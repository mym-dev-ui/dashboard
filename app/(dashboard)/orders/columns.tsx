"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { Order } from "@/lib/definitions";
import { Badge } from "@/components/ui/badge";
import { deleteOrder } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Trash2 } from 'lucide-react';

export const columns: ColumnDef<Order>[] = [
  {
    accessorKey: "customerName",
    header: "العميل",
  },
  {
    accessorKey: "status",
    header: "الحالة",
    cell: ({ row }) => {
      const status = row.getValue("status") as Order['status'];
      const variant = {
        'قيد الانتظار': 'secondary',
        'تم الشحن': 'outline',
        'تم التوصيل': 'default',
        'ملغي': 'destructive',
      }[status] as any;
      return <Badge variant={variant}>{status}</Badge>;
    },
  },
  {
    accessorKey: "amount",
    header: "المبلغ",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));
      return <div>{new Intl.NumberFormat("ar-SA", { style: "currency", currency: "SAR" }).format(amount)}</div>;
    },
  },
  {
    accessorKey: "createdAt",
    header: "تاريخ الإنشاء",
    cell: ({ row }) => {
      const date = (row.getValue("createdAt") as any).toDate();
      return <div>{date.toLocaleDateString('ar-EG')}</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const order = row.original;
      return (
        <Button variant="ghost" size="icon" onClick={async () => {
            if(confirm(`هل أنت متأكد من حذف الطلب ${order.id}؟`)) {
                await deleteOrder(order.id);
            }
        }}>
          <Trash2 className="h-4 w-4 text-red-500" />
        </Button>
      );
    },
  },
];
