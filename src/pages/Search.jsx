import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import Pagination from "../components/Pagination";
import { useOutletContext } from "react-router-dom";
import DetailProduct from "../components/DetailProduct";

export default function Search() {
  const location = useLocation();
  const query = location.state?.query || ""; // ambil query dari state
  const [results, setResults] = useState([]);
  const itemsPerPage = 10; // jumlah item per halaman
  const [cartItems, setCartItems] = useState({});

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

  const [selectedProduct, setSelectedProduct] = useState(null);
  const { isDetailOpen, setIsDetailOpen } = useOutletContext();

  const handleOpenDetail = (allProduct) => {
    setSelectedProduct(allProduct);
    setIsDetailOpen(true);
  };

  const incrementCart = (id) => {
    setCartItems((prev) => ({
      ...prev,
      [id]: prev[id] ? prev[id] + 1 : 1,
    }));
  };

  const decrementCart = (id) => {
    setCartItems((prev) => {
      const kuantitas = prev[id] ? prev[id] - 1 : 0;
      if (kuantitas <= 0) {
        const newState = { ...prev };
        delete newState[id];
        return newState;
      }
      return { ...prev, [id]: kuantitas };
    });
  };

  const resetKuantitas = (id) => {
    setCartItems((prev) => {
      const newState = { ...prev };
      delete newState[id]; // hapus kuantitas sehingga kembali ke 0
      return newState;
    });
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50 mt-25">
      <h1 className="text-2xl font-bold m-6 text-center">
        Hasil pencarian untuk: <span className="text-pink-600">"{query}"</span>
      </h1>

      {results.length > 0 ? (
        results.length <= itemsPerPage ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {results.map((item) => (
              <ProductCard
                key={item.id}
                item={item}
                kuantitas={cartItems[item.id] || 0}
                incrementCart={() => incrementCart(item.id)}
                decrementCart={() => decrementCart(item.id)}
                onOpenDetail={handleOpenDetail}
                resetKuantitas={resetKuantitas}
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
                    kuantitas={cartItems[item.id] || 0} // gunakan state cartItems
                    incrementCart={() => incrementCart(item.id)}
                    decrementCart={() => decrementCart(item.id)}
                    onOpenDetail={handleOpenDetail}
                    resetKuantitas={resetKuantitas}
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
      {isDetailOpen && (
        <DetailProduct
          isOpen={isDetailOpen}
          onClose={() => setIsDetailOpen(false)}
          product={selectedProduct}
          overlayOpacity="bg-black/60"
        />
      )}
    </div>
  );
}
