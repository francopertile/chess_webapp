import { Link } from 'react-router-dom';
import { Home, Library, LogIn, UserPlus } from 'lucide-react';

export function Header() {
  return (
    <header className="bg-surface-main shadow-md">
      <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-white">
          ChessApp
        </Link>
        <div className="flex items-center space-x-4">
          <Link to="/" className="flex items-center text-gray-300 hover:text-white transition-colors">
            <Home className="w-5 h-5 mr-1" />
            Inicio
          </Link>
          <Link to="/library" className="flex items-center text-gray-300 hover:text-white transition-colors">
            <Library className="w-5 h-5 mr-1" />
            Biblioteca
          </Link>
          <div className="border-l border-gray-600 h-6"></div>
          <Link to="/login" className="flex items-center text-gray-300 hover:text-white transition-colors">
            <LogIn className="w-5 h-5 mr-1" />
            Login
          </Link>
          <Link to="/register" className="flex items-center bg-blue-600 px-3 py-2 rounded-md text-white hover:bg-blue-700 transition-colors">
            <UserPlus className="w-5 h-5 mr-1" />
            Register
          </Link>
        </div>
      </nav>
    </header>
  );
}