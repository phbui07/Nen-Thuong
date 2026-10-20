"use client";

import { Toaster } from "react-hot-toast";

export default function ToastProvider() {
  // Offset below the fixed header
  return <Toaster containerStyle={{ top: 80 }} toastOptions={{ style: { borderRadius: "9999px" } }} />;
}
