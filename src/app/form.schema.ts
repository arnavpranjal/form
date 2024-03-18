import { z } from "zod";

const isValidJsonString = (template: string) => {
  try {
    JSON.parse(template);
    return true;
  } catch (e) {
    return false;
  }
};

const isFileOrNullUndefined = (file) => {
  if (file === null || file === undefined) {
    return true;
  }

  return file instanceof File;
};

export const formSchema = z.object({
  name: z.string().min(1, { message: "name cannot be empty" }),
  description: z.string().min(1, { message: "description cannot be empty" }),
  owner: z.string().min(1, { message: "owner cannot be empty" }),

  startDate: z
    .string()
    .min(1, { message: "startdate cannot be empty" })
    .regex(/^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2})?$/, {
      message: "startDate must be in ISO 8601 format",
    }),
  endDate: z
    .string()
    .min(1, { message: "enddate cannot be empty" })
    .regex(/^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2})?$/, {
      message: "endDate must be in ISO 8601 format",
    }),
  status: z.string().min(1, { message: "status cannot be empty" }),
  phase: z.string().min(1, { message: "phase cannot not be empty" }),
  phaseStartDate: z
    .string()
    .min(1, { message: "phase startdate cannot be empty" })
    .regex(/^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2})?$/, {
      message: "phase startDate must be in ISO 8601 format",
    }),
  phaseEndDate: z
    .string()
    .min(1, { message: "phase enddate cannot be empty" })
    .regex(/^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2})?$/, {
      message: "phase endDate must be in ISO 8601 format",
    }),
  phaseStatus: z.string().min(1, { message: "phase status cannot be empty" }),

  file: z.any().refine(isFileOrNullUndefined, { message: "not a file" }),

  templates: z
    .string()
    .min(1, { message: "template cannot be empty" })
    .refine(isValidJsonString, {
      message: "template cannot be parsed to json",
    }),
});
