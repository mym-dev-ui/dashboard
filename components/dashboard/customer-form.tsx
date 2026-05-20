"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { createCustomer, updateCustomer } from "@/lib/actions";
import type { Customer } from "@/lib/definitions";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  name: z.string().min(2, "الاسم مطلوب"),
  phone: z.string().min(10, "رقم الهاتف غير صالح"),
  address: z.string().min(5, "العنوان مطلوب"),
});

interface CustomerFormProps {
  setOpen: (open: boolean) => void;
  initialData?: Customer;
}

export function CustomerForm({ setOpen, initialData }: CustomerFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || { name: "", phone: "", address: "" },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (initialData) {
      await updateCustomer(initialData.id, values);
    } else {
      await createCustomer(values);
    }
    setOpen(false);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField control={form.control} name="name" render={({ field }) => (<FormItem><FormLabel>اسم العميل</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
        <FormField control={form.control} name="phone" render={({ field }) => (<FormItem><FormLabel>رقم الهاتف</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
        <FormField control={form.control} name="address" render={({ field }) => (<FormItem><FormLabel>العنوان</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "جاري الحفظ..." : "حفظ العميل"}
        </Button>
      </form>
    </Form>
  );
}
