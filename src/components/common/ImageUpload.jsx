import { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import './ImageUpload.css';

const ImageUpload = ({
  images = [],
  onImagesChange,
  maxImages = 5,
  acceptedTypes = ['image/jpeg', 'image/png', 'image/webp'],
  maxSizeMB = 5,
  label,
  error,
  className = '',
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const inputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const validateFile = (file) => {
    if (!acceptedTypes.includes(file.type)) {
      return `Invalid file type. Accepted: ${acceptedTypes.map(t => t.split('/')[1]).join(', ')}`;
    }
    if (file.size > maxSizeMB * 1024 * 1024) {
      return `File too large. Maximum size: ${maxSizeMB}MB`;
    }
    return null;
  };

  const processFiles = async (files) => {
    setUploadError(null);
    const fileArray = Array.from(files);

    if (images.length + fileArray.length > maxImages) {
      setUploadError(`Maximum ${maxImages} images allowed`);
      return;
    }

    setUploading(true);
    const newImages = [];

    for (const file of fileArray) {
      const validationError = validateFile(file);
      if (validationError) {
        setUploadError(validationError);
        continue;
      }

      // Create preview URL for now (will be replaced with S3 URL from backend)
      const previewUrl = URL.createObjectURL(file);
      newImages.push({
        file,
        preview: previewUrl,
        name: file.name,
        // The actual S3 URL will be set after upload
        url: null,
      });
    }

    setUploading(false);
    onImagesChange?.([...images, ...newImages]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
  };

  const handleRemove = (index) => {
    const newImages = [...images];
    const removed = newImages.splice(index, 1)[0];
    if (removed.preview && removed.preview.startsWith('blob:')) {
      URL.revokeObjectURL(removed.preview);
    }
    onImagesChange?.(newImages);
  };

  const handleButtonClick = () => {
    inputRef.current?.click();
  };

  return (
    <div className={`image-upload ${className}`}>
      {label && <label className="image-upload-label">{label}</label>}

      <div
        className={`image-upload-dropzone ${dragActive ? 'active' : ''} ${error ? 'error' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={handleButtonClick}
      >
        <input
          ref={inputRef}
          type="file"
          accept={acceptedTypes.join(',')}
          multiple={maxImages > 1}
          onChange={handleChange}
          className="image-upload-input"
        />

        {uploading ? (
          <div className="image-upload-loading">
            <Loader2 className="spinner" size={32} />
            <span>Uploading...</span>
          </div>
        ) : (
          <div className="image-upload-content">
            <Upload size={32} />
            <span className="image-upload-text">
              Drag & drop images here, or click to select
            </span>
            <span className="image-upload-hint">
              {acceptedTypes.map(t => t.split('/')[1].toUpperCase()).join(', ')} up to {maxSizeMB}MB
            </span>
          </div>
        )}
      </div>

      {(uploadError || error) && (
        <span className="image-upload-error">{uploadError || error}</span>
      )}

      {images.length > 0 && (
        <div className="image-upload-preview">
          {images.map((image, index) => (
            <div key={index} className="preview-item">
              {image.preview || image.url ? (
                <img src={image.preview || image.url} alt={image.name || `Image ${index + 1}`} />
              ) : (
                <div className="preview-placeholder">
                  <ImageIcon size={24} />
                </div>
              )}
              <button
                type="button"
                className="preview-remove"
                onClick={() => handleRemove(index)}
                aria-label="Remove image"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      <span className="image-upload-count">
        {images.length} / {maxImages} images
      </span>
    </div>
  );
};

export default ImageUpload;
