import { StringToNumber } from "$lib/utils/zod";
import z from "zod";
import xmlParser from "./xmlParser";

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

export const queryOrganizations = async function () {
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
