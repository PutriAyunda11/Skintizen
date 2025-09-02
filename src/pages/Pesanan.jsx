import HeaderUser from "../components/HeaderUser";
import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { X } from "lucide-react";

const MotionDiv = motion.div;

export default function Pesanan() {
  const [pesanan, setPesanan] = useState([]);
  const [selectedPesanan, setSelectedPesanan] = useState(null);
  const [showPaymentPopup, setShowPaymentPopup] = useState(null);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showCompletePopup, setShowCompletePopup] = useState(null);
  const location = useLocation();
  

  useEffect(() => {
    const storedPesanan = JSON.parse(localStorage.getItem("pesanan")) || [];
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    if (currentUser) {
      // filter hanya pesanan milik user login
      const filtered = storedPesanan.filter(
        (p) =>
          p.namaUser === currentUser.nama && p.emailUser === currentUser.email
      );
      setPesanan(filtered);
    } else {
      setPesanan([]);
    }
  }, [location.state]);

  // update status pembayaran jadi "Selesai"
  const updatePembayaran = (id) => {
    const updated = pesanan.map((p, i) =>
      i === id ? { ...p, statusPembayaran: "Selesai" } : p
    );
    setPesanan(updated);
    localStorage.setItem("pesanan", JSON.stringify(updated));
  };

  // pindahkan ke riwayat & hapus dari pesanan
  const completePesanan = (id) => {
    const pesananDipilih = pesanan[id];
    if (!pesananDipilih) return;

    const riwayat = JSON.parse(localStorage.getItem("riwayat")) || [];

    const newRiwayatItem = {
      ...pesananDipilih,
      statusPesanan: "Selesai",
      tanggalSelesai: new Date().toLocaleString("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    const updatedRiwayat = [...riwayat, newRiwayatItem];
    localStorage.setItem("riwayat", JSON.stringify(updatedRiwayat));

    // hapus dari pesanan
    const updatedPesanan = pesanan.filter((_, i) => i !== id);
    setPesanan(updatedPesanan);
    localStorage.setItem("pesanan", JSON.stringify(updatedPesanan));
  };

  return (
    <>
      <div className="mt-12 md:mt-26 min-h-[80vh] md:min-h-[60vh] flex flex-col">
        <HeaderUser />
        <h2 className="text-2xl md:text-3xl font-bold text-center pt-10">
          Pesanan Anda
        </h2>

        <div className="flex-1 flex flex-col items-center mt-6">
          {pesanan.length === 0 ? (
            <div className="text-center">
              <p className="font-semibold md:mb-6 text-gray-600">
                Anda belum memiliki pemesanan
              </p>
              <Link
                to="/all-product"
                className="mt-6 inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Pesan Sekarang
              </Link>
            </div>
          ) : (
            <div className="w-full max-w-3xl space-y-2 px-4 sm:px-6 md:px-6">
              {pesanan.map((item, index) => {
                const isMulti = !!item.produk; // cek apakah multiple produk
                return (
                  <div
                    key={index}
                    onClick={() => setSelectedPesanan({ ...item, index })}
                    className="flex items-center justify-between p-4 border rounded-lg shadow-md bg-white 
                   hover:shadow-md hover:bg-gray-50 hover:scale-[1.01] active:scale-[0.98]
                   transition-all duration-200 cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      {isMulti ? (
                        <div className="flex -space-x-2">
                          {item.produk.slice(0, 2).map((p, i) => (
                            <img
                              key={i}
                              src={p.foto || "/placeholder.png"}
                              alt={p.nama}
                              className="w-12 h-12 object-cover rounded-lg shadow border"
                            />
                          ))}
                          {item.produk.length > 2 && (
                            <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-gray-200 text-xs">
                              +{item.produk.length - 2}
                            </div>
                          )}
                        </div>
                      ) : (
                        <img
                          src={item.foto || "/placeholder.png"}
                          alt={item.nama}
                          className="w-16 h-16 object-cover rounded-lg shadow"
                        />
                      )}

                      <div>
                        {isMulti ? (
                          <>
                            <p className="font-semibold">Pesanan ({item.produk.length} produk)</p>
                          </>
                        ) : (
                          <>
                            <p className="font-semibold">{item.nama}</p>
                            <p className="text-gray-600">{item.kuantitas}x</p>
                          </>
                        )}
                        <p className="text-blue-600">
                          Rp{item.total?.toLocaleString("id-ID")}
                        </p>
                      </div>
                    </div>
                    <div className="text-sm font-medium text-gray-500">
                      {item.statusPembayaran}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Sidebar Detail Pesanan */}
      {selectedPesanan && (
        <>
          <MotionDiv
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-[60]"
            onClick={() => setSelectedPesanan(null)}
          />

          <MotionDiv
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="fixed top-0 left-0 h-full w-full sm:w-2/3 lg:w-1/3 bg-white z-[70] shadow-xl flex flex-col overflow-y-auto"
          >
            <div className="relative flex items-center justify-center p-6 border-b">
              <h2 className="text-base md:text-lg lg:text-xl font-semibold text-center">
                Detail Pesanan
              </h2>
              <button
                onClick={() => setSelectedPesanan(null)}
                className="absolute right-4 p-2 rounded-full hover:bg-gray-200"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex flex-col flex-1">
              {/* Produk */}
              {selectedPesanan.produk ? (
                <div className="p-4 space-y-4">
                  {selectedPesanan.produk.map((p, i) => (
                    <div key={i} className="flex gap-4 items-center">
                      <img
                        src={p.foto || "/placeholder.png"}
                        alt={p.nama}
                        className="w-20 h-20 object-cover rounded-lg shadow"
                      />
                      <div>
                        <p className="font-semibold">{p.nama}</p>
                        <p className="text-gray-600">
                          Rp{p.subtotal?.toLocaleString("id-ID")}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 flex gap-4 items-center">
                  <img
                    src={selectedPesanan.foto || "/placeholder.png"}
                    alt={selectedPesanan.nama}
                    className="w-24 h-24 object-cover rounded-lg shadow"
                  />
                  <div>
                    <p className="font-semibold">{selectedPesanan.nama}</p>
                    <p className="text-gray-600">{selectedPesanan.kuantitas}x</p>
                  </div>
                </div>
              )}

              {/* Harga */}
              <div className="p-6 space-y-2 text-sm">
                <p>
                  Subtotal: Rp
                  {selectedPesanan.subtotal?.toLocaleString("id-ID")}
                </p>
                <p>
                  Ongkir: Rp{selectedPesanan.ongkir?.toLocaleString("id-ID")}
                </p>
                <p className="font-bold text-lg">
                  Total: Rp{selectedPesanan.total?.toLocaleString("id-ID")}
                </p>
              </div>

              {/* Button */}
              <div className="p-6 mt-auto">
                {selectedPesanan.statusPembayaran === "Belum Selesai" ? (
                  <button
                    className="w-full px-5 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                    onClick={() => {
                      setSelectedPesanan(null);
                      setShowPaymentPopup(selectedPesanan);
                    }}
                  >
                    Bayar Sekarang
                  </button>
                ) : (
                  <button
                    className="w-full px-5 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                    onClick={() => {
                      setSelectedPesanan(null);
                      setShowCompletePopup(selectedPesanan);
                    }}
                  >
                    Pesanan Selesai
                  </button>
                )}
              </div>
            </div>
          </MotionDiv>
        </>
      )}

      {/* Popup kode pembayaran */}
      {showPaymentPopup && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[80]">
          <div className="bg-white w-96 max-w-full rounded-2xl shadow-xl p-6 relative">
            <button
              onClick={() => setShowPaymentPopup(null)}
              className="absolute top-3 right-3 text-gray-600 hover:text-black"
            >
              <X />
            </button>

            <h3 className="text-lg font-bold mb-4">Kode Pembayaran</h3>
            <p className="text-center text-xl font-mono tracking-widest mb-6">
              {showPaymentPopup.kodePembayaran}
            </p>

            <div className="flex gap-4 justify-center">
              <button
                onClick={() => {
                  updatePembayaran(showPaymentPopup.index);
                  setShowPaymentPopup(null);
                  setShowSuccessPopup(true);
                }}
                className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                Selesai
              </button>
              <button
                onClick={() => setShowPaymentPopup(null)}
                className="px-5 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition"
              >
                Kembali
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Popup pembayaran berhasil */}
      {showSuccessPopup && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[90]">
          <div className="bg-white w-80 max-w-full rounded-2xl shadow-xl p-6 text-center relative">
            <h3 className="text-lg font-bold mb-4 text-blue-600">
              Pembayaran Berhasil
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              Status pesanan Anda sudah diperbarui.
            </p>
            <button
              onClick={() => setShowSuccessPopup(false)}
              className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              OK
            </button>
          </div>
        </div>
      )}

      {/* Popup pesanan selesai */}
      {showCompletePopup && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[95]">
          <div className="bg-white w-96 max-w-full rounded-2xl shadow-xl p-6 text-center relative">
            <h3 className="text-lg font-bold mb-4 text-grey-500">
              Pesanan Telah Anda Terima
            </h3>
            <button
              onClick={() => {
                completePesanan(showCompletePopup.index);
                setShowCompletePopup(null);
              }}
              className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </>
  );
}
