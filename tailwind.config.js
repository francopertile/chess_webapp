/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Escaneará todos los archivos de React en la carpeta src
  ],
  theme: {
    extend: {
      // Aquí podemos extender el tema por defecto de Tailwind
      // con nuestros propios colores, fuentes, etc.
      // Por ejemplo, para un futuro modo oscuro o colores de la marca.
      colors: {
        'board-light': '#f0d9b5',
        'board-dark': '#b58863',
        'background-main': '#202225', // Un fondo oscuro elegante
        'surface-main': '#2f3136',   // Para las cards y superficies
        'primary-text': '#ffffff',
        'secondary-text': '#b9bbbe',
      }
    },
  },
  plugins: [],
}