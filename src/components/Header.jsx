import { Search, ShoppingCart, User, Menu, X } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import DrawerSearch from "../pages/DrawerSearch";

const MotionDiv = motion.div;

export default function Header({ isSearchOpen, setIsSearchOpen }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();

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

  // kategori untuk HeaderSmall
  const showHeaderSmall =
    location.pathname === "/skin-care" || location.pathname === "/makeup";
  const category = location.pathname.slice(1);

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

            <NavLink to="/cart" className="hidden sm:block">
              <ShoppingCart size={22} className="cursor-pointer" />
            </NavLink>

            {/* Mobile icons */}
            <div className="flex items-center gap-3 sm:hidden">
              <button onClick={() => setIsSearchOpen(true)}>
                <Search size={22} className="cursor-pointer" />
              </button>
              <NavLink to="/cart">
                <ShoppingCart size={22} className="cursor-pointer" />
              </NavLink>
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
              <NavLink to="/all-product" className="hover:underline ml-1">
                All Products
              </NavLink>{" "}
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
      </header>
    </>
  );
}
