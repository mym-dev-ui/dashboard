"use client";

import { useState, useEffect } from "react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Order } from "@/lib/definitions";
import { DataTable } from "./data-table";
import { columns, neonTableStyles } from "./columns";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { OrderForm } from "@/components/dashboard/order-form";

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const ordersData: Order[] = [];
      querySnapshot.forEach((doc) => {
        ordersData.push({ id: doc.id, ...doc.data() } as Order);
      });
      setOrders(ordersData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <>
      <div className="page-container" dir="rtl">
        <div className="page-header">
          <div>
            <h1 className="page-title">الطلبات</h1>
            <p className="page-subtitle">إدارة وعرض جميع الطلبات</p>
          </div>
          
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="add-btn">
                <PlusCircle className="ml-2 h-4 w-4" />
                إضافة طلب جديد
              </Button>
            </DialogTrigger>
            <DialogContent className="dialog-content">
              <DialogHeader>
                <DialogTitle>إنشاء طلب جديد</DialogTitle>
              </DialogHeader>
              <OrderForm setOpen={setOpen} />
            </DialogContent>
          </Dialog>
        </div>

        {loading ? (
          <div className="loading">جاري التحميل...</div>
        ) : (
          <DataTable columns={columns} data={orders} />
        )}
      </div>

      <style jsx global>{neonTableStyles}</style>

      <style jsx>{`
        .page-container {
          padding: 24px;
          min-height: 100vh;
          background: #050810;
          color: #e
