import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import Pagination from "../components/Pagination";
import { useOutletContext } from "react-router-dom";
import DetailProduct from "../components/DetailProduct";


export default function NewLaunch() {
  const [newLaunch, setNewLaunch] = useState([]);
  const [cartItems, setCartItems] = useState({});
  const itemsPerPage = 9;

  useEffect(() => {
    const storedData = localStorage.getItem("skintiz");
    if (storedData) {
      const products = JSON.parse(storedData);
      const filtered = products.filter((p) => p.tahun_keluar >= 2023);
      setNewLaunch(filtered);
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
    <div className="max-w-screen lg:max-w-7/8 mx-auto p-2 sm:pb-12 sm:pt-7 lg:p-6 mt-12 sm:mt-25">
      <h1 className="text-xl md:text-2xl font-bold text-center m-6 text-blue-600">
        New Launching
      </h1>

        <Pagination itemsPerPage={itemsPerPage} products={newLaunch}>
          {(currentItems) => (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
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
  );
}
