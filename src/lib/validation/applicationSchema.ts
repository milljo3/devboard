import { z } from "zod";
import {ApplicationStatus} from "@prisma/client";

export const applicationCreateSchema = z.object({
    company: z.string().min(1).max(50),
    companyUrl: z.string().url().max(250).optional().or(z.literal("")),
    position: z.string().min(1).max(50),
    applicationUrl: z.string().url().max(250).optional().or(z.literal("")),
    status: z.nativeEnum(ApplicationStatus),
});

export const applicationUpdateSchema = applicationCreateSchema.partial();
