import { Users, ShoppingBag, TrendingUp, DollarSign, Package } from "lucide-react";

export default [
  {
    label: "Total Users",
    value: "2,847",
    change: "+12.5%",
    subtext: "1,420 Farmers • 1,427 Consumers",
    icon: Users,
    color: "blue",
    trend: "up",
  },
  {
    label: "Total Revenue",
    value: "₹4.2M",
    change: "+18.2%",
    subtext: "₹845K this month",
    icon: DollarSign,
    color: "green",
    trend: "up",
  },
  {
    label: "Total Orders",
    value: "15,847",
    change: "+8.7%",
    subtext: "2,340 this week",
    icon: ShoppingBag,
    color: "purple",
    trend: "up",
  },
  {
    label: "Active Products",
    value: "8,924",
    change: "+5.3%",
    subtext: "456 added this week",
    icon: Package,
    color: "orange",
    trend: "up",
  },
];
