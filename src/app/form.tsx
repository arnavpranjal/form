"use client";
import React, { useState } from "react";
import { formSchema } from "./form.schema";
import { FormEvent } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Form = () => {
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const formObject: Record<any, any> = {};

    for (const [key, value] of formData.entries()) {
      formObject[key] = value;
    }

    try {
      formSchema.parse(formObject);
      const response = await fetch("http://localhost:3001/deal/create", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        toast.success("deal created successfully!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
        });
      } else {
        toast.error("error creating deal", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
        });
      }
    } catch (error) {
      console.log("zod validation failed:", error);
      toast.error("form validation error", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
      });
    }
  };

  const statusOptions = [
    { value: "", label: "Select Status" },
    { value: "pending", label: "Pending" },
    { value: "progress", label: "In Progress" },
    { value: "completed", label: "Completed" },
  ];
  const phaseOptions = [
    { value: "", label: "Select phase" },
    { value: "initial", label: "Initial" },
    { value: "ui", label: "Ui" },
  ];

  const templateOptions = [
    { value: "", label: "Select template" },
    { value: '{"key":"value"}', label: "template1" },
  ];

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <h2 className="text-3xl ml-3">Deal Summary</h2>
      <div className="flex flex-col mb-3">
        <label htmlFor="name" className="ml-3">
          Deal Name:
        </label>
        <input
          type="text"
          id="name"
          name="name"
          className=" px-2 py-1 ml-3 text-md text-gray-800 border border-gray-300 rounded-lg w-1/5 "
        />
      </div>
      <div className="flex flex-col mb-3">
        <label htmlFor="description" className="ml-3">
          Deal Description:
        </label>
        <input
          type="text"
          id="description"
          name="description"
          className=" px-2 py-1 ml-3 text-md text-gray-800 border border-gray-300 rounded-lg w-1/5 "
        />
      </div>
      <div className="flex flex-col mb-3">
        <label htmlFor="owner" className="ml-3">
          Deal Owner:
        </label>
        <input
          type="text"
          id="owner"
          name="owner"
          className=" px-2 py-1 ml-3 text-md text-gray-800 border border-gray-300 rounded-lg w-1/5 "
        />
      </div>
      <div className="flex flex-col mb-3">
        <label htmlFor="startDate" className="ml-3">
          Deal Start Date:
        </label>
        <input
          type="date"
          id="startDate"
          name="startDate"
          className=" px-2 py-1 ml-3 text-md text-gray-800 border border-gray-300 rounded-lg w-1/5 "
        />
      </div>
      <div className="flex flex-col mb-3">
        <label htmlFor="endDate" className="ml-3">
          Deal End Date:
        </label>
        <input
          type="date"
          id="endDate"
          name="endDate"
          className=" px-2 py-1 ml-3 text-md text-gray-800 border border-gray-300 rounded-lg w-1/5 "
        />
      </div>
      <div className="flex flex-col mb-3">
        <label htmlFor="status" className="ml-3">
          Status:
        </label>
        <select
          id="status"
          name="status"
          className=" px-2 py-1 ml-3 text-md text-gray-800 border border-gray-300 rounded-lg w-1/5 "
        >
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <br />

      <h2 className="text-3xl ml-3">Phase Information</h2>
      <div className="flex flex-col mb-3">
        <label htmlFor="phase" className="ml-3">
          Deal Phase:
        </label>
        <select
          id="phase"
          name="phase"
          className=" px-2 py-1 ml-3 text-md text-gray-800 border border-gray-300 rounded-lg w-1/5 "
        >
          {phaseOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <div className="flex flex-col mb-3">
        <label htmlFor="phaseStartDate" className="ml-3">
          Phase Start Date:
        </label>
        <input
          type="date"
          id="phaseStartDate"
          name="phaseStartDate"
          className=" px-2 py-1 ml-3 text-md text-gray-800 border border-gray-300 rounded-lg w-1/5 "
        />
      </div>
      <div className="flex flex-col mb-3">
        <label htmlFor="phaseEndDate" className="ml-3">
          Phase End Date:
        </label>
        <input
          type="date"
          id="phaseEndDate"
          name="phaseEndDate"
          className=" px-2 py-1 ml-3 text-md text-gray-800 border border-gray-300 rounded-lg w-1/5 "
        />
      </div>
      <div className="flex flex-col mb-3">
        <label htmlFor="phaseStatus" className="ml-3">
          Phase Staus:
        </label>
        <select
          id="phaseStatus"
          name="phaseStatus"
          className=" px-2 py-1 ml-3 text-md text-gray-800 border border-gray-300 rounded-lg w-1/5 "
        >
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <div className="flex flex-col mb-3">
        <label htmlFor="templates" className="ml-3">
          Template :
        </label>
        <select
          id="templates"
          name="templates"
          className=" px-2 py-1 ml-3 text-md text-gray-800 border border-gray-300 rounded-lg w-1/5 "
        >
          {templateOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <div className="flex flex-col mb-3">
        <label htmlFor="file" className="ml-3">
          Upload File:
        </label>
        <input
          type="file"
          id="file"
          name="file"
          className=" px-2 py-1 ml-3 text-md text-gray-800 border border-gray-300 rounded-lg w-1/5 "
        />
      </div>

      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-3 mb-3"
      >
        Submit
      </button>
    </form>
  );
};

export default Form;
