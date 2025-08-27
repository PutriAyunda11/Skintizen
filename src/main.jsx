import './index.css'
import React from "react";
import { createRoot } from 'react-dom/client';
import App from "./App.jsx";
import "@fontsource/raleway";
import { createBrowserRouter } from 'react-router-dom';
import Home from "./pages/Home.jsx";
import { StrictMode } from 'react';
import { RouterProvider } from 'react-router-dom';


const router = createBrowserRouter(
  [{
    path:"/",
    element :(
     <App/>
    ),
    children:[
      {
        path:"/",
        element: <Home/>
      },
      {
        path:"/best-sellers",
        element: <Home/>
      },
      {
        path:"/new-launch",
        element: <Home/>
      },
      {
        path:"/makeup",
        element: <Home/>
      },
      {
        path:"/skin-care",
        element: <Home/>
      },
      {
        path:"/about",
        element: <Home/>
      },
    ]
  }
]);

createRoot(document.getElementById("root")).render(
 <StrictMode>
 <RouterProvider router={router} />
 </StrictMode>
);