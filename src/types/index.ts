export type ProductColor = {
  name: string;
  hex: string;
  image?: string;
};

export type PackOption = {
  label: string;
  qty?: number;
  price: number;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  sort_order: number;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  code: string;
  description: string | null;
  category_id: string | null;
  price: number;
  mrp: number | null;
  badge: string | null;
  in_stock: boolean;
  is_featured: boolean;
  sort_order: number;
  images: string[];
  lit_image: string | null;
  colors: ProductColor[];
  pack_options: PackOption[];
  is_hidden: boolean;
  deleted_at: string | null;
  created_at: string;
};

export type BannerType = "carousel" | "offer" | "popup";

export type Banner = {
  id: string;
  type: BannerType;
  image_url: string | null;
  title: string | null;
  subtitle: string | null;
  link: string | null;
  cta_text: string | null;
  active: boolean;
  sort_order: number;
  starts_at: string | null;
  ends_at: string | null;
};

export type Settings = {
  shop_name: string;
  logo_url: string;
  whatsapp_number: string;
  call_number: string;
  store_address: string;
  store_map_url: string;
  deliverable_pincodes: string;
  diwali_date: string;
};

export type OrderSource = "web" | "manual";

export type OrderItem = {
  productId: string;
  code?: string;
  name: string;
  image?: string;
  price: number;
  qty: number;
  color?: string;
  pack?: string;
};

export type Order = {
  id: string;
  order_id: string;
  customer_name: string;
  phone: string;
  address: string;
  pincode: string;
  items: OrderItem[];
  total: number;
  source: OrderSource;
  created_at: string;
};

export type CartItem = {
  productId: string;
  code?: string;
  name: string;
  image: string;
  price: number;
  qty: number;
  color?: string;
  pack?: string;
};

export type WhatsAppOrder = {
  orderId: string;
  customerName: string;
  phone: string;
  address: string;
  pincode: string;
  items: Array<{
    name: string;
    code?: string;
    qty: number;
    price: number;
    color?: string;
    pack?: string;
  }>;
  total: number;
};
