import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

const MotionDiv = motion.div;

export default function Filtered({ products, onFilterChange, page }) {
  const [sortFilter, setSortFilter] = useState("All");
  const [availabilityFilter, setAvailabilityFilter] = useState("All");
  const [productTypeFilter, setProductTypeFilter] = useState("All");

  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isAvailabilityOpen, setIsAvailabilityOpen] = useState(false);
  const [isProductTypeOpen, setIsProductTypeOpen] = useState(false);

  const sortOptions = [
    "All",
    "Harga Terendah",
    "Harga Tertinggi",
    "Nama Produk A-Z",
    "Nama Produk Z-A",
  ];
  const availabilityOptions = ["All", "Tersedia", "Habis"];

  const getProductTypeOptions = () => {
    if (page === "/skin-care") {
      return ["All", "Moisturizer", "Serum", "Sunscreen", "Facial Wash", "Masker", "Toner"];
    }
    if (page === "/makeup") {
      return ["All", "Cushion", "Skintint", "Setting Spray", "Loose Powder", "Concealer", "Lip Care", "Makeup Remover"];
    }
    if (page === "/all-product") {
      return [
        "All","Moisturizer","Serum","Sunscreen","Facial Wash","Masker","Toner",
        "Cushion","Skintint","Setting Spray","Loose Powder","Concealer","Lip Care","Makeup Remover",
      ];
    }
    return ["All"];
  };

  const productTypeOptions = getProductTypeOptions();

  // Filtering & Sorting
  useEffect(() => {
    let filtered = [...products];

    if (availabilityFilter !== "All") {
      filtered = filtered.filter((p) =>
        availabilityFilter === "Tersedia" ? p.stok !== 0 : p.stok === 0
      );
    }

    if (productTypeFilter !== "All") {
      filtered = filtered.filter((p) =>
        p.jenis_produk.toLowerCase().includes(productTypeFilter.toLowerCase())
      );
    }

    if (sortFilter === "Harga Terendah") {
      filtered.sort((a, b) => a.harga - b.harga);
    } else if (sortFilter === "Harga Tertinggi") {
      filtered.sort((a, b) => b.harga - a.harga);
    } else if (sortFilter === "Nama Produk A-Z") {
      filtered.sort((a, b) => a.nama.localeCompare(b.nama));
    } else if (sortFilter === "Nama Produk Z-A") {
      filtered.sort((a, b) => b.nama.localeCompare(a.nama));
    }

    onFilterChange(filtered);
  }, [sortFilter, availabilityFilter, productTypeFilter, products, onFilterChange]);

  // Variants animasi bottom sheet
  const sheetVariants = {
    hidden: { y: "100%", opacity: 0 },
    visible: { y: 0, opacity: 1 },
    exit: { y: "100%", opacity: 0 },
  };

  // 🔹 Helper class active
  const activeClass = "bg-blue-100 font-medium text-blue-600 border-l-4 border-blue-500";
  const defaultClass = "block w-full text-left px-3 py-2 rounded hover:bg-gray-100 text-sm";

  return (
    <>
      {/* 🔹 Desktop Sidebar */}
      <aside className="hidden lg:block w-60 flex-shrink-0 bg-white space-y-5">
        {/* Sort */}
        <div>
          <h2 className="font-semibold text-gray-700 mb-2">Urutkan</h2>
          {sortOptions.map((option) => (
            <button
              key={option}
              className={`${defaultClass} ${sortFilter === option ? activeClass : ""}`}
              onClick={() => setSortFilter(option)}
            >
              {option}
            </button>
          ))}
        </div>

        {/* Availability */}
        <div>
          <h2 className="font-semibold text-gray-700 mb-2">Ketersediaan</h2>
          {availabilityOptions.map((option) => (
            <button
              key={option}
              className={`${defaultClass} ${availabilityFilter === option ? activeClass : ""}`}
              onClick={() => setAvailabilityFilter(option)}
            >
              {option}
            </button>
          ))}
        </div>

        {/* Product Type */}
        <div>
          <h2 className="font-semibold text-gray-700 mb-2">Jenis Produk</h2>
          {productTypeOptions.map((option) => (
            <button
              key={option}
              className={`${defaultClass} ${productTypeFilter === option ? activeClass : ""}`}
              onClick={() => setProductTypeFilter(option)}
            >
              {option}
            </button>
          ))}
        </div>
      </aside>

      {/* 🔹 Mobile / Tablet Filter Nav */}
      <nav className="block lg:hidden border-t border-gray-200 bg-white pt-5">
        <div className="flex justify-center space-x-6 py-3 text-sm font-bold text-gray-600">
          <button onClick={() => {setIsSortOpen(true); setIsAvailabilityOpen(false); setIsProductTypeOpen(false);}}>
            Urutkan
          </button>
          <button onClick={() => {setIsAvailabilityOpen(true); setIsSortOpen(false); setIsProductTypeOpen(false);}}>
            Ketersediaan
          </button>
          <button onClick={() => {setIsProductTypeOpen(true); setIsAvailabilityOpen(false); setIsSortOpen(false);}}>
            Jenis Produk
          </button>
        </div>
      </nav>

      {/* 🔹 Bottom Sheet Filter Mobile/Tablet */}
      <AnimatePresence>
        {isSortOpen && (
          <MotionDiv
            className="fixed bottom-0 left-0 w-full bg-white shadow-lg border-t z-50 p-4"
            variants={sheetVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.3 }}
          >
            <h2 className="font-semibold text-gray-700 mb-3">Urutkan</h2>
            {sortOptions.map((option) => (
              <button
                key={option}
                className={`${defaultClass} ${sortFilter === option ? activeClass : ""}`}
                onClick={() => { setSortFilter(option); setIsSortOpen(false); }}
              >
                {option}
              </button>
            ))}
          </MotionDiv>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isAvailabilityOpen && (
          <MotionDiv
            className="fixed bottom-0 left-0 w-full bg-white shadow-lg border-t z-50 p-4"
            variants={sheetVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.3 }}
          >
            <h2 className="font-semibold text-gray-700 mb-3">Ketersediaan</h2>
            {availabilityOptions.map((option) => (
              <button
                key={option}
                className={`${defaultClass} ${availabilityFilter === option ? activeClass : ""}`}
                onClick={() => { setAvailabilityFilter(option); setIsAvailabilityOpen(false); }}
              >
                {option}
              </button>
            ))}
          </MotionDiv>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isProductTypeOpen && (
          <MotionDiv
            className="fixed bottom-0 left-0 w-full bg-white shadow-lg border-t z-50 p-4 max-h-[60vh] overflow-y-auto"
            variants={sheetVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.3 }}
          >
            <h2 className="font-semibold text-gray-700 mb-3">Jenis Produk</h2>
            {productTypeOptions.map((option) => (
              <button
                key={option}
                className={`${defaultClass} ${productTypeFilter === option ? activeClass : ""}`}
                onClick={() => { setProductTypeFilter(option); setIsProductTypeOpen(false); }}
              >
                {option}
              </button>
            ))}
          </MotionDiv>
        )}
      </AnimatePresence>
    </>
  );
}
