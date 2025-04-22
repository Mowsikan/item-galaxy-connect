import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, HandHeart } from "lucide-react";
import { Item } from "@/types/item";
import { format } from "date-fns";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateItemStatus } from "@/services/itemService";
import { useToast } from "@/hooks/use-toast";

interface ItemCardProps {
  item: Item;
  onContactClick: (item: Item) => void;
  currentUserEmail?: string;
}

const ItemCard = ({ item, onContactClick, currentUserEmail }: ItemCardProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const isItemPoster = currentUserEmail === item.contactInfo;
  const canMarkAsClaimed = (item.status === "found" || item.status === "lost") && isItemPoster;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "lost":
        return "bg-lost";
      case "found":
        return "bg-found";
      case "claimed":
        return "bg-green-500";
      default:
        return "bg-muted";
    }
  };

  const markAsClaimed = useMutation({
    mutationFn: () => updateItemStatus(item.id, "claimed"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
      toast({
        title: "Item Updated",
        description: "The item has been marked as claimed.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update item status. Please try again.",
        variant: "destructive",
      });
    },
  });

  return (
    <Card className={`${item.status === "lost" ? "lost-item-card" : "found-item-card"} overflow-hidden transition-all hover:shadow-md animate-slide-up`}>
      <CardHeader className="p-4 pb-2">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-lg line-clamp-1">{item.title}</h3>
            <div className="flex items-center text-sm text-muted-foreground mt-1">
              <Calendar className="h-4 w-4 mr-1" />
              <span>{format(new Date(item.date), "MMM d, yyyy")}</span>
              <MapPin className="h-4 w-4 ml-3 mr-1" />
              <span className="line-clamp-1">{item.location}</span>
            </div>
          </div>
          <Badge 
            variant={item.status === "claimed" ? "default" : item.status === "lost" ? "default" : "secondary"}
            className={`${getStatusColor(item.status)} uppercase`}
          >
            {item.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        <div className="flex gap-4">
          {item.imageUrl && (
            <div className="shrink-0 h-24 w-24 rounded overflow-hidden bg-muted">
              <img 
                src={item.imageUrl} 
                alt={item.title} 
                className="h-full w-full object-cover"
              />
            </div>
          )}
          <div>
            <p className="text-sm line-clamp-3">{item.description}</p>
            <Badge variant="outline" className="mt-2">
              {item.category}
            </Badge>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-2 flex justify-between">
        <div className="text-xs text-muted-foreground">
          Reported {format(new Date(item.timeReported), "MMM d, h:mm a")}
        </div>
        <div className="flex gap-2">
          {canMarkAsClaimed && item.status !== "claimed" && (
            <Button
              size="sm"
              onClick={() => markAsClaimed.mutate()}
              disabled={markAsClaimed.isPending}
              className="text-green-600 hover:text-green-700"
            >
              <HandHeart className="mr-1 h-4 w-4" />
              Mark as Claimed
            </Button>
          )}
          <Button 
            size="sm" 
            variant="outline" 
            onClick={() => onContactClick(item)}
            className={item.status === "lost" ? "text-lost hover:text-lost/90" : "text-found hover:text-found/90"}
          >
            Contact
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ItemCard;
