"use client";
import React, { useState } from "react";
import { formSchema } from "./form.schema";
import { FormEvent } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ZodError } from "zod";

const Form = () => {
  const [zodError, setZodError] = useState<any>(null);
  const deafaultForm = {
    name: "",
    description: "",
    owner: "",
    startDate: "",
    endDate: "",
    status: "",
    phase: "",
    phaseStartDate: "",
    phaseEndDate: "",
    phaseStatus: "",
    templates: "",
    file: null,
  };

  const [formState, setFormState] = useState(deafaultForm);

  const handleChange = (e) => {
    const { name, type, files } = e.target;

    if (type === "file") {
      setFormState({
        ...formState,
        [name]: files[0],
      });
    } else if (name === "startDate" || name === "endDate") {
      if (formState.phaseEndDate || formState.phaseStartDate) {
        toast.error("select phase date values again", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
        });

        setFormState({
          ...formState,
          [name]: e.target.value,
          phaseEndDate: "",
          phaseStartDate: "",
        });
      } else {
        setFormState({
          ...formState,
          [name]: e.target.value,
        });
      }
    } else {
      setFormState({
        ...formState,
        [name]: e.target.value,
      });
    }

    setZodError({
      ...zodError,
      [name]: null,
    });
    console.log(formState);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    try {
      formSchema.parse(formState);
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
        setZodError(null);
      } else {
        toast.error("error creating deal", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
        });

        setZodError(null);
      }
    } catch (error) {
      if (error instanceof ZodError) {
        setZodError(error.format());
        console.log(zodError);

        toast.error("form validation error", {
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
        setZodError(null);
      }
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
      <div className="flex flex-col h-20">
        <label htmlFor="name" className="ml-3">
          Deal Name:
        </label>
        <input
          type="text"
          id="name"
          name="name"
          className=" px-2 py-1 ml-3 text-md text-gray-800 border border-gray-300 rounded-lg w-1/5 h-9 shadow-md placeholder-black "
          placeholder="Deal Name"
          value={formState.name}
          onChange={handleChange}
          required
        />
        {zodError?.name?._errors[0] && (
          <span className="ml-3 text-red-500 text-xs">
            *{zodError.name._errors[0]}
          </span>
        )}
      </div>
      <div className="flex flex-col h-20">
        <label htmlFor="description" className="ml-3">
          Deal Description:
        </label>
        <input
          type="text"
          id="description"
          name="description"
          value={formState.description}
          onChange={handleChange}
          placeholder="Description"
          className=" px-2 py-1 ml-3 text-md text-gray-800 border border-gray-300 rounded-lg w-1/5 h-9 shadow-md placeholder-black"
          required
        />
        {zodError?.description?._errors[0] && (
          <span className="ml-3 text-red-500 text-xs">
            *{zodError.description._errors[0]}
          </span>
        )}
      </div>
      <div className="flex flex-col h-20">
        <label htmlFor="owner" className="ml-3">
          Deal Owner:
        </label>
        <input
          type="text"
          id="owner"
          name="owner"
          placeholder="Deal Owner"
          className=" px-2 py-1 ml-3 text-md text-gray-800 border border-gray-300 rounded-lg w-1/5 h-9 shadow-md placeholder-black"
          value={formState.owner}
          onChange={handleChange}
          required
        />
        {zodError?.owner?._errors[0] && (
          <span className="ml-3 text-red-500 text-xs">
            *{zodError.owner._errors[0]}
          </span>
        )}
      </div>
      <div className="flex flex-col h-20">
        <label htmlFor="startDate" className="ml-3">
          Deal Start Date:
        </label>
        <input
          type="date"
          id="startDate"
          name="startDate"
          value={formState.startDate}
          max={formState.endDate}
          onChange={handleChange}
          required
          className=" px-2 py-1 ml-3 text-md text-gray-800 border border-gray-300 rounded-lg w-1/5 h-9 shadow-md "
        />
        {zodError?.startDate?._errors[0] && (
          <span className="ml-3 text-red-500 text-xs">
            *{zodError.startDate._errors[0]}
          </span>
        )}
      </div>
      <div className="flex flex-col h-20">
        <label htmlFor="endDate" className="ml-3">
          Deal End Date:
        </label>
        <input
          type="date"
          id="endDate"
          name="endDate"
          value={formState.endDate}
          onChange={handleChange}
          min={formState.startDate}
          required
          className=" px-2 py-1 ml-3 text-md text-gray-800 border border-gray-300 rounded-lg w-1/5 h-9 shadow-md "
        />
        {zodError?.endDate?._errors[0] && (
          <span className="ml-3 text-red-500 text-xs">
            *{zodError.endDate._errors[0]}
          </span>
        )}
      </div>
      <div className="flex flex-col h-20">
        <label htmlFor="status" className="ml-3">
          Status:
        </label>
        <select
          id="status"
          name="status"
          value={formState.status}
          onChange={handleChange}
          required
          className=" px-2 py-1 ml-3 text-md text-gray-800 border border-gray-300 rounded-lg w-1/5 h-9 shadow-md "
        >
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {zodError?.status?._errors[0] && (
          <span className="ml-3 text-red-500 text-xs">
            *{zodError.status._errors[0]}
          </span>
        )}
      </div>
      <br />

      <h2 className="text-3xl ml-3">Phase Information</h2>
      <div className="flex flex-col h-20">
        <label htmlFor="phase" className="ml-3">
          Deal Phase:
        </label>
        <select
          id="phase"
          name="phase"
          className=" px-2 py-1 ml-3 text-md text-gray-800 border border-gray-300 rounded-lg w-1/5 h-9 shadow-md "
          value={formState.phase}
          onChange={handleChange}
          required
        >
          {phaseOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {zodError?.phase?._errors[0] && (
          <span className="ml-3 text-red-500 text-xs">
            *{zodError.phase._errors[0]}
          </span>
        )}
      </div>
      <div className="flex flex-col mb-3 h-20">
        <label htmlFor="phaseStartDate" className="ml-3">
          Phase Start Date:
        </label>
        <input
          type="date"
          id="phaseStartDate"
          name="phaseStartDate"
          required
          value={formState.phaseStartDate}
          disabled={!formState.endDate || !formState.startDate}
          min={formState.startDate}
          max={formState.phaseEndDate || formState.endDate}
          onChange={handleChange}
          className=" px-2 py-1 ml-3 text-md text-gray-800 border border-gray-300 rounded-lg w-1/5 h-9 shadow-md "
        />
        {(!formState.endDate || !formState.startDate) && (
          <span className="ml-3 text-red-500 text-xs">
            *Please select deal start date and end date
          </span>
        )}
        {zodError?.phaseStartDate?._errors[0] && (
          <span className="ml-3 text-red-500 text-xs">
            *{zodError.phaseStartDate._errors[0]}
          </span>
        )}
      </div>

      <div className="flex flex-col h-20">
        <label htmlFor="phaseEndDate" className="ml-3">
          Phase End Date:
        </label>
        <input
          type="date"
          id="phaseEndDate"
          name="phaseEndDate"
          required
          value={formState.phaseEndDate}
          disabled={!formState.endDate || !formState.startDate}
          min={formState.phaseStartDate || formState.phaseEndDate}
          max={formState.endDate}
          onChange={handleChange}
          className=" px-2 py-1 ml-3 text-md text-gray-800 border border-gray-300 rounded-lg w-1/5 h-9 shadow-md"
        />
        {(!formState.endDate || !formState.startDate) && (
          <span className="ml-3 text-red-500 text-xs">
            *Please select deal start date and end date
          </span>
        )}
        {zodError?.phaseEndDate?._errors[0] && (
          <span className="ml-3 text-red-500 text-xs">
            *{zodError.phaseEndDate._errors[0]}
          </span>
        )}
      </div>
      <div className="flex flex-col h-20">
        <label htmlFor="phaseStatus" className="ml-3">
          Phase Staus:
        </label>
        <select
          id="phaseStatus"
          name="phaseStatus"
          required
          value={formState.phaseStatus}
          onChange={handleChange}
          className=" px-2 py-1 ml-3 text-md text-gray-800 border border-gray-300 rounded-lg w-1/5 h-9 shadow-md "
        >
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {zodError?.phaseStatus?._errors[0] && (
          <span className="ml-3 text-red-500 text-xs">
            *{zodError.phaseStatus._errors[0]}
          </span>
        )}
      </div>
      <div className="flex flex-col h-20">
        <label htmlFor="templates" className="ml-3">
          Template :
        </label>
        <select
          id="templates"
          name="templates"
          required
          value={formState.templates}
          onChange={handleChange}
          className=" px-2 py-1 ml-3 text-md text-gray-800 border border-gray-300 rounded-lg w-1/5 h-9 shadow-md "
        >
          {templateOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {zodError?.templates?._errors[0] && (
          <span className="ml-3 text-red-500 text-xs">
            *{zodError.templates._errors[0]}
          </span>
        )}
      </div>
      <div className="flex flex-col h-20">
        <label htmlFor="file" className="ml-3">
          Upload File:
        </label>
        <input
          type="file"
          id="file"
          name="file"
          onChange={handleChange}
          className=" px-2 py-1 ml-3 text-md text-gray-800 border border-gray-300 rounded-lg w-1/5 h-9 shadow-md "
        />
        {zodError?.file?._errors[0] && (
          <span className="ml-3 text-red-500 text-xs">
            *{zodError.file._errors[0]}
          </span>
        )}
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
