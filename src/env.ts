import { defineEnvVars } from "@sveltejs/kit/env";
import z from "zod";

export const variables = defineEnvVars({
	REMOTE_ADDR: {},
	DOCKER: {
		schema: z.string().transform(val => val === 'true'),
	},
});
