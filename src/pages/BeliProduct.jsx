import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function BeliProduct() {
  const location = useLocation();
  const { orderData } = location.state || {};
  const navigate = useNavigate();

  const [alamatList, setAlamatList] = useState([]);
  const [selectedAlamatIndex, setSelectedAlamatIndex] = useState(null);

  const [metodeBayar, setMetodeBayar] = useState("");
  const metodeOptions = ["Bank BRI", "Bank MANDIRI", "Bank BNI", "Bank BCA"];

  const [showDropdown, setShowDropdown] = useState(false);
  const [kodePembayaran, setKodePembayaran] = useState("");

  const [showPesananPopup, setShowPesananPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  useEffect(() => {
    const alamatAll = JSON.parse(localStorage.getItem("alamat")) || [];
    if (currentUser) {
      const alamatUser = alamatAll.filter(
        (item) => item.namaUser === currentUser.nama
      );
      setAlamatList(alamatUser);
    }
  }, []);

  if (!orderData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Data produk tidak ditemukan!</p>
      </div>
    );
  }

  // subtotal & ongkir
  const subtotal = orderData.harga * orderData.kuantitas;
  const getOngkir = () => {
    const provinsi = alamatList[selectedAlamatIndex]?.provinsi || "";
    switch (provinsi) {
      case "Jawa Barat":
        return 7000;
      case "Jawa Tengah":
        return 8000;
      case "Jawa Timur":
        return 9000;
      default:
        return 10000;
    }
  };
  const ongkir = getOngkir();
  const total = subtotal + ongkir;

  // generate kode pembayaran random
  const generateKodePembayaran = () => {
    let kode = "";
    for (let i = 0; i < 15; i++) {
      kode += Math.floor(Math.random() * 10);
    }
    return kode;
  };

  // tombol buat pesanan → tampilkan dropdown kode bayar
  const handleBuatPesanan = () => {
    if (!kodePembayaran) {
      setKodePembayaran(generateKodePembayaran());
    }
    setShowDropdown(true);
  };

// selesai bayar → simpan riwayat → popup
const handleSelesai = () => {
  const data = {
    statusPembayaran: "Selesai",
    statusPesanan: "Belum Selesai",
    message: "Pesanan berhasil! Pembayaran selesai.",
  };
  savePesanan(data);
};

// bayar nanti → simpan riwayat → popup
const handleNanti = () => {
  const data = {
    statusPembayaran: "Belum Selesai",
    statusPesanan: "Belum Selesai",
    message: "Pesanan berhasil, tapi belum dibayar!",
  };
  savePesanan(data);
};

// simpan ke localStorage
const savePesanan = ({ statusPembayaran, statusPesanan, message }) => {
  const riwayat = JSON.parse(localStorage.getItem("pesanan")) || [];
  const dataPesanan = {
    foto: orderData.foto || "/placeholder.png",
    nama: orderData.nama,
    kuantitas: orderData.kuantitas,
    subtotal,
    ongkir,
    total,
    shade: orderData.shade || null,
    metodeBayar,
    alamat: alamatList[selectedAlamatIndex],
    statusPembayaran,
    kodePembayaran,
    statusPesanan,
    namaUser: currentUser?.nama || "Guest",
    tanggalPesan: new Date().toLocaleString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }),

  };

  riwayat.push(dataPesanan);
  localStorage.setItem("pesanan", JSON.stringify(riwayat));

  setShowDropdown(false);
  setPopupMessage(message);
  setShowPesananPopup(true);
};

  // tombol ok di popup
  const handleOk = () => {
    setShowPesananPopup(false);
    navigate("/pesanan");
  };

  return (
    <div className="min-h-screen bg-gray-50 md:bg-gray-50 bg-white">
      {/* Header */}
      <div
        className="w-full bg-white py-8 text-center font-bold text-2xl cursor-pointer"
        onClick={() => navigate("/")}
      >
        SKINTIZEN
      </div>

      {/* Konten utama */}
      <div className="flex flex-col-reverse md:flex-row w-full min-h-[calc(100vh-64px)]">
        {/* Kiri (alamat + metode bayar) */}
        <div className="w-full md:w-1/2 p-6 md:p-10 md:pl-20 flex flex-col gap-6 bg-white md:bg-gray-50">
          {" "}
          {/* Alamat */}
          <div className="flex flex-col gap-2">
            <h4 className="font-medium text-lg">Alamat Pengiriman</h4>
            {alamatList.length === 0 ? (
              <p className="text-gray-500 text-sm">
                Tidak ada alamat tersedia. Tambahkan alamat di profil Anda.
              </p>
            ) : (
              <div className="flex flex-col gap-2">
                {alamatList.map((alamat, index) => (
                  <div
                    key={index}
                    onClick={() => setSelectedAlamatIndex(index)}
                    className={`px-4 py-2 border rounded cursor-pointer ${
                      selectedAlamatIndex === index
                        ? "bg-blue-100 border-blue-400"
                        : "border-gray-300 hover:bg-gray-100"
                    }`}
                  >
                    a.n {alamat.nama} ,{alamat.nomorTelepon}, {alamat.detail},{" "}
                    {alamat.alamatLengkap}, {alamat.kecamatan}, {alamat.kota},{" "}
                    {alamat.provinsi} - {alamat.kodePos}
                  </div>
                ))}
              </div>
            )}
          </div>
          {/* Metode Bayar */}
          <div className="flex flex-col gap-2">
            <h4 className="font-medium text-lg">Metode Pembayaran</h4>
            <div className="flex flex-col gap-2">
              {metodeOptions.map((met, index) => (
                <div
                  key={index}
                  onClick={() => setMetodeBayar(met)}
                  className={`px-4 py-2 border rounded cursor-pointer ${
                    metodeBayar === met
                      ? "bg-blue-100 border-blue-400"
                      : "border-gray-300 hover:bg-gray-100"
                  }`}
                >
                  {met}
                </div>
              ))}
            </div>
            <button
              onClick={handleBuatPesanan}
              disabled={selectedAlamatIndex === null || !metodeBayar}
              className={`mt-4 font-semibold py-3 rounded-2xl ${
                selectedAlamatIndex === null || !metodeBayar
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-red-500 hover:bg-red-600 text-white"
              }`}
            >
              Pesan Sekarang
            </button>
          </div>
        </div>

        {/* Kanan: Ringkasan */}
        <div className="w-full md:w-1/2 p-6 md:p-10 md:pr-20 flex flex-col gap-6 bg-white md:bg-gray-200">
          {" "}
          <div className="flex gap-6">
            <div className="relative">
              <img
                src={orderData.foto || "/placeholder.png"}
                alt={orderData.nama}
                className="w-32 h-32 md:w-50 md:h-50 object-cover rounded-lg"
              />
              <div className="absolute top-1 right-1 bg-gray-600 text-white text-lg font-bold px-3 py-1 rounded-full">
                {orderData.kuantitas}
              </div>
            </div>
            <div className="flex flex-col justify-center gap-2">
              <h3 className="text-lg font-semibold">{orderData.nama}</h3>
              {orderData.shade && (
                <p className="text-gray-600">Shade: {orderData.shade}</p>
              )}
            </div>
          </div>
          <div className="flex justify-between text-md">
            <span>Subtotal:</span>
            <span>Rp {subtotal.toLocaleString("id-ID")}</span>
          </div>
          <div className="flex justify-between text-md">
            <span>Ongkir:</span>
            <span>Rp {ongkir.toLocaleString("id-ID")}</span>
          </div>
          <div className="flex justify-between font-bold text-xl">
            <span>Total:</span>
            <span>Rp {total.toLocaleString("id-ID")}</span>
          </div>
        </div>
      </div>

      {/* Dropdown kode pembayaran */}
      {showDropdown && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-xl w-96 flex flex-col gap-4">
            <h2 className="text-lg font-bold text-center">Kode Pembayaran</h2>
            <p className="text-center text-xl font-mono tracking-widest">
              {kodePembayaran}
            </p>
            <div className="flex gap-4 justify-center mt-4">
              <button
                onClick={handleSelesai}
                className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg"
              >
                Selesai
              </button>
              <button
                onClick={handleNanti}
                className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg"
              >
                Nanti
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Popup pesanan */}
      {showPesananPopup && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-xl w-96 text-center">
            <h2 className="text-lg font-bold">Pesanan Berhasil dibuat!</h2>
            <p className="mt-2 text-gray-600">{popupMessage}</p>
            <button
              onClick={handleOk}
              className="mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
