import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import Pagination from "../components/Pagination";

export default function Search() {
  const location = useLocation();
  const query = location.state?.query || ""; // ambil query dari state
  const [results, setResults] = useState([]);
  const itemsPerPage = 10; // jumlah item per halaman

  useEffect(() => {
    if (!query) return;
    const data = localStorage.getItem("skintiz");
    if (data) {
      const parsed = JSON.parse(data);
      const filtered = parsed.filter((item) => {
        const nama = item.nama?.toLowerCase() || "";
        const jenis = item.jenis_produk?.toLowerCase() || "";
        return (
          nama.includes(query.toLowerCase()) ||
          jenis.includes(query.toLowerCase())
        );
      });
      setResults(filtered);
    }
  }, [query]);

  return (
    <div className="min-h-screen p-6 bg-gray-50 mt-25">
      <h1 className="text-2xl font-bold m-6 text-center">
        Hasil pencarian untuk:{" "}
        <span className="text-pink-600">"{query}"</span>
      </h1>

      {results.length > 0 ? (
        results.length <= itemsPerPage ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {results.map((item) => (
              <ProductCard
                key={item.id}
                item={item}
                qty={0}
                incrementCart={() => {}}
                decrementCart={() => {}}
              />
            ))}
          </div>
        ) : (
          <Pagination itemsPerPage={itemsPerPage} products={results}>
            {(currentItems) => (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {currentItems.map((item) => (
                  <ProductCard
                    key={item.id}
                    item={item}
                    qty={0}
                    incrementCart={() => {}}
                    decrementCart={() => {}}
                  />
                ))}
              </div>
            )}
          </Pagination>
        )
      ) : (
        <p className="text-gray-500 text-center">
          Tidak ada produk yang cocok.
        </p>
      )}
    </div>
  );
}
