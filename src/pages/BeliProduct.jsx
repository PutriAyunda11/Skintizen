import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function BeliProduct() {
  const location = useLocation();
  let { orderData } = location.state || {};
  const navigate = useNavigate();

  //  pastikan orderData selalu array
  if (orderData && !Array.isArray(orderData)) {
    orderData = [orderData];
  }

  const [alamatList, setAlamatList] = useState([]);
  const [selectedAlamatIndex, setSelectedAlamatIndex] = useState(null);

  const [metodeBayar, setMetodeBayar] = useState("");
  const metodeOptions = ["Bank BRI", "Bank MANDIRI", "Bank BNI", "Bank BCA"];

  const [showDropdown, setShowDropdown] = useState(false);
  const [kodePembayaran, setKodePembayaran] = useState("");

  const [showPesananPopup, setShowPesananPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");

  const [showAlamatPopup, setShowAlamatPopup] = useState(false);
  const [alamatMessage, setAlamatMessage] = useState("");

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  useEffect(() => {
    const loadAlamat = () => {
      const alamatAll = JSON.parse(localStorage.getItem("alamat")) || [];
      if (currentUser) {
        const alamatUser = alamatAll.filter(
          (item) => item.namaUser === currentUser.nama
        );
        setAlamatList(alamatUser);
      }
    };

    loadAlamat();
 // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  

  if (!orderData || orderData.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Data produk tidak ditemukan!</p>
      </div>
    );
  }

  // 🔥 hitung subtotal dengan aman
  const subtotal = orderData.reduce(
    (acc, item) => acc + (item.subtotal || 0),
    0
  );

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

  const generateKodePembayaran = () => {
    let kode = "";
    for (let i = 0; i < 15; i++) {
      kode += Math.floor(Math.random() * 10);
    }
    return kode;
  };

  const isAlamatLengkap = (alamat) => {
    return (
      alamat &&
      alamat.provinsi &&
      alamat.kota &&
      alamat.kecamatan &&
      alamat.kodePos &&
      alamat.nomorTelepon
    );
  };

  const handleBuatPesanan = () => {
    const selectedAlamat = alamatList[selectedAlamatIndex];

    if (!selectedAlamat || !isAlamatLengkap(selectedAlamat)) {
      setAlamatMessage(
        "Alamat yang dipilih belum lengkap! Silakan edit alamat terlebih dahulu."
      );
      setShowAlamatPopup(true);
      return;
    }

    if (!kodePembayaran) {
      setKodePembayaran(generateKodePembayaran());
    }
    setShowDropdown(true);
  };

  const handleSelesai = () => {
    const data = {
      statusPembayaran: "Selesai",
      statusPesanan: "Belum Selesai",
      message: "Pesanan berhasil! Pembayaran selesai.",
    };
    savePesanan(data);
  };

  const handleNanti = () => {
    const data = {
      statusPembayaran: "Belum Selesai",
      statusPesanan: "Belum Selesai",
      message: "Pesanan berhasil, tapi belum dibayar!",
    };
    savePesanan(data);
  };

  const updateStokProduk = () => {
    const semuaProduk = JSON.parse(localStorage.getItem("skintiz")) || [];

    orderData.forEach((order) => {
      const indexProduk = semuaProduk.findIndex((p) => p.id === order.id);
      if (indexProduk !== -1) {
        semuaProduk[indexProduk].stok -= order.kuantitas;
        if (semuaProduk[indexProduk].stok < 0) {
          semuaProduk[indexProduk].stok = 0;
        }
      }
    });

    localStorage.setItem("skintiz", JSON.stringify(semuaProduk));
  };

  const savePesanan = ({ statusPembayaran, statusPesanan, message }) => {
    const riwayat = JSON.parse(localStorage.getItem("pesanan")) || [];
    const selectedAlamat = alamatList[selectedAlamatIndex];

    const alamatLengkapPesanan = {
      namaUser: currentUser?.nama || "Guest",
      emailUser: currentUser?.email || "Guest",
      nama: selectedAlamat?.nama || "",
      nomorTelepon: selectedAlamat?.nomorTelepon || "",
      provinsi: selectedAlamat?.provinsi || "",
      kota: selectedAlamat?.kota || "",
      kecamatan: selectedAlamat?.kecamatan || "",
      kodePos: selectedAlamat?.kodePos || "",
      detail: selectedAlamat?.detail || "",
      alamatLengkap: selectedAlamat?.alamatLengkap || "",
    };

    const dataPesanan = {
      produk: orderData.map((order) => ({
        id: order.id,
        foto: order.foto || "/placeholder.png",
        nama: order.nama,
        kuantitas: order.kuantitas,
        subtotal: order.subtotal,
        shade: order.shade || null,
      })),
      subtotal,
      ongkir,
      total,
      metodeBayar,
      alamat: alamatLengkapPesanan,
      statusPembayaran,
      kodePembayaran,
      statusPesanan,
      namaUser: currentUser?.nama || "Guest",
      emailUser: currentUser?.email || "Guest",
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

    updateStokProduk();

    let keranjang = JSON.parse(localStorage.getItem("keranjang")) || [];

    keranjang = keranjang.filter(
      (item) =>
        !orderData.some(
          (order) => order.id === item.id && order.kuantitas === item.kuantitas
        )
    );

    localStorage.setItem("keranjang", JSON.stringify(keranjang));

    setShowDropdown(false);
    setPopupMessage(message);
    setShowPesananPopup(true);
  };

  const handleOk = () => {
    setShowPesananPopup(false);
    navigate("/pesanan", { state: { refresh: Date.now() } });
  };

  const handleOkAlamat = () => {
    setShowAlamatPopup(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 md:bg-gray-50 bg-white">
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
          {orderData.map((order, idx) => (
            <div key={idx} className="flex gap-6 border-b pb-4">
              <div className="relative">
                <img
                  src={order.foto || "/placeholder.png"}
                  alt={order.nama}
                  className="w-32 h-32 md:w-50 md:h-50 object-cover rounded-lg"
                />
                <div className="absolute top-1 right-1 bg-gray-600 text-white text-lg font-bold px-3 py-1 rounded-full">
                  {order.kuantitas}
                </div>
              </div>
              <div className="flex flex-col justify-center gap-2">
                <h3 className="text-lg font-semibold">{order.nama}</h3>
                {order.shade && (
                  <p className="text-gray-600">Shade: {order.shade}</p>
                )}
                <p className="text-pink-600 font-semibold">
                  Rp {order.subtotal?.toLocaleString("id-ID") || {}}
                </p>
              </div>
            </div>
          ))}

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
            <h2 className="text-lg font-bold">Pesanan</h2>
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

      {/* Popup alamat belum lengkap */}
      {showAlamatPopup && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-xl w-96 text-center">
            <h2 className="text-lg font-bold text-red-500">
              Alamat Tidak Lengkap
            </h2>
            <p className="mt-2 text-gray-600">{alamatMessage}</p>
            <button
              onClick={handleOkAlamat}
              className="mt-4 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
