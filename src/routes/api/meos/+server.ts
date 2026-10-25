import { unzipSync, strFromU8 } from 'fflate';
import xmlParser from '#lib/server/xmlParser.js';
import z from 'zod';
import { StringToNumber } from '#lib/utils/zod';
import { CompetitorState } from '#lib/types.js';
import { error } from '@sveltejs/kit';
import { db } from '#lib/server/db/sqlite.js';

const mopValidator = z.object({
	cls: z.object({
		'#text': z.string(),
		'@_id': StringToNumber,
		'@_ord': StringToNumber,
		'@_len': StringToNumber,
	}).array().default([]),
	cmp: z.object({
		'@_id': StringToNumber,
		"base": z.object({
			'#text': z.string(),
			'@_org': StringToNumber,
			'@_cls': StringToNumber,
			'@_rt': StringToNumber,
			'@_stat': z.string().optional().transform((val) => {
				const value = val ? Number(val) : 0;
				if (value === 0) return CompetitorState.UNKNOWN;
				else if (value === 1) return CompetitorState.OK;
				else if (value === 2) return CompetitorState.NO_TIMING;
				else if (value === 20) return CompetitorState.NO_START;
				return CompetitorState.DSQ;
			}).pipe(z.enum(CompetitorState)),
		}),
	}).array().default([]),
	org: z.object({
		'#text': z.string(),
		'@_id': StringToNumber,
	}).array().default([]),
}).default({
	cls: [],
	cmp: [],
	org: [],
}).transform(obj => ({
	cls: obj.cls.map(cls => ({
		id: cls['@_id'],
		name: cls['#text'],
		length: cls['@_len'],
		order: cls['@_ord'],
	})),
	cmp: obj.cmp.map(cmp => ({
		id: cmp['@_id'],
		name: cmp.base['#text'],
		organizationId: cmp.base['@_org'],
		classId: cmp.base['@_cls'],
		runningTime: cmp.base['@_rt'],
		state: cmp.base['@_stat'],
	})),
	org: obj.org.map(org => ({
		id: org['@_id'],
		name: org['#text'],
	})),
}));

const Validator = z.object({
	MOPComplete: mopValidator,
	MOPDiff: mopValidator,
}).transform(({ MOPComplete, MOPDiff }) => ({
	cls: [MOPComplete.cls, MOPDiff.cls].flat(),
	cmp: [MOPComplete.cmp, MOPDiff.cmp].flat(),
	org: [MOPComplete.org, MOPDiff.org].flat(),
}));

export const POST = async function ({ request }) {
	const fileBuffer = new Uint8Array(await request.arrayBuffer());
	const unzipped = unzipSync(fileBuffer);
	const result = Object.values(unzipped).map(val => strFromU8(val));
	const xml = result[0];

	const parsed = xmlParser.parse(xml);
	console.log('parsed', parsed);

	const validated = Validator.safeParse(parsed);
	if (!validated.success) {
		console.error(validated.error);
		error(500);
	}

	if (validated.data.cls.length > 0) {
		const insert = db.prepare(`
			INSERT INTO class (id, name, length, position)
			VALUES (?, ?, ?, ?)
			ON CONFLICT (id) DO UPDATE SET
				name = excluded.name,
				length = excluded.length,
				position = excluded.position;
		`);
		for (const cls of validated.data.cls) {
			insert.run(cls.id, cls.name, cls.length, cls.order);
		}
	}
	if (validated.data.cmp.length > 0) {
		const insert = db.prepare(`
			INSERT INTO competitor (id, name, organization_id, class_id, running_time, state)
			VALUES (?, ?, ?, ?, ?, ?)
			ON CONFLICT (id) DO UPDATE SET
				name = excluded.name,
				organization_id = excluded.organization_id,
				class_id = excluded.class_id,
				running_time = excluded.running_time,
				state = excluded.state;
		`);
		for (const cmp of validated.data.cmp) {
			insert.run(cmp.id, cmp.name, cmp.organizationId, cmp.classId, cmp.runningTime, cmp.state);
		}
	}
	if (validated.data.org.length > 0) {
		const insert = db.prepare(`
			INSERT INTO organization (id, name)
			VALUES (?, ?)
			ON CONFLICT (id) DO UPDATE SET
				name = excluded.name;
		`);
		for (const org of validated.data.org) {
			insert.run(org.id, org.name);
		}
	}

	return new Response(
		'<?xml version="1.0"?><MOPStatus status="OK"></MOPStatus>',
		{
			headers: {
				'Content-Type': 'application/xml',
				'Cache-Control': 'max-age=0, s-maxage=3600',
			},
		},
	);
};
