"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { deleteOrderAction } from "@/lib/actions";

export type Order = {
  id: string;
  customer: string;
  amount: number;
  status: string;
  date: string;
};

export const columns: ColumnDef<Order>[] = [
  {
    accessorKey: "customer",
    header: "العميل",
  },
  {
    accessorKey: "amount",
    header: "المبلغ",
    cell: ({ row }) => `${row.getValue("amount")} $`,
  },
  {
    accessorKey: "status",
    header: "الحالة",
  },
  {
    accessorKey: "date",
    header: "التاريخ",
  },
  {
    id: "actions",
    header: "إجراءات",
    cell: ({ row }) => {
      const orderId = row.original.id;
      return (
        <form action={deleteOrderAction}>
          <input type="hidden" name="id" value={orderId} />
          <Button 
            type="submit" 
            variant="ghost" 
            size="icon" 
            className="delete-btn"
          >
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        </form>
      );
    },
  },
];
