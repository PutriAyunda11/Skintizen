import { useEffect, useState } from "react";
import Pagination from "../components/Pagination";
import ProductCard from "../components/ProductCard";
import Filtered from "../components/Filtered";
import DetailProduct from "../components/DetailProduct";
import { useOutletContext } from "react-router-dom";

export default function AllProduct() {
  const [allProduct, setAllProduct] = useState([]);
  const [cartItems, setCartItems] = useState({});
  const itemsPerPage = 8;
  const [filteredProducts, setFilteredProducts] = useState([]);
  
  useEffect(() => {
    const storedData = localStorage.getItem("skintiz");
    if (storedData) {
      const products = JSON.parse(storedData);
      setAllProduct(products);
      setFilteredProducts(products);
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
      const kuantitas = prev[id] ? prev[id] - 1 : 0;
      if (kuantitas <= 0) {
        const newState = { ...prev };
        delete newState[id];
        return newState;
      }
      return { ...prev, [id]: kuantitas };
    });
  };

  const [selectedProduct, setSelectedProduct] = useState(null);
  const { isDetailOpen, setIsDetailOpen } = useOutletContext();

  const handleOpenDetail = (allProduct) => {
    setSelectedProduct(allProduct);
    setIsDetailOpen(true);
  };
  
  const resetKuantitas = (id) => {
    setCartItems((prev) => {
      const newState = { ...prev };
      delete newState[id]; // hapus kuantitas sehingga kembali ke 0
      return newState;
    });
  };

  return (
    <>
      <div className="max-w-full mx-auto flex flex-col lg:flex-row gap-6 p-0 sm:pb-12 sm:pt-7 lg:p-6 mt-12 sm:mt-35">
        <Filtered
          products={allProduct}
          onFilterChange={setFilteredProducts}
          page="/all-product"
        />
        <div className="max-w-7/8 mx-auto">
          {filteredProducts.length <= itemsPerPage ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {filteredProducts.map((item) => {
                const kuantitas = cartItems[item.id] || 0;
                return (
                  <ProductCard
                    key={item.id}
                    item={item}
                    kuantitas={kuantitas}
                    incrementCart={incrementCart}
                    decrementCart={decrementCart}
                    onOpenDetail={handleOpenDetail}
                    resetKuantitas={resetKuantitas}
                  />
                );
              })}
            </div>
          ) : (
            <Pagination itemsPerPage={itemsPerPage} products={filteredProducts}>
              {(currentItems) => (
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                  {currentItems.map((item) => {
                    const kuantitas = cartItems[item.id] || 0;
                    return (
                      <ProductCard
                        key={item.id}
                        item={item}
                        kuantitas={kuantitas}
                        incrementCart={incrementCart}
                        decrementCart={decrementCart}
                        onOpenDetail={handleOpenDetail}
                        resetKuantitas={resetKuantitas}
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
          />
        )}
      </div>
    </>
  );
}
