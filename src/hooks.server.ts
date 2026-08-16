import { queryDataFromMeOS } from "$lib/queryData";

const handleQuery = async function () {
    console.log('Running query...');
    try {
        await queryDataFromMeOS();
        console.log('Query complete');
    } catch (error) {
        console.error(error);
    }
    setTimeout(() => handleQuery(), 5000);
}
handleQuery();
