import { collection, addDoc, doc, updateDoc, deleteDoc, Timestamp } from "firebase/firestore";
import { db } from "./firebase";
import { revalidatePath } from "next/cache";
import type { Product, Customer, Order } from "./definitions";

// Product Actions
export async function createProduct(product: Omit<Product, 'id'>) {
  await addDoc(collection(db, "products"), product);
  revalidatePath("/products");
}

export async function updateProduct(id: string, product: Partial<Product>) {
  await updateDoc(doc(db, "products", id), product);
  revalidatePath("/products");
}

export async function deleteProduct(id: string) {
  await deleteDoc(doc(db, "products", id));
  revalidatePath("/products");
}

// Customer Actions
export async function createCustomer(customer: Omit<Customer, 'id' | 'joinedAt'>) {
    await addDoc(collection(db, "customers"), {
        ...customer,
        joinedAt: Timestamp.now(),
    });
    revalidatePath("/customers");
}

export async function updateCustomer(id: string, customer: Partial<Customer>) {
  await updateDoc(doc(db, "customers", id), customer);
  revalidatePath("/customers");
}

export async function deleteCustomer(id: string) {
  await deleteDoc(doc(db, "customers", id));
  revalidatePath("/customers");
}

// Order Actions
export async function createOrder(order: Omit<Order, 'id' | 'createdAt'>) {
    await addDoc(collection(db, "orders"), {
        ...order,
        createdAt: Timestamp.now(),
    });
    revalidatePath("/orders");
}

export async function updateOrderStatus(id: string, status: Order['status']) {
  await updateDoc(doc(db, "orders", id), { status });
  revalidatePath("/orders");
}

export async function deleteOrder(id: string) {
  await deleteDoc(doc(db, "orders", id));
  revalidatePath("/orders");
}
