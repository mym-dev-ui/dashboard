"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Order } from "@/lib/definitions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { deleteOrder } from "@/lib/actions";

export const columns: ColumnDef<Order>[] = [
  {
    accessorKey: "customerName",
    header: "العميل",
    cell: ({ row }) => (
      <div className="customer-cell">
        {row.getValue("customerName")}
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "الحالة",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;

      const statusConfig: Record<string, { label: string; color: string }> = {
        pending: { label: "بإنتظار", color: "#00d4ff" },
        processing: { label: "قيد التنفيذ", color: "#00a8ff" },
        shipped: { label: "تم الشحن", color: "#0099ff" },
        delivered: { label: "تم التسليم", color: "#00ff88" },
        cancelled: { label: "ملغي", color: "#ff0033" },
      };

      const config = statusConfig[status] || statusConfig.pending;

      return (
        <span
          className="status-badge"
          style={{
            background: `${config.color}18`,
            border: `1px solid ${config.color}66`,
            color: config.color,
            box
