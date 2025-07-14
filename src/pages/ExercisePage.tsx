import { useState, useEffect, useMemo, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Chess } from 'chess.js';
import { Chessboard } from 'react-chessboard';
import { Lightbulb, RotateCcw, ChevronRight, Timer } from 'lucide-react';

type Exercise = {
  id: number;
  position_fen: string;
  solution_moves: string;
  description: string | null;
};

export function ExercisePage() {
  const { bookId, exerciseId } = useParams<{ bookId: string; exerciseId: string }>();

  // State for data and loading
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State for game logic
  const [game, setGame] = useState<Chess | null>(null);
  const [solved, setSolved] = useState(false);

  // State for the timer
  const [time, setTime] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const currentExercise = useMemo(() => {
    if (!exerciseId || exercises.length === 0) return undefined;
    return exercises.find(ex => ex.id === parseInt(exerciseId));
  }, [exercises, exerciseId]);
  
  const currentIndex = useMemo(() => !currentExercise ? -1 : exercises.findIndex(ex => ex.id === currentExercise.id), [currentExercise, exercises]);
  const nextExercise = useMemo(() => (currentIndex === -1 || currentIndex >= exercises.length - 1) ? null : exercises[currentIndex + 1], [currentIndex, exercises]);

  // Fetch exercises for the book
  useEffect(() => {
    if (!bookId) return;
    let isMounted = true;
    setIsLoading(true);
    fetch(`http://localhost:3001/api/books/${bookId}/exercises`)
      .then(res => res.ok ? res.json() : Promise.reject(new Error(`Server responded with ${res.status}`)))
      .then(data => isMounted && setExercises(data))
      .catch(err => isMounted && setError(err.message))
      .finally(() => isMounted && setIsLoading(false));
    return () => { isMounted = false; };
  }, [bookId]);

  // Initialize board and timer
  useEffect(() => {
    if (currentExercise) {
      setGame(new Chess(currentExercise.position_fen));
      setSolved(false);
      setTime(0);
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(() => setTime(prevTime => prevTime + 1), 1000);
    }
    // Cleanup timer on component unmount or when exercise changes
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentExercise]);

  const saveProgress = async () => {
    const token = localStorage.getItem('authToken');
    if (!token || !currentExercise) return; // Don't save if not logged in

    try {
      await fetch('http://localhost:3001/api/progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          exerciseId: currentExercise.id,
          timeTaken: time,
        }),
      });
      console.log('Progress saved!');
    } catch (error) {
      console.error('Failed to save progress:', error);
    }
  };

  function onPieceDrop(sourceSquare: string, targetSquare: string) {
    if (!game || solved) return false;
    const gameCopy = new Chess(game.fen());
    const move = gameCopy.move({ from: sourceSquare, to: targetSquare, promotion: 'q' });

    if (move === null) return false;
    setGame(gameCopy);

    if (move.san === currentExercise?.solution_moves) {
      if (timerRef.current) clearInterval(timerRef.current); // Stop the timer
      setSolved(true);
      saveProgress(); // <-- SAVE PROGRESS ON SOLVE
      setTimeout(() => alert('¡Correcto!'), 100);
    } else {
      setTimeout(() => {
        alert('Movimiento incorrecto.');
        setGame(new Chess(game.fen()));
      }, 100);
    }
    return true;
  }
  
  function handleReset() {
    if (currentExercise) {
      setGame(new Chess(currentExercise.position_fen));
      setSolved(false);
      setTime(0);
      if(timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(() => setTime(prevTime => prevTime + 1), 1000);
    }
  }

  function showSolution() {
    if (currentExercise) alert(`La solución es: ${currentExercise.solution_moves}`);
  }

  if (isLoading) return <div className="text-white text-center p-8">Cargando ejercicio...</div>;
  if (error) return <div className="text-red-500 text-center p-8">Error al cargar: {error}</div>;
  if (!currentExercise) return <div className="text-white text-center p-8"><h2 className="text-2xl">Ejercicio no encontrado.</h2><Link to="/library" className="text-blue-400 hover:underline mt-4">Volver a la biblioteca</Link></div>;

  return (
    <div className="flex flex-col lg:flex-row items-center justify-center min-h-screen p-4 gap-8">
      <div className="w-full max-w-lg md:max-w-xl lg:max-w-2xl">
        {game && <Chessboard position={game.fen()} onPieceDrop={onPieceDrop} />}
      </div>
      <div className="w-full lg:w-96 bg-surface-main p-6 rounded-lg shadow-2xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-primary-text">Resolver Ejercicio #{currentExercise.id}</h2>
          <div className="flex items-center text-lg text-yellow-400">
             <Timer className="w-5 h-5 mr-2" />
             <span>{time}s</span>
          </div>
        </div>
        <p className="text-secondary-text mb-6 h-12">{currentExercise.description || 'Encuentra la mejor jugada.'}</p>
        
        <div className="space-y-4">
          <button onClick={handleReset} className="w-full flex items-center justify-center bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-4 rounded-lg transition-colors">
            <RotateCcw className="w-5 h-5 mr-2" /> Reiniciar
          </button>
          <button onClick={showSolution} className="w-full flex items-center justify-center bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-3 px-4 rounded-lg transition-colors">
            <Lightbulb className="w-5 h-5 mr-2" /> Ver Solución
          </button>
        </div>

        {solved && nextExercise && (
           <Link to={`/book/${bookId}/exercise/${nextExercise.id}`} className="block mt-6">
             <button className="w-full flex items-center justify-center bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition-colors animate-pulse">
               Siguiente Ejercicio <ChevronRight className="w-5 h-5 ml-2" />
             </button>
           </Link>
        )}
         {solved && !nextExercise && (
            <div className="mt-6 p-4 bg-blue-900 text-blue-200 rounded-lg text-center">
              ¡Felicidades! Has completado este libro.
            </div>
        )}
      </div>
    </div>
  );
}