export * from './time.js';
export * from './settings.js';

export const ClassStateRank = Object.fromEntries(Object.keys(ClassState).map((key, i) => [key, i]));
