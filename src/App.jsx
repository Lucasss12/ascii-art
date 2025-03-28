import React from "react";
import { useState, useRef, useEffect } from "react";
import sortedAsciiChars from "./utils/ascii-character.js";

export default function App() {
  const [image, setImage] = useState(null);
  const [asciiArt, setAsciiArt] = useState("");
  const canvaRef = useRef(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
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
    // Calculer la luminosité d'un pixel en utilisant la formule de luminosité
    return 0.299 * r + 0.587 * g + 0.114 * b;
  };

  const getAsciiForPixel = (luminosity, sortedAsciiChars) => {
    // Trouver le caractère ASCII correspondant à la luminosité
    const index = Math.floor(
      (luminosity / 255) * (sortedAsciiChars.length - 1)
    );
    return sortedAsciiChars[index].char;
  };

  useEffect(() => {
    if (image) {
      const canvas = canvaRef.current;
      const context = canvas.getContext("2d");

      const scaleFactor = 0.10; 
      canvas.height = image.height * scaleFactor;
      canvas.width = image.width * scaleFactor;

      context.drawImage(image, 0, 0, canvas.width, canvas.height);

      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = imageData.data;

      let asciiArt = "";

      for (let i = 0; i < pixels.length; i += 4) {
        const r = pixels[i];
        const g = pixels[i + 1];
        const b = pixels[i + 2];

        // Calculer la luminosité du pixel
        const luminosity = getPixelLuminosity(r, g, b);

        // Obtenir le caractère ASCII correspondant
        const asciiChar = getAsciiForPixel(luminosity, sortedAsciiChars);
        asciiArt += asciiChar;

        if ((i / 4 + 1) % canvas.width === 0) {
          asciiArt += "\n"; // Sauter à la ligne suivante
        }
      }
      setAsciiArt(asciiArt);
    }
  }, [image]);

  return (
    <div className="mx-10 my-20 max-w-screen-lg lg:mx-auto">
      <label
        htmlFor="file-upload"
        className={`w-full border flex flex-col justify-center items-center rounded-xl border-dashed min-h-96 cursor-pointer relative group`}
      >
        {image ? (
          <div className="relative w-full rounded-xl">
            <pre
              className="w-full h-full flex justify-center items-center"
              style={{
                whiteSpace: "pre",
                fontFamily: "monospace",
                fontSize: "10px",
                lineHeight: "0.8",
              }}
            >
              {asciiArt}
            </pre>
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
      <canvas ref={canvaRef} className="hidden" />
    </div>
  );
}
