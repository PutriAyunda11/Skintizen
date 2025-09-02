import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Product() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedShade, setSelectedShade] = useState(null);
  const [kuantitas, setKuantitas] = useState(1);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupType, setPopupType] = useState("error");
  const navigate = useNavigate();

  useEffect(() => {
    const data = localStorage.getItem("skintiz");
    if (data) {
      const parsed = JSON.parse(data);
      const found = parsed.find((item) => String(item.id) === String(id));
      setProduct(found);
    }
  }, [id]);

  if (!product) {
    return (
      <div className="p-6 text-center text-gray-500">
        Produk tidak ditemukan
      </div>
    );
  }

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

    const existingIndex = keranjang.findIndex(
      (k) =>
        k.id === product.id &&
        k.namaUser === currentUser.nama &&
        k.emailUser === currentUser.email &&
        k.shade === (selectedShade || null)
    );

    if (existingIndex === -1) {
      keranjang.push({
        ...product,
        kuantitas: kuantitas,
        subtotal: product.harga * kuantitas,
        namaUser: currentUser.nama,
        emailUser: currentUser.email,
        shade: selectedShade || null,
      });
    } else {
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

    if (product.stok === 0) {
      setPopupMessage("Stok produk habis! Tidak bisa melakukan pesanan.");
      setPopupType("error");
      setShowPopup(true);
      return;
    }

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
      subtotal: product.harga,
      kuantitas: kuantitas,
      shade: selectedShade || null,
    };

    navigate("/beli-product", { state: { orderData } });
  };

  return (
    <div className="pt-28 sm:pt-32 lg:pt-40 max-w-6xl mx-auto px-4">
      <div className="flex flex-col lg:flex-row gap-10">
        <div className="flex-1 flex justify-center">
          <img
            src={product.foto || "/placeholder.png"}
            alt={product.nama}
            className="w-full max-w-sm sm:max-w-md lg:max-w-lg object-cover rounded-xl shadow-lg"
          />
        </div>

        <div className="flex-1 flex flex-col gap-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">{product.nama}</h1>
            <p className="text-gray-500 mt-5">
              Kategori: {product.jenis_produk}
            </p>
            <p className="text-gray-800 mt-1">
              Stok: {product.stok ?? "Tidak tersedia"}
            </p>
            <p className="text-pink-600 text-xl sm:text-2xl font-semibold mt-1">
              Rp {product.harga?.toLocaleString("id-ID")}
            </p>
          </div>

          {product.deskripsi && (
            <p className="text-gray-700 leading-relaxed text-justify">
              {product.deskripsi}
            </p>
          )}

          {Array.isArray(product.shade) && product.shade.length > 0 && (
            <div className="flex flex-col gap-2">
              <h4 className="font-medium">Pilih Shade:</h4>
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
                disabled={product.stok === 0 || kuantitas >= product.stok}
                className={`px-3 py-1 text-lg rounded-lg hover:bg-gray-200 ${
                  product.stok === 0 || kuantitas >= product.stok
                    ? "cursor-not-allowed bg-gray-200 hover:bg-gray-200"
                    : ""
                }`}
              >
                +
              </button>
            </div>
            {product.stok !== 0 && kuantitas >= product.stok && (
              <span className="text-xs text-red-500 mt-1">
                Maksimum stok tercapai
              </span>
            )}
          </div>

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
          </div>
        </div>
      </div>

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
    </div>
  );
}
