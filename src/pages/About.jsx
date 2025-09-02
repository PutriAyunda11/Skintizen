import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const MotionDiv = motion.div;

const images = [
  "/photo/ceremide.jpg",
  "/photo/symwhite.jpg",
  "/photo/niacinamide.jpg",
  "/photo/retinol.jpg",
];

const captions = [
  {
    title: "Ceremide",
    desc: "Menjaga kelembapan kulit",
  },
  {
    title: "Symwhite",
    desc: "Mencerahkan dan meratakan warna kulit",
  },
  {
    title: "Niacinamide",
    desc: "Mengurangi noda hitam dan jerawat",
  },
  {
    title: "Retinol",
    desc: "Membantu regenerasi kulit",
  },
];

export default function AboutCarousel() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0); // 1 = next, -1 = prev

  const prevSlide = () => {
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + images.length) % images.length);
  };

  const nextSlide = () => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % images.length);
  };

  const variants = {
    enter: (dir) => ({
      x: dir > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.98,
      filter: "blur(6px)",
    }),
    center: {
      zIndex: 10,
      x: 0,
      opacity: 1,
      scale: 1,
      filter: "blur(0px)",
      transition: { duration: 0.6 },
    },
    exit: (dir) => ({
      zIndex: 0,
      x: dir > 0 ? -300 : 300,
      opacity: 0,
      scale: 0.98,
      filter: "blur(6px)",
      transition: { duration: 0.6 },
    }),
  };

  return (
    <>
      <div className="relative h-screen flex items-center justify-center overflow-hidden pt-30">
        <div className="relative w-screen h-screen overflow-hidden rounded-xl flex items-center justify-center">
          <AnimatePresence initial={false} custom={direction}>
            <motion.img
              key={current}
              src={images[current]}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              className="absolute top-0 left-0 w-screen h-full object-cover rounded-xl shadow-2xl"
            />
          </AnimatePresence>

          {/* Caption di tengah */}
          <AnimatePresence mode="wait">
            <MotionDiv
              key={current}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.6 }}
              className="absolute z-20 text-center text-black drop-shadow-lg px-4"
            >
              <h2 className="text-3xl font-bold mb-2">
                {captions[current].title}
              </h2>
              <p className="text-xl font-medium text-black/70">
                {captions[current].desc}
              </p>
            </MotionDiv>
          </AnimatePresence>
        </div>

        {/* Tombol navigasi */}
        <button
          onClick={prevSlide}
          className="absolute left-10 top-1/2 -translate-y-1/3 
             bg-white/20 backdrop-blur-md p-3 rounded-full 
             shadow-lg z-20 hover:bg-white/50 transition"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-10 top-1/2 -translate-y-1/3 
             bg-white/20 backdrop-blur-md p-3 rounded-full 
             shadow-lg z-20 hover:bg-white/50 transition"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </>
  );
}
