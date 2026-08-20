export type BundledItem = {
  productId: number;
  title: string;
  quantity: number;
  slug: string | null;
  image: string | null;
  variationLabel: string | null;
};

export type ProductVariation = {
  id: number;
  label: string;
  price: number;
  regularPrice: number;
  onSale: boolean;
  inStock: boolean;
  image: string | null;
};

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
  featured: boolean;
  variations: ProductVariation[] | null;
  image: string | null;
  description: string;
  shortDescription: string;
  inStock: boolean;
  bundledItems: BundledItem[] | null;
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
  isPickup: boolean;
};
