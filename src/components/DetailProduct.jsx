import { motion } from "motion/react";
import { X } from "lucide-react";
import { useState } from "react";

const MotionDiv = motion.div;

export default function DetailProduct({ isOpen, onClose, product, addToCart }) {
  const [selectedShade, setSelectedShade] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);

  if (!product) return null;

  return (
    <>
{isOpen && (
  <MotionDiv
    initial={{ opacity: 0 }}
    animate={{ opacity: 0.5 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 bg-black/15 z-[60]" // lebih tinggi dari header
    onClick={onClose}
  />
)}

<MotionDiv
  initial={{ x: "100%" }}
  animate={{ x: isOpen ? 0 : "100%" }}
  transition={{ type: "spring", stiffness: 100, damping: 20 }}
  className="fixed top-0 right-0 h-full w-full sm:w-1/2 lg:w-1/3 bg-white shadow-sm z-[70] flex flex-col overflow-y-auto"
>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b z-70">
          <h2 className="text-lg font-semibold">Detail Produk</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-200"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 flex flex-col gap-4">
          {/* Foto */}
          <div className="w-full flex justify-center">
            <img
              src={product.foto || "/placeholder.png"}
              alt={product.nama}
              className="w-48 h-48 object-cover rounded-lg shadow"
            />
          </div>

          {/* Info */}
          <div>
            <h3 className="text-xl font-bold">{product.nama}</h3>
            <p className="text-pink-600 text-lg font-semibold">
              Rp {product.harga?.toLocaleString("id-ID")}
            </p>
            <p className="text-gray-600 text-sm mt-1">
              Stok: {product.stok ?? "Tidak tersedia"}
            </p>
          </div>

          {/* Deskripsi */}
          {product.deskripsi && (
            <p className="text-gray-700 text-sm leading-relaxed">
              {product.deskripsi}
            </p>
          )}

          {/* Size */}
          {Array.isArray(product.size) && product.size.length > 0 && (
            <div>
              <h4 className="font-medium mb-2">Pilih Ukuran:</h4>
              <div className="flex gap-2 flex-wrap">
                {product.size.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={`px-3 py-1 border rounded-lg text-sm ${
                      selectedSize === s
                        ? "bg-blue-500 text-white"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Shade */}
          {Array.isArray(product.shade) && product.shade.length > 0 && (
            <div>
              <h4 className="font-medium mb-2">Pilih Shade:</h4>
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

          {/* Buttons */}
          <div className="mt-6 flex flex-col gap-3">
            <button
              onClick={() =>
                addToCart && addToCart(product, selectedSize, selectedShade)
              }
              className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-lg"
            >
              Tambah ke Keranjang
            </button>
            <button
              onClick={() =>
                alert(`Pesan sekarang: ${product.nama} - Rp ${product.harga}`)
              }
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg"
            >
              Pesan Sekarang!
            </button>
          </div>
        </div>
      </MotionDiv>
    </>
  );
}
