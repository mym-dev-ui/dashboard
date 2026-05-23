"use client";

import { useEffect, useState } from "react";
import { ref, onValue, query, orderByChild } from "firebase/database";
import { db } from "@/lib/firebase";

interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  joinedAt: number;
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const customersRef = query(ref(db, "customers"), orderByChild("joinedAt"));

    const unsubscribe = onValue(customersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const customersList = Object.keys(data).map(key => ({
          id: key,
         ...data[key]
        })).reverse(); // عشان يطلع الأحدث أول
        setCustomers(customersList);
      } else {
        setCustomers([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div className="p-6">جاري التحميل...</div>;
  }

  return (
    <div className="page-container p-6" dir="rtl">
      <h1 className="text-2xl font-bold mb-4">العملاء</h1>
      <p className="mb-6 text-gray-400">عدد العملاء: {customers.length}</p>

      <div className="grid gap-4">
        {customers.length === 0? (
          <p>لا يوجد عملاء</p>
        ) : (
          customers.map((customer) => (
            <div key={customer.id} className="p-4 bg-gray-800 rounded-lg">
              <h3 className="font-bold">{customer.name}</h3>
              <p className="text-gray-400">{customer.email}</p>
              {customer.phone && <p className="text-gray-400">{customer.phone}</p>}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
