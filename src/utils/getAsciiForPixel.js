const getAsciiForPixel = (luminosity, sortedAsciiChars) => {
  const index = Math.floor(
    (luminosity / 255) * (sortedAsciiChars.length - 1)
  );
  return sortedAsciiChars[index].char;
};

export default getAsciiForPixel;  