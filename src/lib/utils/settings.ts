type Groups = 'A' | 'B' | 'C' | 'D' | 'E';

interface Group {
	id: Groups;
	classes: {
		id: number;
		note: string;
		minCmp: number;
	}[];
	orgs: number[];
	movements: { up: number; down: number };
}

export const definedGroups: Group[] = [
	{
		id: 'A',
		classes: [
			{ id: 120, minCmp: 4, note: 'DL' },
			{ id: 121, minCmp: 5, note: 'DM' },
			{ id: 122, minCmp: 5, note: 'DK' },
			{ id: 123, minCmp: 2, note: 'DKK' },
			{ id: 124, minCmp: 4, note: 'HL' },
			{ id: 125, minCmp: 5, note: 'HM' },
			{ id: 126, minCmp: 5, note: 'HK' },
			{ id: 127, minCmp: 2, note: 'HKK' },
		],
		orgs: [
			294, // OK Pan-Kristianstad
			483, // Lunds OK
			639, // Skåneslättens OL
			125, // Helsingborgs SOK
		],
		movements: { up: 0, down: 1 },
	},
	{
		id: 'B',
		classes: [
			{ id: 128, minCmp: 2, note: 'DL' },
			{ id: 129, minCmp: 3, note: 'DM' },
			{ id: 130, minCmp: 4, note: 'DK' },
			{ id: 131, minCmp: 2, note: 'DKK' },
			{ id: 132, minCmp: 4, note: 'HL' },
			{ id: 133, minCmp: 4, note: 'HM' },
			{ id: 134, minCmp: 5, note: 'HK' },
			{ id: 135, minCmp: 2, note: 'HKK' },
		],
		orgs: [
			114, // FK Göingarna
			614, // Hjärnarps OL
			111, // OK Gynge
			169, // Hästveda OK
			258, // Malmö OK
		],
		movements: { up: 1, down: 1 },
	},
	{
		id: 'C',
		classes: [
			{ id: 136, minCmp: 2, note: 'DL' },
			{ id: 137, minCmp: 2, note: 'DM' },
			{ id: 138, minCmp: 3, note: 'DK' },
			{ id: 139, minCmp: 1, note: 'DKK' },
			{ id: 140, minCmp: 3, note: 'HL' },
			{ id: 141, minCmp: 4, note: 'HM' },
			{ id: 142, minCmp: 4, note: 'HK' },
			{ id: 143, minCmp: 1, note: 'HKK' },
		],
		orgs: [
			471, // Örkelljunga FK
			35, // Andrarums IF
			54, // FK Boken
			507, // OK Kontinent
			165, // Härlövs IF
			132, // Eslövs FK
		],
		movements: { up: 1, down: 2 },
	},
	{
		id: 'D',
		classes: [
			{ id: 144, minCmp: 2, note: 'DL' },
			{ id: 145, minCmp: 2, note: 'DM' },
			{ id: 146, minCmp: 2, note: 'DK' },
			{ id: 147, minCmp: 1, note: 'DKK' },
			{ id: 148, minCmp: 2, note: 'HL' },
			{ id: 149, minCmp: 3, note: 'HM' },
			{ id: 150, minCmp: 4, note: 'HK' },
			{ id: 151, minCmp: 1, note: 'HKK' },
		],
		orgs: [
			461, // FK Åsen
			487, // OK Tyringe
			400, // Tormestorps IF
			544, // Ystads OK
			228, // IS Kullen
			558, // OK Kompassen
		],
		movements: { up: 2, down: 2 },
	},
	{
		id: 'E',
		classes: [
			{ id: 152, minCmp: 1, note: 'DL' },
			{ id: 153, minCmp: 1, note: 'DM' },
			{ id: 154, minCmp: 2, note: 'DK' },
			{ id: 155, minCmp: 1, note: 'DKK' },
			{ id: 156, minCmp: 1, note: 'HL' },
			{ id: 157, minCmp: 2, note: 'HM' },
			{ id: 158, minCmp: 3, note: 'HK' },
			{ id: 159, minCmp: 1, note: 'HKK' },
		],
		orgs: [
			81, // Frosta OK
			486, // Simrishamns OK
			350, // FK Snapphanarna
			127, // Heleneholms IF
			331, // IS Skanne
			509, // OK Origo
			327, // OK Silva
			482, // OK Torfinn
			412, // Tuvan
			297, // Ringsjö OK
			317, // Rävetofta OK
			392, // Tockarps IK
		],
		movements: { up: 2, down: 0 },
	},
];

interface Organization {
	id: number;
	group: Groups;
}

export const definedOrgs: Organization[] = definedGroups.map((group) => {
	return group.orgs.map(org => ({ id: org, group: group.id }));
}).flat();

export const definedClasses = definedGroups.map(group => group.classes).flat();
