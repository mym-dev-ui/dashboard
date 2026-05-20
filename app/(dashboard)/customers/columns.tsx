"use client";

import { useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import type { Customer } from "@/lib/definitions";
import { deleteCustomer } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CustomerForm } from "@/components/dashboard/customer-form";

const ActionsCell = ({ row }: { row: any }) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const customer = row.original as Customer;

  return (
    <>
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild><Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}><Pencil className="ml-2 h-4 w-4" />تعديل</DropdownMenuItem>
            <DropdownMenuItem className="text-red-600" onClick={async () => { if (confirm(`هل أنت متأكد من حذف العميل ${customer.name}؟`)) { await deleteCustomer(customer.id); } }}><Trash2 className="ml-2 h-4 w-4" />حذف</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <DialogContent><DialogHeader><DialogTitle>تعديل العميل</DialogTitle></DialogHeader><CustomerForm setOpen={setIsEditDialogOpen} initialData={customer} /></DialogContent>
      </Dialog>
    </>
  );
};

export const columns: ColumnDef<Customer>[] = [
  { accessorKey: "name", header: "الاسم" },
  { accessorKey: "phone", header: "الهاتف" },
  { accessorKey: "address", header: "العنوان" },
  { accessorKey: "joinedAt", header: "تاريخ الانضمام", cell: ({ row }) => (row.getValue("joinedAt") as any).toDate().toLocaleDateString('ar-EG') },
  { id: "actions", cell: ActionsCell },
];
