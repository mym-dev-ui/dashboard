"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Home, ShoppingCart, Users, Package } from 'lucide-react';

export function CommandMenu() {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runCommand = (command: () => unknown) => {
    setOpen(false);
    command();
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="...اكتب أمرًا أو ابحث" />
      <CommandList>
        <CommandEmpty>لا توجد نتائج.</CommandEmpty>
        <CommandGroup heading="التنقل">
          <CommandItem onSelect={() => runCommand(() => router.push('/'))}>
            <Home className="ml-2 h-4 w-4" />
            <span>لوحة التحكم</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push('/orders'))}>
            <ShoppingCart className="ml-2 h-4 w-4" />
            <span>الطلبات</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push('/products'))}>
            <Package className="ml-2 h-4 w-4" />
            <span>المنتجات</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push('/customers'))}>
            <Users className="ml-2 h-4 w-4" />
            <span>العملاء</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
