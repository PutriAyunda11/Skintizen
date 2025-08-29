import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Eye } from "lucide-react";
import DetailProduct from "../components/DetailProduct";

const randomIds = [44, 18, 14, 28, 33];

export default function Home() {
  const [_skintiz, setSkintiz] = useState([]);
  useEffect(() => {
    const storedData = localStorage.getItem("skintiz");
    if (storedData) {
      setSkintiz(JSON.parse(storedData));
    } else {
      fetch("/data.json")
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to fetch data");
          }
          return response.json();
        })
        .then((data) => {
          setSkintiz(data);
          localStorage.setItem("skintiz", JSON.stringify(data));
          console.log("Data disimpan:", data);
        })
        .catch((error) => console.error("Gagal fetch data.json:", error));
    }
  }, []);

  const [bestSellers, setBestSellers] = useState([]);
  useEffect(() => {
    const storedData = localStorage.getItem("skintiz");
    if (storedData) {
      const products = JSON.parse(storedData);

      const filtered = products.filter((p) => p.jumlah_terjual >= 80000);
      setBestSellers(filtered);
    }
  }, []);

  const [itemsPerPage, setItemsPerPage] = useState(7);
  useEffect(() => {
    const updateItemsPerPage = () => {
      if (window.innerWidth < 640) {
        setItemsPerPage(2);
      } else if (window.innerWidth < 1024) {
        setItemsPerPage(3);
      } else if (window.innerWidth < 1300) {
        setItemsPerPage(5);
      } else {
        setItemsPerPage(7);
      }
    };

    updateItemsPerPage();
    window.addEventListener("resize", updateItemsPerPage);
    return () => window.removeEventListener("resize", updateItemsPerPage);
  }, []);

  const [currentIndex, setCurrentIndex] = useState(0);
  const selectedProducts = bestSellers.slice(
    currentIndex,
    currentIndex + itemsPerPage
  );

  const totalPages = Math.max(bestSellers.length - itemsPerPage + 1, 1);
  const prevSlide = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };
  const nextSlide = () => {
    setCurrentIndex((prev) =>
      Math.min(prev + 1, bestSellers.length - itemsPerPage)
    );
  };

  // Data video
  const [productSkin, setProductSkin] = useState([]);
  const videoFiles = [
    "/videos/vid10.mp4",
    "/videos/vid7.mp4",
    "/videos/vid9.mp4",
    "/videos/vid6.mp4",
    "/videos/vid8.mp4",
  ];
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("skintiz")) || [];
    const filtered = stored.filter((item) => randomIds.includes(item.id));
    setProductSkin(filtered);
  }, []);

  const [openDetail, setOpenDetail] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleOpenDetail = (product) => {
    setSelectedProduct(product);
    setOpenDetail(true);
  };
  return (
    <>
      <div className="relative w-full h-screen">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute top-0 left-0 w-full h-full object-cover"
        >
          <source src="/videos/vid5.mp4" media="(max-width: 1024px)" />
          <source src="/videos/lanscape.mp4" />
        </video>
        <div className="absolute inset-0 flex items-end justify-center pb-16">
          <Link
            to="/all-product"
            className="bg-blue-500 text-white px-3 py-2 rounded-2xl text-sm sm:text-lg font-semibold hover:bg-blue-300 transition"
          >
            Belanja Sekarang
          </Link>
        </div>
      </div>

      <h1 className="text-2xl md:text-3xl font-bold mt-8 text-center">
        Best Sellers
      </h1>

      {/* Mobile (HP)*/}
      <div className="flex sm:hidden gap-4 overflow-x-auto scrollbar-hide">
        {bestSellers.map((product) => (
          <div
            key={product.id}
            className="flex-shrink-0 p-4 bg-white shadow rounded-lg flex flex-col justify-between items-center w-40 h-60"
          >
            <div className="flex flex-col items-center">
              <img
                src={product.foto}
                alt={product.nama}
                className="w-24 h-24 object-cover mb-3 rounded-lg"
              />
              <h3 className="text-xs font-semibold text-center">
                {product.nama}
              </h3>
            </div>
            <button
              className="mt-auto w-full px-3 py-1.5 text-sm bg-blue-500 text-white rounded-lg 
             hover:bg-blue-400 transition flex items-center justify-center gap-2"
              onClick={() => alert(`Quick View: ${product.nama}`)}
            >
              <Eye size={16} />
              Lihat Detail
            </button>
          </div>
        ))}
      </div>

      {/* Tablet & Desktop*/}
      <div className="hidden sm:flex flex-col items-center">
        <div className="flex items-center justify-center">
          <button
            onClick={prevSlide}
            disabled={currentIndex === 0}
            className="p-2 bg-gray-200 rounded-full mr-3 disabled:opacity-50"
          >
            <ChevronLeft
              className={currentIndex === 0 ? "text-gray-400" : "text-black"}
            />
          </button>

          <div className="flex gap-6 overflow-hidden">
            {selectedProducts.map((product) => (
              <div
                key={product.id}
                className="p-4 bg-white shadow rounded-lg flex flex-col items-center 
          w-44 md:w-43 h-90"
              >
                <img
                  src={product.foto}
                  alt={product.nama}
                  className="w-28 md:w-32 h-28 md:h-32 object-cover mb-3 rounded-lg"
                />
                <div className="flex-grow flex flex-col items-center">
                  <h3 className="text-sm md:text-lg font-semibold text-center line-clamp-2">
                    {product.nama}
                  </h3>
                  <p className="text-gray-800 text-sm md:text-base">
                    Harga: Rp {product.harga.toLocaleString()}
                  </p>
                  <p className="text-gray-800 text-sm md:text-base">
                    Terjual: {product.jumlah_terjual}
                  </p>
                </div>
                <button
                  className="mt-auto w-full px-3 py-1.5 text-sm bg-blue-500 text-white rounded-lg 
             hover:bg-blue-400 transition flex items-center justify-center gap-2"
                  onClick={() => handleOpenDetail(product)}
                >
                  <Eye size={16} />
                  Lihat Detail
                </button>
                                <DetailProduct
                  isOpen={openDetail}
                  onClose={() => setOpenDetail(false)}
                  product={bestSellers}
                  addToCart={(p, size, shade) =>
                    console.log("Tambah ke keranjang:", p, size, shade)
                  }
                />

              </div>
            ))}
          </div>

          <button
            onClick={nextSlide}
            disabled={currentIndex >= bestSellers.length - itemsPerPage}
            className="p-2 bg-gray-200 rounded-full ml-3 disabled:opacity-50"
          >
            <ChevronRight
              className={
                currentIndex >= bestSellers.length - itemsPerPage
                  ? "text-gray-400"
                  : "text-black"
              }
            />
          </button>
        </div>

        {/* Pagination*/}
        <div className="flex justify-center mt-4 gap-3">
          {Array.from({ length: totalPages }).map((_, index) => (
            <span
              key={index}
              className={`w-3 h-3 rounded-full transition-all duration-100 ${
                index === currentIndex
                  ? "bg-white border border-black/30 scale-125"
                  : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      </div>

      <h1 className="text-2xl md:text-3xl font-bold mt-8 text-center">
        Produk Favorit
      </h1>

      <div className="px-4 py-6">
        <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory">
          {productSkin.map((product, index) => (
            <div
              key={product.id}
              className="flex-shrink-0 snap-center flex flex-col rounded-lg overflow-hidden bg-white shadow
                   w-[85%] sm:w-[45%] md:w-[45%] lg:w-[calc(20%-1rem)] min-h-[450px] md:min-h-[500px]"
            >
              <div className="aspect-[9/16] bg-black">
                <video
                  controls
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-contain"
                >
                  <source
                    src={videoFiles[index % videoFiles.length]}
                    type="video/mp4"
                  />
                </video>
              </div>

              <div className="p-2 text-center flex-grow flex flex-col justify-between">
                <div>
                  <h2 className="text-sm sm:text-[10px] md:text-xl font-semibold line-clamp-2">
                    {product.nama}
                  </h2>
                  <p className="hidden md:block text-xs md:text-[15px] text-gray-600 mt-1">
                    Harga: Rp {product.harga}
                  </p>
                  <p className="hidden md:block text-xs md:text-[15px] text-gray-600 mt-1 mb-4">
                    Terjual: {product.jumlah_terjual}
                  </p>
                </div>

                <button
                  className="mt-2 px-4 py-1.5 text-sm bg-blue-500 text-white rounded-lg 
                       hover:bg-blue-400 transition flex items-center justify-center gap-2 
                       w-fit mx-auto mb-2"
                  onClick={() => handleOpenDetail(product)}
                >
                  <Eye size={16} />
                  Lihat Detail
                </button>
                <DetailProduct
                  isOpen={openDetail}
                  onClose={() => setOpenDetail(false)}
                  product={selectedProduct}
                  addToCart={(p, size, shade) =>
                    console.log("Tambah ke keranjang:", p, size, shade)
                  }
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="w-full max-w-6xl mx-auto flex flex-col lg:flex-row gap-6 lg:gap-16 mt-15">
        <div className="relative w-full lg:w-1/1 lg:pr-2">
          <img
            src="/photo/setBiru.jpg"
            alt="Repair Barrier Set Blue"
            className="w-full h-auto object-cover rounded-lg"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white bg-black/40 p-4 lg:hidden">
            <h2 className="text-xl font-bold">REPAIR BARIER SET BLUE</h2>
            <p className="text-40px mt-1 font-semibold">
              Menenangkan Kulit Sensitive
            </p>
            <p className="text-40px font-semibold">Meredakan Kemerahan</p>
          </div>
        </div>

        <div className="hidden lg:flex lg:flex-col lg:w-1/2 lg:justify-center lg:pl-20">
          <div className="flex flex-col justify-center h-full">
            <h2 className="text-2xl font-bold mb-4">REPAIR BARIER SET BLUE</h2>
            <p className="text-base mb-2 ">Menenangkan Kulit Sensitive</p>
            <p className="text-base">Meredakan Kemerahan</p>
          </div>
        </div>
      </div>

      <div className="w-full max-w-6xl mx-auto flex flex-col lg:flex-row-reverse gap-6 lg:gap-16 mt-5 lg:mt-15">
        <div className="relative w-full lg:w-1/2 lg:pl-2">
          <img
            src="/photo/setPink.jpg"
            alt="GLOWING SET PINK"
            className="w-full h-auto object-cover rounded-lg"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white bg-black/40 p-4 lg:hidden">
            <h2 className="text-xl font-bold">GLOWING SET PINK</h2>
            <p className="text-40px mt-1 font-semibold">
              Kulit Bersih dan Segar Terhidrasi
            </p>
            <p className="text-40px font-semibold">Mencerahkan Warna Kulit</p>
          </div>
        </div>
        <div className="hidden lg:flex lg:flex-col lg:w-1/2 lg:justify-center lg:pr-20">
          <div className="flex flex-col justify-center h-full">
            <h2 className="text-2xl font-bold mb-4">GLOWING SET PINK</h2>
            <p className="text-base mb-2">Kulit Bersih dan Segar Terhidrasi</p>
            <p className="text-base">Mencerahkan Warna Kulit</p>
          </div>
        </div>
      </div>
    </>
  );
}
