import { motion, AnimatePresence } from "motion/react";
import { X, Trash, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const MotionDiv = motion.div;

export default function DrawerCart({
  showCartDrawer,
  setShowCartDrawer,
  cartItems,
  setCartItems,
  handleDecrement,
  handleIncrement,
}) {
  const [selectedItems, setSelectedItems] = useState([]);
  const navigate = useNavigate();

  // toggle pilih item
  const toggleSelect = (index) => {
    setSelectedItems((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  // subtotal hanya item terpilih
  const subtotal = selectedItems.reduce((acc, i) => {
    const item = cartItems[i];
    return acc + (item.subtotal || 0);
  }, 0);

  return (
    <AnimatePresence>
      {showCartDrawer && (
        <>
          {/* Overlay */}
          <MotionDiv
            className="fixed inset-0 bg-black/40 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowCartDrawer(false)}
          />
          {/* Drawer */}
          <MotionDiv
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="fixed top-0 right-0 h-full w-full sm:w-2/3 lg:w-1/3 bg-white shadow-lg z-50 flex flex-col overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">Keranjang Saya</h2>
              <button
                onClick={() => setShowCartDrawer(false)}
                className="p-2 rounded-full hover:bg-gray-200"
              >
                <X size={20} />
              </button>
            </div>
            {/* Content */}
            <div className="flex flex-col flex-1 p-4 relative">
              {cartItems.length === 0 ? (
                <div className="text-gray-500 text-center mt-10">
                  Keranjang kosong
                </div>
              ) : (
                <ul className="space-y-4 flex-1">
                  {cartItems.map((item, index) => {
                    const isSelected = selectedItems.includes(index);
                    return (
                      <li
                        key={index}
                        onClick={() => toggleSelect(index)}
                        className={`relative flex items-center gap-3 border rounded p-2 cursor-pointer ${
                          isSelected
                            ? "border-pink-500 ring-2 ring-pink-300"
                            : ""
                        }`}
                      >
                        {/* Centang */}
                        {isSelected && (
                          <CheckCircle2
                            size={20}
                            className="absolute top-2 left-2 text-pink-600"
                          />
                        )}

                        {/* Foto */}
                        <img
                          src={item.foto || "/placeholder.png"}
                          alt={item.nama}
                          className="w-26 h-26 object-cover rounded-md border"
                        />

                        {/* Info produk */}
                        <div className="flex flex-col flex-1">
                          <div className="font-medium">{item.nama}</div>
                          <div className="text-gray-500 text-sm">
                            {item.jenis_produk}
                          </div>
                          <div className="text-pink-600 font-semibold">
                            Rp {item.subtotal?.toLocaleString("id-ID") || "-"}
                          </div>
                        </div>

                        {/* Icon Hapus */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation(); // supaya ga trigger toggleSelect
                            const filtered = cartItems.filter(
                              (_, i) => i !== index
                            );
                            setCartItems(filtered);
                            localStorage.setItem(
                              "keranjang",
                              JSON.stringify(filtered)
                            );
                            setSelectedItems((prev) =>
                              prev.filter((i) => i !== index)
                            );
                          }}
                          className="absolute top-2 right-2 text-red-500 hover:text-red-600"
                        >
                          <Trash size={18} />
                        </button>

                        {/* Kuantitas Controls */}
                        <div
                          onClick={(e) => e.stopPropagation()}
                          className="absolute bottom-2 right-2 flex items-center border rounded overflow-hidden"
                        >
                          <button
                            className="px-2 bg-gray-200 hover:bg-gray-300"
                            onClick={() => handleDecrement(index)}
                          >
                            -
                          </button>
                          <span className="px-2">{item.kuantitas}</span>
                          <button
                            className="px-2 bg-gray-200 hover:bg-gray-300"
                            onClick={() => handleIncrement(index)}
                          >
                            +
                          </button>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
            {/* Bottom Bar */}
            {selectedItems.length > 0 && (
              <div className="sticky bottom-0 left-0 right-0 bg-white flex items-center justify-between p-4 shadow-2xl border-t border-gray-200">
                <div className="font-semibold text-gray-800">
                  Subtotal: Rp {subtotal.toLocaleString("id-ID")}
                </div>
                <button
                  onClick={() => {
                    const selectedProducts = selectedItems.map(
                      (i) => cartItems[i]
                    );
                    navigate("/beli-product", {
                      state: { orderData: selectedProducts },
                    });
                  }}
                  className="bg-pink-600 hover:bg-pink-700 text-white font-bold px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition"
                >
                  Beli Sekarang
                </button>
              </div>
            )}{" "}
          </MotionDiv>
        </>
      )}
    </AnimatePresence>
  );
}
