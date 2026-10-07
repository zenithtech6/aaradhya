# Project: Diwali Diya Store (Next.js + Supabase)

Build a mobile-first, festive e-commerce "funnel" website for a diya (lamp) seller, plus an admin panel in the same Next.js project. There is NO payment gateway, NO order status, NO tracking. Customers browse, add to cart, and tap "Order on WhatsApp" (prefilled message) or "Call to order". All orders are cash on delivery, delivered within 24 hours.

The project is already scaffolded: Next.js App Router, TypeScript, Tailwind, shadcn/ui, framer-motion, zustand, @supabase/ssr, react-hook-form, zod, embla-carousel-react, lottie-react, @react-pdf/renderer, qrcode, lucide-react, sonner. The Supabase schema (categories, products, orders, banners, settings) already exists. Use those table and column names exactly. Do not install extra packages without asking.

## Rules
- Build ONLY the phase I name. Stop after each phase and list what to test.
- Keep code simple and typed. No over-engineering, no tests unless asked.
- Reuse components. Don't rewrite files unrelated to the task.
- Never use localStorage directly outside the zustand persist middleware.
- Read secrets from env vars. Admin routes must be protected.

## Design system
- Palette: maroon #4A0E1C, gold #D4A017, saffron #F28C28, cream #FFF6E5. Add as Tailwind theme colors.
- Fonts via next/font: Playfair Display (headings), Poppins (body).
- Vibe: rich, warm, premium Diwali. Gold borders, soft glow shadows, rangoli/mandala-style SVG patterns as section dividers, flickering CSS flame animation, subtle floating sparkles/petals in the hero.
- Animations (framer-motion): staggered card reveals on scroll, hover zoom, button press feedback, smooth cart drawer, count-up of discounts.
- Mobile first: sticky bottom bar on mobile with Cart and WhatsApp; thumb-friendly buttons.

## Phase 1: Foundation
- Tailwind theme, fonts, global styles, flame animation CSS.
- lib/supabase/client.ts and server.ts; types/index.ts for all tables.
- store/cart.ts (zustand + persist): items {productId, name, image, price, qty, color?, pack?}, add/remove/update/clear, totals.
- lib/whatsapp.ts: generateOrderId() like DY-DDMMYY-XXXX (random 4 chars), buildWhatsAppMessage(order) listing order id, customer name, phone, address, pincode, each item with color/pack/qty/price, total, "Cash on Delivery", then buildWhatsAppUrl(number, message) using wa.me and encodeURIComponent.
- middleware.ts protecting /admin/* (except /admin/login) using Supabase session.

## Phase 2: Customer website
Pages: / (home), /product/[slug], /cart (and a CartDrawer).
Home sections in order:
1. Offer strip at top (active 'offer' banners, auto-scrolling marquee).
2. Hero carousel (embla) from 'carousel' banners with animated diya/flame, headline, CTA scroll to products.
3. Diwali countdown (date from settings.diwali_date).
4. Category chips/tabs (horizontal scroll on mobile).
5. Featured Diwali Gift Packs section (products where is_featured).
6. Product grid with filters (category, color, price sort).
7. Why us (24-hr delivery, COD, handmade) with icons.
8. Store location + call button; footer.
Also: PopupAd (shows once per session from the active 'popup' banner, after 3 seconds, closable), FloatingWhatsApp button.

ProductCard: main image, hover/tap-toggle "See it lit" showing lit_image, colour swatches that swap the image, badge, price with MRP strikethrough and % off, "Add to cart" with animation + toast. Skeleton loading states.
Product page: image gallery with lit toggle, swatches, pack options (e.g. set of 6/12/24 with price), quantity, add to cart, related products.

Cart (drawer + page): edit quantities, form for name, phone (10-digit validation), address, pincode (zod). Validate pincode against settings.deliverable_pincodes; if not deliverable show a friendly message with store address and call number and block ordering. Buttons:
- "Order on WhatsApp": generate order id, insert the order into the orders table (source='web'), clear nothing until insert succeeds, then open the wa.me URL in a new tab, then show a thank-you screen.
- "Call to order": on mobile use tel: link, on desktop show the number in a dialog with a copy button.

## Phase 3: Admin panel (/admin)
Layout with sidebar (collapsible on mobile). Pages:
- /admin/login (Supabase email/password).
- /admin (dashboard): counts for products, orders today, total orders; quick links.
- /admin/products: table + add/edit dialog or page. Fields: name, slug (auto), description, category, price, mrp, badge, in_stock, is_featured, sort_order, images (multi-upload to Supabase Storage bucket 'product-images' with <input type="file" accept="image/*" capture="environment"> and client-side compression to under 300 KB), lit_image upload, colors editor (name, hex, image), pack_options editor. Delete with confirmation. Category CRUD.
- /admin/orders: list orders (search by order id, phone), view details, "Create order" form (customer, phone, address, pincode, pick products with qty, auto total, source='manual', generate order id), edit and delete.
- /admin/bills: pick an order (or create from the form), generate a PDF bill with @react-pdf/renderer: shop name/address/phone from settings, bill number, date, customer details, items table, total, "Cash on Delivery", thank-you note. Download button.
- /admin/banners: CRUD for carousel, offer, and popup banners with image upload, title, subtitle, link, CTA text, active toggle, sort order, optional start/end dates. Live preview of the popup.
- /admin/settings: WhatsApp number, call number, store address, map URL, deliverable pincodes (comma-separated), Diwali date, shop name. Plus a QR code generator for the site URL with ?src=box that can be downloaded as PNG.

## Phase 4: Polish
- SEO metadata and Open Graph, favicon, sitemap.
- Image optimization, lazy loading, loading skeletons, empty and error states.
- Accessibility basics and Lighthouse mobile performance pass.

Start by confirming you've read this, then wait for me to name the phase.