import React from "react";
import { useState } from "react";

export default function App() {
  const [image, setImage] = useState(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="max-w-screen-md md:mx-auto mx-10 my-10">
      <label
        htmlFor="file-upload"
        className={`w-full border flex flex-col justify-center items-center rounded-xl border-dashed ${
          image ? "h-fit" : "h-96"
        } cursor-pointer relative group`}
      >
        {image ? (
          <div className="relative w-full h-full">
            <img
              src={image}
              alt="Uploaded"
              className="rounded-xl object-cover h-full w-full"
            />
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
    </div>
  );
}
