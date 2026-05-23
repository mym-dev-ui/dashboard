"use client";

import { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { db } from "@/lib/firebase";

interface Order {
  id: string;
  customer: string;
  amount: number;
  status: string;
  date: string;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ordersRef = ref(db, 'orders');

    const unsubscribe = onValue(ordersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const ordersList = Object.keys(data).map(key => ({
          id: key,
         ...data[key]
        }));
        setOrders(ordersList);
      } else {
        setOrders([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div className="page-container">جاري التحميل...</div>;
  }

  return (
    <div className="page-container" dir="rtl">
      <div className="page-header">
        <div>
          <h1>الطلبات</h1>
          <p>عدد الطلبات: {orders.length}</p>
        </div>
      </div>

      <div className="table-wrapper">
        <table className="orders-table">
          <thead>
            <tr>
              <th>رقم الطلب</th>
              <th>العميل</th>
              <th>المبلغ</th>
              <th>الحالة</th>
              <th>التاريخ</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0? (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center' }}>لا توجد طلبات</td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{order.customer}</td>
                  <td>{order.amount} $</td>
                  <td>
                    <span className={`status ${order.status}`}>
                      {order.status}
                    </span>
                  </td>
                  <td>{order.date}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
