import { CompetitorState } from "$lib/types";
import { StringToNumber } from "$lib/utils/zod";
import z from "zod";
import xmlParser from "./xmlParser";
import { getAddress } from "./getAddress";

const CompetitorValidator = z.object({
    MOPComplete: z.object({
        cmp: z.object({
            '@_id': StringToNumber,
            base: z.object({
                '#text': z.string(),
                '@_org': StringToNumber,
                '@_cls': StringToNumber,
                '@_rt': StringToNumber,
                '@_stat': z.string().optional().transform(val => {
                    const value = val ? Number(val) : 0;
                    if (value === 0) return CompetitorState.UNKNOWN;
                    else if (value === 1) return CompetitorState.OK;
                    else if (value === 2) return CompetitorState.NO_TIMING;
					else if (value === 20) return CompetitorState.NO_START;
                    return CompetitorState.DSQ;
                }).pipe(z.enum(CompetitorState))
            }),
        }).array(),
    })
}).transform(obj => obj.MOPComplete.cmp.map(competitor => ({
    id: competitor['@_id'],
    name: competitor.base['#text'],
    organizationId: competitor.base['@_org'],
    classId: competitor.base['@_cls'],
    runningTime: competitor.base['@_rt'],
    state: competitor.base['@_stat'],
})));

export type CompetitorState = z.output<typeof CompetitorValidator>[number]['state'];

export const queryCompetitors = async function () {
    try {
        const response = await fetch(`${getAddress()}/meos?get=competitor`);
        const xml = await response.text();
        const parsed = xmlParser.parse(xml);
        const validated = CompetitorValidator.parse(parsed);
        return validated;
    } catch (error) {
        console.error(error);
    }
};
