import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [type, setType] = useState("error");
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const users = JSON.parse(localStorage.getItem("users")) || [];

    // --- Validasi ---
    if (!nama || !email || !password) {
      setType("error");
      setMessage("Semua field wajib diisi!");
      setShowPopup(true);
      return;
    }

    if (nama.length < 2) {
      setType("error");
      setMessage("Nama harus minimal 2 karakter!");
      setShowPopup(true);
      return;
    }

    if (password.length < 8) {
      setType("error");
      setMessage("Password harus minimal 8 karakter!");
      setShowPopup(true);
      return;
    }

    // password tidak boleh punya huruf/angka sama lebih dari 2 kali berurutan
    if (/(.)\1{2,}/.test(password)) {
      setType("error");
      setMessage(
        "Password tidak boleh mengandung karakter yang sama lebih dari 2 kali berturut-turut!"
      );
      setShowPopup(true);
      return;
    }

    const emailExists = users.some((user) => user.email === email);
    if (emailExists) {
      setType("error");
      setMessage("Email sudah terdaftar, gunakan email lain!");
      setShowPopup(true);
      return;
    }

    const newUser = { nama, email, password };
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));

    const alamatList = JSON.parse(localStorage.getItem("alamat")) || [];
    alamatList.push({ nama, email, namaUser: nama });
    localStorage.setItem("alamat", JSON.stringify(alamatList));

    setType("success");
    setMessage("Registrasi berhasil! Silakan login.");
    setShowPopup(true);

    setTimeout(() => {
      navigate("/login");
    }, 2000);
  };

  return (
    <div className="min-h-[90vh] lg:min-h-[70vh] flex flex-col justify-center bg-white px-6 mt-5 lg:mt-25">
      <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-8 text-center">
        Registrasi Akun Skintizen
      </h1>

      {/* 🔹 Popup Modal */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          {/* background gelap */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setShowPopup(false)}
          />
          {/* kotak popup */}
          <div
            className={`relative bg-white rounded-xl shadow-lg p-6 w-80 text-center border-t-4 ${
              type === "error" ? "border-red-500" : "border-green-500"
            }`}
          >
            <p
              className={`text-base font-semibold mb-4 ${
                type === "error" ? "text-red-600" : "text-green-600"
              }`}
            >
              {message}
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

      <form
        onSubmit={handleSubmit}
        className="max-w-xl w-full mx-auto flex flex-col gap-6"
      >
        {/* Nama */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nama
          </label>
          <input
            type="text"
            placeholder="Masukkan nama"
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            placeholder="Masukkan email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
          />
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            type="password"
            placeholder="Masukkan password (min. 8 karakter)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
          />
        </div>

        {/* Tombol Register */}
        <button
          type="submit"
          className="w-full bg-red-500 hover:bg-red-400 text-white font-semibold py-3 rounded-lg transition"
        >
          Daftar
        </button>
      </form>

      <p className="text-center text-sm text-gray-600 mt-6">
        Sudah punya akun?{" "}
        <Link to="/login" className="text-blue-600 font-bold hover:underline">
          Login di sini
        </Link>
      </p>
    </div>
  );
}
