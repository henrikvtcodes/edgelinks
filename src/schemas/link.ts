import { z } from "zod";
import { RedirectType as PrismaRedirectEnum } from "@prismaGenerated";

const RedirectType = z.nativeEnum(PrismaRedirectEnum);

export const cacheSettingsSchema = z.object({
  maxAge: z.number().min(0).int().default(3600), // Default to 1 hour cache
  swr: z.boolean().or(z.number().min(0).int()).default(false),
});

export const linkSchema = z.object({
  description: z.string().optional(),
  url: z.string().url(),
  redirect: RedirectType.default(PrismaRedirectEnum.TEMPORARY_307),
  cacheSettings: z.literal(false).or(cacheSettingsSchema).default(false),
});
