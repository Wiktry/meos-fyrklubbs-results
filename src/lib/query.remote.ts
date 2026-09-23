import { query } from "$app/server";
import { getMeosData } from "./server/handleMeos";

export const queryData = query(function () {
	return getMeosData();
});
