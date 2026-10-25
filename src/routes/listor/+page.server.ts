import { getMeosData } from "#lib/server/handleMeos";

export const load = async function () {
	// await queryDataFromMeOS();

	return { ...getMeosData() };
};
