import { motion } from "motion/react";
import { X } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const MotionDiv = motion.div;

export default function DetailProduct({
  isOpen,
  onClose,
  product,
  overlayOpacity = "bg-black/30",
}) {
  const [selectedShade, setSelectedShade] = useState(null);
  // const [selectedSize, _setSelectedSize] = useState(null);
  const [kuantitas, setKuantitas] = useState(1);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupType, setPopupType] = useState("error");
  const navigate = useNavigate();

  if (!product) return null;

  const handleKuantitasChange = (type) => {
    setKuantitas((prev) => {
      if (type === "inc") return prev + 1;
      if (type === "dec") return prev > 1 ? prev - 1 : 1;
      return prev;
    });
  };

  const handleAddToCart = () => {
    const isLoggedIn = JSON.parse(localStorage.getItem("isLoggedIn"));
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    if (!isLoggedIn || !currentUser) {
      setPopupMessage("Silakan login terlebih dahulu!");
      setPopupType("error");
      setShowPopup(true);
      return;
    }

    if (product.stok === 0) {
      setPopupMessage(
        "Stok produk habis! Tidak bisa menambahkan ke keranjang."
      );
      setPopupType("error");
      setShowPopup(true);
      return;
    }

    // Produk punya shade wajib pilih
    if (
      Array.isArray(product.shade) &&
      product.shade.length > 0 &&
      !selectedShade
    ) {
      setPopupMessage("Silakan pilih shade terlebih dahulu!");
      setPopupType("error");
      setShowPopup(true);
      return;
    }

    const keranjang = JSON.parse(localStorage.getItem("keranjang")) || [];

    // Cek apakah ada item dengan kombinasi id + shade + size + user yang sama
    const existingIndex = keranjang.findIndex(
      (k) =>
        k.id === product.id &&
        k.namaUser === currentUser.nama &&
        k.emailUser === currentUser.email &&
        k.shade === (selectedShade || null)
        // && k.size === (selectedSize || null)
    );

    if (existingIndex === -1) {
      // Kombinasi baru → buat entry baru
      keranjang.push({
        ...product,
        kuantitas: kuantitas,
        subtotal: product.harga * kuantitas,
        namaUser: currentUser.nama,
        emailUser: currentUser.email,
        shade: selectedShade || null,
        // size: selectedSize || null,
      });
    } else {
      // Kombinasi sama → update kuantitas & subtotal
      keranjang[existingIndex].kuantitas += kuantitas;
      keranjang[existingIndex].subtotal =
        keranjang[existingIndex].kuantitas * product.harga;
    }

    localStorage.setItem("keranjang", JSON.stringify(keranjang));

    setPopupMessage(`Produk berhasil ditambahkan ke keranjang!`);
    setPopupType("success");
    setShowPopup(true);
  };

  const handleBuyNow = () => {
    const isLoggedIn = JSON.parse(localStorage.getItem("isLoggedIn"));
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    if (!isLoggedIn || !currentUser) {
      setPopupMessage("Silakan login terlebih dahulu!");
      setPopupType("error");
      setShowPopup(true);
      return;
    }

    if (product.stok === 0 || product.stok=== null) {
      setPopupMessage("Stok produk habis! Tidak bisa melakukan pesanan.");
      setPopupType("error");
      setShowPopup(true);
      return;
    }

    // kalau produk punya shade wajib pilih
    if (
      Array.isArray(product.shade) &&
      product.shade.length > 0 &&
      !selectedShade
    ) {
      setPopupMessage("Silakan pilih shade terlebih dahulu!");
      setPopupType("error");
      setShowPopup(true);
      return;
    }

    const orderData = {
      id: product.id,
      nama: product.nama,
      foto: product.foto,
      harga: product.harga,
      kuantitas: kuantitas,
      subtotal: product.harga * kuantitas,
      shade: selectedShade || null,
    };
    navigate("/beli-product", { state: { orderData } });
    onClose();
  };

  const handleGoToDetailPage = () => {
    navigate(`/product/${product.id}`);
    onClose();
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

          {/* Kuantitas */}
          <div className="flex flex-col gap-2">
            <h4 className="font-medium text-left">Kuantitas:</h4>
            <div className="flex items-center border rounded-lg w-fit">
              <button
                onClick={() => handleKuantitasChange("dec")}
                className="px-3 py-1 text-lg rounded-lg hover:bg-gray-200"
              >
                -
              </button>
              <span className="px-4">{kuantitas}</span>
              <button
                onClick={() => handleKuantitasChange("inc")}
                disabled={product.stok === 0 || kuantitas >= product.stok || product.stok === null}
                className={`px-3 py-1 text-lg rounded-lg hover:bg-gray-200 ${
                  product.stok === 0 || kuantitas >= product.stok
                    ? "cursor-not-allowed bg-gray-200 hover:bg-gray-200"
                    : ""
                }`}
              >
                +
              </button>
            </div>
            {product.stok !== 0 && kuantitas >= product.stok || product.stok == null && (
              <span className="text-xs text-red-500 mt-1">
                Maksimum stok tercapai
              </span>
            )}
          </div>

          {/* Buttons */}
          <div className="mt-0 flex flex-col gap-3">
            <button
              onClick={handleAddToCart}
              disabled={product.stok === 0}
              className={`w-full font-semibold py-2 rounded-lg transition ${
                product.stok === 0
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-500 hover:bg-green-600 text-white"
              }`}
            >
              Tambah ke Keranjang
            </button>

            <button
              onClick={handleBuyNow}
              disabled={product.stok === 0}
              className={`w-full font-semibold py-2 rounded-lg transition ${
                product.stok === 0
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600 text-white"
              }`}
            >
              Buat Pesanan
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
        {/* Popup */}
        {showPopup && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-[80]">
            <div
              className={`bg-white rounded-xl shadow-lg p-6 w-80 text-center border-t-4 ${
                popupType === "error" ? "border-red-500" : "border-blue-500"
              }`}
            >
              <p
                className={`text-base font-semibold mb-4 ${
                  popupType === "error" ? "text-red-600" : "text-blue-600"
                }`}
              >
                {popupMessage}
              </p>
              <button
                onClick={() => setShowPopup(false)}
                className="mt-2 bg-blue-500 hover:bg-blue-400 text-white px-4 py-2 rounded-lg transition"
              >
                OK
              </button>
            </div>
          </div>
        )}
      </MotionDiv>
    </>
  );
}
