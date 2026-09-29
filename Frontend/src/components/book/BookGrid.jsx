import BookCard from './BookCard';
import './Book.css';

export default function BookGrid({ books }) {
  if (!books || books.length === 0) {
    return null;
  }

  return (
    <div className="book-grid">
      {books.map((book) => (
        <BookCard key={book._id} book={book} />
      ))}
    </div>
  );
}
