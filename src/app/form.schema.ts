import { z } from "zod";

const isValidJsonString = (template: string) => {
  try {
    JSON.parse(template);
    return true;
  } catch (e) {
    return false;
  }
};

export const formSchema = z.object({
  name: z.string().min(1, { message: "empty name" }),
  description: z.string().min(1, { message: "description cannot be empty" }),
  owner: z.string().min(1, { message: "owner cannot be empty" }),

  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2})?$/, {
    message: "startDate must be in ISO 8601 format",
  }),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2})?$/, {
    message: "endDate must be in ISO 8601 format",
  }),
  status: z.string().min(1, { message: "status must not be empty" }),
  phase: z.string().min(1, { message: "phase must not be empty" }),
  phaseStartDate: z.string().regex(/^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2})?$/, {
    message: "phase startDate must be in ISO 8601 format",
  }),
  phaseEndDate: z.string().regex(/^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2})?$/, {
    message: "phase endDate must be in ISO 8601 format",
  }),
  phaseStatus: z.string().min(1, { message: "phase status cannoy be empty" }),
  file: z.instanceof(File, { message: "not a file object" }).optional(),
  templates: z.string().min(1).refine(isValidJsonString, {
    message: "template cannot be parsed to json",
  }),
});
