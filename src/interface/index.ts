export interface Order {
  createdAt: string;
  id: number;
  status: boolean;
  orderProducts: Array<OrderProduct> | undefined;
  supplier: {
    id: string;
    name: String;
  };
  note: string | undefined;
  tax: number;
  code: string;
}

export interface ImportOrder {
  id: number;
  code: string;
  payment: number;
  createdAt?: Date;
  updatedAt?: Date;
  supplier: Supplier;
  status: Status;
  employee: Employee;
  importOrderProducts?: ImportOrderProduct[];
  note?: string;
}

export interface ImportOrderProduct {
  id: number | undefined;
  quantity: number;
  product: Product;
  importOrder?: ImportOrder;
  importPrice: number;
}

export interface Employee {
  id: number;
  name: string;
  username: string;
  password: string;
  phoneNumber: string;
  dateOfBirth: Date;
  address: string;
  homeTown: string;
  gender: string;
}

export interface Category {
  id: number;
  name: string;
}

export interface Product {
  category: {
    id: number;
    name: string;
  };
  description: string;
  id: number;
  image: string;
  name: string;
  price: number;
  stock: number;
  deleted: boolean;
}

export interface Supplier {
  createdAt?: string | undefined;
  id: number;
  name: string | undefined;
  email: string | undefined;
  phoneNumber: string | undefined;
  address: string | undefined;
  note: string | undefined;
  taxCode?: string | undefined;
  [key: string]: unknown;
}

export interface OrderProduct {
  id: number;
  quantity: number;
  product: Product;
  price: number;
}

export interface Status {
  id: number;
  name: string;
}