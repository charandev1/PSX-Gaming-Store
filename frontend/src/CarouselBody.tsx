import React, { useState, useRef, useEffect } from 'react';
import styles from './CarouselBody.module.css';
import { FaChevronRight } from "react-icons/fa";
import { FaChevronLeft } from "react-icons/fa";
type SlidesType = {
  _id: number;
  desktop: any;
  tablet: any;
  mobile: any;
  alt: string;
  theme: 'light' | 'dark';
  actionItem: {
    content: {
      heading: string;
      para: string;
      actionButtonText: string;
      tag?: string;
    };
    pos: {
      desktop: 'left' | 'right';
    };
  };
};
const slides: SlidesType[] = [
  {
    _id: 1,
    desktop: '/assets/carousel-images/carousel1_1920x720.jpg',
    tablet: '/assets/carousel-images/carousel1_1083x1222.jpg',
    mobile: '/assets/carousel-images/carousel1_767x1175.jpg',
    alt: 'Cover art from games that are part of the Xbox & Bethesda Anniversary Collection including Microsoft Flight Simulator, Forza Horizon 5, Age of Empires IV, Fallout, and Dishonored®',
    theme: 'dark',
    actionItem: {
      content: {
        heading: 'Anniversary Collection',
        para: 'Celebrate the joy of gaming with us',
        actionButtonText: 'get it now',
      },
      pos: {
        desktop: 'right',
      },
    },
  },
  {
    _id: 2,
    desktop: '/assets/carousel-images/carousel2_1920x720.jpg',
    tablet: '/assets/carousel-images/carousel2_1083x1222.jpg',
    mobile: '/assets/carousel-images/carousel2_767x1175.jpg',
    alt: 'Valheim, two characters in dark woods sitting by a large campfire.',
    theme: 'dark',
    actionItem: {
      content: {
        heading: 'Valheim',
        para: 'Play now with Game X Pass or purchase',
        actionButtonText: 'get it now',
      },
      pos: {
        desktop: 'left',
      },
    },
  },
  {
    _id: 3,
    desktop: '/assets/carousel-images/carousel3_1920x720.jpg',
    tablet: '/assets/carousel-images/carousel3_1083x1222.jpg',
    mobile: '/assets/carousel-images/carousel3_767x1175.jpg',
    alt: 'Sojourn, Junker Queen, and Kiriko pose confidently among the clouds.',
    theme: 'light',
    actionItem: {
      content: {
        heading: 'Overwatch 2',
        para: 'Play Season 1 now featuring epic 5v5 combat and 35 unique heroes',
        actionButtonText: 'get it now',
        tag: 'play free now',
      },
      pos: {
        desktop: 'left',
      },
    },
  },
];


const AUTO_DELAY = 4000;

const Carousel = () => {
  const [index, setIndex] = useState(0);
  const timeoutRef = useRef<number | null>(null);

  const total = slides.length;

  /* ---------------- AUTO SLIDE ---------------- */

  useEffect(() => {
    startAutoSlide();
    return stopAutoSlide;
  }, [index]);

  const startAutoSlide = () => {
    stopAutoSlide();

    // ✅ FIX 2: explicitly use window.setTimeout
    timeoutRef.current = window.setTimeout(() => {
      setIndex((prev) => (prev + 1) % total);
    }, AUTO_DELAY);
  };

  const stopAutoSlide = () => {
    // ✅ FIX 3: strict null check
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
    }
  };

  /* ---------------- BUTTONS ---------------- */

  const nextSlide = () => {
    stopAutoSlide();
    setIndex((prev) => (prev + 1) % total);
  };

  const prevSlide = () => {
    stopAutoSlide();
    setIndex((prev) =>
      prev === 0 ? total - 1 : prev - 1
    );
  };

  return (
    <section className={styles.carouselContainer}>
      <div
        className={styles.slider}
        style={{
          transform: `translateX(-${index * 100}%)`
        }}
      >
        {slides.map((slide) => (
          <img
            key={slide._id}
            src={slide.desktop}
            alt={slide.alt}
            className={styles.slide}
          />
        ))}
      </div>

      <button
        className={`${styles.arrowBtn} ${styles.left}`}
        onClick={prevSlide}
      >
        <FaChevronLeft />
      </button>

      <button
        className={`${styles.arrowBtn} ${styles.right}`}
        onClick={nextSlide}
      >
        <FaChevronRight />
      </button>
    </section>
  );
};

export default Carousel;


