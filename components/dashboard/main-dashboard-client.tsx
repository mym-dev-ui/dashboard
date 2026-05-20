"use client";

import { useState, useEffect, useMemo } from "react";
import { collection, onSnapshot, query, orderBy, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Order as OrderType, Product as ProductType, Customer as CustomerType } from "@/lib/definitions";
import { StatCard } from "./stat-card";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DateRangePicker, DateRangePickerProps } from "@/components/ui/date-range-picker";
import { DollarSign, ShoppingCart, Users, PackageMinus } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LineChart, Line, Tooltip } from "recharts";
import { format, subDays, isWithinInterval, differenceInDays } from 'date-fns';
import { Avatar, AvatarFallback } from "../ui/avatar";

type ClientOrder = Omit<OrderType, 'createdAt'> & { createdAt: Date };
type ClientCustomer = Omit<CustomerType, 'joinedAt'> & { joinedAt: Date };

export function MainDashboardClient({ initialOrders, initialCustomers, initialProducts }: {
    initialOrders: any[],
    initialCustomers: any[],
    initialProducts: ProductType[]
}) {
    const [orders, setOrders] = useState<ClientOrder[]>(() => initialOrders.map(o => ({...o, createdAt: new Date(o.createdAt)})));
    const [customers, setCustomers] = useState<ClientCustomer[]>(() => initialCustomers.map(c => ({...c, joinedAt: new Date(c.joinedAt)})));
    const [products, setProducts] = useState<ProductType[]>(initialProducts);
    const [dateRange, setDateRange] = useState<any>({ from: subDays(new Date(), 29), to: new Date() });

    useEffect(() => {
        const unsubOrders = onSnapshot(query(collection(db, "orders"), orderBy("createdAt", "desc")), (snapshot) => setOrders(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), createdAt: (doc.data().createdAt as Timestamp).toDate() } as ClientOrder))));
        const unsubCustomers = onSnapshot(collection(db, "customers"), (snapshot) => setCustomers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), joinedAt: (doc.data().joinedAt as Timestamp).toDate() } as ClientCustomer))));
        const unsubProducts = onSnapshot(collection(db, "products"), (snapshot) => setProducts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ProductType))));
        return () => { unsubOrders(); unsubCustomers(); unsubProducts(); };
    }, []);

    const filteredData = useMemo(() => {
        if (!dateRange?.from || !dateRange?.to) return { orders: [], customers: [] };
        const currentPeriodOrders = orders.filter(o => isWithinInterval(o.createdAt, { start: dateRange.from!, end: dateRange.to! }));
        const currentPeriodCustomers = customers.filter(c => isWithinInterval(c.joinedAt, { start: dateRange.from!, end: dateRange.to! }));
        
        const days = differenceInDays(dateRange.to, dateRange.from);
        const prevPeriodStart = subDays(dateRange.from, days + 1);
        const prevPeriodEnd = subDays(dateRange.to, days + 1);
        
        const prevPeriodOrders = orders.filter(o => isWithinInterval(o.createdAt, { start: prevPeriodStart, end: prevPeriodEnd }));
        const prevPeriodCustomers = customers.filter(c => isWithinInterval(c.joinedAt, { start: prevPeriodStart, end: prevPeriodEnd }));

        return { currentPeriodOrders, currentPeriodCustomers, prevPeriodOrders, prevPeriodCustomers };
    }, [orders, customers, dateRange]);

    const calculatePercentageChange = (current: number, previous: number) => {
        if (previous === 0) return current > 0 ? "∞% (لا توجد بيانات سابقة)" : "0%";
        const change = ((current - previous) / previous) * 100;
        return `${change >= 0 ? '+' : ''}${change.toFixed(1)}% عن الفترة السابقة`;
    };

    const stats = useMemo(() => {
        const currentRevenue = filteredData?.currentPeriodOrders?.reduce((sum, o) => sum + o.amount, 0);
        const prevRevenue = filteredData?.prevPeriodOrders?.reduce((sum, o) => sum + o.amount, 0);
        const currentOrdersCount = filteredData?.currentPeriodOrders?.length;
        const prevOrdersCount = filteredData?.prevPeriodOrders?.length;
        const currentCustomersCount = filteredData?.currentPeriodCustomers?.length;
        const prevCustomersCount = filteredData?.prevPeriodCustomers?.length;

        return {
            revenue: { value: currentRevenue, change: calculatePercentageChange(currentRevenue!, prevRevenue!) },
            orders: { value: currentOrdersCount, change: calculatePercentageChange(currentOrdersCount!, prevOrdersCount!) },
            customers: { value: currentCustomersCount, change: calculatePercentageChange(currentCustomersCount!, prevCustomersCount!) },
            lowStock: { value: products.filter(p => p.stock < 50).length }
        };
    }, [filteredData, products]);

    const salesChartData = useMemo(() => {
        const salesByDay: { [key: string]: number } = {};
        filteredData?.currentPeriodOrders?.forEach(order => {
            const day = format(order.createdAt, 'yyyy-MM-dd');
            salesByDay[day] = (salesByDay[day] || 0) + order.amount;
        });
        return Object.entries(salesByDay).map(([date, sales]) => ({ date, sales })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }, [filteredData?.currentPeriodOrders]);

    return (
        <div className="flex flex-col  w-full gap-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h1 className="text-2xl font-bold tracking-tight">أهلاً بك مجدداً!</h1>
                {/* <DateRangePicker date={dateRange } onDateChange={setDateRange} /> */}
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard title="إجمالي الإيرادات" value={new Intl.NumberFormat("ar-JO", { style: "currency", currency: "JOD" }).format(stats?.revenue?.value as any)} description={stats.revenue.change} icon={<DollarSign className="h-4 w-4 text-muted-foreground" />} />
                <StatCard title="إجمالي الطلبات" value={`+${stats.orders.value}`} description={stats.orders.change} icon={<ShoppingCart className="h-4 w-4 text-muted-foreground" />} />
                <StatCard title="عملاء جدد" value={`+${stats.customers.value}`} description={stats.customers.change} icon={<Users className="h-4 w-4 text-muted-foreground" />} />
                <StatCard title="مخزون منخفض" value={`${stats.lowStock.value} أصناف`} description="أقل من 50 وحدة" icon={<PackageMinus className="h-4 w-4 text-muted-foreground" />} />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <Card className="lg:col-span-2">
                    <CardHeader><CardTitle>نظرة عامة على المبيعات</CardTitle></CardHeader>
                    <CardContent className="pl-2">
                        <ResponsiveContainer width="100%" height={350}>
                            <LineChart data={salesChartData}>
                                <XAxis dataKey="date" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(str) => format(new Date(str), 'dd/MM')} />
                                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `JOD ${value}`} />
                                <Tooltip />
                                <Line type="monotone" dataKey="sales" stroke="#16a34a" dot={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader><CardTitle>الطلبات الأخيرة</CardTitle><CardDescription>آخر 5 طلبات تم إنشاؤها.</CardDescription></CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {orders.slice(0, 5).map(order => (
                                <div key={order.id} className="flex items-center">
                                    <Avatar className="h-9 w-9"><AvatarFallback>{order.customerName.slice(0, 2)}</AvatarFallback></Avatar>
                                    <div className="mr-4 space-y-1">
                                        <p className="text-sm font-medium leading-none">{order.customerName}</p>
                                        <p className="text-sm text-muted-foreground">{format(order.createdAt, 'dd/MM/yyyy')}</p>
                                    </div>
                                    <div className="mr-auto font-medium">{new Intl.NumberFormat("ar-JO", { style: "currency", currency: "JOD" }).format(order.amount)}</div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
