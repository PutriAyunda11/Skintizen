import { ShoppingCart, Eye, Plus, Minus, Award, Sparkles } from "lucide-react";
import { motion } from "motion/react";

const MotionDiv = motion.div;
const MotionButton = motion.button;

export default function ProductCard({ item, qty, incrementCart, decrementCart, onOpenDetail }) {
  return (
    <div className="relative border-none rounded-xl p-3 sm:p-4 shadow-sm bg-white hover:shadow-lg transition-shadow duration-300 flex flex-col">
      
      {/* Badges */}
      {item.jumlah_terjual >= 80000 && (
        <span
          className={`absolute left-2 z-10 bg-yellow-400 text-white font-bold text-[8px] sm:text-xs px-2 py-1 rounded-lg shadow-md flex items-center gap-1 ${
            item.tahun_keluar >= 2023 ? "top-2" : "top-2"
          }`}
        >
          <Award size={14} />
          Best Seller
        </span>
      )}
      {item.tahun_keluar >= 2023 && (
        <span
          className={`absolute left-2 z-10 bg-green-500 text-white font-bold text-[8px] sm:text-xs px-2 py-1 rounded-lg shadow-md flex items-center gap-1 ${
            item.jumlah_terjual >= 80000 ? "top-8" : "top-2"
          }`}
        >
          <Sparkles size={14} />
          New Product
        </span>
      )}

      {/* Image */}
      <div className="overflow-hidden rounded-lg">
        <img
          src={item.foto}
          alt={item.nama}
          className="w-full h-36 sm:h-40 md:h-44 lg:h-85 object-cover mb-3 sm:mb-4 transform hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Info */}
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
        {qty === 0 && (
          <MotionButton
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            onClick={() => onOpenDetail(item)}
            className="flex-1 bg-blue-500 text-white font-semibold py-1 sm:py-2 rounded-lg hover:bg-blue-700 transition-colors duration-300 flex items-center justify-center gap-1 sm:gap-2 text-[9px] sm:text-sm"
          >
            <Eye size={14} />
            Lihat Detail
          </MotionButton>
        )}

        {/* Tampilkan keranjang hanya jika produk TIDAK punya shade */}
        {!item.shade && (
          <>
            {qty === 0 ? (
              <button
                onClick={() => incrementCart(item.id)}
                className="bg-red-500 p-1 sm:p-2 rounded-lg hover:bg-red-700 transition-colors duration-300 flex items-center justify-center"
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
                  onClick={() => incrementCart(item.id)}
                  className="flex-[2] bg-red-500 rounded-lg py-1 sm:py-2 flex items-center justify-center text-white font-bold hover:bg-red-700 transition-colors duration-300 text-[10px] sm:text-sm"
                >
                  {qty}
                </button>

                <button
                  onClick={() => incrementCart(item.id)}
                  className="flex-[0.5] bg-red-500 rounded-lg py-1 sm:py-2 flex items-center justify-center hover:bg-red-700 transition-colors duration-300"
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
