import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { FlaskRound, Sparkles, Droplet } from "lucide-react";

const MotionDiv = motion.div;

const images = [
  "/photo/ceremide.jpg",
  "/photo/symwhite.jpg",
  "/photo/niacinamide.jpg",
  "/photo/retinol.jpg",
];

const captions = [
  {
    title: "Ceramide",
    desc: "Menjaga kelembapan kulit dan memperkuat skin barrier",
  },
  {
    title: "Symwhite",
    desc: "Mencerahkan kulit dan membantu meratakan warna kulit",
  },
  {
    title: "Niacinamide",
    desc: "Mengurangi noda hitam, jerawat, dan membuat kulit lebih sehat",
  },
  {
    title: "Retinol",
    desc: "Mendukung regenerasi kulit untuk tampilan lebih muda",
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

  return (
    <>
      {/* About Section */}
      <img src="/photo/about.jpg" className="w-full pt-20" />

      <div className="w-full max-w-6xl mx-auto flex flex-row gap-4 md:gap-8 md:mt-16 px-4 items-center">
        {/* Gambar */}
        <div className="w-1/3 sm:w-2/5 md:w-1/2 flex justify-center">
          <img
            src="/photo/about1.jpg"
            alt="Skintific Paket Repair Skin Barrier & Reduce Acne"
            className="w-full h-auto object-cover rounded-lg shadow-lg"
          />
        </div>

        {/* Teks */}
        <div className="flex flex-col w-2/3 sm:w-3/5 md:w-1/2 justify-center text-left pl-4">
          <h2 className="text-base sm:text-lg md:text-2xl font-bold mb-2 md:mb-4">
            Skintific Repair Skin Barrier & Reduce Acne
          </h2>
          <p className="text-xs sm:text-sm md:text-base mb-2">
            Formula lembut untuk menenangkan kulit sensitif dan Membantu
            memperbaiki skin barrier yang rusak.
          </p>
          <p className="text-xs sm:text-sm md:text-base mb-2"></p>
          <p className="hidden sm:block text-xs sm:text-sm md:text-base">
            Efektif mengurangi kemerahan dan jerawat tanpa membuat kulit kering.
          </p>
        </div>
      </div>

      <div className="w-full max-w-6xl mx-auto flex flex-row gap-4 md:gap-8 mt-8 px-4 items-center">
        {/* Teks */}
        <div className="flex flex-col w-2/3 sm:w-3/5 md:w-1/2 justify-center text-left pr-4">
          <h2 className="text-base sm:text-lg md:text-2xl font-bold mb-2 md:mb-4">
            Skintific Glowing Routine Set
          </h2>
          <p className="text-xs sm:text-sm md:text-base mb-2">
            Rangkaian perawatan lengkap untuk mencerahkan kulit kusam.
          </p>
          <p className="text-xs sm:text-sm md:text-base mb-2">
            Membantu menjaga kelembapan kulit agar tetap segar dan sehat.
          </p>
          <p className="hidden sm:block text-xs sm:text-sm md:text-base">
            Memberikan hasil kulit tampak lebih glowing dan merata.
          </p>
        </div>

        {/* Gambar */}
        <div className="w-1/3 sm:w-2/5 md:w-1/2 flex justify-center">
          <img
            src="/photo/about2.jpg"
            alt="Skintific Glowing Routine Set"
            className="w-full h-auto object-cover rounded-lg shadow-lg"
          />
        </div>
      </div>

      <div className="w-full max-w-6xl mx-auto flex flex-row gap-4 md:gap-8 md:mt-16 px-4 items-center">
        {/* Gambar */}
        <div className="w-1/3 sm:w-2/5 md:w-1/2 flex justify-center">
          <img
            src="/photo/about3.jpg"
            alt="Skintific Paket Repair Skin Barrier & Reduce Acne"
            className="w-full h-auto object-cover rounded-lg shadow-lg"
          />
        </div>
        {/* Teks di desktop */}
        <div className="flex flex-col w-2/3 sm:w-3/5 md:w-1/2 justify-center text-left pl-4">
          <h2 className="text-base sm:text-lg md:text-2xl font-bold mb-2 md:mb-4">
            Skintific Anti Acne Set
          </h2>
          <p className="text-xs sm:text-sm md:text-base mb-2">
            Rangkaian perawatan kulit untuk membantu mengatasi jerawat dan
            mencegah munculnya kembali.
          </p>
          <p className="hidden sm:block text-xs sm:text-sm md:text-base mb-2">
            Menenangkan kulit yang meradang sekaligus menjaga kelembapan alami.
          </p>
          <p className="text-xs sm:text-sm md:text-base">
            Membuat kulit lebih bersih, sehat, dan bebas dari masalah jerawat.
          </p>
        </div>
      </div>

      <div className="w-full max-w-6xl mx-auto flex flex-row gap-4 md:gap-8 mt-8 px-4 items-center">
        {/* Teks */}
        <div className="flex flex-col w-2/3 sm:w-3/5 md:w-1/2 justify-center text-left pl-4">
          <h2 className="text-base sm:text-lg md:text-2xl font-bold mb-2 md:mb-4">
            Skintific Dark Spot Set
          </h2>
          <p className="text-xs sm:text-sm md:text-base mb-2">
            Rangkaian perawatan kulit yang diformulasikan untuk membantu
            memudarkan noda hitam dan bekas jerawat.
          </p>
          <p className="hidden sm:block text-xs sm:text-sm md:text-base mb-2">
            Mencerahkan warna kulit secara merata serta menjaga kelembapan
            kulit.
          </p>
          <p className=" text-xs sm:text-sm md:text-base mb-2">
            Membuat kulit tampak lebih cerah, halus, dan bebas dari dark spot.
          </p>
        </div>

        {/* Gambar */}
        <div className="w-1/3 sm:w-2/5 md:w-1/2 flex justify-center">
          <img
            src="/photo/about4.jpg"
            alt="Skintific Glowing Routine Set"
            className="w-full h-auto object-cover rounded-lg shadow-lg"
          />
        </div>
      </div>
      {/* Carousel Section */}
      <h3 className="text-center font-bold text-2xl md:text-3xl p-6 ">Hero Ingredience</h3>
      <div className="relative md:h-auto flex justify-center overflow-hidden">
        <div className="relative w-[80vw] h-[55vh] md:h-[80vh] overflow-hidden rounded-xl flex items-center justify-center">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.img
              key={current}
              src={images[current]}
              custom={direction}
              variants={{
                enter: (dir) => ({
                  x: dir > 0 ? 300 : -300,
                  opacity: 0,
                }),
                center: {
                  x: 0,
                  opacity: 1,
                  transition: { duration: 0.6, ease: "easeInOut" },
                },
                exit: (dir) => ({
                  x: dir > 0 ? -300 : 300,
                  opacity: 0,
                  transition: { duration: 0.6, ease: "easeInOut" },
                }),
              }}
              initial="enter"
              animate="center"
              exit="exit"
              className="absolute top-0 left-0 w-full h-full object-cover rounded-xl shadow-2xl"
            />
          </AnimatePresence>

          {/* Caption */}
          <AnimatePresence mode="wait">
            <MotionDiv
              key={current}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.6 }}
              className="absolute z-20 text-center text-black drop-shadow-lg px-4"
            >
              <h2 className="text-lg md:text-3xl font-bold mb-2">
                {captions[current].title}
              </h2>
              <p className="text-sm md:text-xl font-medium text-black/70 ">
                {captions[current].desc}
              </p>
            </MotionDiv>
          </AnimatePresence>
        </div>

        {/* Tombol navigasi */}
        <button
          onClick={prevSlide}
          className="absolute left-2 md:left-10 top-1/2 -translate-y-1/2 
       bg-white/20 backdrop-blur-md p-3 rounded-full 
       shadow-lg z-20 hover:bg-white/50 transition"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-2 md:right-10 top-1/2 -translate-y-1/2 
       bg-white/20 backdrop-blur-md p-3 rounded-full 
       shadow-lg z-20 hover:bg-white/50 transition"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </>
  );
}
