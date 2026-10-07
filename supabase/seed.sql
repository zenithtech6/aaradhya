-- Run supabase/alter-products.sql first (code, is_hidden, deleted_at).
-- Matches the live schema: settings is key/value jsonb,
-- banners use image_url / starts_at / ends_at,
-- pack_options use {label, qty, price}.
-- Safe to re-run.

insert into categories (id, name, slug, sort_order)
values
  ('11111111-1111-1111-1111-111111111111', 'Clay Diyas', 'clay-diyas', 1),
  ('22222222-2222-2222-2222-222222222222', 'Brass Diyas', 'brass-diyas', 2),
  ('33333333-3333-3333-3333-333333333333', 'Gift Packs', 'gift-packs', 3)
on conflict (id) do update
set name = excluded.name,
    slug = excluded.slug,
    sort_order = excluded.sort_order;

insert into settings (key, value)
values
  ('shop_name', to_jsonb('Diwali Diya Store'::text)),
  ('logo_url', to_jsonb(''::text)),
  ('whatsapp_number', to_jsonb('919307887839'::text)),
  ('call_number', to_jsonb('9307887839'::text)),
  ('store_address', to_jsonb(E'Jain mandir shilphata khopoli 410203'::text)),
  ('store_map_url', to_jsonb('https://share.google/nmGlSS2UpsOVy49bh'::text)),
  ('deliverable_pincodes', to_jsonb('410203'::text)),
  ('diwali_date', to_jsonb('2026-10-29'::text))
on conflict (key) do update
set value = excluded.value;

insert into products (
  id, name, slug, code, description, category_id, price, mrp, badge,
  in_stock, is_featured, sort_order, images, lit_image, colors, pack_options
)
values
(
  'b1111111-1111-1111-1111-111111111111',
  'Classic Clay Diya Set',
  'classic-clay-diya-set',
  'DY-CLAY6',
  'Hand-thrown terracotta diyas with a cotton wick. Warm, traditional glow for rangoli corners and puja thalis.',
  '11111111-1111-1111-1111-111111111111',
  249, 349, 'Bestseller', true, true, 1,
  array[
    'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1507499739999-0c4616c9f2d4?auto=format&fit=crop&w=900&q=80'
  ],
  'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=900&q=80',
  '[{"name":"Terracotta","hex":"#C1440E","image":"https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&w=900&q=80"},{"name":"Maroon","hex":"#4A0E1C","image":"https://images.unsplash.com/photo-1507499739999-0c4616c9f2d4?auto=format&fit=crop&w=900&q=80"}]'::jsonb,
  '[{"label":"Set of 6","qty":6,"price":249},{"label":"Set of 12","qty":12,"price":449},{"label":"Set of 24","qty":24,"price":799}]'::jsonb
),
(
  'b2222222-2222-2222-2222-222222222222',
  'Lotus Brass Diya',
  'lotus-brass-diya',
  'DY-BRASS',
  'Polished brass lotus with a deep well for ghee. A keepsake diya for the mandir.',
  '22222222-2222-2222-2222-222222222222',
  599, 799, 'Premium', true, true, 2,
  array[
    'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?auto=format&fit=crop&w=900&q=80'
  ],
  'https://images.unsplash.com/photo-1545486332-9d1fee1e1ed7?auto=format&fit=crop&w=900&q=80',
  '[{"name":"Antique Gold","hex":"#D4A017"},{"name":"Copper","hex":"#B87333"}]'::jsonb,
  '[{"label":"Single","qty":1,"price":599},{"label":"Pair","qty":2,"price":1099}]'::jsonb
),
(
  'b3333333-3333-3333-3333-333333333333',
  'Floating Flower Diyas',
  'floating-flower-diyas',
  'DY-FLOAT',
  'Wide-bowl clay diyas made to float in urli bowls with petals and tea lights.',
  '11111111-1111-1111-1111-111111111111',
  329, 399, null, true, false, 3,
  array[
    'https://images.unsplash.com/photo-1478144592103-25e6de4c2d51?auto=format&fit=crop&w=900&q=80'
  ],
  'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=900&q=80',
  '[{"name":"Ivory","hex":"#FFF6E5"},{"name":"Saffron","hex":"#F28C28"}]'::jsonb,
  '[{"label":"Set of 6","qty":6,"price":329},{"label":"Set of 12","qty":12,"price":579}]'::jsonb
),
(
  'b4444444-4444-4444-4444-444444444444',
  'Designer Gift Pack of 12',
  'designer-gift-pack-12',
  'DY-GIFT12',
  'Assorted painted diyas packed in a festive box. Ready to gifting, no wrapping needed.',
  '33333333-3333-3333-3333-333333333333',
  899, 1199, 'Gift', true, true, 4,
  array[
    'https://images.unsplash.com/photo-1604424288892-b8f4e0b6e0c3?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1578662996442-48f36befd7f5?auto=format&fit=crop&w=900&q=80'
  ],
  'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?auto=format&fit=crop&w=900&q=80',
  '[{"name":"Mixed","hex":"#D4A017"}]'::jsonb,
  '[{"label":"Box of 12","qty":12,"price":899},{"label":"Box of 24","qty":24,"price":1599}]'::jsonb
),
(
  'b5555555-5555-5555-5555-555555555555',
  'Scented Wax Diyas',
  'scented-wax-diyas',
  'DY-WAX',
  'Soy-wax filled clay cups in jasmine and sandalwood. Clean burn, gentle fragrance.',
  '11111111-1111-1111-1111-111111111111',
  379, 449, 'New', true, false, 5,
  array[
    'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=900&q=80'
  ],
  'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=900&q=80',
  '[{"name":"Jasmine","hex":"#F8E8C8"},{"name":"Sandalwood","hex":"#C4A484"}]'::jsonb,
  '[]'::jsonb
),
(
  'b6666666-6666-6666-6666-666666666666',
  'Rangoli Diya Combo',
  'rangoli-diya-combo',
  'DY-RANG20',
  'Twenty small painted diyas to outline a rangoli. Lightweight, bright colours.',
  '33333333-3333-3333-3333-333333333333',
  499, 649, null, true, false, 6,
  array[
    'https://images.unsplash.com/photo-1634193295627-8c930dd1930b?auto=format&fit=crop&w=900&q=80'
  ],
  'https://images.unsplash.com/photo-1502082553048-f009c37129c9?auto=format&fit=crop&w=900&q=80',
  '[{"name":"Rainbow","hex":"#F28C28"}]'::jsonb,
  '[{"label":"Set of 20","qty":20,"price":499}]'::jsonb
)
on conflict (id) do update
set name = excluded.name,
    slug = excluded.slug,
    code = excluded.code,
    description = excluded.description,
    category_id = excluded.category_id,
    price = excluded.price,
    mrp = excluded.mrp,
    badge = excluded.badge,
    in_stock = excluded.in_stock,
    is_featured = excluded.is_featured,
    sort_order = excluded.sort_order,
    images = excluded.images,
    lit_image = excluded.lit_image,
    colors = excluded.colors,
    pack_options = excluded.pack_options;

insert into banners (
  id, type, title, subtitle, image_url, link, cta_text, active, sort_order, starts_at, ends_at
)
values
(
  'c1111111-1111-1111-1111-111111111111',
  'offer',
  'Free 24-hr delivery in selected pincodes  •  Cash on delivery  •  Handmade clay & brass diyas',
  null,
  null,
  null,
  null,
  true,
  1,
  null,
  null
),
(
  'c2222222-2222-2222-2222-222222222222',
  'carousel',
  'Light up this Diwali',
  'Handmade diyas. Order on WhatsApp. Delivered by tomorrow.',
  'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&w=1400&q=80',
  '/#products',
  'Shop diyas',
  true,
  1,
  null,
  null
),
(
  'c3333333-3333-3333-3333-333333333333',
  'popup',
  'Diwali gift packs from ₹249',
  'Add a set to cart and order on WhatsApp. Cash on delivery.',
  'https://images.unsplash.com/photo-1545486332-9d1fee1e1ed7?auto=format&fit=crop&w=900&q=80',
  '/#products',
  'Browse packs',
  true,
  1,
  null,
  null
)
on conflict (id) do update
set type = excluded.type,
    title = excluded.title,
    subtitle = excluded.subtitle,
    image_url = excluded.image_url,
    link = excluded.link,
    cta_text = excluded.cta_text,
    active = excluded.active,
    sort_order = excluded.sort_order,
    starts_at = excluded.starts_at,
    ends_at = excluded.ends_at;
