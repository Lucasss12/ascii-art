import React, { useState, useRef, useEffect } from "react";
import Options from "./components/options.jsx";
import AsciiArt from "./components/asciiArt.jsx";

import getPixelLuminosity from "./utils/getPixelLuminosity.js";
import getAsciiForPixel from "./utils/getAsciiForPixel.js";
import sortedAsciiChars from "./utils/ascii-character.js";
import handleImageUpload from "./utils/handleImageUpload.js";

export default function App() {
  const [image, setImage] = useState(null);
  const [asciiArt, setAsciiArt] = useState([]);
  const canvasRef = useRef(null);
  const [asciiWidth, setAsciiWidth] = useState(120);

  useEffect(() => {
    if (window.innerWidth < 768) {
      setAsciiWidth(120);
    }
    if (window.innerWidth < 1024) {
      setAsciiWidth(76);
    }

    if (!image || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    const aspectRatio = image.height / image.width;
    const targetWidth = asciiWidth;
    const targetHeight = Math.floor(targetWidth * aspectRatio * 0.5);

    canvas.width = targetWidth;
    canvas.height = targetHeight;

    context.drawImage(image, 0, 0, targetWidth, targetHeight);

    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;

    let asciiResult = [];

    for (let y = 0; y < targetHeight; y++) {
      let line = [];

      for (let x = 0; x < targetWidth; x++) {
        const i = (y * targetWidth + x) * 4;
        const r = pixels[i];
        const g = pixels[i + 1];
        const b = pixels[i + 2];
        const a = pixels[i + 3];

        const luminosity = getPixelLuminosity(r, g, b);
        const asciiChar = getAsciiForPixel(luminosity, sortedAsciiChars);

        line.push({
          char: asciiChar,
          color: `rgba(${r}, ${g}, ${b}, ${a / 255})`,
        });
      }

      asciiResult.push(line);
    }

    setAsciiArt(asciiResult);
  }, [image, asciiWidth]);

  return (
    <div className="max-lg:m-8 max-md:m-4  max-w-screen-md lg:mx-auto lg:h-screen justify-center items-center flex flex-col">
      <label
        htmlFor="file-upload"
        className="w-full border flex flex-col justify-center items-center rounded-xl border-dashed min-h-96 cursor-pointer relative group">
        {image ? (
          <div className="relative w-full rounded-xl flex justify-center items-center">
            <div className="absolute inset-0 flex justify-center items-center bg-black/70 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity">
              <img
                src="src/assets/upload.svg"
                alt="Upload"
                className="rounded-full bg-sky-400/10 p-4"
              />
            </div>
            {asciiArt.length > 0 && (
              <AsciiArt asciiArt={asciiArt} />
            )}
            <input
              id="file-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(event => handleImageUpload(event, setImage))}
            />
          </div>
        ) : (
          <>
            <img
              src="src/assets/upload.svg"
              alt="Upload"
              className="rounded-full bg-sky-400/10 p-4"
            />
            <p className="mt-2 text-gray-600">Cliquez pour télécharger une image</p>
            <input
              id="file-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(event => handleImageUpload(event, setImage))}
            />
          </>
        )}
      </label>

      {asciiArt.length > 0 && (
        <Options asciiWidth={asciiWidth} setAsciiWidth={setAsciiWidth} />
      )}

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
