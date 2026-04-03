import { useState } from 'react';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';

interface PatentCarouselProps {
  images: string[];
}

function PatentCarousel({ images }: PatentCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(2);

  const total = images.length;

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + total) % total);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % total);
  };

  const getOffset = (index: number) => {
    let offset = index - activeIndex;
    if (offset > Math.floor(total / 2)) offset -= total;
    if (offset < -Math.floor(total / 2)) offset += total;
    return offset;
  };

  return (
    <div className='patent__carousel'>
      <button className='patent__carousel-btn' onClick={handlePrev}>
        <IoIosArrowBack size='70' />
      </button>

      <div className='patent__carousel-track'>
        {images.map((src, index) => {
          const offset = getOffset(index);
          const absOffset = Math.abs(offset);

          if (absOffset > 2) return null;

          return (
            <div
              key={index}
              className={`patent__carousel-card patent__carousel-card--offset-${offset}`}
              onClick={() => setActiveIndex(index)}
            >
              <img src={src} className='patent__carousel-card-img' />
            </div>
          );
        })}
      </div>

      <button className='patent__carousel-btn' onClick={handleNext}>
        <IoIosArrowForward size='70' />
      </button>
    </div>
  );
}

export default PatentCarousel;
