"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Order } from "@/lib/definitions";
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
            boxShadow: `0 0 12px ${config.color}44`
          }}
        >
          {config.label}
        </span>
      );
    },
  },
  {
    accessorKey: "amount",
    header: "المبلغ",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));
      return (
        <div className="amount-cell">
          {new Intl.NumberFormat("ar-SA", {
            style: "currency",
            currency: "SAR",
          }).format(amount)}
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "إجراءات",
    cell: ({ row }) => {
      const orderId = row.original.id;
      return (
        <form action={deleteOrder}>
          <input type="hidden" name="id" value={orderId} />
          <Button type="submit" variant="ghost" size="icon" className="delete-btn">
            <Trash2 className="h-4 w-4" />
          </Button>
        </form>
      );
    },
  },
];

export const neonTableStyles = `
.customer-cell {
    color: #e2f2ff;
    font-weight: 500;
  }

.status-badge {
    padding: 6px 14px;
    border-radius: 8px;
    font-size: 12px;
    font-weight: 700;
    display: inline-block;
    text-align: center;
    min-width: 90px;
    letter-spacing: 0.5px;
    transition: all 0.2s ease;
  }

.status-badge:hover {
    transform: scale(1.05);
    box-shadow: 0 0 20px currentColor;
  }

.amount-cell {
    color: #00d4ff;
    font-weight: 700;
    font-size: 15px;
    text-shadow: 0 0 10px rgba(0, 212, 255, 0.7);
  }

.delete-btn {
    color: #ff0033;
    border: 1px solid #ff003333;
    transition: all 0.2s;
  }

.delete-btn:hover {
    background: rgba(255, 0, 51, 0.15);
    box-shadow: 0 0 15px rgba(255, 0, 51, 0.5);
    color: #ff6680;
  }

  [data-radix-table] {
    background: #070b14;
    border: 1px solid #00d4ff33;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 0 25px rgba(0, 212, 255, 0.18);
  }

  [data-radix-table] th {
    background: #0b1220;
    color: #00d4ff;
    border-bottom: 1px solid #00d4ff33;
    text-shadow: 0 0 8px rgba(0, 212, 255, 0.8);
    font-weight: 700;
    padding: 14px;
  }

  [data-radix-table] td {
    border-bottom: 1px solid #00d4ff22;
    color: #e2f2ff;
    padding: 14px;
  }

  [data-radix-table] tr:hover {
    background: #0b1220;
    box-shadow: inset 0 0 20px rgba(0, 212, 255, 0.12);
  }

  [data-radix-table] tr:last-child td {
    border-bottom: none;
  }
`;
