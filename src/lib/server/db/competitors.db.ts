import { db } from "./sqlite";

export const findCompetitorsByIds = function () {
	const statement = db.prepare(`
		SELECT * FROM competitor
		WHERE 
	`);
};
