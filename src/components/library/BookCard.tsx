import { motion } from "framer-motion";
import { Book, Clock, Star } from "lucide-react"; // 'BarChart3' ha sido eliminado

// Definimos el "tipo" de datos que espera nuestro componente
export type BookData = {
  id: string;
  title: string;
  description: string;
  difficulty: 'Principiante' | 'Intermedio' | 'Avanzado';
  category: string;
  total_exercises: number;
  average_time: number; // en minutos
};

type BookCardProps = {
  book: BookData;
};

// Mapeo de dificultad a color de Tailwind
const difficultyColorMap = {
  Principiante: 'text-green-400',
  Intermedio: 'text-yellow-400',
  Avanzado: 'text-red-400',
};

export function BookCard({ book }: BookCardProps) {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ type: 'spring', stiffness: 300 }}
      className="bg-surface-main rounded-lg overflow-hidden shadow-lg cursor-pointer p-5 flex flex-col h-full border border-transparent hover:border-blue-500"
    >
      <h3 className="text-xl font-bold text-primary-text mb-2 truncate">{book.title}</h3>
      <p className="text-secondary-text text-sm mb-4 flex-grow">{book.description}</p>
      
      <div className="mt-auto pt-4 border-t border-gray-700 space-y-3 text-sm">
        <div className="flex items-center text-secondary-text">
          <Star className={`w-4 h-4 mr-2 ${difficultyColorMap[book.difficulty]}`} />
          <span className={`font-semibold ${difficultyColorMap[book.difficulty]}`}>{book.difficulty}</span>
        </div>
        <div className="flex items-center text-secondary-text">
          <Book className="w-4 h-4 mr-2" />
          <span>{book.total_exercises} Ejercicios</span>
        </div>
        <div className="flex items-center text-secondary-text">
          <Clock className="w-4 h-4 mr-2" />
          <span>~{book.average_time} min.</span>
        </div>
      </div>
    </motion.div>
  );
}
