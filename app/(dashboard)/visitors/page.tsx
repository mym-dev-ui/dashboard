"use client";

import { useState, useEffect } from "react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Visitor } from "@/lib/definitions";
import { DataTable } from "@/app/(dashboard)/orders/data-table";
import { columns } from "./columns";
import { AlertCircle, Eye, Users, Wifi } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function VisitorsPage() {
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setError(null);
    let unsubscribe: () => void;

    try {
      const q = query(collection(db, "pays"), orderBy("createdDate", "desc"));
      unsubscribe = onSnapshot(
        q,
        (querySnapshot) => {
          const data: Visitor[] = [];
          querySnapshot.forEach((doc) => {
            data.push({ id: doc.id, ...doc.data() } as Visitor);
          });
          setVisitors(data);
          setLoading(false);
        },
        (err) => {
          console.error("خطأ في قراءة بيانات الزوار:", err);
          setError("حدث خطأ أثناء تحميل البيانات. تأكد من صلاحيات Firebase.");
          setLoading(false);
        }
      );
    } catch (err) {
      console.error("خطأ في الاتصال بـ Firebase:", err);
      setError("فشل الاتصال بقاعدة البيانات.");
      setLoading(false);
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const onlineCount = visitors.filter((v) => v.online).length;
  const completedCount = visitors.filter((v) => v.finalStatus === "completed").length;

  return (
    <div className="container mx-auto py-10" dir="rtl">
      <div className="flex items-center gap-3 mb-6">
        <Eye className="w-7 h-7 text-primary" />
        <h1 className="text-2xl font-bold">الزوار (من الموقع)</h1>
        <span className="text-sm text-muted-foreground">
          — البيانات مباشرة من Firebase بشكل فوري
        </span>
      </div>

      {error && (
        <div className="mb-6 flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-3 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">إجمالي الزوار</CardTitle>
            <Users className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? "—" : visitors.length}</div>
            <p className="text-xs text-muted-foreground mt-1">جميع الزوار المسجلين</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">متصل الآن</CardTitle>
            <Wifi className="w-4 h-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{loading ? "—" : onlineCount}</div>
            <p className="text-xs text-muted-foreground mt-1">يتصفحون الموقع حالياً</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">أكملوا العملية</CardTitle>
            <Eye className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? "—" : completedCount}</div>
            <p className="text-xs text-muted-foreground mt-1">أتموا جميع الخطوات</p>
          </CardContent>
        </Card>
      </div>

      <DataTable columns={columns} data={visitors} isLoading={loading} />
    </div>
  );
}
