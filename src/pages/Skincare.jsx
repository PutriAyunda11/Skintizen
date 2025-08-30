import { useEffect, useState } from "react";
import Pagination from "../components/Pagination";
import ProductCard from "../components/ProductCard";
import Filtered from "../components/Filtered";
import { useOutletContext } from "react-router-dom";
import DetailProduct from "../components/DetailProduct";

export default function Skincare() {
  const [skincare, setSkincare] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [cartItems, setCartItems] = useState({});
  const itemsPerPage = 8;

  useEffect(() => {
    const storedData = localStorage.getItem("skintiz");
    if (storedData) {
      const products = JSON.parse(storedData);
      const filtered = products.filter(
        (p) => !p.jenis_produk.toLowerCase().includes("makeup")
      );
      setSkincare(filtered);
      setFilteredProducts(filtered);
    }
  }, []);

  const incrementCart = (id) => {
    setCartItems((prev) => ({
      ...prev,
      [id]: prev[id] ? prev[id] + 1 : 1,
    }));
  };

  const decrementCart = (id) => {
    setCartItems((prev) => {
      const qty = prev[id] ? prev[id] - 1 : 0;
      if (qty <= 0) {
        const newState = { ...prev };
        delete newState[id];
        return newState;
      }
      return { ...prev, [id]: qty };
    });
  };

  const [selectedProduct, setSelectedProduct] = useState(null);
  const { isDetailOpen, setIsDetailOpen } = useOutletContext();

  const handleOpenDetail = (allProduct) => {
    setSelectedProduct(allProduct);
    setIsDetailOpen(true);
  };

  return (
    <>
      <div className="max-w-full mx-auto p-2 sm:pb-12 sm:pt-12 lg:p-6 mt-10 flex flex-col lg:flex-row gap-6 lg:mt-35">
        <Filtered
          products={skincare}
          onFilterChange={setFilteredProducts}
          page="/skin-care"
        />

        <div className="flex-1">
          <h1 className="text-xl md:text-2xl font-bold text-center mb-6 text-blue-600">
            SkinCare
          </h1>

          {filteredProducts.length <= itemsPerPage ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {filteredProducts.map((item) => {
                const qty = cartItems[item.id] || 0;
                return (
                  <ProductCard
                    key={item.id}
                    item={item}
                    qty={qty}
                    incrementCart={incrementCart}
                    decrementCart={decrementCart}
                    onOpenDetail={handleOpenDetail}
                  />
                );
              })}
            </div>
          ) : (
            // ✅ Kalau data lebih banyak dari itemsPerPage → pakai Pagination
            <Pagination itemsPerPage={itemsPerPage} products={filteredProducts}>
              {(currentItems) => (
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                  {currentItems.map((item) => {
                    const qty = cartItems[item.id] || 0;
                    return (
                      <ProductCard
                        key={item.id}
                        item={item}
                        qty={qty}
                        incrementCart={incrementCart}
                        decrementCart={decrementCart}
                        onOpenDetail={handleOpenDetail}
                      />
                    );
                  })}
                </div>
              )}
            </Pagination>
          )}
        </div>
        {isDetailOpen && (
          <DetailProduct
            isOpen={isDetailOpen}
            onClose={() => setIsDetailOpen(false)}
            product={selectedProduct}
            overlayOpacity="bg-black/60"
            addToCart={(p, size, shade) =>
              console.log("Tambah ke keranjang:", p, size, shade)
            }
          />
        )}
      </div>
    </>
  );
}
