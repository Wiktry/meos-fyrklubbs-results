import { XMLParser } from 'fast-xml-parser';
import { z } from 'zod';

const xmlParser = new XMLParser({ ignoreAttributes: false });

const StringToNumber = z.string().optional().transform(val => val ? Number(val) : 0).pipe(z.number());

const CompetitorValidator = z.object({
    MOPComplete: z.object({
        cmp: z.object({
            '@_id': StringToNumber,
            base: z.object({
                '#text': z.string(),
                '@_org': StringToNumber,
                '@_cls': StringToNumber,
                '@_rt': StringToNumber,
            }),
        }).array(),
    })
}).transform(obj => obj.MOPComplete.cmp.map(competitor => ({
    id: competitor['@_id'],
    name: competitor.base['#text'],
    organizationId: competitor.base['@_org'],
    classId: competitor.base['@_cls'],
    runningTime: competitor.base['@_rt'],
})));

const queryCompetitors = async function () {
    try {
        const response = await fetch('http://localhost:2009/meos?get=competitor');
        const xml = await response.text();
        const parsed = xmlParser.parse(xml);
        const validated = CompetitorValidator.parse(parsed);
        return validated;
    } catch (error) {
        console.error(error);
    }
};

const ClassValidator = z.object({
    MOPComplete: z.object({
        cls: z.object({
            '#text': z.string(),
            '@_id': StringToNumber,
            '@_ord': StringToNumber,
            '@_len': StringToNumber,
        }).array(),
    }),
}).transform(obj => obj.MOPComplete.cls.map(cls => ({
    id: cls['@_id'],
    name: cls['#text'],
    length: cls['@_len'],
    order: cls['@_ord'],
})).sort((a,b) => a.order - b.order));

const queryClasses = async function () {
    try {
        const response = await fetch('http://localhost:2009/meos?get=class');
        const xml = await response.text();
        const parsed = xmlParser.parse(xml);
        const validated = ClassValidator.parse(parsed);
        return validated;
    } catch (error) {
        console.error(error);
    }
};

const OrganizationValidator = z.object({
    MOPComplete: z.object({
        org: z.object({
            '#text': z.string(),
            '@_id': StringToNumber,
        }).array(),
    }),
}).transform(obj => obj.MOPComplete.org.map(org => ({
    id: org['@_id'],
    name: org['#text'],
})));

const queryOrganizations = async function () {
    try {
        const response = await fetch('http://localhost:2009/meos?get=organization');
        const xml = await response.text();
        const parsed = xmlParser.parse(xml);
        const validated = OrganizationValidator.parse(parsed);
        return validated;
    } catch (error) {
        console.error(error);
    }
}

export let meosData: {
    competitors: NonNullable<Awaited<ReturnType<typeof queryCompetitors>>>;
    classes: NonNullable<Awaited<ReturnType<typeof queryClasses>>>;
    organizations: NonNullable<Awaited<ReturnType<typeof queryOrganizations>>>;
} = { classes: [], competitors: [], organizations: [] };

export const queryDataFromMeOS = async function () {
    const competitors = await queryCompetitors();
    const classes = await queryClasses();
    const organizations = await queryOrganizations();

    if (!competitors || !classes || !organizations) return;

    meosData = { competitors, classes, organizations };
};
