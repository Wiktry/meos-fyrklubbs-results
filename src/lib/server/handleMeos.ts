import { queryClasses } from './queryClasses';
import { queryCompetitors } from './queryCompetitors';
import { queryOrganizations } from './queryOrganizations';
import { definedGroups } from '../utils';

type Group = typeof definedGroups[number];
type Competitor = NonNullable<Awaited<ReturnType<typeof queryCompetitors>>>[number];
type Class = NonNullable<Awaited<ReturnType<typeof queryClasses>>>[number];
type Organization = NonNullable<Awaited<ReturnType<typeof queryOrganizations>>>[number];

let meosData: {
	competitors: Competitor[];
	classes: Class[];
	organizations: Organization[];
	groups: NonNullable<Awaited<ReturnType<typeof buildGroups>>>;
} = { classes: [], competitors: [], organizations: [], groups: [] };

export const getMeosData = function () {
	return meosData;
}

const ClassState = {
	ERR: 'ERR', // An error, should never happen
	PAS: 'PAS', // Has enough to pass
	ONG: 'ONG', // Still in flux
	DSQ: 'DSQ', // Disqualified
} as const;
const ClassStateRank = Object.fromEntries(Object.keys(ClassState).map((key, i) => [key, i]));

const queryDataFromMeOS = async function () {
	const competitors = await queryCompetitors();
	const classes = await queryClasses();
	const organizations = await queryOrganizations();

	if (!competitors || !classes || !organizations) return;	

	return { competitors, classes, organizations };
};

const buildClass = function (cls: Class, orgCompetitors: Competitor[], group: Group) {
	const classCompetitors = orgCompetitors.filter(cmp => cmp.classId === cls.id);

	const groupClass = group.classes.find(grpCls => grpCls.id === cls.id);

	const cmpNotDsq = classCompetitors.filter(cmp => cmp.state !== 'DSQ').length;

	const okCompetitors = classCompetitors.filter(cmp => cmp.state === 'OK');
	const fastestCompetitors = okCompetitors.sort((a,b) => a.runningTime - b.runningTime).slice(0, groupClass?.minCmp);

	const classTime = fastestCompetitors.reduce((res, val) => res + val.runningTime, 0);

	const setState = function () {
		// If no group class error, this should be impossible
		if (!groupClass) return ClassState.ERR; 
		// If there's enough OK competitors to match the minCmp, the class is passing
		if (fastestCompetitors.length >= groupClass.minCmp) return ClassState.PAS; 
		// If there's still enough active 
		if (cmpNotDsq >= groupClass.minCmp) return ClassState.ONG; 

		// ToDo: Remove for competition
		// if (classCompetitors.length < groupClass.minCmp) return ClassState.ONG;

		return ClassState.DSQ; 
	};

	return {
		id: cls.id,
		name: cls.name,
		order: cls.order,
		classTime,
		minCmp: groupClass?.minCmp ?? 0,
		classCompetitors,
		okCompetitors,
		state: setState(),
	}
}

const buildOrg = function (org: Organization, competitors: Competitor[], classes: Class[], group: Group) {
	const orgCompetitors = competitors.filter(cmp => cmp.organizationId === org.id);

	const handledClasses = classes
		.filter(cls => group.classes.some(_cls => _cls.id === cls.id))
		.map(cls => buildClass(cls, orgCompetitors, group))
		.sort((a,b) => a.order - b.order);

	const setState = function () {
		if (handledClasses.some(cls => cls.state === 'DSQ')) return ClassState.DSQ;
		if (handledClasses.every(cls => cls.state === 'PAS')) return ClassState.PAS;
		return ClassState.ONG;
	}

	return {
		id: org.id,
		name: org.name,
		classes: handledClasses,
		competitors: orgCompetitors,
		totalTime: handledClasses.reduce((res, cls) => res + cls.classTime, 0),
		state: setState(),
	}
}

const buildGroups = function ({ classes, competitors, organizations }: NonNullable<Awaited<ReturnType<typeof queryDataFromMeOS>>>) {
	return definedGroups.map(group => {
		const orgs = organizations
			.filter(org => group.orgs.includes(org.id))
			.map(org => buildOrg(org, competitors, classes, group))
			.sort((a,b) => {
				if (a.state !== b.state) {
					return ClassStateRank[a.state] - ClassStateRank[b.state];
				}
				return (a.totalTime || Infinity) - (b.totalTime || Infinity);
			});

		const groupClasses = classes.reduce<(Class & { minCmp: number })[]>((res, cls) => {
			const grpCls = group.classes.find(gCls => gCls.id === cls.id);
			if (grpCls) {
				res.push({
					...cls,
					minCmp: grpCls.minCmp,
				});
			}
			return res;
		}, []);

		return {
			id: group.id,
			classes: groupClasses,
			orgs: orgs
		}
	});
}

export const handleMeOS = async function () {
	const response = await queryDataFromMeOS();
	if (!response) return;
	const data = buildGroups(response);

	meosData = {
		competitors: response.competitors,
		classes: response.classes,
		organizations: response.organizations,
		groups: data,
	};
}
