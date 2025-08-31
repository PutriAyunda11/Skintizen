import { useEffect, useState } from "react";
import HeaderUser from "../components/HeaderUser";

export default function Riwayat() {
  const [riwayat, setRiwayat] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    // cek apakah ada data riwayat di localStorage
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

    // filter berdasarkan nama yang sama dengan currentUser
    const filtered = parsedRiwayat.filter(
      (item) => item.namaUser === currentUser.nama
    );

    if (filtered.length === 0) {
      setMessage("Tidak ada riwayat pemesanan");
    } else {
      setRiwayat(filtered);
    }
  }, []);

  return (
    <div className="mt-14 md:mt-26 min-h-[80vh] md:min-h-[60vh]">
        <HeaderUser />
      <h2 className="text-3xl font-bold text-center mb-4 py-10">Riwayat Pemesanan</h2>

      {message && <p className="text-gray-600 text-center font-semibold">{message}</p>}

      {riwayat.length > 0 && (
        <ul className="space-y-3">
          {riwayat.map((item, index) => (
            <li
              key={index}
              className="border rounded-lg p-3 shadow-sm bg-white"
            >
              <p className="font-semibold">product: {item.nama}</p>
              <p>Jumlah: {item.kuantitas}</p>
              <p>Tanggal: {item.tanggal}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
