import { Chessboard } from "react-chessboard";
import { Link } from "react-router-dom";
import { Library } from "lucide-react";

export function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen p-4 md:p-8">
      <div className="w-full max-w-lg md:max-w-xl lg:max-w-2xl text-center">
        <h1 className="text-3xl font-bold text-primary-text mb-6">
          Chess Training
        </h1>
        <div className="shadow-2xl">
          <Chessboard 
            id="HomePageBoard"
            arePiecesDraggable={false}
            position={"start"} 
          />
        </div>
        <p className="text-secondary-text mt-6 mb-8">
          Bienvenido a tu plataforma de entrenamiento.
        </p>

        <Link to="/library">
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition-transform transform hover:scale-105 flex items-center justify-center mx-auto">
            <Library className="w-5 h-5 mr-2" />
            Ir a la Biblioteca
          </button>
        </Link>
      </div>
    </div>
  );
}