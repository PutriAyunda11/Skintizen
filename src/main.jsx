import './index.css'
import React from "react";
import { createRoot } from 'react-dom/client';
import App from "./App.jsx";
import "@fontsource/raleway";
import { createBrowserRouter } from 'react-router-dom';
import { StrictMode } from 'react';
import { RouterProvider } from 'react-router-dom';
import Home from "./pages/Home.jsx";
import BestSeller from "./pages/BestSeller.jsx";
import NewLaunch from './pages/NewLaunch.jsx';
import Skincare from './pages/Skincare.jsx';
import MakeUp from './pages/MakeUp.jsx';
import Register from './pages/Register.jsx';
import Login from './pages/Login.jsx';
import Search from './pages/Search.jsx';
import AllProduct from './pages/AllProduct.jsx';
import Pesanan from './pages/Pesanan.jsx';
import Product from './pages/Product.jsx';
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Alamat from './pages/Alamat.jsx';
import Riwayat from './pages/Riwayat.jsx';
import BeliProduct from './pages/BeliProduct.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
      { path: "/best-sellers", element: <BestSeller /> },
      { path: "/new-launch", element: <NewLaunch /> },
      { path: "/skin-care", element: <Skincare /> },
      { path: "/makeup", element: <MakeUp /> },
      { path: "/search", element: <Search /> },
      { path: "/all-product", element: <AllProduct /> },
      { path: "/product/:id", element: <Product /> },

      //bungkus route yang butuh login
      {
        element: <ProtectedRoute />,
        children: [
          { path: "/pesanan", element: <Pesanan /> },
          { path: "/alamat", element: <Alamat /> },  
          { path: "/riwayat", element: <Riwayat/> },
        ]
      },
    ],
  },
  {
    path: "/beli-product",
    element:<BeliProduct />
  }
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
