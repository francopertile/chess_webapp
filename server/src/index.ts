import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { protect } from './middleware/authMiddleware';
import { parseBookTxt } from './utils/parser';

const app = express();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'YOUR_SUPER_SECRET_KEY';

// --- Multer Setup for in-memory file storage ---
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// --- Middlewares ---
app.use(cors());
app.use(express.json());

// --- API Routes ---

// Get all books
app.get('/api/books', async (req, res) => {
  try {
    const books = await prisma.book.findMany();
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch books' });
  }
});

// Get all exercises for a specific book
app.get('/api/books/:bookId/exercises', async (req, res) => {
  const { bookId } = req.params;
  try {
    const exercises = await prisma.exercise.findMany({
      where: { bookId: parseInt(bookId) },
      orderBy: { order_index: 'asc' },
    });
    if (exercises.length === 0) {
      return res.status(404).json({ error: 'No exercises found' });
    }
    res.json(exercises);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch exercises' });
  }
});

// Register a new user
app.post('/api/register', async (req, res) => {
  const { email, username, password } = req.body;
  if (!email || !username || !password) {
    return res.status(400).json({ error: 'Email, username, and password are required.' });
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, username, password: hashedPassword },
    });
    res.status(201).json({ message: 'User created successfully', userId: user.id });
  } catch (error: any) {
    if (error.code === 'P2002') {
      return res.status(409).json({ error: 'Email or username already exists.' });
    }
    res.status(500).json({ error: 'Failed to create user.' });
  }
});

// Login a user
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ message: 'Logged in successfully', token });
  } catch (error) {
    res.status(500).json({ error: 'Login failed.' });
  }
});

// Record exercise completion
app.post('/api/progress', protect, async (req, res) => {
  const { exerciseId, timeTaken } = req.body;
  const userId = req.user?.id;
  if (!userId || !exerciseId) {
    return res.status(400).json({ error: 'User ID and Exercise ID are required.' });
  }
  try {
    const progress = await prisma.userProgress.upsert({
      where: { userId_exerciseId: { userId: userId, exerciseId: exerciseId } },
      update: { completed: true, attempts: { increment: 1 }, time_taken: timeTaken },
      create: { userId: userId, exerciseId: exerciseId, completed: true, attempts: 1, time_taken: timeTaken, best_time: timeTaken },
    });
    res.status(201).json(progress);
  } catch (error) {
    console.error('Failed to save progress:', error);
    res.status(500).json({ error: 'Failed to save progress.' });
  }
});

// --- Book Upload Route ---
app.post('/api/upload-book', upload.single('bookFile'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded.' });
  }

  try {
    const txtContent = req.file.buffer.toString('utf-8');
    const parsedBook = parseBookTxt(txtContent);

    const newBook = await prisma.book.create({
      data: {
        title: parsedBook.title,
        description: `Un libro sobre ${parsedBook.category} de dificultad ${parsedBook.difficulty}.`,
        difficulty: parsedBook.difficulty,
        category: parsedBook.category,
        total_exercises: parsedBook.exercises.length,
        average_time: parsedBook.exercises.length * 2,
        exercises: {
          create: parsedBook.exercises.map((ex, index) => ({
            order_index: index + 1,
            position_fen: ex.position_fen,
            description: ex.description,
            solution_moves: ex.solution_moves,
          })),
        },
      },
      include: {
        exercises: true,
      },
    });

    res.status(201).json({ message: 'Book uploaded successfully!', book: newBook });

  } catch (error: any) {
    console.error('Error processing book:', error);
    res.status(500).json({ error: error.message || 'Failed to process book.' });
  }
});

// Export the app for Vercel
export default app;
