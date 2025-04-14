import React, { useState, useEffect } from 'react';

const Gallery = ({ images }) => {
  const [selectedIndex, setSelectedIndex] = useState(null);

  const openModal = (index) => {
    setSelectedIndex(index);
  };

  const closeModal = (e) => {
    if (
      e.target.classList.contains('modal') ||
      e.target.classList.contains('close-button')
    ) {
      setSelectedIndex(null);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (selectedIndex !== null) {
        if (e.key === 'ArrowRight') {
          setSelectedIndex((prevIndex) => (prevIndex + 1) % images.length);
        } else if (e.key === 'ArrowLeft') {
          setSelectedIndex((prevIndex) =>
            (prevIndex - 1 + images.length) % images.length
          );
        } else if (e.key === 'Escape') {
          setSelectedIndex(null);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedIndex, images.length]);

  return (
    <div>
      <div className="image-gallery">
        {images.map((image, index) => (
          <img
            key={index}
            src={image.src}
            alt={image.alt}
            loading="lazy"
            onClick={() => openModal(index)}
            className="gallery-image"
          />
        ))}
      </div>

      {selectedIndex !== null && (
        <div className="modal" onClick={closeModal}>
          <span className="close-button">&times;</span>
          <img
            className="modal-content"
            src={images[selectedIndex].src}
            alt={images[selectedIndex].alt}
          />
        </div>
      )}
    </div>
  );
};

export default Gallery;
