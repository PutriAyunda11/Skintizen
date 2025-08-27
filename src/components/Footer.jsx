import {
  Mail,
  Instagram,
  Youtube,
  ShoppingCart,
  CreditCard,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-blue-200 border-t mt-10">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-4 gap-8 text-sm text-black">
        <div>
          <h1 className="text-xl font-bold">SKINTIZEN</h1>
        </div>
        <div>
          <h3 className="font-semibold mb-2">NEWSLETTER</h3>
          <p className="text-sm mb-3">
            Sign up and get limited <span className="font-bold">10% OFF!</span>
          </p>
          <div className="flex border rounded-md overflow-hidden mb-4">
            <input
              type="email"
              placeholder="Email mu"
              className="flex-grow min-w-0 px-3 py-2 outline-none text-sm"
            />
            <button className="bg-black text-white px-4 shrink-0">→</button>
          </div>
          <div className="flex space-x-4">
            <Instagram className="cursor-pointer" size={20} />
            <Youtube className="cursor-pointer" size={20} />
            <ShoppingCart className="cursor-pointer" size={20} />
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-2">CONTACT US</h3>
          <p className="flex items-center gap-2 mb-4">
            <Mail size={16} /> CSskintific@gmail.com
          </p>
          <h3 className="font-semibold mb-2">SUPPORT</h3>
          <ul className="space-y-1">
            <li>
              <a href="#" className="hover:underline">
                Track My Order
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Shipping & Delivery
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Returns & Refunds Policy
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                FAQs
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Terms of Service
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold mb-2">ABOUT US</h3>
          <a href="#" className="hover:underline">
            Skintific©
          </a>
        </div>
      </div>
    </footer>
  );
}
