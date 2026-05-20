"use client";

import { useState, useEffect, useMemo } from "react";
import { collection, onSnapshot, query, orderBy, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Order as OrderType, Product as ProductType, Customer as CustomerType } from "@/lib/definitions";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DollarSign, ShoppingCart, Users, PackageMinus } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from "recharts";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { format, subDays, startOfMonth, isAfter } from 'date-fns';

// A type for our client-side state, where Timestamps are converted to Dates
type ClientOrder = Omit<OrderType, 'createdAt'> & { createdAt: Date };
type ClientCustomer = Omit<CustomerType, 'joinedAt'> & { joinedAt: Date };

export function MainDashboard({ initialOrders, initialCustomers, initialProducts }: {
    initialOrders: any[],
    initialCustomers: any[],
    initialProducts: ProductType[]
}) {
    // Initialize state, converting ISO strings from server to Date objects
    const [orders, setOrders] = useState<ClientOrder[]>(() => initialOrders.map(o => ({...o, createdAt: new Date(o.createdAt)})));
    const [customers, setCustomers] = useState<ClientCustomer[]>(() => initialCustomers.map(c => ({...c, joinedAt: new Date(c.joinedAt)})));
    const [products, setProducts] = useState<ProductType[]>(initialProducts);

    // Set up real-time listeners
    useEffect(() => {
        const unsubOrders = onSnapshot(query(collection(db, "orders"), orderBy("createdAt", "desc")), (snapshot) => {
            const fetchedOrders = snapshot.docs.map(doc => {
                const data = doc.data();
                return { id: doc.id, ...data, createdAt: (data.createdAt as Timestamp).toDate() } as ClientOrder;
            });
            setOrders(fetchedOrders);
        });

        const unsubCustomers = onSnapshot(collection(db, "customers"), (snapshot) => {
            const fetchedCustomers = snapshot.docs.map(doc => {
                const data = doc.data();
                return { id: doc.id, ...data, joinedAt: (data.joinedAt as Timestamp).toDate() } as ClientCustomer;
            });
            setCustomers(fetchedCustomers);
        });

        const unsubProducts = onSnapshot(collection(db, "products"), (snapshot) => {
            setProducts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ProductType)));
        });

        return () => {
            unsubOrders();
            unsubCustomers();
            unsubProducts();
        };
    }, []);

    // Memoize expensive calculations to optimize performance
    const dashboardStats = useMemo(() => {
        const totalRevenue = orders.reduce((sum, order) => sum + order.amount, 0);
        const startOfThisMonth = startOfMonth(new Date());
        const newCustomersThisMonth = customers.filter(c => isAfter(c.joinedAt, startOfThisMonth)).length;
        const lowStockItems = products.filter(p => p.stock < 50).length;
        return { totalRevenue, totalOrders: orders.length, newCustomersThisMonth, lowStockItems };
    }, [orders, customers, products]);

    const recentOrders = useMemo(() => orders.slice(0, 5), [orders]);

    const salesChartData = useMemo(() => {
        const salesByDay: { [key: string]: number } = {};
        const thirtyDaysAgo = subDays(new Date(), 30);
        orders.forEach(order => {
            if (isAfter(order.createdAt, thirtyDaysAgo)) {
                const day = format(order.createdAt, 'MMM dd');
                salesByDay[day] = (salesByDay[day] || 0) + order.amount;
            }
        });
        return Object.entries(salesByDay).map(([date, sales]) => ({ date, sales })).reverse();
    }, [orders]);

    const bestSellingProductsData = useMemo(() => {
        const productSales: { [key: string]: number } = {};
        orders.forEach(order => {
            if (order.items) {
                order.items.forEach(item => {
                    productSales[item.productId] = (productSales[item.productId] || 0) + item.quantity;
                });
            }
        });
        return Object.entries(productSales)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 5)
            .map(([productId, quantity]) => {
                const product = products.find(p => p.id === productId);
                return { name: product?.name || 'منتج محذوف', quantity };
            });
    }, [orders, products]);

    return (
        <div className="flex flex-col w-full min-h-screen bg-muted/40">
            <header className="sticky top-0 flex items-center h-16 px-4 border-b bg-background shrink-0 md:px-6 z-10">
                <SidebarTrigger />
                <h1 className="text-xl font-semibold ml-4">لوحة التحكم الرئيسية</h1>
            </header>
            <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">إجمالي الإيرادات</CardTitle><DollarSign className="w-4 h-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{new Intl.NumberFormat("ar-SA", { style: "currency", currency: "SAR" }).format(dashboardStats.totalRevenue)}</div></CardContent></Card>
                    <Card><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">إجمالي الطلبات</CardTitle><ShoppingCart className="w-4 h-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{dashboardStats.totalOrders}</div></CardContent></Card>
                    <Card><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">عملاء جدد (هذا الشهر)</CardTitle><Users className="w-4 h-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{dashboardStats.newCustomersThisMonth}</div></CardContent></Card>
                    <Card><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">منتجات ذات مخزون منخفض</CardTitle><PackageMinus className="w-4 h-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{dashboardStats.lowStockItems} أصناف</div></CardContent></Card>
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                    <Card className="lg:col-span-4"><CardHeader><CardTitle>الطلبات الأخيرة</CardTitle></CardHeader><CardContent><Table><TableHeader><TableRow><TableHead>العميل</TableHead><TableHead>الحالة</TableHead><TableHead>المبلغ</TableHead></TableRow></TableHeader><TableBody>{recentOrders.map((order) => (<TableRow key={order.id}><TableCell>{order.customerName}</TableCell><TableCell><Badge variant="outline">{order.status}</Badge></TableCell><TableCell>{new Intl.NumberFormat("ar-SA", { style: "currency", currency: "SAR" }).format(order.amount)}</TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
                    <Card className="lg:col-span-3"><CardHeader><CardTitle>المنتجات الأكثر مبيعاً</CardTitle><CardDescription>بناءً على الكمية المباعة.</CardDescription></CardHeader><CardContent><ResponsiveContainer width="100%" height={250}><BarChart data={bestSellingProductsData} layout="vertical" margin={{ right: 20 }}><XAxis type="number" hide /><YAxis dataKey="name" type="category" width={100} tickLine={false} axisLine={false} /><Tooltip cursor={{fill: '#f3f4f6'}} contentStyle={{borderRadius: '0.5rem'}} /><Bar dataKey="quantity" name="الكمية" radius={[0, 4, 4, 0]} fill="#3b82f6" /></BarChart></ResponsiveContainer></CardContent></Card>
                </div>
                <div className="grid gap-4">
                    <Card><CardHeader><CardTitle>نظرة عامة على المبيعات</CardTitle><CardDescription>إجمالي الإيرادات خلال آخر 30 يومًا.</CardDescription></CardHeader><CardContent><ResponsiveContainer width="100%" height={300}><LineChart data={salesChartData}><CartesianGrid strokeDasharray="3 3" vertical={false} /><XAxis dataKey="date" /><YAxis /><Tooltip contentStyle={{borderRadius: '0.5rem'}} /><Legend /><Line type="monotone" dataKey="sales" name="المبيعات (SAR)" stroke="#3b82f6" strokeWidth={2} activeDot={{ r: 8 }} /></LineChart></ResponsiveContainer></CardContent></Card>
                </div>
            </main>
        </div>
    );
}
