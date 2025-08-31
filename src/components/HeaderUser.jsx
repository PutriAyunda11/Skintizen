import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function HeaderUser() {
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);

  const navItems = [
    { path: "/pesanan", label: "Pesanan" },
    { path: "/alamat", label: "Alamat" },
    { path: "/riwayat", label: "Riwayat" },
  ];

  const handleLogout = () => {
    // hapus status login di localStorage
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("currentUser");
    setShowPopup(false);
    navigate("/login", { replace: true });// arahkan ke login
    navigate(0);
  };

  return (
    <>
      <nav className="border border-gray-200 bg-white">
        <div className="flex max-w-7xl mx-auto justify-center space-x-6 md:space-x-13 py-8 text-sm font-bold text-gray-600">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `relative group transition ${
                  isActive
                    ? "text-blue-600 underline underline-offset-4 decoration-blue-600"
                    : "hover:underline hover:underline-offset-4 hover:decoration-blue-600"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}

          {/* Tombol Logout */}
          <button
            onClick={() => setShowPopup(true)}
            className="relative group transition hover:underline hover:underline-offset-4 hover:decoration-blue-600"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Popup konfirmasi */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-80 text-center">
            <h2 className="text-lg font-semibold mb-4">
              Apakah Anda yakin ingin logout?
            </h2>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
              >
                Ya
              </button>
              <button
                onClick={() => setShowPopup(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
              >
                Tidak
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
