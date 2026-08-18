export type Product = {
  id: number;
  slug: string;
  name: string;
  category: string;
  categories: string[];
  type: string;
  price: number;
  regularPrice: number;
  onSale: boolean;
  size: string | null;
  image: string | null;
  description: string;
  shortDescription: string;
  inStock: boolean;
};

export type Review = {
  name: string;
  role: string;
  rating: number;
  quote: string;
};

export type OrderLineItem = {
  name: string;
  quantity: number;
  total: number;
};

export type Order = {
  id: number;
  number: string;
  date: string;
  status: string;
  total: number;
  lineItems: OrderLineItem[];
};
