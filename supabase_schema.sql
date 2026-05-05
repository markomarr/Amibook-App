-- ============================================================
-- AMIBOOK — Supabase Database Schema
-- Jalankan file ini di Supabase SQL Editor
-- (Dashboard → SQL Editor → New Query → paste → Run)
-- ============================================================

-- ── 1. Tabel profiles (extends auth.users) ───────────────────
CREATE TABLE IF NOT EXISTS profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name   TEXT NOT NULL,
  nim         TEXT UNIQUE,
  phone       TEXT,
  role        TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  avatar_url  TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── 2. Tabel categories ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS categories (
  id          SERIAL PRIMARY KEY,
  name        TEXT NOT NULL UNIQUE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── 3. Tabel books ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS books (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title            TEXT NOT NULL,
  author           TEXT NOT NULL,
  isbn             TEXT UNIQUE,
  publisher        TEXT,
  year             INT,
  category_id      INT REFERENCES categories(id) ON DELETE SET NULL,
  description      TEXT,
  cover_url        TEXT,
  total_copies     INT NOT NULL DEFAULT 1,
  available_copies INT NOT NULL DEFAULT 1,
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT available_not_negative CHECK (available_copies >= 0),
  CONSTRAINT available_lte_total CHECK (available_copies <= total_copies)
);

-- ── 4. Tabel borrowings ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS borrowings (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  book_id     UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  borrowed_at TIMESTAMPTZ DEFAULT NOW(),
  due_date    TIMESTAMPTZ NOT NULL,
  returned_at TIMESTAMPTZ,
  status      TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'returned', 'overdue')),
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── 5. Auto-create profile saat user register ────────────────
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, nim)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'User Baru'),
    NEW.raw_user_meta_data->>'nim'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ── 6. Row Level Security (RLS) ──────────────────────────────

-- Profiles: user bisa baca semua, hanya edit milik sendiri
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Profiles visible to authenticated users" ON profiles;
CREATE POLICY "Profiles visible to authenticated users"
  ON profiles FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE TO authenticated USING (auth.uid() = id);

-- Books: semua bisa baca, hanya admin yang bisa edit
ALTER TABLE books ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Books are publicly readable" ON books;
CREATE POLICY "Books are publicly readable"
  ON books FOR SELECT USING (true);

DROP POLICY IF EXISTS "Only admin can insert books" ON books;
CREATE POLICY "Only admin can insert books"
  ON books FOR INSERT TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  ));

DROP POLICY IF EXISTS "Only admin can update books" ON books;
CREATE POLICY "Only admin can update books"
  ON books FOR UPDATE TO authenticated
  USING (EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  ));

DROP POLICY IF EXISTS "Only admin can delete books" ON books;
CREATE POLICY "Only admin can delete books"
  ON books FOR DELETE TO authenticated
  USING (EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  ));

-- Categories: semua bisa baca
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Categories readable by all" ON categories;
CREATE POLICY "Categories readable by all" ON categories FOR SELECT USING (true);

-- Borrowings: user hanya lihat milik sendiri, admin lihat semua
ALTER TABLE borrowings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users see own borrowings" ON borrowings;
CREATE POLICY "Users see own borrowings"
  ON borrowings FOR SELECT TO authenticated
  USING (
    auth.uid() = user_id OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

DROP POLICY IF EXISTS "Authenticated users can borrow" ON borrowings;
CREATE POLICY "Authenticated users can borrow"
  ON borrowings FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own borrowings" ON borrowings;
CREATE POLICY "Users can update own borrowings"
  ON borrowings FOR UPDATE TO authenticated
  USING (
    auth.uid() = user_id OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ── 7. Seed data: Categories ─────────────────────────────────
INSERT INTO categories (name) VALUES
  ('Komputer & Teknologi'),
  ('Matematika'),
  ('Fisika'),
  ('Sastra & Bahasa'),
  ('Ekonomi & Bisnis'),
  ('Hukum'),
  ('Kedokteran & Kesehatan'),
  ('Sejarah & Sosial'),
  ('Filsafat'),
  ('Agama')
ON CONFLICT (name) DO NOTHING;

-- ── 8. Seed data: Sample books ───────────────────────────────
INSERT INTO books (title, author, isbn, publisher, year, category_id, total_copies, available_copies, description)
SELECT
  'Clean Code: A Handbook of Agile Software Craftsmanship',
  'Robert C. Martin',
  '9780132350884',
  'Prentice Hall',
  2008,
  id,
  3, 3,
  'Buku wajib bagi setiap programmer yang ingin menulis kode yang bersih, mudah dibaca, dan mudah dipelihara.'
FROM categories WHERE name = 'Komputer & Teknologi'
ON CONFLICT DO NOTHING;

INSERT INTO books (title, author, isbn, publisher, year, category_id, total_copies, available_copies)
SELECT
  'The Pragmatic Programmer',
  'David Thomas & Andrew Hunt',
  '9780135957059',
  'Addison-Wesley',
  2019,
  id,
  2, 2
FROM categories WHERE name = 'Komputer & Teknologi'
ON CONFLICT DO NOTHING;

INSERT INTO books (title, author, isbn, publisher, year, category_id, total_copies, available_copies)
SELECT
  'Struktur Data & Algoritma dengan Python',
  'Michael T. Goodrich',
  '9781118290279',
  'Wiley',
  2013,
  id,
  4, 4
FROM categories WHERE name = 'Komputer & Teknologi'
ON CONFLICT DO NOTHING;

-- ── 9. Buat akun admin pertama (manual) ──────────────────────
-- Setelah register melalui UI, update role user tersebut jadi admin:
--
-- UPDATE profiles
-- SET role = 'admin'
-- WHERE nim = 'NIM_ADMIN_KAMU';
--
-- Atau langsung set email admin:
-- UPDATE profiles
-- SET role = 'admin'
-- WHERE id = (SELECT id FROM auth.users WHERE email = 'admin@amibook.com');
