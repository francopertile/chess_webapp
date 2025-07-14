import { useState, useEffect, useMemo } from 'react';
import { BookCard, BookData } from '../components/library/BookCard';
import { Link } from 'react-router-dom';
import { FilterDropdown } from '../components/ui/FilterDropdown';
import API_BASE_URL from '../apiConfig'; // <-- IMPORTA LA NUEVA CONFIGURACIÓN

export function LibraryPage() {
  const [books, setBooks] = useState<BookData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State for filters
  const [difficultyFilter, setDifficultyFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  useEffect(() => {
    async function fetchBooks() {
      try {
        // USA LA NUEVA VARIABLE PARA CONSTRUIR LA URL
        const response = await fetch(`${API_BASE_URL}/api/books`);
        if (!response.ok) {
          throw new Error('Failed to fetch data from the server.');
        }
        const data = await response.json();
        setBooks(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
    fetchBooks();
  }, []);

  // Memoized lists for filter options to avoid recalculating on every render
  const difficultyOptions = useMemo(() => [...new Set(books.map(book => book.difficulty))], [books]);
  const categoryOptions = useMemo(() => [...new Set(books.map(book => book.category))], [books]);

  // Apply filters to the book list
  const filteredBooks = useMemo(() => {
    return books.filter(book => {
      const difficultyMatch = difficultyFilter ? book.difficulty === difficultyFilter : true;
      const categoryMatch = categoryFilter ? book.category === categoryFilter : true;
      return difficultyMatch && categoryMatch;
    });
  }, [books, difficultyFilter, categoryFilter]);

  if (isLoading) {
    return <div className="text-center text-white p-10">Cargando libros...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 p-10">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-primary-text mb-8 text-center">
        Biblioteca de Ejercicios
      </h1>
      
      {/* Filter Controls */}
      <div className="mb-8 p-4 bg-surface-main rounded-lg grid grid-cols-1 md:grid-cols-2 gap-6">
        <FilterDropdown
          label="Filtrar por Dificultad"
          options={difficultyOptions}
          selectedValue={difficultyFilter}
          onValueChange={setDifficultyFilter}
        />
        <FilterDropdown
          label="Filtrar por Categoría"
          options={categoryOptions}
          selectedValue={categoryFilter}
          onValueChange={setCategoryFilter}
        />
      </div>

      {/* Grid of books */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {filteredBooks.length > 0 ? (
          filteredBooks.map((book) => (
            <Link to={`/book/${book.id}/exercise/1`} key={book.id}>
              <BookCard book={book} />
            </Link>
          ))
        ) : (
          <p className="text-secondary-text col-span-full text-center">
            No se encontraron libros que coincidan con los filtros seleccionados.
          </p>
        )}
      </div>
    </div>
  );
}
