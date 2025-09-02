import {
  Mail,
  Instagram,
  Youtube,
  ShoppingCart,
  Copyright,
} from "lucide-react";
import { NavLink } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-blue-200 border-t mt-10">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-4 gap-8 text-sm text-black">
        <div>
          <h1 className="text-xl font-bold">SKINTIZEN</h1>
        </div>
        <div>
          <h3 className="font-semibold mb-2">CONTACT US</h3>
                    <p className="flex items-center gap-2 mb-4">
            <Mail size={16} /> CSskintific@gmail.com
          </p>
          <div className="flex space-x-4">

            <div className="flex space-x-4">
              <a
                href="https://www.instagram.com/skintificofficial?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
                target="_blank"
                rel="noopener noreferrer"
              >
                <Instagram className="cursor-pointer" size={20} />
              </a>

              <a
                href="https://youtube.com/@skintific-indonesia?si=ctjel3fwVSYBedx9"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Youtube className="cursor-pointer" size={20} />
              </a>

              <a
                href="https://id.shp.ee/Qd9RRzG"
                target="_blank"
                rel="noopener noreferrer"
              >
                <ShoppingCart className="cursor-pointer" size={20} />
              </a>
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-2">MENU</h3>
          <ul className="space-y-1">
            <li>
              <NavLink to="/" className="hover:underline">
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/all-product" className="hover:underline">
                All Product
              </NavLink>
            </li>
            <li>
              <NavLink to="/best-sellers" className="hover:underline">
                Best Seller
              </NavLink>
            </li>
            <li>
              <NavLink to="/new-launch" className="hover:underline">
                New Launching
              </NavLink>
            </li>
            <li>
              <NavLink to="/skin-care" className="hover:underline">
                Skincare
              </NavLink>
            </li>
            <li>
              <NavLink to="/makeup" className="hover:underline">
                MakeUp
              </NavLink>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold mb-2">ABOUT US</h3>
          <NavLink
            to="/about"
            className="hover:underline flex items-center gap-1"
          >
            Skintific
            <Copyright size={16} />
          </NavLink>
        </div>
      </div>
    </footer>
  );
}
