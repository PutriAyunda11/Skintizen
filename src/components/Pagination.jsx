import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({ itemsPerPage, products, children }) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(products.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = products.slice(startIndex, startIndex + itemsPerPage);

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  // logic tombol angka pagination
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (page) => {
      if (totalPages <= 3) return true;
      if (currentPage === 1) return page <= 3;
      if (currentPage === totalPages) return page >= totalPages - 2;
      return Math.abs(page - currentPage) <= 1;
    }
  );

  return (
    <>
      {/* Render produk dari parent */}
      {children(currentItems)}

      {/* Kontrol pagination */}
      <div className="flex justify-center items-center mt-8 gap-2 text-gray-700 flex-wrap">
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 rounded hover:bg-gray-200 disabled:opacity-50 transition"
        >
          <ChevronLeft size={20} />
        </button>

        {pages.map((page) => (
          <button
            key={page}
            onClick={() => goToPage(page)}
            className={`px-3 py-1 rounded hover:bg-gray-200 transition ${
              currentPage === page ? "bg-gray-500 text-white" : ""
            }`}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 rounded hover:bg-gray-200 disabled:opacity-50 transition"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </>
  );
}
