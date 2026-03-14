import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

export type HeroGallerySlide = {
  alt: string;
  src: string;
  imageClassName?: string;
  objectPosition?: React.CSSProperties['objectPosition'];
};

type HeroGalleryProps = {
  slides: HeroGallerySlide[];
};

const AUTO_DELAY_MS = 5200;
const SWIPE_THRESHOLD = 48;

export const HeroGallery: React.FC<HeroGalleryProps> = ({ slides }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const pointerStartX = useRef<number | null>(null);
  const pausedRef = useRef(false);

  const totalSlides = slides.length;

  const beginGesture = (x: number) => {
    pointerStartX.current = x;
    setIsPaused(true);
  };

  const completeGesture = (x: number) => {
    if (pointerStartX.current === null) return;

    const delta = x - pointerStartX.current;
    pointerStartX.current = null;

    if (Math.abs(delta) >= SWIPE_THRESHOLD) {
      goTo(activeIndex + (delta < 0 ? 1 : -1));
    }

    setIsPaused(false);
  };

  useEffect(() => {
    pausedRef.current = isPaused;
  }, [isPaused]);

  useEffect(() => {
    if (totalSlides < 2) return;

    const timer = window.setInterval(() => {
      if (pausedRef.current) return;
      setActiveIndex((current) => (current + 1) % totalSlides);
    }, AUTO_DELAY_MS);

    return () => window.clearInterval(timer);
  }, [totalSlides]);

  const goTo = (index: number) => {
    setActiveIndex((index + totalSlides) % totalSlides);
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    beginGesture(event.clientX);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    completeGesture(event.clientX);
    event.currentTarget.releasePointerCapture(event.pointerId);
  };

  const handlePointerCancel = (event: React.PointerEvent<HTMLDivElement>) => {
    pointerStartX.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    setIsPaused(false);
  };

  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    beginGesture(event.touches[0].clientX);
  };

  const handleTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
    completeGesture(event.changedTouches[0].clientX);
  };

  if (totalSlides === 0) return null;

  const activeSlide = slides[activeIndex];

  return (
    <div
      data-hero-gallery
      className="relative overflow-hidden rounded-[2.8rem] border border-[rgba(198,184,162,0.72)] bg-[linear-gradient(180deg,rgba(255,255,255,0.86),rgba(244,238,229,0.96))] p-4 shadow-[0_24px_60px_rgba(43,33,23,0.08)] select-none sm:p-6 lg:p-7"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onPointerCancel={handlePointerCancel}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onTouchEnd={handleTouchEnd}
      onTouchStart={handleTouchStart}
    >
      <div className="absolute left-8 top-8 h-px w-24 bg-[rgba(198,184,162,0.74)]" />
      <div className="absolute bottom-0 right-0 h-36 w-36 rounded-tl-[2.4rem] bg-[rgba(235,225,212,0.34)]" />

      <div className="relative h-[360px] overflow-hidden rounded-[2.15rem] bg-[rgba(248,244,237,0.82)] sm:h-[520px] lg:h-[600px]">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={activeSlide.src}
            className="absolute inset-0 flex items-center justify-center p-5 sm:p-7"
            initial={{ opacity: 0, x: 14 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -14 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            <img
              src={activeSlide.src}
              alt={activeSlide.alt}
              className={`h-full w-full object-contain object-center ${activeSlide.imageClassName ?? ''}`}
              draggable={false}
              style={{ objectPosition: activeSlide.objectPosition }}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {totalSlides > 1 && (
        <div className="absolute inset-x-0 bottom-5 z-10 flex justify-center">
          <div className="flex items-center gap-2 rounded-full border border-[rgba(198,184,162,0.6)] bg-[rgba(255,253,249,0.78)] px-3 py-2 backdrop-blur-sm">
            {slides.map((slide, index) => (
              <button
                key={slide.src}
                type="button"
                data-hero-dot
                aria-label={`Ver imagen ${index + 1}`}
                aria-current={activeIndex === index}
                className={`h-2.5 rounded-full transition-all duration-200 ${
                  activeIndex === index
                    ? 'w-6 bg-[var(--brand)]'
                    : 'w-2.5 bg-[rgba(127,98,66,0.24)] hover:bg-[rgba(127,98,66,0.42)]'
                }`}
                onClick={(event) => {
                  event.stopPropagation();
                  goTo(index);
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
