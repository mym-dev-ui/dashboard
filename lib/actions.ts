"use server";

import { ref, set, update, remove, push } from "firebase/database";
import { db } from "@/lib/firebase";
import { revalidatePath } from "next/cache";
import { Timestamp } from "firebase/database";
import { Product, Customer, Order } from "../definitions";

// Product Actions
export async function createProduct(product: Omit<Product, 'id'>) {
  const newRef = push(ref(db, "products"));
  await set(newRef, product);
  revalidatePath("/products");
}

export async function updateProduct(id: string, product: Partial<Product>) {
  await update(ref(db, `products/${id}`), product);
  revalidatePath("/products");
}

export async function deleteProduct(id: string) {
  await remove(ref(db, `products/${id}`));
  revalidatePath("/products");
}

// Customer Actions
export async function createCustomer(customer: Omit<Customer, 'id' | 'joinedAt'>) {
  const newRef = push(ref(db, "customers"));
  await set(newRef, {
    ...customer,
    joinedAt: Date.now(),
  });
  revalidatePath("/customers");
}

export async function updateCustomer(id: string, customer: Partial<Customer>) {
  await update(ref(db, `customers/${id}`), customer);
  revalidatePath("/customers");
}

export async function deleteCustomer(id: string) {
  await remove(ref(db, `customers/${id}`));
  revalidatePath("/customers");
}

// Order Actions
export async function deleteOrderAction(formData: FormData) {
  const id = formData.get("id") as string;
  if (!id) return;
  await remove(ref(db, `orders/${id}`));
  revalidatePath("/orders");
}
