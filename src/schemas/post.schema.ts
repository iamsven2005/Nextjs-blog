import { z } from "zod";

export interface AddPostFormSchema {
  title: string;
  description: string;
  sport: string;
  workoutDate: string;
  image?: string | null;
}

export const postSchemaInput = z.object({
  title: z
    .string()
    .trim()
    .max(40, { message: "Title cannot be longer than 40 characters" })
    .min(1, { message: "Title cannot be empty!" }),
  description: z
    .string()
    .trim()
    .min(1, { message: "Description cannot be empty!" })
    .max(500, { message: "Description cannot be longer than 500 characters" }),
  sport: z.string().trim().min(1, { message: "Please choose a sport" }),
  workoutDate: z
    .string()
    .trim()
    .min(1, { message: "Workout Date cannot be empty!" }),
  image: z.string().nullish().optional(),
});
