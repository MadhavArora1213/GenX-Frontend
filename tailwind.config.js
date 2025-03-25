/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    // PDF.js related classes
    'pdfViewer',
    'canvasWrapper',
    'page',
    'textLayer',
    'annotationLayer'
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
