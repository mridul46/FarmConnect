import { ShoppingBag, Heart, Clock, TrendingUp } from "lucide-react";

export const stats = [
  {
    label: "Total Orders",
    value: "24",
    change: "+3 this month",
    icon: ShoppingBag,
    color: "blue",
    trend: "up",
  },
  {
    label: "Active Orders",
    value: "3",
    change: "In progress",
    icon: Clock,
    color: "orange",
    trend: "neutral",
  },
  {
    label: "Total Spent",
    value: "₹8,450",
    change: "+₹1,200 this month",
    icon: TrendingUp,
    color: "green",
    trend: "up",
  },
  {
    label: "Saved Items",
    value: "12",
    change: "4 back in stock",
    icon: Heart,
    color: "red",
    trend: "up",
  },
];

export const recentOrders = [
  {
    id: "#ORD-1234",
    items: ["Organic Tomatoes (5kg)", "Fresh Spinach (2 bunches)"],
    farmer: "Kumar Organic Farm",
    amount: "₹350",
    status: "out_for_delivery",
    date: "2 hours ago",
    estimatedDelivery: "Today, 6:00 PM",
    image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=100",
  },
  {
    id: "#ORD-1233",
    items: ["Alphonso Mangoes (3kg)"],
    farmer: "Sharma Fresh Produce",
    amount: "₹360",
    status: "preparing",
    date: "5 hours ago",
    estimatedDelivery: "Tomorrow, 10:00 AM",
    image: "https://images.unsplash.com/photo-1553279768-865429fa0078?w=100",
  },
  {
    id: "#ORD-1232",
    items: ["Farm Fresh Eggs (2 dozen)", "Organic Honey (500g)"],
    farmer: "Patel Dairy Farm",
    amount: "₹420",
    status: "delivered",
    date: "2 days ago",
    estimatedDelivery: "Delivered",
    image: "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=100",
  },
];

export const recommendedProducts = [
  {
    id: 1,
    name: "Fresh Green Spinach",
    farmer: "Kumar Organic Farm",
    price: 30,
    unit: "bunch",
    image:
      "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=200",
    rating: 4.8,
    distance: "2.5 km",
  },
  {
    id: 2,
    name: "Premium Basmati Rice",
    farmer: "Sunita Agro",
    price: 85,
    unit: "kg",
    image:
      "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=200",
    rating: 4.9,
    distance: "3.2 km",
  },
  {
    id: 3,
    name: "Organic Carrots",
    farmer: "Green Valley Farms",
    price: 40,
    unit: "kg",
    image:
      "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=200",
    rating: 4.7,
    distance: "1.8 km",
  },
];

export const favoriteProducts = [
  {
    id: 1,
    name: "Organic Tomatoes",
    farmer: "Kumar Organic Farm",
    price: 45,
    unit: "kg",
    stock: "In Stock",
    image:
      "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=100",
  },
  {
    id: 2,
    name: "Fresh Spinach",
    farmer: "Kumar Organic Farm",
    price: 30,
    unit: "bunch",
    stock: "Low Stock",
    image:
      "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=100",
  },
];
