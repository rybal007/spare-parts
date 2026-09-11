import React from "react";

interface ImageUploaderProps {
  onImageUpload: (image: string) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  onImageUpload,
}) => {
  const handleImageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      onImageUpload(reader.result as string);
    };

    reader.readAsDataURL(file);
  };

  return (
    <div>
      <label>Select Image</label>
      <br />

      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
      />
    </div>
  );
};

export default ImageUploader;