import { db } from "./sqlite"

export const findOrganizationsByIds = function (ids: number[]) {
	const result = db.prepare(`
		SELECT * FROM organization
		WHERE id IN (SELECT value FROM json_each(?))
	`).all(JSON.stringify(ids));
};
