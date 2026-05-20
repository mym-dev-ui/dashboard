"use client";

import { useState, useEffect } from "react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Customer } from "@/lib/definitions";
import { DataTable } from "@/app/(dashboard)/orders/data-table";
import { columns } from "./columns";
import { Button } from "@/components/ui/button";
import { PlusCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CustomerForm } from "@/components/dashboard/customer-form";

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const q = query(collection(db, "customers"), orderBy("joinedAt", "desc"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const customersData: Customer[] = [];
      querySnapshot.forEach((doc) => {
        customersData.push({ id: doc.id, ...doc.data() } as Customer);
      });
      setCustomers(customersData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">إدارة العملاء</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button><PlusCircle className="ml-2 h-4 w-4" />إضافة عميل جديد</Button></DialogTrigger>
          <DialogContent><DialogHeader><DialogTitle>إنشاء عميل جديد</DialogTitle></DialogHeader><CustomerForm setOpen={setOpen} /></DialogContent>
        </Dialog>
      </div>
      <DataTable columns={columns} data={customers} isLoading={loading} />
    </div>
  );
}
