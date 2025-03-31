import React from "react";
import { useState, useRef, useEffect } from "react";
import sortedAsciiChars from "./utils/ascii-character.js";

export default function App() {
  const [image, setImage] = useState(null);
  const [asciiArt, setAsciiArt] = useState([]);
  const canvasRef = useRef(null);
  const [asciiWidth, setAsciiWidth] = useState(150);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const img = new Image();
      img.src = reader.result;
      img.onload = () => {
        setImage(img);
      };
    };
    reader.readAsDataURL(file);
  };

  const getPixelLuminosity = (r, g, b) => {
    return 0.299 * r + 0.587 * g + 0.114 * b;
  };

  const getAsciiForPixel = (luminosity, sortedAsciiChars) => {
    const index = Math.floor(
      (luminosity / 255) * (sortedAsciiChars.length - 1)
    );
    return sortedAsciiChars[index].char;
  };

  useEffect(() => {
    if (!image || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    // Calculer les dimensions cibles
    const aspectRatio = image.height / image.width;
    const targetWidth = asciiWidth;
    const targetHeight = Math.floor(targetWidth * aspectRatio * 0.5);
    
    // Redimensionner le canvas
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    
    // Dessiner l'image sur le canvas
    context.drawImage(image, 0, 0, targetWidth, targetHeight);
    
    // Obtenir les données des pixels
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;

    let asciiResult = [];

    // Générer l'ASCII art
    for (let y = 0; y < targetHeight; y++) {
      // Chaque ligne est un tableau de caractères avec leurs couleurs
      let line = [];
      
      for (let x = 0; x < targetWidth; x++) {
        const i = (y * targetWidth + x) * 4;
        const r = pixels[i];
        const g = pixels[i + 1];
        const b = pixels[i + 2];
        const a = pixels[i + 3];

        const luminosity = getPixelLuminosity(r, g, b);
        const asciiChar = getAsciiForPixel(luminosity, sortedAsciiChars);
        
        // Stocker le caractère et sa couleur
        line.push({
          char: asciiChar,
          color: `rgba(${r}, ${g}, ${b}, ${a/255})`
        });
      }
      
      asciiResult.push(line);
    }
    
    setAsciiArt(asciiResult);

  }, [image, asciiWidth]);

  const handleWidthChange = (e) => {
    setAsciiWidth(parseInt(e.target.value));
  };

  return (
    <div className="mx-10 my-20 max-w-screen-md md:mx-auto">
      <label
        htmlFor="file-upload"
        className="w-full border flex flex-col justify-center items-center rounded-xl border-dashed min-h-64 cursor-pointer relative group"
      >
        {image ? (
          <div className="relative w-full rounded-xl">
            <div className="absolute inset-0 flex justify-center items-center bg-black/70 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity">
              <img
                src="src/assets/upload.svg"
                alt="Upload"
                className="rounded-full bg-sky-400/10 p-4"
              />
            </div>
            <input
              id="file-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
          </div>
        ) : (
          <>
            <img
              src="src/assets/upload.svg"
              alt="Upload"
              className="rounded-full bg-sky-400/10 p-4"
            />
            <p className="mt-2 text-gray-600">
              Cliquez pour télécharger une image
            </p>
            <input
              id="file-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
          </>
        )}
      </label>
      
      <div className="mt-4">
        <label htmlFor="ascii-width" className="block text-sm font-medium text-gray-700">
          Largeur en caractères:
        </label>
        <input
          type="range"
          id="ascii-width"
          min="40"
          max="160"
          value={asciiWidth}
          onChange={handleWidthChange}
          className="w-full mt-1"
        />
        <span className="text-sm text-gray-500">{asciiWidth} caractères</span>
      </div>
      
      <canvas ref={canvasRef} className="hidden" />
      
      {image && (
        <p className="mt-2 text-sm text-gray-600">
          Image originale: {image.width} x {image.height}
        </p>
      )}

      {asciiArt.length > 0 && (
        <div className="mt-4 border-2 rounded bg-black flex justify-center items-center">
          <div style={{ fontSize: '6px', fontFamily: 'monospace', lineHeight: '1', whiteSpace: 'pre' }}>
            {asciiArt.map((line, lineIndex) => (
              <div key={lineIndex} style={{ display: 'flex' }}>
                {line.map((char, charIndex) => (
                  <span key={`${lineIndex}-${charIndex}`} style={{ color: char.color }}>
                    {char.char}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}