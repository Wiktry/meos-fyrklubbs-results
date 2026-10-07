import { query } from "$app/server";
import { getMeosData } from "./server/handleMeos";

export type MeosData = Awaited<ReturnType<typeof getMeosData>>;

export const queryData = query(function () {
	return getMeosData();
});
