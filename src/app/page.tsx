
import Image from "next/image";
import React from 'react';
import Form from './form';
import { ToastContainer, toast } from 'react-toastify';
export default function Home() {
   
  return (
     <div>
      <ToastContainer />
      <h1 className="text-3xl bg-green-500 text-white p-1">MergerWare</h1>
      <Form />
    </div>
  );
}
