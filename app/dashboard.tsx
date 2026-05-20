import {
  collection,
  getDocs,
  query,
  orderBy,
  limit,
  where,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { DashboardClient } from "@/components/dashboard-client";

async function getDashboardData() {
  // Fetch stats
  const ordersSnapshot = await getDocs(collection(db, "orders"));
  const customersSnapshot = await getDocs(collection(db, "customers"));
  const lowStockSnapshot = await getDocs(
    query(collection(db, "inventory"), where("stock", "<", 50))
  );

  const totalRevenue = ordersSnapshot.docs.reduce(
    (sum, doc) => sum + doc.data().amount,
    0
  );
  const totalOrders = ordersSnapshot.size;
  const totalCustomers = customersSnapshot.size;
  const lowStockItems = lowStockSnapshot.size;

  // Fetch recent orders
  const recentOrdersQuery = query(
    collection(db, "orders"),
    orderBy("createdAt", "desc"),
    limit(5)
  );
  const recentOrdersSnapshot = await getDocs(recentOrdersQuery);
  const recentOrders = recentOrdersSnapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      customerName: data.customerName,
      status: data.status,
      amount: data.amount,
      // Convert Firestore Timestamp to a serializable format
      date: (data.createdAt as Timestamp).toDate().toISOString().split("T")[0],
    };
  });

  // Fetch inventory data
  const inventorySnapshot = await getDocs(collection(db, "inventory"));
  const inventoryData = inventorySnapshot.docs.map((doc) => ({
    name: doc.data().name,
    stock: doc.data().stock,
  }));

  // Fetch and process customer growth data
  const customerGrowthData = customersSnapshot.docs.reduce((acc, doc) => {
    const joinedDate = (doc.data().joinedAt as Timestamp).toDate();
    const month = joinedDate.toLocaleString("default", { month: "short" });
    if (!acc[month]) {
      acc[month] = 0;
    }
    acc[month]++;
    return acc;
  }, {} as Record<string, number>);

  const customerChartData = Object.entries(customerGrowthData).map(
    ([month, customers]) => ({ month, customers })
  );

  return {
    stats: { totalRevenue, totalOrders, totalCustomers, lowStockItems },
    recentOrders,
    inventoryData,
    customerChartData,
  };
}

export default async function Dashboard() {
  const data = await getDashboardData();
  return <DashboardClient data={data} />;
}
