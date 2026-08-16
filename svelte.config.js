import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import adapter from '@sveltejs/adapter-node';

/** @type {import("@sveltejs/kit").Config} */
const config = {
    preprocess: vitePreprocess,
    compilerOptions: {
        experimental: {
            async: true,
        },
        runes: ({ filename }) => filename.split(/[/\\]/).includes('node_modules') ? undefined : true,
    },
    kit: {
        adapter: adapter(),
        csrf: { trustedOrigins: ['*'] },
        experimental: {
            remoteFunctions: true,
        },
        alias: {
            '$utils': '$lib/utils/index.ts',
        }
    }
}

export default config;
