import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [type, setType] = useState("error");
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const storedData = JSON.parse(localStorage.getItem("users")) || [];

const userFound = storedData.find(
  (user) =>
    user.email.toLowerCase().trim() === email.toLowerCase().trim() &&
    user.password === password.trim()
);
    if (userFound) {
      // Simpan status login dengan nama user
      localStorage.setItem("isLoggedIn", true);
      localStorage.setItem("currentUser", JSON.stringify(userFound));

      setType("success");
      setMessage(`Selamat datang, ${userFound.nama}!`);
      setShowPopup(true);

      setTimeout(() => {
        navigate("/pesanan");
      }, 2000);
    } else {
      setType("error");
      setMessage("Email atau password salah!");
      setShowPopup(true);
    }
  };

  return (
    <div className=" min-h-[90vh] lg:min-h-[70vh] flex flex-col justify-center bg-white px-6 mt-5 lg:mt-25">
      <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-8 text-center">
        Bergabung Sekarang
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
            required
          />
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            type="password"
            placeholder="Masukkan password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
            required
          />
        </div>

        {/* Tombol Login */}
        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition"
        >
          Login
        </button>
      </form>

      <p className="text-center text-sm text-gray-600 mt-6">
        Belum punya akun?{" "}
        <Link
          to="/register"
          className="text-blue-600 font-bold hover:underline"
        >
          Daftar di sini
        </Link>{" "}
      </p>
    </div>
  );
}
