"use client";
import React, { useState } from "react";
import { formSchema } from "./form.schema";
import { FormEvent } from "react";

import { ZodError } from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

const Form = () => {
  const [zodError, setZodError] = useState<any>(null);
  const deafaultForm = {
    name: "",
    description: "",
    owner: "",
    startDate: null,
    endDate: null,
    status: "",
    phase: "",
    phaseStartDate: null,
    phaseEndDate: null,
    phaseStatus: "",
    templates: "",
    file: null,
  };
  const { toast } = useToast();
  const [formState, setFormState] = useState(deafaultForm);

  const convertToFormData = () => {
    const formData = new FormData();
    Object.keys(formState).forEach((key) => {
      if (
        key === "startDate" ||
        key === "endDate" ||
        key === "phaseStartDate" ||
        key === "phaseEndDate"
      ) {
        if (formState[key] === null) formData.append(key, "");
        else formData.append(key, formState[key].toISOString());
      } else {
        formData.append(key, formState[key]);
      }
    });
    return formData;
  };
  const handleDateSelect = (id: string, date: any) => {
    if (id === "startDate" || id === "endDate") {
      if (formState.phaseStartDate || formState.phaseEndDate) {
        setFormState((prevState) => ({
          ...prevState,
          [id]: date,
          phaseStartDate: null,
          phaseEndDate: null,
        }));
        setZodError({
          ...zodError,
          [id]: null,
          phaseStartDate: null,
          phaseEndDate: null,
        });
        toast({
          variant: "destructive",
          title: "select phase date values again",
        });
      } else {
        setFormState((prevState) => ({
          ...prevState,
          [id]: date,
        }));
        setZodError({
          ...zodError,
          [id]: null,
        });
      }
    } else {
      setFormState((prevState) => ({
        ...prevState,
        [id]: date,
      }));
      setZodError({
        ...zodError,
        [id]: null,
      });
    }
  };

  const handleChange = (e) => {
    const { name, type, files, value } = e.target;

    if (type === "file") {
      setFormState({
        ...formState,
        [name]: files[0],
      });
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
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = convertToFormData();

    for (const entry of formData.entries()) {
      console.log(entry[0], entry[1]);
    }

    try {
      formSchema.parse(formState);
      const response = await fetch("http://localhost:3001/deal/create", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        toast({
          variant: "constructive",
          title: "Deal Created",
          description: "Your request was successful.",
        });
        setZodError(null);
      } else {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "There was a problem with your request.",
        });

        setZodError(null);
      }
    } catch (error) {
      if (error instanceof ZodError) {
        setZodError(error.format());
        console.log(zodError);

        toast({
          variant: "destructive",
          title: "Form Validation Error",
          description: "There was a problem with your request.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "There was a problem with your request.",
        });
        setZodError(null);
      }
    }
  };

  return (
    <Card className="inline-block m-3">
      <form onSubmit={handleSubmit} className="w-full">
        <CardHeader>
          <CardTitle className="text-3xl">Deal Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col h-20 items-center">
            <div className="grid w-full max-w-sm items-center  ">
              <Label htmlFor="name" className="mb-1">
                Deal Name<span className="text-red-500">*</span>
              </Label>
              <Input
                type="text"
                id="name"
                name="name"
                placeholder="Deal Name"
                value={formState.name}
                onChange={handleChange}
              />
              {zodError?.name?._errors[0] && (
                <span className=" text-red-500 text-xs">
                  *{zodError.name._errors[0]}
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-col h-20 items-center">
            <div className="grid w-full max-w-sm items-center ">
              <Label htmlFor="name" className="mb-1">
                Deal Description<span className="text-red-500">*</span>
              </Label>
              <Input
                type="text"
                id="description"
                name="description"
                placeholder="Description"
                value={formState.description}
                onChange={handleChange}
              />
              {zodError?.description?._errors[0] && (
                <span className="text-red-500 text-xs">
                  *{zodError.description._errors[0]}
                </span>
              )}
            </div>
          </div>
          <div className="flex flex-col h-20 items-center">
            <div className="grid w-full max-w-sm items-center  ">
              <Label htmlFor="name" className="mb-1">
                Deal Owner<span className="text-red-500">*</span>
              </Label>
              <Input
                type="text"
                id="owner"
                name="owner"
                placeholder="Deal Owner"
                value={formState.owner}
                onChange={handleChange}
              />

              {zodError?.owner?._errors[0] && (
                <span className=" text-red-500 text-xs">
                  *{zodError.owner._errors[0]}
                </span>
              )}
            </div>
          </div>
          <div className="flex flex-col h-20 items-center">
            <div className="grid w-full max-w-sm items-center  ">
              <Label htmlFor="startDate" className="mb-1">
                Start Date<span className="text-red-500">*</span>
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    id="startDate"
                    className={cn(
                      " justify-start text-left font-normal",
                      !formState.startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formState.startDate ? (
                      format(formState.startDate, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    id="startDate"
                    selected={formState.startDate}
                    onSelect={(date) => handleDateSelect("startDate", date)}
                    disabled={(date) =>
                      formState?.endDate && date > formState.endDate
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {zodError?.startDate?._errors[0] && (
                <span className=" text-red-500 text-xs">
                  *{zodError.startDate._errors[0]}
                </span>
              )}
            </div>
          </div>
          <div className="flex flex-col h-20 items-center">
            <div className="grid w-full max-w-sm items-center ">
              <Label htmlFor="endDate" className="mb-1">
                End Date<span className="text-red-500">*</span>
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    id="endDate"
                    className={cn(
                      " justify-start text-left font-normal",
                      !formState.endDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formState.endDate ? (
                      format(formState.endDate, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    id="endDate"
                    selected={formState.endDate}
                    onSelect={(date) => handleDateSelect("endDate", date)}
                    disabled={(date) =>
                      formState?.endDate && date < formState.startDate
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {zodError?.endDate?._errors[0] && (
                <span className=" text-red-500 text-xs">
                  *{zodError.endDate._errors[0]}
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-col h-20 items-center">
            <div className="grid w-full max-w-sm items-center">
              <Label htmlFor="status" className="mb-1">
                Status<span className="text-red-500">*</span>
              </Label>
              <Select
                name="status"
                onValueChange={(value) => {
                  setFormState({ ...formState, status: value });
                  setZodError({
                    ...zodError,
                    status: null,
                  });
                }}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value="status 1">status 1</SelectItem>
                  <SelectItem value="status2">status 2</SelectItem>
                  <SelectItem value="status 3">status 3</SelectItem>
                </SelectContent>
              </Select>
              {zodError?.status?._errors[0] && (
                <span className=" text-red-500 text-xs">
                  *{zodError.status._errors[0]}
                </span>
              )}
            </div>
          </div>
        </CardContent>
        <CardHeader>
          <CardTitle className="text-3xl">Phase Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col h-20 items-center">
            <div className="grid w-full max-w-sm items-center ">
              <Label htmlFor="phase" className="mb-1">
                Phase<span className="text-red-500">*</span>
              </Label>
              <Select
                name="phase"
                onValueChange={(value) => {
                  setFormState({ ...formState, phase: value });
                  setZodError({
                    ...zodError,
                    phaseStatus: null,
                  });
                }}
              >
                <SelectTrigger id="phase">
                  <SelectValue placeholder="Select Phase" />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value="phase 1">status 1</SelectItem>
                  <SelectItem value="phase 2">status 2</SelectItem>
                  <SelectItem value="phase 3">status 3</SelectItem>
                </SelectContent>
              </Select>
              {zodError?.phase?._errors[0] && (
                <span className=" text-red-500 text-xs">
                  *{zodError.phase._errors[0]}
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-col h-20 items-center">
            <div className="grid w-full max-w-sm items-center">
              <Label htmlFor="phaseStartDate" className="mb-1">
                Phase Start Date<span className="text-red-500">*</span>
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    id="phaseStartDate"
                    className={cn(
                      " justify-start text-left font-normal",
                      !formState.phaseStartDate && "text-muted-foreground"
                    )}
                    disabled={!formState.endDate || !formState.startDate}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formState.phaseStartDate ? (
                      format(formState.phaseStartDate, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    id="phaseStartDate"
                    selected={new Date(formState.phaseStartDate)}
                    onSelect={(date) =>
                      handleDateSelect("phaseStartDate", date)
                    }
                    disabled={(date) =>
                      (formState?.phaseEndDate &&
                        date > formState.phaseEndDate) ||
                      date < formState.startDate ||
                      date > formState.endDate
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>

              {zodError?.phaseStartDate?._errors[0] && (
                <span className="text-red-500 text-xs">
                  *{zodError.phaseStartDate._errors[0]}
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-col h-20 items-center">
            <div className="grid w-full max-w-sm items-center">
              <Label htmlFor="phaseEndDate" className="mb-1">
                Phase End Date<span className="text-red-500">*</span>
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    id="phaseEndDate"
                    className={cn(
                      " justify-start text-left font-normal",
                      !formState.phaseEndDate && "text-muted-foreground"
                    )}
                    disabled={!formState.endDate || !formState.startDate}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formState.phaseEndDate ? (
                      format(formState.phaseEndDate, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    id="phaseStartDate"
                    selected={formState.phaseEndDate}
                    onSelect={(date) => handleDateSelect("phaseEndDate", date)}
                    disabled={(date) =>
                      (formState?.phaseStartDate &&
                        date < formState.phaseStartDate) ||
                      date > formState.endDate
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>

              {zodError?.phaseEndDate?._errors[0] && (
                <span className="text-red-500 text-xs">
                  *{zodError.phaseEndDate._errors[0]}
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-col h-20 items-center">
            <div className="grid w-full max-w-sm items-center  ">
              <Label htmlFor="phaseStatus" className="mb-1">
                Phase Status<span className="text-red-500">*</span>
              </Label>
              <Select
                name="phaseStatus"
                onValueChange={(value) => {
                  setFormState({ ...formState, phaseStatus: value });
                  setZodError({
                    ...zodError,
                    phaseStatus: null,
                  });
                }}
              >
                <SelectTrigger id="phaseStatus">
                  <SelectValue placeholder="Select Phase Status" />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value="phase status 1">Phase status 1</SelectItem>
                  <SelectItem value="phase status 2">Phase status 2</SelectItem>
                  <SelectItem value="phase status 3">Phase status 3</SelectItem>
                </SelectContent>
              </Select>
              {zodError?.phaseStatus?._errors[0] && (
                <span className=" text-red-500 text-xs">
                  *{zodError.phaseStatus._errors[0]}
                </span>
              )}
            </div>
          </div>
          <div className="flex flex-col h-20 items-center">
            <div className="grid w-full max-w-sm items-center  ">
              <Label htmlFor="templates" className="mb-1">
                Templates<span className="text-red-500">*</span>
              </Label>
              <Select
                name="templates"
                onValueChange={(value) => {
                  setFormState({ ...formState, templates: value });
                  setZodError({
                    ...zodError,
                    templates: null,
                  });
                }}
              >
                <SelectTrigger id="templates">
                  <SelectValue placeholder="Select template" />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value='{"key1":"value1"}'>Template 1</SelectItem>
                  <SelectItem value='{"key2":"value2"}'>Template 2</SelectItem>
                </SelectContent>
              </Select>
              {zodError?.templates?._errors[0] && (
                <span className=" text-red-500 text-xs">
                  *{zodError.templates._errors[0]}
                </span>
              )}
            </div>
          </div>
          <div className="flex flex-col h-20 items-center">
            <div className="grid w-full max-w-sm items-center mb-3">
              <Label htmlFor="file" className="mb-1">
                File
              </Label>
              <Input
                id="file"
                type="file"
                name="file"
                onChange={handleChange}
              />

              {zodError?.file?._errors[0] && (
                <span className=" text-red-500 text-xs">
                  *{zodError.file._errors[0]}
                </span>
              )}
            </div>
          </div>
          <div className="flex flex-1 justify-end w-full">
            <Button type="submit">Submit</Button>
          </div>
        </CardContent>
      </form>
    </Card>
  );
};

export default Form;
