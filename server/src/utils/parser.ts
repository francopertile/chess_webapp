interface ParsedExercise {
  position_fen: string;
  description: string;
  solution_moves: string;
}

interface ParsedBook {
  title: string;
  difficulty: string;
  category: string;
  exercises: ParsedExercise[];
}

export function parseBookTxt(txtContent: string): ParsedBook {
  const lines = txtContent.split('\n').filter(line => line.trim() !== '');
  
  const book: Partial<ParsedBook> = { exercises: [] };
  let currentExercise: Partial<ParsedExercise> = {};
  
  lines.forEach(line => {
    const titleMatch = line.match(/^LIBRO:\s*(.*)/i);
    const difficultyMatch = line.match(/^DIFICULTAD:\s*(.*)/i);
    const categoryMatch = line.match(/^CATEGORIA:\s*(.*)/i);
    const exerciseHeaderMatch = line.match(/^EJERCICIO\s*\d+:/i);
    const fenMatch = line.match(/^FEN:\s*(.*)/i);
    const descriptionMatch = line.match(/^DESCRIPCIÓN:\s*(.*)/i);
    const solutionMatch = line.match(/^SOLUCIÓN:\s*(.*)/i);

    if (titleMatch) book.title = titleMatch[1].trim();
    if (difficultyMatch) book.difficulty = difficultyMatch[1].trim();
    if (categoryMatch) book.category = categoryMatch[1].trim();
    
    if (exerciseHeaderMatch) {
      if (currentExercise.position_fen && currentExercise.solution_moves) {
        book.exercises?.push(currentExercise as ParsedExercise);
      }
      currentExercise = {};
    }

    if (fenMatch) currentExercise.position_fen = fenMatch[1].trim();
    if (descriptionMatch) currentExercise.description = descriptionMatch[1].trim();
    if (solutionMatch) currentExercise.solution_moves = solutionMatch[1].trim();
  });

  // Add the last exercise
  if (currentExercise.position_fen && currentExercise.solution_moves) {
    book.exercises?.push(currentExercise as ParsedExercise);
  }

  if (!book.title || !book.difficulty || !book.category) {
    throw new Error('Missing book metadata (LIBRO, DIFICULTAD, CATEGORIA).');
  }

  return book as ParsedBook;
}