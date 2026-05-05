import { supabase } from '@/lib/supabase'

// ─── Books ────────────────────────────────────────────────────────────────────

export const getBooks = async ({ search = '', category = '', page = 1, limit = 12 } = {}) => {
  let query = supabase
    .from('books')
    .select('*, categories(name)', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range((page - 1) * limit, page * limit - 1)

  if (search) {
    query = query.or(`title.ilike.%${search}%,author.ilike.%${search}%,isbn.ilike.%${search}%`)
  }
  if (category) {
    query = query.eq('category_id', category)
  }

  const { data, error, count } = await query
  if (error) throw error
  return { data, count }
}

export const getBookById = async (id) => {
  const { data, error } = await supabase
    .from('books')
    .select('*, categories(name)')
    .eq('id', id)
    .single()

  if (error) throw error
  return data
}

export const createBook = async (book) => {
  const { data, error } = await supabase
    .from('books')
    .insert(book)
    .select()
    .single()

  if (error) throw error
  return data
}

export const updateBook = async (id, updates) => {
  const { data, error } = await supabase
    .from('books')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export const deleteBook = async (id) => {
  const { error } = await supabase.from('books').delete().eq('id', id)
  if (error) throw error
}

// ─── Categories ──────────────────────────────────────────────────────────────

export const getCategories = async () => {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name')

  if (error) throw error
  return data
}

// ─── Borrowings ───────────────────────────────────────────────────────────────

export const borrowBook = async ({ bookId, userId, dueDate }) => {
  // 1. Cek ketersediaan buku
  const { data: book } = await supabase
    .from('books')
    .select('available_copies')
    .eq('id', bookId)
    .single()

  if (!book || book.available_copies < 1) {
    throw new Error('Buku sedang tidak tersedia')
  }

  // 2. Buat record peminjaman
  const { data, error } = await supabase
    .from('borrowings')
    .insert({
      book_id: bookId,
      user_id: userId,
      due_date: dueDate,
      status: 'active',
    })
    .select()
    .single()

  if (error) throw error

  // 3. Kurangi available_copies (trigger di DB juga bisa handle ini)
  await supabase
    .from('books')
    .update({ available_copies: book.available_copies - 1 })
    .eq('id', bookId)

  return data
}

export const returnBook = async (borrowingId) => {
  const { data: borrowing } = await supabase
    .from('borrowings')
    .select('book_id')
    .eq('id', borrowingId)
    .single()

  const { error } = await supabase
    .from('borrowings')
    .update({ status: 'returned', returned_at: new Date().toISOString() })
    .eq('id', borrowingId)

  if (error) throw error

  // Kembalikan available_copies
  const { data: book } = await supabase
    .from('books')
    .select('available_copies')
    .eq('id', borrowing.book_id)
    .single()

  await supabase
    .from('books')
    .update({ available_copies: book.available_copies + 1 })
    .eq('id', borrowing.book_id)
}

export const getMyBorrowings = async (userId) => {
  const { data, error } = await supabase
    .from('borrowings')
    .select('*, books(title, author, cover_url)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export const getAllBorrowings = async () => {
  const { data, error } = await supabase
    .from('borrowings')
    .select('*, books(title, author), profiles(full_name, nim)')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

// ─── Dashboard stats ──────────────────────────────────────────────────────────

export const getDashboardStats = async () => {
  const [
    { count: totalBooks },
    { count: totalMembers },
    { count: activeBorrowings },
    { count: overdueBorrowings },
  ] = await Promise.all([
    supabase.from('books').select('*', { count: 'exact', head: true }),
    supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'user'),
    supabase.from('borrowings').select('*', { count: 'exact', head: true }).eq('status', 'active'),
    supabase.from('borrowings').select('*', { count: 'exact', head: true })
      .eq('status', 'active')
      .lt('due_date', new Date().toISOString()),
  ])

  return { totalBooks, totalMembers, activeBorrowings, overdueBorrowings }
}
