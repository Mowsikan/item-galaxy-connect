
export type ItemCategory = 
  | "electronics" 
  | "clothing" 
  | "accessories" 
  | "books" 
  | "documents" 
  | "keys" 
  | "other";

export type ItemStatus = "lost" | "found" | "claimed";

export interface Item {
  id: string;
  title: string;
  description: string;
  category: ItemCategory;
  status: ItemStatus;
  location: string;
  date: string; // ISO date string
  contactInfo: string;
  imageUrl?: string;
  timeReported: string; // ISO date string
}
