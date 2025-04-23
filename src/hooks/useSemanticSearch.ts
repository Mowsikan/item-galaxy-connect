
import { useEffect, useState, useRef } from "react";
import { pipeline } from "@huggingface/transformers";

type ItemLike = {
  id: string;
  title: string;
  description: string;
};

async function getEmbedder() {
  // Use a very small, fast model for browser
  return await pipeline(
    "feature-extraction",
    "mixedbread-ai/mxbai-embed-xsmall-v1",
    { device: "webgpu" }
  );
}

function cosineSim(a: number[], b: number[]): number {
  let dot = 0, aLen = 0, bLen = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    aLen += a[i] * a[i];
    bLen += b[i] * b[i];
  }
  return dot / (Math.sqrt(aLen) * Math.sqrt(bLen));
}

export function useSemanticSearch<T extends ItemLike>(items: T[], searchQuery: string) {
  const [sortedItems, setSortedItems] = useState<T[]>(items);
  const [isEmbedding, setIsEmbedding] = useState(false);
  const [embedError, setEmbedError] = useState<string | null>(null);
  const embedderRef = useRef<any>(null);
  const [itemEmbeddings, setItemEmbeddings] = useState<number[][]>([]);

  // Compute embeddings once for all items (title + description)
  useEffect(() => {
    let alive = true;
    (async () => {
      setIsEmbedding(true);
      setEmbedError(null);
      try {
        if (!embedderRef.current) embedderRef.current = await getEmbedder();
        const embedder = embedderRef.current;
        const texts = items.map(item =>
          (item.title ?? "") + " " + (item.description ?? "")
        );
        const outputs = await embedder(texts, { pooling: "mean", normalize: true });
        if (!alive) return;
        setItemEmbeddings(outputs.tolist ? outputs.tolist() : outputs);
      } catch (err: any) {
        setEmbedError("Failed to load AI search (try refreshing)");
      } finally {
        setIsEmbedding(false);
      }
    })();
    return () => { alive = false; };
  }, [items]);

  // Semantic search
  useEffect(() => {
    // If search is blank, show all
    if (!searchQuery || itemEmbeddings.length !== items.length) {
      setSortedItems(items);
      return;
    }
    (async () => {
      try {
        if (!embedderRef.current) return;
        setIsEmbedding(true);
        const text = searchQuery;
        const output = await embedderRef.current([text], { pooling: "mean", normalize: true });
        const queryEmb = output.tolist ? output.tolist()[0] : output[0];
        // Compute similarities
        const withScore = items.map((item, i) => ({
          item,
          score: cosineSim(itemEmbeddings[i], queryEmb)
        }));
        withScore.sort((a, b) => b.score - a.score);
        setSortedItems(withScore.map(w => w.item));
      } finally {
        setIsEmbedding(false);
      }
    })();
  }, [searchQuery, itemEmbeddings, items]);

  return { sortedItems, isEmbedding, embedError };
}
