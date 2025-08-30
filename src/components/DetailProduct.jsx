import { motion } from "motion/react";
import { X } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const MotionDiv = motion.div;

export default function DetailProduct({
  isOpen,
  onClose,
  product,
  addToCart,
  overlayOpacity = "bg-black/30",
}) {
  const [selectedShade, setSelectedShade] = useState(null);
  const [selectedSize, _setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();

  if (!product) return null;

  const handleQuantityChange = (type) => {
    setQuantity((prev) => {
      if (type === "inc") return prev + 1;
      if (type === "dec") return prev > 1 ? prev - 1 : 1;
      return prev;
    });
  };

  const handleAddToCart = () => {
    if (addToCart) {
      addToCart(product, selectedSize, selectedShade, quantity);
    }
    alert(
      `Produk ditambahkan: ${product.nama} (${quantity}x) - Rp ${(
        product.harga * quantity
      ).toLocaleString("id-ID")}`
    );
  };

  const handleBuyNow = () => {
    alert(
      `Pesan sekarang: ${product.nama} (${quantity}x) - Rp ${(
        product.harga * quantity
      ).toLocaleString("id-ID")}`
    );
  };

  const handleGoToDetailPage = () => {
    navigate(`/product/${product.id}`); // arahkan ke Product.jsx
    onClose(); // tutup modal setelah navigasi
  };

  return (
    <>
      {isOpen && (
        <MotionDiv
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          exit={{ opacity: 0 }}
          className={`fixed inset-0 ${overlayOpacity} z-[60]`}
          onClick={onClose}
        />
      )}

      <MotionDiv
        initial={{ x: "100%" }}
        animate={{ x: isOpen ? 0 : "100%" }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="fixed top-0 right-0 h-full w-full sm:w-2/3 lg:w-1/3 bg-white shadow-sm z-[70] flex flex-col overflow-y-auto"
      >
        {/* Header */}
        <div className="relative flex items-center justify-center p-6 border-b">
          <h2 className="text-lg font-semibold text-center">Detail Produk</h2>
          <button
            onClick={onClose}
            className="absolute right-4 p-2 rounded-full hover:bg-gray-200"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="pt-10 pl-6 pr-6 flex flex-col gap-6">
          {/* Foto + Info */}
          <div className="flex flex-col sm:flex-row gap-6">
            <div className="flex justify-center sm:w-1/2">
              <img
                src={product.foto || "/placeholder.png"}
                alt={product.nama}
                className="w-48 h-48 object-cover rounded-lg shadow"
              />
            </div>
            <div className="flex flex-col items-start sm:w-2/2">
              <h3 className="text-md text-start font-bold">{product.nama}</h3>
              <p className="text-pink-600 text-lg font-semibold">
                Rp {product.harga?.toLocaleString("id-ID")}
              </p>
              <p className="text-gray-800 text-sm mt-1">
                Stok: {product.stok ?? "Tidak tersedia"}
              </p>
            </div>
          </div>

          {/* Deskripsi */}
          {product.deskripsi && (
            <p className="text-gray-700 text-sm leading-relaxed">
              {product.deskripsi}
            </p>
          )}

          {/* Shade */}
          {Array.isArray(product.shade) && product.shade.length > 0 && (
            <div className="flex flex-col gap-2">
              <h4 className="font-medium mb-2 text-left">Pilih Shade:</h4>
              <div className="flex gap-2 flex-wrap">
                {product.shade.map((sh) => (
                  <button
                    key={sh}
                    onClick={() => setSelectedShade(sh)}
                    className={`px-3 py-1 border rounded-lg text-sm ${
                      selectedShade === sh
                        ? "bg-pink-500 text-white"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    {sh}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="flex flex-col gap-2">
            <h4 className="font-medium text-left">Kuantitas:</h4>
            <div className="flex items-center border rounded-lg w-fit">
              <button
                onClick={() => handleQuantityChange("dec")}
                className="px-3 py-1 text-lg rounded-lg hover:bg-gray-200"
              >
                -
              </button>
              <span className="px-4">{quantity}</span>
              <button
                onClick={() => handleQuantityChange("inc")}
                className="px-3 py-1 text-lg rounded-lg hover:bg-gray-200"
              >
                +
              </button>
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-0 flex flex-col gap-3">
            <button
              onClick={handleAddToCart}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-lg"
            >
              Tambah ke Keranjang
            </button>
            <button
              onClick={handleBuyNow}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg"
            >
              Pesan Sekarang!
            </button>

            {/* Rincian Produk */}
            <span
              onClick={handleGoToDetailPage}
              className="w-full text-center text-gray-800 font-semibold underline cursor-pointer hover:text-blue-600"
            >
              Rincian Produk
            </span>
          </div>
        </div>
      </MotionDiv>
    </>
  );
}
