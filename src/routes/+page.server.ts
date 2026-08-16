import { meosData } from "$lib/queryData"

export const load = async function () {
    // await queryDataFromMeOS();

    return { ...meosData };
}
