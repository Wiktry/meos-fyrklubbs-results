import { handleMeOS } from "$lib/server/handleMeos";

const handleMeosTimeout: { timeout: NodeJS.Timeout | undefined } = { timeout: undefined };
console.log('handleMeosTimeout', handleMeosTimeout);

const handleQuery = async function () {
	clearTimeout(handleMeosTimeout.timeout);

    console.log('Running query...');
    try {
        await handleMeOS();
        console.log('Query complete');
    } catch (error) {
        console.error(error);
    }
    handleMeosTimeout.timeout = setTimeout(() => handleQuery(), 5000);
}
handleQuery();
