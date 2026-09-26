import { env } from "$env/dynamic/private";

export const getAddress = function () {
	if (env.REMOTE_ADDR) return env.REMOTE_ADDR;
	if (env.DOCKER === 'true') return 'http://host.docker.internal:2009';
	return 'http://localhost:2009';
};
