import Header from "./components/Header";
import Footer from "./components/Footer";
import { Outlet } from "react-router-dom";
import { useState } from "react";

export default function App() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <>
      <div className={isSearchOpen ? "overflow-hidden h-screen" : ""}>
        <Header isSearchOpen={isSearchOpen} setIsSearchOpen={setIsSearchOpen} />
        <Outlet />
        <Footer />
      </div>{" "}
    </>
  );
}
