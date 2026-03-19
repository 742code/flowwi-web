import { z } from "zod";

const DateLikeSchema = z.union([z.string(), z.date()]);

export const FormOutSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string().nullable().or(z.string()),
  is_published: z.boolean(),
  created_at: DateLikeSchema,
});

export type tFormOut = z.infer<typeof FormOutSchema>;

// Config e value são JSON livres (variam conforme o "type" do bloco)
export const FormBlockConfigSchema = z.any();

export const FormBlockOutSchema = z.object({
  id: z.number(),
  form: z.number(),
  title: z.string(),
  type: z.string(),
  required: z.boolean(),
  order: z.number(),
  config: FormBlockConfigSchema,
});

export type tFormBlockOut = z.infer<typeof FormBlockOutSchema>;

export const FormAnswerValueSchema = z.any();

export const FormAnswerOutSchema = z.object({
  id: z.number(),
  block: z.number(),
  value: FormAnswerValueSchema,
});

export type tFormAnswerOut = z.infer<typeof FormAnswerOutSchema>;

export const FormResponseOutSchema = z.object({
  id: z.number(),
  form: z.number(),
  created_at: DateLikeSchema,
  answers: z.array(FormAnswerOutSchema),
});

export type tFormResponseOut = z.infer<typeof FormResponseOutSchema>;

