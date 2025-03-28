function getAsciiDensity(char) {
  // Créer un canvas et obtenir son contexte
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  context.font = "30px monospace";

  // Mesurer la largeur du texte
  const textWidth = context.measureText(char).width;

  // La hauteur du texte est constante pour la police que l'on utilise
  const textHeight = 30;  

  canvas.width = textWidth;
  canvas.height = textHeight;

  // Dessiner le caractère dans le canvas
  context.fillStyle = "black"; 
  context.fillText(char, 0, textHeight);

  // Obtenir les données de l'image
  const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
  const pixels = imageData.data;

  // Compter le nombre de pixels "noirs" (non transparents)
  let filledPixels = 0;
  for (let i = 0; i < pixels.length; i += 4) {
    const r = pixels[i];     
    const g = pixels[i + 1]; 
    const b = pixels[i + 2]; 
    const a = pixels[i + 3]; 

    // Si le pixel est "noir" (ou proche du noir), on compte ce pixel
    if (r === 0 && g === 0 && b === 0 && a > 0) {
      filledPixels++;
    }
  }

  const density = filledPixels;  
  return density;
}

const asciiChars = [
  " ", "!", "\"", "#", "$", "%", "&", "'", "(", ")", "*", "+", ",", "-", ".", "/", 
  "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", ":", ";", "<", "=", ">", "?", 
  "@", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", 
  "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "[", "\\", "]", "^", "_", 
  "`", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", 
  "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "{", "|", "}", "~"
];

// Calculer la densité pour chaque caractère
const densities = asciiChars.map(char => {
  const density = getAsciiDensity(char);
  return {
    char,
    density,
  };
});

const sortedAsciiChars = densities.sort((a, b) => a.density - b.density);

export default sortedAsciiChars;
