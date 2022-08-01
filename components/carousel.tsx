import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import styles from "styles/gallery.module.css";
import { imageCollection } from "lib/images";
import { useState } from "react";

const SPEED = 1;

function modulo(n: number, d: number) {
  return ((n % d) + d) % d;
}

function splitEvery<T>(size: number, list: T[]) {
  return Array.from<ArrayLike<T>, T[]>(
    { length: Math.ceil(list.length / size) },
    (_, i) => list.slice(i * size, i * size + size)
  );
}

function aperture<T>(size: number, list: T[]): T[][] {
  return Array.from({ length: list.length - (size - 1) }, (_, i) =>
    list.slice(i, i + size)
  );
}

const GRID_SIZE = 4;

const chunkedImageCollection = splitEvery(GRID_SIZE, imageCollection);

const TOTAL_LENGTH = imageCollection.length;
const CHUNK_LENGTH = chunkedImageCollection.length;

export function Carousel() {
  const [showGrid, setShowGrid] = useState(false);
  const [showModal, setShowModal] = useState<number | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentImage = chunkedImageCollection[currentIndex];

  function pageImage(offset: number) {
    setCurrentIndex(modulo(currentIndex + offset, CHUNK_LENGTH));
  }

  function toggleGallery() {
    setShowGrid((prevState) => !prevState);
  }

  function handleGridItemClick(index: number) {
    return () => {
      const slice = Math.floor(modulo(index, TOTAL_LENGTH) / GRID_SIZE);
      setCurrentIndex(slice);
      setShowGrid(false);
    };
  }

  function handleItemClick(index: number) {
    setShowModal(index);
  }

  function closeModal() {
    setShowModal(null);
  }

  return (
    <div className={styles.container}>
      {/* Header/Nav */}
      <div className={styles.header} onClick={() => setCurrentIndex(0)}>
        <div>Cabe &amp; Saki</div>
      </div>

      <div className={styles.gallery_menu}>
        <div className={styles.counter}>
          {currentIndex + 1} / {CHUNK_LENGTH}
        </div>
        <button className={styles.galleryToggle} onClick={toggleGallery}>
          <GridIcon />
        </button>
      </div>

      {/* Carousel Gallery */}
      <div className={styles.carousel}>
        <AnimatePresence exitBeforeEnter initial={false}>
          <motion.div
            className={styles.carouselItem}
            key={currentIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: SPEED }}
          >
            {/* <CarouselImage src={currentImage} /> */}
            <CarouselGridImage
              srcs={currentImage}
              onItemClick={handleItemClick}
            />
          </motion.div>
        </AnimatePresence>

        {/* Carosuel Gallery Controls */}
        <div className={styles.controls}>
          <button
            className={[styles.carouselButton, styles.prevButton].join(" ")}
            onClick={() => pageImage(-1)}
          >
            Back
          </button>
          <button
            className={[styles.carouselButton, styles.nextButton].join(" ")}
            onClick={() => pageImage(1)}
          >
            Next
          </button>
        </div>
      </div>

      <AnimatePresence exitBeforeEnter initial={false}>
        {showModal !== null && (
          <motion.div
            className={styles.carouselImage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: SPEED }}
            onClick={closeModal}
          >
            <CarouselImage
              src={chunkedImageCollection[currentIndex][showModal]}
            />
            <div className={styles.closeModal}>&times;</div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Grid Gallery */}
      <AnimatePresence>
        {showGrid && (
          <motion.div
            className={styles.grid}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: SPEED }}
          >
            {imageCollection.map((image, index) => (
              <div
                key={index}
                className={styles.gridItem}
                onClick={handleGridItemClick(index)}
                // style={{ opacity: currentIndex === index ? 0.5 : 1 }}
              >
                <div className={styles.gridImage}>
                  <Image
                    src={image + "/thumbnail"}
                    alt=""
                    layout="fill"
                    objectFit="contain"
                    placeholder="blur"
                    blurDataURL={image + "/blur"}
                  />
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function CarouselImage({ src, i }: { src: string; i?: number }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <Image
      src={src + "/gallery"}
      alt=""
      layout="fill"
      objectFit="contain"
      objectPosition={
        typeof i !== "undefined"
          ? i % 2
            ? "left center"
            : "right center"
          : "center"
      }
      onLoadingComplete={() => setLoaded(true)}
      style={{
        opacity: loaded ? 1 : 0,
        transition: `${SPEED}s ${(i || 0) * 100}ms`,
        filter: loaded ? "sepia(10%)" : "sepia(50%) contrast(200%)",
        transform: loaded ? "scale(1)" : "scale(0.99)",
      }}
    />
  );
}

function CarouselGridImage({
  srcs,
  onItemClick,
}: {
  srcs: string[];
  onItemClick: (index: number) => void;
}) {
  return (
    <div className={styles.carouselImageGrid}>
      {srcs.map((src, i) => (
        <div
          key={src}
          className={styles.carouselImageGrid_image}
          onClick={() => onItemClick(i)}
        >
          <CarouselImage src={src} i={i} />
        </div>
      ))}
    </div>
  );
}

function GridIcon() {
  return (
    <svg
      fill="none"
      height="100%"
      viewBox="0 0 40 40"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g fill="currentColor">
        <path d="m4 4h8v8h-8z" />
        <path d="m4 16h8v8h-8z" />
        <path d="m4 28h8v8h-8z" />
        <path d="m16 4h8v8h-8z" />
        <path d="m16 16h8v8h-8z" />
        <path d="m16 28h8v8h-8z" />
        <path d="m28 4h8v8h-8z" />
        <path d="m28 16h8v8h-8z" />
        <path d="m28 28h8v8h-8z" />
      </g>
    </svg>
  );
}
