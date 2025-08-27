import { Search, ShoppingCart, User, Menu, X } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useState } from "react";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { label: "Best Sellers", path: "/best-sellers" },
    { label: "New Launch", path: "/new-launch" },
    { label: "Skin Care", path: "/skin-care" },
    { label: "Makeup", path: "/makeup" },
    { label: "About Skintific", path: "/about" },
  ];

  return (
    <header className="w-full shadow-md bg-white text-black">
      <div className="flex items-center justify-between px-4 md:px-6 py-3">
        <NavLink to="/" className="text-2xl md:text-3xl font-bold">
          SKINTIZEN
        </NavLink>
        <div className="flex items-center gap-3 md:gap-4">
          <div className="hidden sm:flex items-center border rounded-md px-2 w-40 md:w-72">
            <Search size={18} className="w-5" />
            <input
              type="text"
              placeholder="Apa yang sedang Anda cari?"
              className="px-2 py-1 outline-none bg-transparent w-full text-sm md:text-base"
            />
          </div>

          <User size={22} className="cursor-pointer" />
          <ShoppingCart size={22} className="cursor-pointer" />

          {/* Hamburger menu mobile */}
          <button className="sm:hidden p-1" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="border-t border-gray-200">
        {/* Desktop / Tablet Nav */}
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

        {/* Mobile Nav */}
        {isOpen && (
          <div className="sm:hidden flex flex-col items-start px-4 py-2 space-y-3 text-gray-700 font-semibold">
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
        )}
      </nav>
    </header>
  );
}
