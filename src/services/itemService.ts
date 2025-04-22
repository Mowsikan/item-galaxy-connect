
import { Item, ItemCategory, ItemStatus } from "@/types/item";

// Mock data
const mockItems: Item[] = [
  {
    id: "1",
    title: "iPhone 13 Pro with blue case",
    description: "Lost my iPhone 13 Pro with a blue silicone case. It has my ID card in the back pocket. Last seen in the university library.",
    category: "electronics",
    status: "lost",
    location: "University Library, 2nd Floor",
    date: "2025-04-20T14:30:00Z",
    contactInfo: "john.doe@university.edu",
    imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=300&h=200",
    timeReported: "2025-04-21T09:15:00Z"
  },
  {
    id: "2",
    title: "Student ID Card - Sarah Johnson",
    description: "Found a student ID card belonging to Sarah Johnson near the campus cafe. If it's yours, please contact me with details to verify ownership.",
    category: "documents",
    status: "found",
    location: "Campus Cafe",
    date: "2025-04-21T10:45:00Z",
    contactInfo: "finder@university.edu",
    timeReported: "2025-04-21T11:30:00Z"
  },
  {
    id: "3",
    title: "Black Backpack with Laptop",
    description: "Lost my black North Face backpack containing a Dell XPS laptop and some textbooks. Has a small keychain with a blue robot attached to the zipper.",
    category: "accessories",
    status: "lost",
    location: "Engineering Building, Room 302",
    date: "2025-04-19T16:20:00Z",
    contactInfo: "michael.smith@university.edu",
    imageUrl: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=300&h=200",
    timeReported: "2025-04-19T18:45:00Z"
  },
  {
    id: "4",
    title: "Gray and Black Laptop Charger",
    description: "Found a Dell laptop charger in the science building common area. It's a black brick with gray cord. Left it with the front desk.",
    category: "electronics",
    status: "found",
    location: "Science Building Common Area",
    date: "2025-04-18T13:10:00Z",
    contactInfo: "reception@sciencebuilding.edu",
    imageUrl: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=300&h=200",
    timeReported: "2025-04-18T13:30:00Z"
  },
  {
    id: "5",
    title: "Car Keys with Red Keychain",
    description: "Lost my car keys somewhere on campus. Has a distinctive red keychain with a silver bottle opener. Toyota car key plus 3 other keys.",
    category: "keys",
    status: "lost",
    location: "Parking Lot B or Student Center",
    date: "2025-04-21T08:30:00Z",
    contactInfo: "emma.wilson@university.edu",
    timeReported: "2025-04-21T10:15:00Z"
  },
  {
    id: "6",
    title: "Orange Tabby Cat",
    description: "Found a friendly orange tabby cat wandering near the dorms. Has a blue collar but no tag. Currently keeping it safe in my dorm.",
    category: "other",
    status: "found",
    location: "West Campus Dormitories",
    date: "2025-04-20T19:45:00Z",
    contactInfo: "cat.finder@university.edu",
    imageUrl: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?auto=format&fit=crop&w=300&h=200",
    timeReported: "2025-04-20T20:00:00Z"
  }
];

// Simulate API call with a delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const getItems = async (): Promise<Item[]> => {
  await delay(800); // Simulate network request
  return [...mockItems];
};

export const getItemById = async (id: string): Promise<Item | undefined> => {
  await delay(500);
  return mockItems.find(item => item.id === id);
};

export const getItemsByStatus = async (status: ItemStatus): Promise<Item[]> => {
  await delay(800);
  return mockItems.filter(item => item.status === status);
};

export const searchItems = async (query: string): Promise<Item[]> => {
  await delay(1000);
  const lowerQuery = query.toLowerCase();
  return mockItems.filter(
    item => 
      item.title.toLowerCase().includes(lowerQuery) || 
      item.description.toLowerCase().includes(lowerQuery) ||
      item.location.toLowerCase().includes(lowerQuery) ||
      item.category.toLowerCase().includes(lowerQuery)
  );
};

export const addItem = async (item: Omit<Item, "id" | "timeReported">): Promise<Item> => {
  await delay(1200);
  const newItem: Item = {
    ...item,
    id: `${mockItems.length + 1}`,
    timeReported: new Date().toISOString()
  };
  mockItems.push(newItem);
  return newItem;
};

export const getCategories = async (): Promise<ItemCategory[]> => {
  await delay(300);
  return ["electronics", "clothing", "accessories", "books", "documents", "keys", "other"];
};
