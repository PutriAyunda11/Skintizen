import Header from "./components/Header";
import Footer from "./components/Footer";
import { Outlet } from "react-router-dom";
import { useState } from "react";

export default function App() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
   const [isCartOpen, setIsCartOpen] = useState(false);

  // Jika salah satu modal/drawer terbuka → lock scroll
  const isAnyOverlayOpen = isSearchOpen || isDetailOpen || isCartOpen;

  return (
    <div className={isAnyOverlayOpen ? "overflow-hidden h-screen" : "overflow-auto"}>
      <Header
        isSearchOpen={isSearchOpen}
        setIsSearchOpen={setIsSearchOpen}
         isCartOpen={isCartOpen}
        setIsCartOpen={setIsCartOpen}
      />
      <Outlet context={{ isDetailOpen, setIsDetailOpen }} /> 
      <Footer />
    </div>
  );
}
