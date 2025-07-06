import { z } from "zod";

export const applicationUpdateSchema = z.object({
    company: z.string().min(1).optional(),
    companyUrl: z.string().url().optional().or(z.literal("").optional()),
    position: z.string().min(1).optional(),
    applicationUrl: z.string().url().optional().or(z.literal("").optional()),
    status: z.enum(["PENDING", "INTERVIEWING", "REJECTED", "ACCEPTED", "APPLIED"]).optional(),
});
