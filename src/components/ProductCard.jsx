import { ShoppingCart, Eye, Plus, Minus, Award, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";

const MotionDiv = motion.div;
const MotionButton = motion.button;

export default function ProductCard({
  item,
  kuantitas,
  incrementCart,
  decrementCart,
  onOpenDetail,
  resetKuantitas,
}) {
  const [popup, setPopup] = useState({
    show: false,
    message: "",
    type: "success",
  });

  const handleAddToCartMiddle = () => {
    const isLoggedIn = JSON.parse(localStorage.getItem("isLoggedIn"));
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    if (!isLoggedIn || !currentUser) {
      triggerPopup("Silakan login terlebih dahulu!", "error");
      return;
    }

    const keranjang = JSON.parse(localStorage.getItem("keranjang")) || [];

    const existingIndex = keranjang.findIndex(
      (k) =>
        k.id === item.id &&
        k.namaUser === currentUser.nama &&
        k.emailUser === currentUser.email
    );

    if (existingIndex === -1) {
      // Produk belum ada  tambah baru
      keranjang.push({
        ...item,
        kuantitas,
        subtotal: item.harga * kuantitas,
        namaUser: currentUser.nama,
        emailUser: currentUser.email,
      });
    } else {
      // Produk sudah ada  tambahkan kuantitas baru ke kuantitas lama
      keranjang[existingIndex].kuantitas += kuantitas;
      keranjang[existingIndex].subtotal =
        keranjang[existingIndex].kuantitas * item.harga;
    }

    localStorage.setItem("keranjang", JSON.stringify(keranjang));
    triggerPopup("Produk berhasil ditambahkan ke keranjang!", "success");
  };

  const triggerPopup = (message, type) => {
    setPopup({ show: true, message, type });
  };
  const handlePopupOk = () => {
    setPopup({ ...popup, show: false });
    if (resetKuantitas) resetKuantitas(item.id);
  };
  return (
    <div className="relative border-none rounded-xl p-3 sm:p-4 shadow-sm bg-white hover:shadow-lg transition-shadow duration-300 flex flex-col">
      {/* Popup Custom */}
      <AnimatePresence>
        {popup.show && (
          <MotionDiv
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50"
          >
            <div
              className={`relative rounded-xl shadow-lg p-6 w-80 text-center border-t-4 bg-gray-100 ${
                popup.type === "error" ? "border-red-500" : "border-blue-500"
              }`}
            >
              <p
                className={`text-base font-semibold mb-4 ${
                  popup.type === "error" ? "text-red-600" : "text-black"
                }`}
              >
                {popup.message}
              </p>
              <button
                onClick={handlePopupOk}
                className="mt-2 bg-blue-500 hover:bg-blue-400 text-white px-4 py-2 rounded-lg transition"
              >
                OK
              </button>
            </div>
          </MotionDiv>
        )}
      </AnimatePresence>

      {/* Badges */}
      {item.jumlah_terjual >= 80000 && (
        <span
          className={`absolute left-2 z-10 bg-yellow-400 text-white font-bold text-[8px] sm:text-xs px-2 py-1 rounded-lg shadow-md flex items-center gap-1 ${
            item.tahun_keluar >= 2023 ? "top-2" : "top-2"
          }`}
        >
          <Award size={14} /> Best Seller
        </span>
      )}
      {item.tahun_keluar >= 2023 && (
        <span
          className={`absolute left-2 z-10 bg-green-500 text-white font-bold text-[8px] sm:text-xs px-2 py-1 rounded-lg shadow-md flex items-center gap-1 ${
            item.jumlah_terjual >= 80000 ? "top-8" : "top-2"
          }`}
        >
          <Sparkles size={14} /> New Product
        </span>
      )}
      <div className="overflow-hidden rounded-lg">
        <img
          src={item.foto}
          alt={item.nama}
          className="w-full h-36 sm:h-40 md:h-44 lg:h-85 object-cover mb-3 sm:mb-4 transform hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="flex flex-col flex-grow">
        <h2 className="font-semibold text-[10px] sm:text-sm md:text-base text-gray-800 mb-1 truncate">
          {item.nama}
        </h2>
        <p className="text-pink-600 font-bold text-[10px] sm:text-sm md:text-md mb-1">
          Rp {item.harga.toLocaleString()}
        </p>
        <p className="text-gray-500 text-[8px] sm:text-[10px] md:text-sm mb-3">
          Terjual: {item.jumlah_terjual}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-1 sm:gap-2 mt-auto">
        {kuantitas === 0 && (
          <MotionButton
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            onClick={() => onOpenDetail(item)}
            className="flex-1 bg-blue-500 text-white font-semibold py-1 sm:py-2 rounded-lg hover:bg-blue-700 transition-colors duration-300 flex items-center justify-center gap-1 sm:gap-2 text-[9px] sm:text-sm"
          >
            <Eye size={14} /> Lihat Detail
          </MotionButton>
        )}

{!item.shade && (
  <>
    {kuantitas === 0 ? (
      <button
        onClick={() => {
          const isLoggedIn = JSON.parse(
            localStorage.getItem("isLoggedIn")
          );
          if (!isLoggedIn) {
            triggerPopup("Silakan login terlebih dahulu!", "error");
            return;
          }
          if (item.stok > 0) incrementCart(item.id);
        }}
        disabled={item.stok === 0 || item.stok === null}
        className={`p-1 sm:p-2 rounded-lg flex items-center justify-center transition-colors duration-300 ${
          item.stok === 0
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-red-500 hover:bg-red-700"
        }`}
      >
        <ShoppingCart size={16} className="text-white" />
      </button>
    ) : (
      <MotionDiv
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        className="flex gap-1 sm:gap-2 flex-1"
      >
        <button
          onClick={() => decrementCart(item.id)}
          className="flex-[0.5] bg-red-500 rounded-lg py-1 sm:py-2 flex items-center justify-center hover:bg-red-700 transition-colors duration-300"
        >
          <Minus size={14} className="text-white" />
        </button>

        <button
          onClick={handleAddToCartMiddle}
          disabled={item.stok === 0}
          className={`flex-[2] rounded-lg py-1 sm:py-2 flex items-center justify-center font-bold text-[10px] sm:text-sm transition-colors duration-300 ${
            item.stok === 0
              ? "bg-gray-400 cursor-not-allowed text-white"
              : "bg-red-500 hover:bg-red-700 text-white"
          }`}
        >
          {kuantitas}
        </button>

        <button
          onClick={() => {
            if (kuantitas < item.stok) incrementCart(item.id);
          }}
          disabled={item.stok === 0 || kuantitas >= item.stok}
          className={`flex-[0.5] rounded-lg py-1 sm:py-2 flex items-center justify-center transition-colors duration-300 ${
            item.stok === 0 || kuantitas >= item.stok
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-red-500 hover:bg-red-700"
          }`}
        >
          <Plus size={14} className="text-white" />
        </button>
      </MotionDiv>
    )}
  </>
)}
      </div>
    </div>
  );
}
