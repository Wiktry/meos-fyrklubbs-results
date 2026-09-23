import z from "zod";

export const StringToNumber = z.string().optional().transform(val => val ? Number(val) : 0).pipe(z.number());
