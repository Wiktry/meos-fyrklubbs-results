export const ClassState = {
	ERR: 'ERR', // An error, should never happen
	PAS: 'PAS', // Has enough to pass
	ONG: 'ONG', // Still in flux
	DSQ: 'DSQ', // Disqualified
} as const;
export const ClassStateRank = Object.fromEntries(Object.keys(ClassState).map((key, i) => [key, i]));

export * from './time.js';
export * from './settings.js';

