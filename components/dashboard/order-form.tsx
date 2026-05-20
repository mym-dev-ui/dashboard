"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { createOrder } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formSchema = z.object({
  customerName: z.string().min(2, "الاسم مطلوب"),
  amount: z.coerce.number().positive("المبلغ يجب أن يكون إيجابياً"),
  status: z.enum(['قيد الانتظار', 'تم الشحن', 'تم التوصيل', 'ملغي']),
});

export function OrderForm({ setOpen }: { setOpen: (open: boolean) => void }) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      customerName: "",
      amount: 0,
      status: "قيد الانتظار",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // In a real app, items would be handled properly.
    await createOrder({ ...values, items: [] });
    setOpen(false);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="customerName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>اسم العميل</FormLabel>
              <FormControl>
                <Input placeholder="مثال: جون دو" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>المبلغ</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>الحالة</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر حالة الطلب" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="قيد الانتظار">قيد الانتظار</SelectItem>
                  <SelectItem value="تم الشحن">تم الشحن</SelectItem>
                  <SelectItem value="تم التوصيل">تم التوصيل</SelectItem>
                  <SelectItem value="ملغي">ملغي</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "جاري الإنشاء..." : "إنشاء طلب"}
        </Button>
      </form>
    </Form>
  );
}
