"use client";

import { ColumnDef } from "@tanstack/react-table";
import type { Visitor } from "@/lib/definitions";
import { Badge } from "@/components/ui/badge";

export const columns: ColumnDef<Visitor>[] = [
  {
    accessorKey: "name",
    header: "الاسم",
    cell: ({ row }) => <span>{row.getValue("name") || "—"}</span>,
  },
  {
    accessorKey: "phone",
    header: "الجوال",
    cell: ({ row }) => <span dir="ltr">{row.getValue("phone") || "—"}</span>,
  },
  {
    accessorKey: "country",
    header: "الدولة",
    cell: ({ row }) => <span>{row.getValue("country") || "—"}</span>,
  },
  {
    accessorKey: "currentPage",
    header: "الصفحة الحالية",
    cell: ({ row }) => <span className="text-xs text-muted-foreground">{row.getValue("currentPage") || "—"}</span>,
  },
  {
    accessorKey: "status",
    header: "حالة الدفع",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      if (!status) return <span>—</span>;
      const color =
        status === "pending" ? "bg-yellow-100 text-yellow-800" :
        status === "approved" ? "bg-green-100 text-green-800" :
        status === "rejected" ? "bg-red-100 text-red-800" :
        "bg-gray-100 text-gray-700";
      return <span className={`px-2 py-0.5 rounded text-xs font-medium ${color}`}>{status}</span>;
    },
  },
  {
    accessorKey: "finalStatus",
    header: "الحالة النهائية",
    cell: ({ row }) => {
      const val = row.getValue("finalStatus") as string;
      return <span>{val || "—"}</span>;
    },
  },
  {
    accessorKey: "online",
    header: "متصل",
    cell: ({ row }) => {
      const online = row.getValue("online") as boolean;
      return (
        <span className={`flex items-center gap-1 text-xs ${online ? "text-green-600" : "text-gray-400"}`}>
          <span className={`w-2 h-2 rounded-full ${online ? "bg-green-500" : "bg-gray-300"}`} />
          {online ? "نعم" : "لا"}
        </span>
      );
    },
  },
  {
    accessorKey: "createdDate",
    header: "تاريخ الزيارة",
    cell: ({ row }) => {
      const val = row.getValue("createdDate") as string;
      if (!val) return <span>—</span>;
      try {
        return <span className="text-xs">{new Date(val).toLocaleString("ar-SA")}</span>;
      } catch {
        return <span className="text-xs">{val}</span>;
      }
    },
  },
];
