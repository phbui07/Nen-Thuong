export interface Products {
  id: string;
  name: string;
  price: number;
  images: { url: string }[];
  isFeatured: boolean;
  isArchived: boolean;
  category: string;
  categoryId: string | null;
  size: string;
  sizeId: string | null;
  origin: string;
  description: string;
  qty: number;
}

export interface Category {
  id: string;
  name: string;
  productCount?: number;
}

export interface Size {
  id: string;
  name: string;
  value: string;
  productCount?: number;
}

export type PaymentMethod = "bank_transfer" | "cod" | "stripe";

export const ORDER_STATUSES = ["Processing", "Delivering", "Delivered", "Canceled"] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export interface OrderItem {
  productId: string | null;
  name: string;
  price: number;
  qty: number;
  imageUrl: string;
}

export interface Orders {
  id: string;
  code: string;
  userId: string;
  customerName: string;
  phone: string;
  email: string;
  address: string;
  note: string;
  paymentMethod: PaymentMethod;
  isPaid: boolean;
  status: OrderStatus;
  total: number;
  items: OrderItem[];
  stripeSessionId: string | null;
  createdAt: string;
}

export interface StoreSettings {
  bankTransferEnabled: boolean;
  bankBin: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
  codEnabled: boolean;
}
