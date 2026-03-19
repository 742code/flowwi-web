import { z } from "zod";

export enum eArtRequestStatus {
  Pending,
  Approved,
  Completed,
}

export const ArtRequestStatusSchema = z.enum(eArtRequestStatus);

export const ArtRequestInSchema = z.object({
  form_response_id: z.number(),

  status: ArtRequestStatusSchema,

  deadline: z.union([z.string(), z.date()]),
  approved_by: z.number().nullable(),

  approved_at: z.union([z.string(), z.date()]).nullable(),
  completed_at: z.union([z.string(), z.date()]).nullable(),

  created_at: z.union([z.string(), z.date()]),
  updated_at: z.union([z.string(), z.date()]),
});

export const ArtRequestOutSchema = z.object({
  id: z.number(),
  form_response_id: z.number(),

  status: ArtRequestStatusSchema,

  deadline: z.union([z.string(), z.date()]),
  approved_by: z.number().nullable(),

  approved_at: z.union([z.string(), z.date()]).nullable(),
  completed_at: z.union([z.string(), z.date()]).nullable(),

  created_at: z.union([z.string(), z.date()]),
  updated_at: z.union([z.string(), z.date()]),
});

export type tArtRequestIn = z.infer<typeof ArtRequestInSchema>;
export type tArtRequestOut = z.infer<typeof ArtRequestOutSchema>;
