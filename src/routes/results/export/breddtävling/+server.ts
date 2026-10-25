import { getMeosData } from "#lib/server/handleMeos";

export const GET = async function () {
	const { groups } = getMeosData();

	const csv: string[] = [';;;', 'Breddtävlingen Fyrklubbsorienteringen;;;'];
	const orgs = groups.map(group => group.orgs
		.map(org => ({
			index: 0,
			group: group.id,
			name: org.name,
			competitors: org.competitors.filter((cmp) => {
				if (cmp.state !== 'OK') return false;
				if (!org.classes.some(cls => cls.id === cmp.classId)) return false;
				return true;
			}).length,
		}))
		.filter(org => org.competitors > 0),
	).flat()
		.sort((a, b) => b.competitors - a.competitors)
		.map((org, i) => ({ ...org, index: i + 1 }));

	for (const org of orgs) {
		csv.push([
			org.index,
			org.name,
			org.group,
			org.competitors,
		].join(';'));
	}

	return new Response(csv.join('\n'), {
		headers: {
			'Content-Type': 'text/csv; charset=utf-8',
			'Content-Disposition': 'attachment; filename="export.csv"',
		},
	});
};
