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

  const resizeImage = (img, maxWidth = 150, maxHeight = 100) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // Ajuster les dimensions pour compenser le ratio des caractères ASCII
    const aspectRatioCompensation = 0.5; // Car les caractères sont plus hauts que larges
    const targetAspectRatio = (maxWidth / maxHeight) * aspectRatioCompensation;
    const imgAspectRatio = img.width / img.height;
    
    let newWidth, newHeight;
    
    if (imgAspectRatio > targetAspectRatio) {
      // Image plus large que haute
      newWidth = maxWidth;
      newHeight = Math.floor(maxWidth / imgAspectRatio);
    } else {
      // Image plus haute que large
      newHeight = maxHeight;
      newWidth = Math.floor(maxHeight * imgAspectRatio);
    }
    
    canvas.width = newWidth;
    canvas.height = newHeight;
    
    ctx.drawImage(img, 0, 0, newWidth, newHeight);
    return canvas;
  };

  useEffect(() => {
    if (image) {
      const canvas = canvaRef.current;
      const context = canvas.getContext("2d");

      const resizedCanvas = resizeImage(image);
      canvas.height = resizedCanvas.height;
      canvas.width = resizedCanvas.width;

      context.drawImage(resizedCanvas, 0, 0);

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
    <div className="mx-10 my-10">
      <label
        htmlFor="file-upload"
        className={`w-full border flex flex-col justify-center items-center rounded-xl border-dashed ${
          image ? "h-fit" : "h-96"
        } cursor-pointer relative group`}
      >
        {image ? (
          <div className="relative w-full h-full flex justify-center items-center">
            <pre
              style={{
                whiteSpace: "pre-wrap",
                fontFamily: "monospace",
                fontSize: "10px", // Augmenté de 8px à 10px
                lineHeight: "0.8", // Ajout d'un line-height plus serré
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
