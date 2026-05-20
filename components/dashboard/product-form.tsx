"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { createProduct, updateProduct } from "@/lib/actions";
import type { Product } from "@/lib/definitions";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  name: z.string().min(2, "الاسم مطلوب"),
  price: z.coerce.number().positive("السعر يجب أن يكون إيجابياً"),
  stock: z.coerce.number().int().nonnegative("المخزون لا يمكن أن يكون سالباً"),
});

interface ProductFormProps {
  setOpen: (open: boolean) => void;
  initialData?: Product;
}

export function ProductForm({ setOpen, initialData }: ProductFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: initialData || { name: "", price: 0, stock: 0 },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (initialData) {
      await updateProduct(initialData.id, values);
    } else {
      await createProduct(values);
    }
    setOpen(false);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField control={form.control} name="name" render={({ field }) => (<FormItem><FormLabel>اسم المنتج</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
        <FormField control={form.control} name="price" render={({ field }) => (<FormItem><FormLabel>السعر</FormLabel><FormControl><Input type="number" step="0.01" {...field} /></FormControl><FormMessage /></FormItem>)} />
        <FormField control={form.control} name="stock" render={({ field }) => (<FormItem><FormLabel>المخزون</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "جاري الحفظ..." : "حفظ المنتج"}
        </Button>
      </form>
    </Form>
  );
}
