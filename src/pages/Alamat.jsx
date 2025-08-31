import { useEffect, useState } from "react";
import HeaderUser from "../components/HeaderUser";

export default function Alamat() {
  const [userAlamat, setUserAlamat] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupType, setPopupType] = useState("success");

  const [form, setForm] = useState({
    id: "", // id unik
    nama: "",
    email: "",
    nomorTelepon: "",
    provinsi: "",
    kota: "",
    kecamatan: "",
    kodePos: "",
    alamatLengkap: "",
    detail: "",
  });

  useEffect(() => {
    const loginStatus = JSON.parse(localStorage.getItem("isLoggedIn"));
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const alamatList = JSON.parse(localStorage.getItem("alamat")) || [];

    if (loginStatus && currentUser) {
      setIsLoggedIn(true);
      const alamatUser = alamatList.filter(
        (item) => item.namaUser === currentUser.nama
      );
      setUserAlamat(alamatUser);

      if (alamatUser.length > 0) {
        const firstAlamat = alamatUser[0];
        setForm({
          ...firstAlamat
        });
      }
    }
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleClose = () => {
    setIsEditing(false);
    setIsAdding(false);
    setErrorMsg("");
    setForm({
      id: "",
      nama: "",
      email: "",
      nomorTelepon: "",
      provinsi: "",
      kota: "",
      kecamatan: "",
      kodePos: "",
      alamatLengkap: "",
      detail: "",
    });
  };

  const handleEdit = (alamat) => {
    setForm(alamat);
    setIsEditing(true);
  };

  const handleSave = (isAdd = false) => {
    setErrorMsg("");

    const requiredFields = [
      "nama",
      "email",
      "nomorTelepon",
      "provinsi",
      "kota",
      "kecamatan",
      "kodePos",
    ];

    for (let field of requiredFields) {
      if (!form[field].trim()) {
        setErrorMsg(`Field ${field} wajib diisi!`);
        return;
      }
    }

    if (!/^[0-9]{5}$/.test(form.kodePos)) {
      setErrorMsg("Kode Pos harus 5 digit angka!");
      return;
    }

    const wordCount = form.detail.trim().split(/\s+/).filter(Boolean).length;
    if (wordCount > 20) {
      setErrorMsg("Detail lainnya maksimal 20 kata!");
      return;
    }

    const alamatList = JSON.parse(localStorage.getItem("alamat")) || [];
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    if (isAdd) {
      // generate id unik
      const newAlamat = { ...form, id: Date.now(), namaUser: currentUser.nama };
      alamatList.push(newAlamat);
      setUserAlamat([...userAlamat, newAlamat]);
    } else {
      // update alamat
      const updatedList = alamatList.map((item) =>
        item.id === form.id ? { ...item, ...form } : item
      );
      setUserAlamat(updatedList.filter((item) => item.namaUser === currentUser.nama));
    }

    localStorage.setItem("alamat", JSON.stringify(alamatList));
    setIsEditing(false);
    setIsAdding(false);
  };

  const handleDelete = (id) => {
    const alamatList = JSON.parse(localStorage.getItem("alamat")) || [];
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    const updatedList = alamatList.filter((item) => item.id !== id);
    setUserAlamat(updatedList.filter((item) => item.namaUser === currentUser.nama));
    localStorage.setItem("alamat", JSON.stringify(updatedList));

    setPopupMessage("Data berhasil dihapus!");
    setPopupType("success");
    setShowPopup(true);
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        <p>Anda belum login.</p>
      </div>
    );
  }

  return (
    <>
      <div className="mt-14 md:mt-26 min-h-[80vh] md:min-h-[60vh]">
        <HeaderUser />
        <div className="flex items-center justify-center bg-white-50 md:pt-30 pl-6 pr-6 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl w-full">
            {userAlamat.map((alamat) => (
              <div
                key={alamat.id}
                className="bg-white shadow-md rounded-2xl p-6 flex flex-col justify-between"
              >
                <div>
                  <h2 className="text-xl font-bold text-gray-800 mb-4">Alamat</h2>
                  <p className="text-gray-700">{alamat.nama}</p>
                  <p className="text-gray-700">
                    {alamat.email}
                    {alamat.nomorTelepon && `, ${alamat.nomorTelepon}`}
                  </p>
                  <p className="text-gray-700">
                    {alamat.provinsi}, {alamat.kota}, {alamat.kecamatan}, {alamat.kodePos}
                  </p>
                  {alamat.alamatLengkap && <p className="text-gray-700">{alamat.alamatLengkap}</p>}
                  {alamat.detail && <p className="text-gray-700">{alamat.detail}</p>}
                </div>
                <div className="flex justify-between mt-6">
                  <span
                    onClick={() => handleEdit(alamat)}
                    className="text-blue-600 underline cursor-pointer hover:text-blue-800"
                  >
                    Edit
                  </span>
                  <span
                    onClick={() => handleDelete(alamat.id)}
                    className="text-red-600 underline cursor-pointer hover:text-red-800"
                  >
                    Hapus
                  </span>
                </div>
              </div>
            ))}

{userAlamat.length < 4 && (
  <div
    className="bg-white shadow-md rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition"
    style={{ minHeight: "250px" }} // tinggi fix, bisa disesuaikan
    onClick={() => {
      setForm({
        id: "",
        nama: "",
        email: "",
        nomorTelepon: "",
        provinsi: "",
        kota: "",
        kecamatan: "",
        kodePos: "",
        alamatLengkap: "",
        detail: "",
      });
      setIsAdding(true);
    }}
  >
    <div className="text-center">
      <p className="text-4xl font-bold text-blue-500">+</p>
      <p className="text-gray-600 mt-2">Tambah Alamat</p>
    </div>
  </div>
)}
          </div>
        </div>
      </div>

      {/* Modal */}
      {(isEditing || isAdding) && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-lg relative">
            <button
              onClick={handleClose}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl"
            >
              ✕
            </button>
            <h2 className="text-lg font-bold text-gray-800 mb-4">
              {isEditing ? "Edit Alamat" : "Tambah Alamat"}
            </h2>

            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
              {["nama","email","nomorTelepon","provinsi","kota","kecamatan","kodePos","alamatLengkap","detail"].map((field) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {field === "alamatLengkap" ? "Nama Jalan / Gedung / No.Rumah (Opsional)" :
                     field === "detail" ? "Detail lainnya (Opsional, max 20 kata)" :
                     field.charAt(0).toUpperCase() + field.slice(1)}
                  </label>
                  {["provinsi","kota","kecamatan"].includes(field) ? (
                    <select
                      name={field}
                      value={form[field]}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                    >
                      <option value="">Pilih {field}</option>
                      {field === "provinsi" && <>
                        <option value="Jawa Barat">Jawa Barat</option>
                        <option value="Jawa Tengah">Jawa Tengah</option>
                        <option value="DKI Jakarta">DKI Jakarta</option>
                        <option value="Bali">Bali</option>
                      </>}
                      {field === "kota" && <>
                        <option value="Bandung">Bandung</option>
                        <option value="Semarang">Semarang</option>
                        <option value="Jakarta">Jakarta</option>
                        <option value="Denpasar">Denpasar</option>
                      </>}
                      {field === "kecamatan" && <>
                        <option value="Cicendo">Cicendo</option>
                        <option value="Candisari">Candisari</option>
                        <option value="Menteng">Menteng</option>
                        <option value="Kuta">Kuta</option>
                      </>}
                    </select>
                  ) : (
                    <input
                      type={field === "email" ? "email" : "text"}
                      name={field}
                      value={form[field]}
                      onChange={handleChange}
                      maxLength={field === "kodePos" ? 5 : undefined}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                    />
                  )}
                </div>
              ))}
            </div>

            {errorMsg && <p className="text-red-600 text-sm mb-2">{errorMsg}</p>}

            <button
              onClick={() => handleSave(isAdding)}
              className="w-full mt-6 bg-green-500 hover:bg-green-400 text-white font-semibold py-2 rounded-lg transition"
            >
              Simpan
            </button>
          </div>
        </div>
      )}

      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div
            className={`relative bg-white rounded-xl shadow-lg p-6 w-80 text-center border-t-4 ${
              popupType === "error" ? "border-red-500" : "border-green-500"
            }`}
          >
            <p
              className={`text-base font-semibold mb-4 ${
                popupType === "error" ? "text-red-600" : "text-green-600"
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
    </>
  );
}
