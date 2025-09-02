import { Search, ShoppingCart, User, Menu, X } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import DrawerSearch from "../pages/DrawerSearch";
import DrawerCart from "../pages/DrawerCart";

const MotionDiv = motion.div;

export default function Header({ isSearchOpen, setIsSearchOpen, isCartOpen,
  setIsCartOpen,}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupType, setPopupType] = useState("error");

  // --- tambahan state untuk konfirmasi hapus ---
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [isConfirm, setIsConfirm] = useState(false);

  // cek status login dari localStorage
  useEffect(() => {
    const loggedInStatus = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(loggedInStatus);
  }, [location]);

  const navItems = [
    { label: "Best Sellers", path: "/best-sellers" },
    { label: "New Launch", path: "/new-launch" },
    { label: "Skin Care", path: "/skin-care" },
    { label: "Makeup", path: "/makeup" },
    { label: "About Skintific", path: "/about" },
  ];

  const showHeaderSmall =
    location.pathname === "/skin-care" ||
    location.pathname === "/makeup" ||
    location.pathname === "/all-product";
  const category = location.pathname.slice(1);

  const [cartItems, setCartItems] = useState([]);

  const handleCartClick = () => {
    if (!isLoggedIn) {
      setPopupMessage("Silakan login terlebih dahulu!");
      setPopupType("error");
      setShowPopup(true);
    } else {
      const currentUser = JSON.parse(
        localStorage.getItem("currentUser") || "{}"
      );
      const allCart = JSON.parse(localStorage.getItem("keranjang") || "[]");
      const filteredCart = allCart.filter(
        (item) =>
          item.namaUser === currentUser.nama &&
          item.emailUser === currentUser.email
      );
      setCartItems(filteredCart);
      setIsCartOpen(true);
    }
  };

  // --- handle decrement dengan popup konfirmasi ---
  const handleDecrement = (index) => {
    let updatedCart = [...cartItems];
    if (updatedCart[index].kuantitas > 1) {
      updatedCart[index].kuantitas -= 1;
      updatedCart[index].subtotal =
        updatedCart[index].kuantitas * updatedCart[index].harga;
      setCartItems(updatedCart);
      localStorage.setItem("keranjang", JSON.stringify(updatedCart));
    } else {
      // tampilkan popup konfirmasi hapus
      setDeleteIndex(index);
      setPopupMessage("Apakah Anda ingin menghapus produk dari keranjang?");
      setPopupType("error");
      setIsConfirm(true);
      setShowPopup(true);
    }
  };

  const handleIncrement = (index) => {
    let updatedCart = [...cartItems];
    if (
      !updatedCart[index].stok ||
      updatedCart[index].kuantitas < updatedCart[index].stok
    ) {
      updatedCart[index].kuantitas += 1;
      updatedCart[index].subtotal =
        updatedCart[index].kuantitas * updatedCart[index].harga;
    }
    setCartItems(updatedCart);
    localStorage.setItem("keranjang", JSON.stringify(updatedCart));
  };

  // --- fungsi hapus item dari popup ---
  const confirmDelete = () => {
    if (deleteIndex !== null) {
      let updatedCart = [...cartItems];
      updatedCart.splice(deleteIndex, 1);
      setCartItems(updatedCart);
      localStorage.setItem("keranjang", JSON.stringify(updatedCart));
    }
    setDeleteIndex(null);
    setIsConfirm(false);
    setShowPopup(false);
  };

  const cancelDelete = () => {
    setDeleteIndex(null);
    setIsConfirm(false);
    setShowPopup(false);
  };

  return (
    <>
      <header className="w-full fixed top-0 left-0 shadow-sm bg-white text-black z-50">
        <div className="flex items-center justify-between px-4 md:px-6 py-3">
          <NavLink to="/" className="text-2xl md:text-3xl font-bold">
            SKINTIZEN
          </NavLink>
          <div className="flex items-center gap-3 md:gap-4">
            <div
              className="hidden sm:flex items-center border rounded-md px-2 w-40 md:w-72 cursor-text"
              onClick={() => setIsSearchOpen(true)}
            >
              <Search size={18} className="w-5" />
              <input
                type="text"
                readOnly
                placeholder="Apa yang sedang Anda cari?"
                className="px-2 py-1 outline-none bg-transparent w-full text-sm md:text-base text-gray-400"
              />
            </div>
            <NavLink
              to={isLoggedIn ? "/pesanan" : "/login"}
              className="hidden sm:block"
            >
              <User
                size={22}
                className="cursor-pointer"
                fill={isLoggedIn ? "currentColor" : "none"}
              />{" "}
            </NavLink>
            <button
              onClick={handleCartClick}
              className="hidden sm:block cursor-pointer"
            >
              <ShoppingCart size={22} />
            </button>{" "}
            {/* Mobile icons */}
            <div className="flex items-center gap-3 sm:hidden">
              <button onClick={() => setIsSearchOpen(true)}>
                <Search size={22} className="cursor-pointer" />
              </button>
              {/* Desktop */}
              <button
                onClick={handleCartClick}
                className="sm:hidden cursor-pointer"
              >
                <ShoppingCart size={22} />
              </button>{" "}
            </div>
            <button
              className="sm:hidden p-1"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
        {/* Navigation desktop */}
        <nav className="border-t border-gray-200">
          <div className="hidden sm:flex max-w-7xl mx-auto justify-center space-x-6 md:space-x-12 py-3 text-sm font-bold text-gray-600">
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
          </div>
        </nav>
        {/* Mobile Side Drawer */}
        <AnimatePresence>
          {isOpen && (
            <>
              <MotionDiv
                className="fixed inset-0 bg-black/40 z-40"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsOpen(false)}
              />
              <MotionDiv
                className="fixed top-0 left-0 w-full h-full bg-white z-50 flex flex-col p-6"
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "tween", duration: 0.3 }}
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">Menu</h2>
                  <button onClick={() => setIsOpen(false)}>
                    <X size={24} />
                  </button>
                </div>
                <div className="flex flex-col space-y-4 text-gray-700 font-semibold flex-grow">
                  {navItems.map((item) => (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsOpen(false)}
                      className={({ isActive }) =>
                        `transition ${
                          isActive ? "text-blue-600" : "hover:text-blue-500"
                        }`
                      }
                    >
                      {item.label}
                    </NavLink>
                  ))}
                </div>

                {/* User di Mobile */}
                <NavLink
                  to={isLoggedIn ? "/pesanan" : "/login"}
                  onClick={() => setIsOpen(false)}
                  className="border-t pt-4 flex items-center gap-3 text-gray-700 cursor-pointer mt-auto hover:text-blue-600 transition"
                >
                  <User
                    size={22}
                    className="cursor-pointer"
                    fill={isLoggedIn ? "currentColor" : "none"}
                  />{" "}
                  <span className="font-medium">
                    {isLoggedIn ? "Akun Saya" : "Login"}
                  </span>
                </NavLink>
              </MotionDiv>
            </>
          )}
        </AnimatePresence>
        {/* HeaderSmall */}
        {showHeaderSmall && (
          <div className="hidden lg:flex w-full bg-white shadow-sm border-t border-gray-200 z-40">
            <div className="w-full py-2 flex items-center justify-start gap-2 text-sm text-gray-600 px-6">
              <NavLink to="/" className="hover:underline">
                Home
              </NavLink>{" "}
              &gt;{" "}
              <NavLink
                to="/all-product"
                className="hover:underline ml-1 font-medium capitalize"
              >
                All Products
              </NavLink>
              {category !== "all-product" && (
                <>
                  {" "}
                  &gt;{" "}
                  <NavLink
                    to={
                      category === "skin-care"
                        ? "/skin-care"
                        : category === "makeup"
                        ? "/makeup"
                        : "/all-product"
                    }
                    className="hover:underline ml-1 font-medium capitalize"
                  >
                    {category}
                  </NavLink>
                </>
              )}
            </div>
          </div>
        )}
        <AnimatePresence>
          {isSearchOpen && (
            <DrawerSearch
              isOpen={isSearchOpen}
              onClose={() => setIsSearchOpen(false)}
            />
          )}
        </AnimatePresence>
        {showPopup && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-[80]">
            <div
              className={`bg-white rounded-xl shadow-lg p-6 w-80 text-center border-t-4 ${
                popupType === "error" ? "border-red-500" : "border-blue-500"
              }`}
            >
              <p
                className={`text-base font-semibold mb-4 ${
                  popupType === "error" ? "text-red-600" : "text-blue-600"
                }`}
              >
                {popupMessage}
              </p>

              {isConfirm ? (
                <div className="flex justify-center gap-4">
                  <button
                    onClick={confirmDelete}
                    className="bg-red-500 hover:bg-red-400 text-white px-4 py-2 rounded-lg transition"
                  >
                    Hapus
                  </button>
                  <button
                    onClick={cancelDelete}
                    className="bg-gray-300 hover:bg-gray-200 text-black px-4 py-2 rounded-lg transition"
                  >
                    Batal
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowPopup(false)}
                  className="mt-2 bg-blue-500 hover:bg-blue-400 text-white px-4 py-2 rounded-lg transition"
                >
                  OK
                </button>
              )}
            </div>
          </div>
        )}
        {/* Cart Drawer */}
        <DrawerCart
          showCartDrawer={isCartOpen}
          setShowCartDrawer={setIsCartOpen}
          cartItems={cartItems}
          setCartItems={setCartItems}
          handleDecrement={handleDecrement}
          handleIncrement={handleIncrement}
        />{" "}
      </header>
    </>
  );
}
