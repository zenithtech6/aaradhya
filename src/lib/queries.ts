import { createClient } from "@/lib/supabase/server";
import type {
  Banner,
  BannerType,
  Category,
  Order,
  PackOption,
  Product,
  Settings,
} from "@/types";

type SettingRow = { key: string; value: unknown };

function jsonToString(value: unknown): string {
  if (value == null) return "";
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (Array.isArray(value)) return value.map(String).join(",");
  return String(value);
}

function asPackOptions(value: unknown): PackOption[] {
  if (!Array.isArray(value)) return [];
  return value.map((pack) => {
    const row = pack as { label?: string; name?: string; qty?: number; price?: number };
    return {
      label: row.label ?? row.name ?? "",
      qty: row.qty,
      price: Number(row.price ?? 0),
    };
  });
}

function asProduct(row: Product): Product {
  return {
    ...row,
    code: row.code || "",
    price: Number(row.price),
    mrp: row.mrp == null ? null : Number(row.mrp),
    images: Array.isArray(row.images) ? row.images : [],
    colors: Array.isArray(row.colors) ? row.colors : [],
    pack_options: asPackOptions(row.pack_options),
    is_hidden: Boolean(row.is_hidden),
    deleted_at: row.deleted_at ?? null,
  };
}

export async function getSettings(): Promise<Settings | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from("settings").select("key, value");
    if (error || !data || data.length === 0) return null;
    const map = Object.fromEntries(
      (data as SettingRow[]).map((row) => [row.key, row.value])
    );
    return {
      shop_name: jsonToString(map.shop_name) || "Diwali Diya Store",
      logo_url: jsonToString(map.logo_url),
      whatsapp_number: jsonToString(map.whatsapp_number),
      call_number: jsonToString(map.call_number),
      store_address: jsonToString(map.store_address),
      store_map_url: jsonToString(map.store_map_url),
      deliverable_pincodes: jsonToString(map.deliverable_pincodes),
      diwali_date: jsonToString(map.diwali_date),
    };
  } catch {
    return null;
  }
}

export async function getCategories(): Promise<Category[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error || !data) return [];
    return data as Category[];
  } catch {
    return [];
  }
}

export async function getProducts(): Promise<Product[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .is("deleted_at", null)
      .eq("is_hidden", false)
      .order("sort_order", { ascending: true });
    if (error || !data) return [];
    return (data as Product[]).map(asProduct);
  } catch {
    return [];
  }
}

export async function getAdminProducts(): Promise<Product[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error || !data) return [];
    return (data as Product[]).map(asProduct);
  } catch {
    return [];
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("slug", slug)
      .is("deleted_at", null)
      .eq("is_hidden", false)
      .maybeSingle();
    if (error || !data) return null;
    return asProduct(data as Product);
  } catch {
    return null;
  }
}

export async function getRelatedProducts(product: Product): Promise<Product[]> {
  try {
    const supabase = await createClient();
    let query = supabase
      .from("products")
      .select("*")
      .neq("id", product.id)
      .is("deleted_at", null)
      .eq("is_hidden", false)
      .order("sort_order", { ascending: true })
      .limit(4);
    if (product.category_id) {
      query = query.eq("category_id", product.category_id);
    }
    const { data, error } = await query;
    if (error || !data) return [];
    return (data as Product[]).map(asProduct);
  } catch {
    return [];
  }
}

function asOrder(row: Order): Order {
  return {
    ...row,
    total: Number(row.total),
    items: Array.isArray(row.items) ? row.items : [],
  };
}

export async function getDashboardCounts() {
  try {
    const supabase = await createClient();
    const [products, orders] = await Promise.all([
      supabase
        .from("products")
        .select("*", { count: "exact", head: true })
        .is("deleted_at", null),
      supabase.from("orders").select("*", { count: "exact", head: true }),
    ]);
    return {
      products: products.count ?? 0,
      orders: orders.count ?? 0,
    };
  } catch {
    return { products: 0, orders: 0 };
  }
}

export async function getOrders(): Promise<Order[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });
    if (error || !data) return [];
    return (data as Order[]).map(asOrder);
  } catch {
    return [];
  }
}

export async function getOrderById(id: string): Promise<Order | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error || !data) return null;
    return asOrder(data as Order);
  } catch {
    return null;
  }
}

export async function getProductById(id: string): Promise<Product | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error || !data) return null;
    return asProduct(data as Product);
  } catch {
    return null;
  }
}

export async function getAllBanners(): Promise<Banner[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("banners")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error || !data) return [];
    return data as Banner[];
  } catch {
    return [];
  }
}

export async function getActiveBanners(type: BannerType): Promise<Banner[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("banners")
      .select("*")
      .eq("type", type)
      .eq("active", true)
      .order("sort_order", { ascending: true });
    if (error || !data) return [];
    return data as Banner[];
  } catch {
    return [];
  }
}
