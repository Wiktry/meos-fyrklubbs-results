import { DOCKER, REMOTE_ADDR } from '$app/env/private';

export const getAddress = function () {
	if (REMOTE_ADDR) return REMOTE_ADDR;
	if (DOCKER) return 'http://host.docker.internal:2009';
	return 'http://localhost:2009';
};
