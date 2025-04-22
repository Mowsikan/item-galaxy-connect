
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getItems } from "@/services/itemService";
import { Item } from "@/types/item";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import ItemCard from "@/components/ItemCard";

const Dashboard = () => {
  const [contactItem, setContactItem] = useState<Item | null>(null);
  
  // For demo purposes, we'll use a hardcoded email. In a real app, this would come from authentication
  const currentUserEmail = "finder@university.edu";
  
  const { data: items, isLoading, error } = useQuery({
    queryKey: ["items"],
    queryFn: getItems
  });

  const lostItems = items?.filter(item => item.status === "lost") || [];
  const foundItems = items?.filter(item => item.status === "found") || [];

  const handleContactClick = (item: Item) => {
    setContactItem(item);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="flex flex-col items-center">
          <Loader className="h-8 w-8 animate-spin text-primary" />
          <p className="mt-4 text-muted-foreground">Loading items...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center text-destructive">
          <p className="text-lg font-semibold">Something went wrong</p>
          <p className="text-sm text-muted-foreground mt-1">Failed to load items. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-3">Campus Lost & Found</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          A centralized platform to report lost items or items you've found on campus. 
          Help reconnect people with their belongings.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-3">
          <CardContent className="p-6">
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="all">All Items ({items?.length || 0})</TabsTrigger>
                <TabsTrigger value="lost">Lost Items ({lostItems.length})</TabsTrigger>
                <TabsTrigger value="found">Found Items ({foundItems.length})</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {items?.map(item => (
                    <ItemCard 
                      key={item.id} 
                      item={item} 
                      onContactClick={handleContactClick}
                      currentUserEmail={currentUserEmail}
                    />
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="lost" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {lostItems.map(item => (
                    <ItemCard 
                      key={item.id} 
                      item={item} 
                      onContactClick={handleContactClick}
                      currentUserEmail={currentUserEmail}
                    />
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="found" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {foundItems.map(item => (
                    <ItemCard 
                      key={item.id} 
                      item={item} 
                      onContactClick={handleContactClick}
                      currentUserEmail={currentUserEmail}
                    />
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Contact Dialog */}
      <Dialog open={!!contactItem} onOpenChange={() => setContactItem(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Contact Information</DialogTitle>
            <DialogDescription>
              Use the information below to contact about the {contactItem?.status} item.
            </DialogDescription>
          </DialogHeader>
          <div className="p-4 bg-muted/50 rounded-md">
            <h3 className="font-medium">{contactItem?.title}</h3>
            <p className="text-sm text-muted-foreground mt-1 mb-4">{contactItem?.status === "lost" ? "Lost" : "Found"} on {contactItem?.date ? new Date(contactItem.date).toLocaleDateString() : ""}</p>
            <p className="text-sm mb-1"><span className="font-medium">Contact:</span> {contactItem?.contactInfo}</p>
            <p className="text-sm"><span className="font-medium">Location:</span> {contactItem?.location}</p>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setContactItem(null)}>Close</Button>
            <Button>Send Message</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
