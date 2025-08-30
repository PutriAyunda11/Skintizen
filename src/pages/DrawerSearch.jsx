import { useState } from "react";
import { motion } from "motion/react";
import { X, Search, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const MotionDiv = motion.div;

export default function DrawerSearch({ isOpen, onClose }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const handleSearch = (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.trim() === "") {
      setResults([]);
      return;
    }

    const data = localStorage.getItem("skintiz");
    if (data) {
      const parsed = JSON.parse(data);
      const filtered = parsed.filter((item) => {
        const nama = item.nama?.toLowerCase() || "";
        const jenis = item.jenis_produk?.toLowerCase() || "";
        return (
          nama.includes(value.toLowerCase()) ||
          jenis.includes(value.toLowerCase())
        );
      });
      setResults(filtered);
    }
  };

  return (
    <>
      {isOpen && (
        <MotionDiv
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black z-40"
          onClick={onClose}
        />
      )}

      <MotionDiv
        initial={{ x: "100%" }}
        animate={{ x: isOpen ? 0 : "100%" }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="fixed top-0 right-0 h-full w-full sm:w-1/2 lg:w-1/3 bg-white shadow-lg z-50 flex flex-col overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Pencarian</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-200"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex flex-col flex-1 p-4">
          <div className="relative mb-4">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-700"
            />
            <input
              type="text"
              placeholder="Cari produk..."
              value={query}
              onChange={handleSearch}
              className="w-full border rounded px-3 py-2 pl-10"
            />
          </div>
          <div className="flex-1 text-sm flex flex-col">
            {query.length > 0 ? (
              results.length > 0 ? (
                <>
                  <ul className="space-y-2 flex-1 sm:hidden">
                    {results.map((item) => (
                      <Link
                        to={`/product/${item.id}`}
                        key={item.id}
                        onClick={onClose}
                        className="flex items-center gap-3 p-2 border rounded hover:bg-gray-100 cursor-pointer group relative"
                      >
                        {" "}
                        <img
                          src={item.foto || "/placeholder.png"}
                          alt={item.nama}
                          className="w-16 h-16 object-cover rounded-md border"
                        />
                        <div className="flex flex-col">
                          <div className="font-medium">{item.nama}</div>
                          <div className="text-gray-500 text-xs">
                            {item.jenis_produk}
                          </div>
                          <div className="text-pink-600 font-semibold">
                            Rp {item.harga?.toLocaleString("id-ID") || "-"}
                          </div>
                        </div>
                        <ArrowRight className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 opacity-0 group-hover:opacity-100 transition" />
                      </Link>
                    ))}
                  </ul>
                  {/* Desktop */}
                  <div className="hidden sm:flex flex-col flex-1">
                    <ul className="space-y-5 flex-1">
                      {results.slice(0, 5).map((item) => (
                        <Link
                          to={`/product/${item.id}`}
                          key={item.id}
                          onClick={onClose}
                          className="flex items-center gap-3 p-2 border rounded hover:bg-gray-100 cursor-pointer group relative"
                        >
                          {" "}
                          <img
                            src={item.foto || "/placeholder.png"}
                            alt={item.nama}
                            className="w-25 h-25 object-cover rounded-md border"
                          />
                          <div className="flex flex-col">
                            <div className="font-medium text-[20px]">
                              {item.nama}
                            </div>
                            <div className="text-gray-500">
                              {item.jenis_produk}
                            </div>
                            <div className="text-pink-600 font-semibold text-[17px]">
                              Rp {item.harga?.toLocaleString("id-ID") || "-"}
                            </div>
                          </div>
                          <ArrowRight className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 opacity-0 group-hover:opacity-100 transition" />
                        </Link>
                      ))}
                    </ul>
                    {results.length > 0 && (
                      <div className="mt-4 text-center">
                        <Link
                          to="/search"
                          state={{ query }}
                          onClick={onClose}
                          className="inline-flex items-center gap-2 px-10 py-5 text-sm font-medium text-xl text-blue-600 bg-blue-50 border border-blue-200 rounded-full shadow-sm hover:bg-blue-100 hover:text-blue-700 hover:scale-105 transition duration-300 ease-in-out"
                        >
                          <span>Lihat hasil lainnya</span>
                          <motion.div
                            initial={{ x: 0 }}
                            animate={{ x: [0, 5, 0] }}
                            transition={{
                              duration: 1,
                              repeat: Infinity,
                              ease: "easeInOut",
                            }}
                          >
                            <ArrowRight className="w-4 h-4" />
                          </motion.div>
                        </Link>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="text-gray-500 text-center">Tidak ada hasil</div>
              )
            ) : (
              <div className="text-gray-400 text-center italic">
                Ketik untuk mencari produk...
              </div>
            )}
          </div>
        </div>
      </MotionDiv>
    </>
  );
}
