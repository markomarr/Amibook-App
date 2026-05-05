export const getBookCoverUrl = (book) => {
  if (book?.cover_url) return book.cover_url;
  if (book?.isbn) return `https://covers.openlibrary.org/b/isbn/${book.isbn}-L.jpg`;
  return null; // Akan dirender dengan ikon default
}
