import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Product() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedShade, setSelectedShade] = useState(null);
  const [quantity, setQuantity] = useState(1);

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

  const handleQuantityChange = (type) => {
    setQuantity((prev) => {
      if (type === "inc") return prev + 1;
      if (type === "dec") return prev > 1 ? prev - 1 : 1;
      return prev;
    });
  };

  const handleAddToCart = () => {
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

  return (
    <div className="pt-28 sm:pt-32 lg:pt-40 max-w-6xl mx-auto px-4">
      {/* Layout Foto + Info */}
      <div className="flex flex-col lg:flex-row gap-10">
        {/* Foto */}
        <div className="flex-1 flex justify-center">
          <img
            src={product.foto || "/placeholder.png"}
            alt={product.nama}
            className="w-full max-w-sm sm:max-w-md lg:max-w-lg object-cover rounded-xl shadow-lg"
          />
        </div>

        {/* Info */}
        <div className="flex-1 flex flex-col gap-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">{product.nama}</h1>
            <p className="text-gray-500 mt-5">Kategori: {product.jenis_produk}</p>
            <p className="text-gray-800 mt-1">
              Stok: {product.stok ?? "Tidak tersedia"}
            </p>
            <p className="text-pink-600 text-xl sm:text-2xl font-semibold mt-1">
              Rp {product.harga?.toLocaleString("id-ID")}
            </p>
          </div>

          {/* Deskripsi */}
          {product.deskripsi && (
            <p className="text-gray-700 leading-relaxed text-justify">
              {product.deskripsi}
            </p>
          )}

          {/* Shade */}
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

          {/* Quantity */}
          <div className="flex flex-col gap-2">
            <h4 className="font-medium">Kuantitas:</h4>
            <div className="flex items-center border rounded-lg w-fit">
              <button
                onClick={() => handleQuantityChange("dec")}
                className="px-3 py-1 text-lg hover:bg-gray-200"
              >
                -
              </button>
              <span className="px-4">{quantity}</span>
              <button
                onClick={() => handleQuantityChange("inc")}
                className="px-3 py-1 text-lg hover:bg-gray-200"
              >
                +
              </button>
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-4 flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleAddToCart}
              className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-lg transition"
            >
              Tambah ke Keranjang
            </button>
            <button
              onClick={handleBuyNow}
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition"
            >
              Pesan Sekarang
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
