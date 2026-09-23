import { handleMeOS } from "$lib/server/handleMeos";

let handleMeosTimeout: NodeJS.Timeout;

import.meta.hot?.on('vite:beforeUpdate', () => {
	clearTimeout(handleMeosTimeout);
	handleQuery();
});

const handleQuery = async function () {
	clearTimeout(handleMeosTimeout);

    console.log('Running query...');
    try {
        await handleMeOS();
        console.log('Query complete');
    } catch (error) {
        console.error(error);
    }
    handleMeosTimeout = setTimeout(() => handleQuery(), 5000);
}
handleQuery();
