function getAsciiDensity(char) {
  // Créer un canvas et obtenir son contexte
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  
  // Définir dimensions fixes pour tous les caractères
  canvas.width = 30;
  canvas.height = 30;
  
  // Configuration du texte
  context.font = "24px monospace";
  context.textAlign = "center";
  context.textBaseline = "middle";
  
  // Effacer le canvas avec du blanc
  context.fillStyle = "white";
  context.fillRect(0, 0, canvas.width, canvas.height);
  
  // Dessiner le caractère au centre du canvas
  context.fillStyle = "black"; 
  context.fillText(char, canvas.width/2, canvas.height/2);
  
  // Obtenir les données de l'image
  const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
  const pixels = imageData.data;
  
  // Compter le nombre de pixels "noirs" (ou foncés)
  let filledPixels = 0;
  const threshold = 200; // Valeur seuil pour déterminer si un pixel est foncé
  
  for (let i = 0; i < pixels.length; i += 4) {
    const r = pixels[i];     
    const g = pixels[i + 1]; 
    const b = pixels[i + 2]; 
    
    // Si le pixel est foncé (en dessous du seuil), on le compte
    if (r < threshold && g < threshold && b < threshold) {
      filledPixels++;
    }
  }
  
  return filledPixels;
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
