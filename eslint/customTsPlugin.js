import { ESLintUtils } from '@typescript-eslint/utils';

const createRules = ESLintUtils.RuleCreator(name => name);

const noRedirectInTry = createRules({
	name: 'no-redirect-in-try',
	meta: {
		type: "problem",
		docs: {
			description: "Disallow calling redirect() inside try blocks",
			// category: "Best Practices",
			// recommended: false,
		},
		messages: {
			noRedirectInTry: "Avoid calling redirect() inside a try block.",
		},
		schema: [], // no options
	},
	defaultOptions: [],
	create(context) {
		return {
			CallExpression(node) {
				if (node.callee.type !== 'Identifier' || node.callee.name !== 'redirect') {
					return;
				}

				const ancestors = context.sourceCode.getAncestors(node);
				for (const anc of ancestors) {
					if (anc.type === 'TryStatement') {
						if (ancestors.includes(anc.block)) {
							context.report({
								node,
								messageId: 'noRedirectInTry',
							});
						}
						break;
					}
				}
			},
		};
	},
});

const noErrorInTry = createRules({
	name: 'no-error-in-try',
	meta: {
		type: "problem",
		docs: {
			description: "Disallow calling error() inside try blocks",
			// category: "Best Practices",
			// recommended: false,
		},
		messages: {
			noErrorInTry: "Avoid calling error() inside a try block.",
		},
		schema: [], // no options
	},
	defaultOptions: [],
	create(context) {
		return {
			CallExpression(node) {
				if (node.callee.type !== 'Identifier' || node.callee.name !== 'error') {
					return;
				}

				const ancestors = context.sourceCode.getAncestors(node);
				for (const anc of ancestors) {
					if (anc.type === 'TryStatement') {
						if (ancestors.includes(anc.block)) {
							context.report({
								node,
								messageId: 'noErrorInTry',
							});
						}
						break;
					}
				}
			},
		};
	},
});

export const customTsPlugin = {
	rules: {
		'no-redirect-in-try': noRedirectInTry,
		'no-error-in-try': noErrorInTry,
	},
};
