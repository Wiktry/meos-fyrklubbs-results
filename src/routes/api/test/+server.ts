import { db } from "#lib/server/db";
import { json } from "@sveltejs/kit";

export const GET = async function () {
	const result = await db.prepare(`
		SELECT org.id, org.name, COUNT(cmp.id) as count FROM organization AS org
		LEFT JOIN competitor AS cmp
			ON cmp.organization_id = org.id
		GROUP BY org.id
		ORDER BY count
	`).all();
	return json(result);
};
