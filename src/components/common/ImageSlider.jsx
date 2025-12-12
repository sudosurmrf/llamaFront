import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './ImageSlider.css';

const ImageSlider = ({
  slides = [],
  autoPlay = true,
  autoPlayInterval = 5000,
  showDots = true,
  showArrows = true,
  className = '',
  aspectRatio = '16/9',
  placeholderText = 'Image Coming Soon',
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const goToNext = useCallback(() => {
    if (isTransitioning || slides.length <= 1) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev + 1) % slides.length);
    setTimeout(() => setIsTransitioning(false), 500);
  }, [isTransitioning, slides.length]);

  const goToPrev = useCallback(() => {
    if (isTransitioning || slides.length <= 1) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
    setTimeout(() => setIsTransitioning(false), 500);
  }, [isTransitioning, slides.length]);

  const goToSlide = (index) => {
    if (isTransitioning || index === currentIndex) return;
    setIsTransitioning(true);
    setCurrentIndex(index);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  useEffect(() => {
    if (!autoPlay || slides.length <= 1) return;

    const timer = setInterval(goToNext, autoPlayInterval);
    return () => clearInterval(timer);
  }, [autoPlay, autoPlayInterval, goToNext, slides.length]);

  if (slides.length === 0) {
    return (
      <div className={`image-slider ${className}`} style={{ aspectRatio }}>
        <div className="slide-placeholder">
          <span>{placeholderText}</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`image-slider ${className}`}>
      <div className="slides-container" style={{ aspectRatio }}>
        {slides.map((slide, index) => (
          <div
            key={slide.id || index}
            className={`slide ${index === currentIndex ? 'active' : ''}`}
          >
            {slide.image ? (
              <img src={slide.image} alt={slide.alt || slide.title || `Slide ${index + 1}`} />
            ) : (
              <div className="slide-placeholder" style={{ backgroundColor: slide.backgroundColor || '#f8e8d4' }}>
                {slide.title && (
                  <div className="slide-content" style={{ color: slide.textColor || '#5c3d2e' }}>
                    {slide.subtitle && <span className="slide-subtitle">{slide.subtitle}</span>}
                    <h2 className="slide-title">{slide.title}</h2>
                    {slide.description && <p className="slide-description">{slide.description}</p>}
                    {slide.buttonText && (
                      <a href={slide.buttonLink || '#'} className="slide-button">
                        {slide.buttonText}
                      </a>
                    )}
                  </div>
                )}
                {!slide.title && <span>{placeholderText}</span>}
              </div>
            )}
          </div>
        ))}
      </div>

      {showArrows && slides.length > 1 && (
        <>
          <button
            className="slider-arrow slider-arrow-left"
            onClick={goToPrev}
            aria-label="Previous slide"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            className="slider-arrow slider-arrow-right"
            onClick={goToNext}
            aria-label="Next slide"
          >
            <ChevronRight size={24} />
          </button>
        </>
      )}

      {showDots && slides.length > 1 && (
        <div className="slider-dots">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`slider-dot ${index === currentIndex ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageSlider;
