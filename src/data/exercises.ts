// Simulamos una base de datos de ejercicios
// La clave es el bookId, y el valor es un array de ejercicios
export const exerciseDatabase: Record<string, any[]> = {
  // Ejercicios para el Libro 1: "Tácticas de Mate en 1"
  '1': [
    {
      id: 1,
      fen: 'r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3',
      description: 'Blancas juegan y dan mate en 1.',
      solution: 'Qxf7#',
    },
    {
      id: 2,
      fen: '2kr3r/ppp1qppp/2np1n2/8/8/8/PPP2PPP/R1BQR1K1 w - - 0 15',
      description: 'Blancas juegan y dan mate en 1.',
      solution: 'Qe8#',
    },
  ],
  // Ejercicios para el Libro 2: "Finales de Torre y Peón"
  '2': [
    {
      id: 1,
      fen: '8/8/8/8/8/5k2/8/R6K w - - 0 1',
      description: 'Blancas juegan y ganan.',
      solution: 'Ra3',
    },
  ],
};