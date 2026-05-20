"use client";

import { useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import type { Product } from "@/lib/definitions";
import { deleteProduct } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ProductForm } from "@/components/dashboard/product-form";

const ActionsCell = ({ row }: { row: any }) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const product = row.original as Product;

  return (
    <>
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">فتح القائمة</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>
              <Pencil className="ml-2 h-4 w-4" />
              تعديل
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-red-600"
              onClick={async () => {
                if (confirm(`هل أنت متأكد من حذف المنتج ${product.name}؟`)) {
                  await deleteProduct(product.id);
                }
              }}
            >
              <Trash2 className="ml-2 h-4 w-4" />
              حذف
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>تعديل المنتج</DialogTitle>
          </DialogHeader>
          <ProductForm setOpen={setIsEditDialogOpen} initialData={product} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export const columns: ColumnDef<Product>[] = [
  { accessorKey: "name", header: "الاسم" },
  {
    accessorKey: "price",
    header: "السعر",
    cell: ({ row }) => new Intl.NumberFormat("ar-SA", { style: "currency", currency: "SAR" }).format(row.getValue("price")),
  },
  { accessorKey: "stock", header: "المخزون" },
  { id: "actions", cell: ActionsCell },
];
