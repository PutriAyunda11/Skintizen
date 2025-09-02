import { useEffect, useState } from "react";
import HeaderUser from "../components/HeaderUser";
import { motion } from "motion/react";
import { X, ArrowRight } from "lucide-react";

const MotionDiv = motion.div;

export default function Riwayat() {
  const [riwayat, setRiwayat] = useState([]);
  const [message, setMessage] = useState("");
  const [selectedRiwayat, setSelectedRiwayat] = useState(null);

  useEffect(() => {
    const riwayatData = localStorage.getItem("riwayat");
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

    if (!riwayatData) {
      setMessage("Riwayat pemesanan belum ada!");
      return;
    }

    if (!currentUser || !isLoggedIn) {
      setMessage("Anda belum login!");
      return;
    }

    const parsedRiwayat = JSON.parse(riwayatData);

    const filtered = parsedRiwayat.filter(
      (item) =>
        item.namaUser === currentUser.nama &&
        item.emailUser === currentUser.email
    );

    if (filtered.length === 0) {
      setMessage("Tidak ada riwayat pemesanan");
      setRiwayat([]);
    } else {
      setRiwayat(filtered);
      setMessage("");
    }
  }, []);

  return (
    <div className="mt-14 md:mt-26 min-h-[80vh] md:min-h-[60vh] flex flex-col">
      <HeaderUser />
      <h2 className="text-3xl font-bold text-center mb-4 py-10">
        Riwayat Pemesanan
      </h2>

      {message && (
        <p className="text-gray-600 text-center font-semibold">{message}</p>
      )}

      {riwayat.length > 0 && (
        <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 md:px-6">
          <ul className="space-y-3">
            {riwayat.map((item, index) => {
              const isMulti = !!item.produk; // cek apakah multiple produk
              return (
                <li
                  key={index}
                  onClick={() => setSelectedRiwayat({ ...item, index })}
                  className="group border rounded-lg p-4 shadow-sm bg-white hover:shadow-md hover:bg-gray-50 hover:scale-[1.01] active:scale-[0.98] transition cursor-pointer"
                >
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                    <div>
                      {isMulti ? (
                        <p className="font-semibold text-base md:text-lg">
                          Riwayat Pesanan ({item.produk.length} produk)
                        </p>
                      ) : (
                        <>
                          <p className="font-semibold text-base md:text-lg">
                            Produk: {item.nama}
                          </p>
                          <p className="text-sm text-gray-600">
                            {item.kuantitas}x
                          </p>
                        </>
                      )}
                    </div>

                    <div className="flex items-center gap-1 text-blue-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200 mt-2 sm:mt-0">
                      <span>Lihat detail</span>
                      <ArrowRight size={16} />
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* Sidebar Detail Riwayat */}
      {selectedRiwayat && (
        <>
          <MotionDiv
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-[60]"
            onClick={() => setSelectedRiwayat(null)}
          />

          <MotionDiv
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="fixed top-0 left-0 h-full w-full sm:w-2/3 lg:w-1/3 bg-white z-[70] shadow-xl flex flex-col overflow-y-auto"
          >
            {/* Header */}
            <div className="relative flex items-center justify-center p-6 border-b">
              <h2 className="text-base md:text-lg lg:text-xl font-semibold text-center">
                Detail Riwayat
              </h2>
              <button
                onClick={() => setSelectedRiwayat(null)}
                className="absolute right-4 p-2 rounded-full hover:bg-gray-200"
              >
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <div className="flex flex-col flex-1 p-4 space-y-4">
              {/* Produk */}
              {selectedRiwayat.produk ? (
                <div className="space-y-4">
                  {selectedRiwayat.produk.map((p, i) => (
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
                <div className="flex flex-col items-center text-center">
                  <img
                    src={selectedRiwayat.foto || "/placeholder.png"}
                    alt={selectedRiwayat.nama}
                    className="w-full max-w-xs sm:max-w-sm h-64 object-cover rounded-lg shadow"
                  />
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold mt-4">
                    {selectedRiwayat.nama}
                  </h3>
                  <p className="text-gray-600 text-sm sm:text-base">
                    Kuantitas: {selectedRiwayat.kuantitas}x
                  </p>
                </div>
              )}

              {/* Detail Transaksi */}
              <div className="space-y-2 text-sm">
                <p>
                  Metode Bayar:{" "}
                  <span className="font-semibold">
                    {selectedRiwayat.metodeBayar}
                  </span>
                </p>
                <p>
                  Status:{" "}
                  <span className="font-semibold">
                    {selectedRiwayat.statusPesanan}
                  </span>
                </p>
                <p>
                  Alamat:{" "}
                  <span className="font-semibold">
                    {selectedRiwayat.alamat?.nama},{" "}
                    {selectedRiwayat.alamat?.nomorTelepon},{" "}
                    {selectedRiwayat.alamat?.provinsi},{" "}
                    {selectedRiwayat.alamat?.kota},{" "}
                    {selectedRiwayat.alamat?.kecamatan},{" "}
                    {selectedRiwayat.alamat?.alamatLengkap},{" "}
                    {selectedRiwayat.alamat?.detail}
                  </span>
                </p>
                <p>Tanggal Pesan: {selectedRiwayat.tanggalPesan}</p>
                <p>Tanggal Selesai: {selectedRiwayat.tanggalSelesai}</p>
                <p>
                  Subtotal: Rp
                  {selectedRiwayat.subtotal?.toLocaleString("id-ID")}
                </p>
                <p>
                  Ongkir: Rp{selectedRiwayat.ongkir?.toLocaleString("id-ID")}
                </p>
                <p className="font-bold text-lg sm:text-xl md:text-2xl">
                  Total: Rp{selectedRiwayat.total?.toLocaleString("id-ID")}
                </p>
              </div>
            </div>
          </MotionDiv>
        </>
      )}
    </div>
  );
}
