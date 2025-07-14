import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { LibraryPage } from './pages/LibraryPage';
import { ExercisePage } from './pages/ExercisePage';
import { RegisterPage } from './pages/RegisterPage';
import { LoginPage } from './pages/LoginPage';
import { Header } from './components/Header';

function App() {
  return (
    <BrowserRouter>
      {/* The Header will now be visible on most pages */}
      <Header /> 
      <main className="bg-background-main min-h-screen w-full">
        <Routes>
          {/* We wrap pages that should not show the header/main layout if needed, but for now this is fine */}
          <Route path="/" element={<HomePage />} />
          <Route path="/library" element={<LibraryPage />} />
          <Route path="/book/:bookId/exercise/:exerciseId" element={<ExercisePage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;