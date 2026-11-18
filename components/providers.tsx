"use client";

import { ToastContainer } from "react-toastify";
import { SessionProvider } from "next-auth/react";
import { CartProvider } from "@/context/cart-context";
import "react-toastify/dist/ReactToastify.css";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <CartProvider>
        {children}
        <ToastContainer
          position="top-right"
          autoClose={2500}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          pauseOnHover
          theme="light"
        />
      </CartProvider>
    </SessionProvider>
  );
}
