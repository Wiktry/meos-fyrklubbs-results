import { StringToNumber } from "$lib/utils/zod";
import z from "zod";
import xmlParser from "./xmlParser";
import { getAddress } from "./getAddress";

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

export const queryClasses = async function () {
    try {
		const response = await fetch(`${getAddress()}/meos?get=class`);
        const xml = await response.text();
        const parsed = xmlParser.parse(xml);
        const validated = ClassValidator.parse(parsed);
        return validated;
    } catch (error) {
        console.error(error);
    }
};