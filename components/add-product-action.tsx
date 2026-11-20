"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { AddProductButton } from "@/components/common/button";

export const ProductEditor = dynamic(() =>
  import("./AddProductModal").then((module) => module.AddProductModal),
);

export default function AddProductAction() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <AddProductButton onClick={() => setOpen(true)} />
      {open && <ProductEditor open onClose={() => setOpen(false)} />}
    </>
  );
}
