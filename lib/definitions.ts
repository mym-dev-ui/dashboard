import { Timestamp } from "firebase/firestore";

export type Order = {
  id: string;
  customerName: string;
  status: 'قيد الانتظار' | 'تم الشحن' | 'تم التوصيل' | 'ملغي';
  amount: number;
  createdAt: Timestamp;
  items: { productId: string; quantity: number }[];
};

export type Product = {
  id: string;
  name: string;
  price: number;
  stock: number;
};

export type Customer = {
  id:string;
  name: string;
  phone: string;
  address: string;
  joinedAt: Timestamp;
};
