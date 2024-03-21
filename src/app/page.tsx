import React from "react";
import Form from "./form";

import { Toaster } from "@/components/ui/toaster";
export default function Home() {
  return (
    <div>
      <Toaster />
      <Form />
    </div>
  );
}
