import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log(`Start seeding ...`);

  // Create Books and their associated Exercises
  const book1 = await prisma.book.create({
    data: {
      title: 'Tácticas de Mate en 1',
      description: 'Aprende los patrones fundamentales para dar jaque mate en un solo movimiento. Ideal para principiantes.',
      difficulty: 'Principiante',
      category: 'Táctica',
      total_exercises: 2,
      average_time: 15,
      exercises: {
        create: [
          {
            order_index: 1,
            position_fen: 'r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3',
            description: 'Blancas juegan y dan mate en 1.',
            solution_moves: 'Qxf7#',
          },
          {
            order_index: 2,
            position_fen: '2kr3r/ppp1qppp/2np1n2/8/8/8/PPP2PPP/R1BQR1K1 w - - 0 15',
            description: 'Blancas juegan y dan mate en 1.',
            solution_moves: 'Qe8#',
          },
        ],
      },
    },
  });

  const book2 = await prisma.book.create({
    data: {
      title: 'Finales de Torre y Peón',
      description: 'Domina las técnicas esenciales en los finales más comunes del ajedrez.',
      difficulty: 'Intermedio',
      category: 'Finales',
      total_exercises: 1,
      average_time: 30,
      exercises: {
        create: [
          {
            order_index: 1,
            position_fen: '8/8/8/8/8/5k2/8/R6K w - - 0 1',
            description: 'Blancas juegan y ganan.',
            solution_moves: 'Ra3',
          },
        ],
      },
    },
  });
  
  const book3 = await prisma.book.create({
    data: {
      title: 'Sacrificios de Pieza por Ataque',
      description: 'Descubre cuándo y cómo sacrificar material para obtener una ventaja decisiva en el ataque.',
      difficulty: 'Avanzado',
      category: 'Estrategia',
      total_exercises: 0, // No exercises yet for this book
      average_time: 45,
    },
  });


  console.log(`Seeding finished.`);
  console.log(`Created book: ${book1.title} with 2 exercises.`);
  console.log(`Created book: ${book2.title} with 1 exercise.`);
  console.log(`Created book: ${book3.title} with 0 exercises.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });