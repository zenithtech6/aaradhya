-- Run once in the Supabase SQL editor (before or with seed.sql).
-- Adds a unique product code, hide (storefront), and soft delete.

alter table products
  add column if not exists code text,
  add column if not exists is_hidden boolean not null default false,
  add column if not exists deleted_at timestamptz;

update products
set code = 'DY-' || upper(substr(regexp_replace(coalesce(slug, id::text), '[^a-zA-Z0-9]', '', 'g'), 1, 8))
where code is null or btrim(code) = '';

with ranked as (
  select id, row_number() over (partition by lower(code) order by created_at) as n
  from products
)
update products p
set code = p.code || '-' || substr(replace(p.id::text, '-', ''), 1, 4)
from ranked r
where p.id = r.id and r.n > 1;

alter table products alter column code set not null;

create unique index if not exists products_code_key on products (lower(code));
