import { getMeosData } from "$lib/server/handleMeos";

export const GET = async function () {
	const { groups } = getMeosData();

	const csv: string[] = [';;', 'Breddtävlingen Fyrklubbsorienteringen;;'];
	for (const group of groups) {
		csv.push(`Grupp ${group.id};;`);

		const orgs = group.orgs
			.map((org) => ({
				index: 0,
				name: org.name,
				competitors: org.competitors.filter(cmp => {
					if (cmp.state !== 'OK') return false;
					if (!org.classes.some(cls => cls.id === cmp.classId)) return false;
					return true;
				}).length,
			}))
			.sort((a,b) => b.competitors - a.competitors)
			.filter(org => org.competitors > 0)
			.map((org, i) => ({ ...org, index: i + 1 }));

		for (const org of orgs) {
			csv.push([
				org.index,
				org.name,
				org.competitors,
			].join(';'));
		}
		csv.push(';;');
	}

	return new Response(csv.join('\n'), {
		headers: {
			'Content-Type': 'text/csv; charset=utf-8',
			'Content-Disposition': 'attachment; filename="export.csv"'
		}
	});
};
