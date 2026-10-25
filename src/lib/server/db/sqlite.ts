import { readFileSync } from "fs";
import { DatabaseSync } from "node:sqlite";
import { join } from "path";

const buildDb = function () {
	const db = new DatabaseSync(':memory');

	db.exec(readFileSync(join(import.meta.dirname, 'tables.sql'), 'utf-8'));

	return db;
};

export const db = buildDb();

export const query = function<T> (sql: string, ...params: any[]): T[] {
	return db.prepare(sql).all(params) as unknown as T[];
};
