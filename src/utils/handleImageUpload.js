const handleImageUpload = (event, setImage) => {
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

export default handleImageUpload;