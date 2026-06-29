# راهنمای اتصال پیرو به Supabase (بک‌اند امن)

این راهنما حساب‌های کاربری دموی محلی را به یک بک‌اند واقعی و امن تبدیل می‌کند.

---

## مرحله ۱ — ساخت پروژه

1. به [supabase.com](https://supabase.com) بروید و یک حساب بسازید (رایگان).
2. **New Project** → نام و رمز دیتابیس را وارد کنید → منطقه نزدیک (مثلاً Frankfurt).
3. بعد از ساخت، به **Project Settings → API** بروید و این دو مقدار را کپی کنید:
   - `Project URL`
   - `anon public key`

---

## مرحله ۲ — وارد کردن کلیدها

فایل `assets/supabase.js` را باز کنید و دو خط بالا را پر کنید:

```js
const SUPABASE_URL  = "https://xxxx.supabase.co";
const SUPABASE_ANON = "eyJhbGciOi...";
```

و در `account.html` و `dashboard.html` این خط را **قبل از** `auth.js` اضافه کنید:

```html
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<script src="assets/supabase.js"></script>
```

> اگر CDN به دلیل تحریم باز نشد، فایل `supabase-js@2` را دانلود و به‌صورت محلی در `assets/` قرار دهید.

---

## مرحله ۳ — ساخت جدول و امنیت (RLS)

در Supabase به **SQL Editor** بروید و این کوئری را اجرا کنید:

```sql
-- جدول پروفایل کاربران
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  first_name  text not null,
  last_name   text not null,
  national_id text unique not null,
  mobile      text unique not null,
  created_at  timestamptz default now()
);

-- فعال‌سازی Row Level Security (هر کاربر فقط به دادهٔ خودش دسترسی دارد)
alter table public.profiles enable row level security;

create policy "users read own profile"
  on public.profiles for select
  using ( auth.uid() = id );

create policy "users insert own profile"
  on public.profiles for insert
  with check ( auth.uid() = id );

create policy "users update own profile"
  on public.profiles for update
  using ( auth.uid() = id );

-- جدول سفارش‌ها
create table public.orders (
  id          uuid default gen_random_uuid() primary key,
  user_id     uuid references auth.users on delete cascade,
  items       jsonb not null,
  total       bigint not null,
  status      text default 'pending',
  created_at  timestamptz default now()
);
alter table public.orders enable row level security;
create policy "users manage own orders"
  on public.orders for all
  using ( auth.uid() = user_id )
  with check ( auth.uid() = user_id );

-- جدول آدرس‌ها
create table public.addresses (
  id        uuid default gen_random_uuid() primary key,
  user_id   uuid references auth.users on delete cascade,
  title     text,
  province  text, city text, full_address text, postal_code text,
  receiver  text, phone text
);
alter table public.addresses enable row level security;
create policy "users manage own addresses"
  on public.addresses for all
  using ( auth.uid() = user_id )
  with check ( auth.uid() = user_id );
```

---

## مرحله ۴ — تمام!

بعد از این مراحل:
- ثبت‌نام و ورود از طریق Supabase Auth انجام می‌شود (رمز عبور به‌صورت امن hash می‌شود).
- کد ملی در جدول `profiles` با RLS محافظت می‌شود — هیچ کاربری به دادهٔ کاربر دیگر دسترسی ندارد.
- سفارش‌ها و آدرس‌ها در دیتابیس واقعی ذخیره می‌شوند.

---

## امنیت کد ملی — نکات مهم

1. **RLS فعال است** → داده‌ها بین کاربران ایزوله‌اند.
2. برای امنیت بیشتر، می‌توان کد ملی را با **pgcrypto** رمزنگاری کرد.
3. هرگز `service_role key` را در کد فرانت‌اند قرار ندهید — فقط `anon key`.
4. ارتباط همیشه روی HTTPS است.
