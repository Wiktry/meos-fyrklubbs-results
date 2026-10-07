<script lang="ts">
	import '@fontsource-variable/roboto';
	import { type MeosData } from "$lib/query.remote";
    import { oneTenthSecondsToString } from "$lib/utils";

	let { groups, classes, competitors }: MeosData = $props();

	const competetiveClasses = $derived(classes.filter(cls => cls.id < 200));
	const openClasses = $derived(classes.filter(cls => cls.id >= 200));

	const buildOpenGroups = function () {
		const cmps = competitors.filter(cmp => openClasses.some(cls => cmp.classId === cls.id));
		const startCmps = cmps.filter(cmp => cmp.state !== 'NO_START');
		const okCmps = cmps.filter(cmp => cmp.state === 'OK');

		return {
			id: 'Öppna klasser',
			classes: openClasses,
			competitors: cmps,
			startCmps,
			okCmps,
			competetive: false,
		}
	}

	const buildTotalGroup = function () {
		const classes = [
			{
				id: 10000,
				name: 'Fyrklubbsbanorna',
			},
			{
				id: 10001,
				name: 'Tävlingen',
			},
		];

		const handledCmps = competitors.map(cmp => ({
			...cmp,
			classId: cmp.classId < 200 ? 10000 : 10001,
		}));

		return {
			id: 'Totalt',
			classes: classes,
			competitors: handledCmps,
			startCmps: handledCmps.filter(cmp => cmp.state !== 'NO_START'),
			okCmps: handledCmps.filter(cmp => cmp.state === 'OK'),
			competetive: false,
		}
	}
</script>

<article>
	<h1>Resultat Fyrklubbsorienteringen</h1>

	{#each groups as group (group.id)}
		<div class="header">
			<h2>Grupp {group.id}</h2>
			<span>({group.movements.up} upp, {group.movements.down} ner)</span>
		</div>
		<table>
			<thead>
				<tr>
					<th></th>
					<th class="bold">Tid</th>
					{#each group.classes as cls (cls.id)}
						<th>{cls.name}</th>
					{/each}
					<th class="bold">Bredd</th>
				</tr>
			</thead>
			<tbody>
				{#each group.orgs.filter(org => org.okCompetitors.length > 0) as org, index (org.id)}
					<tr>
						<td class="td-space bold">{index + 1} {org.name}</td>
						{#if org.classes.every(cls => cls.okCompetitors.length >= cls.minCmp)}
							<td class="bold">{oneTenthSecondsToString(org.totalTime, true)}</td>
						{:else}
							<td class="bold">Ej fullt</td>
						{/if}
						{#each org.classes as cls (cls.id)}
							{#if cls.okCompetitors.length >= cls.minCmp}
								<td>{oneTenthSecondsToString(cls.classTime, true)}</td>
							{:else}
								<td class="bold">Ej fullt</td>
							{/if}
						{/each}
						<td class="bold">{org.okCompetitors.length}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	{/each}
</article>

<article>
	<h1>Resultat Fyrklubbsorienteringen</h1>

	{#each [
		...groups.map(group => {
			const competitors = group.orgs.map(org => org.competitors).flat();
			const startCmps = competitors.filter(cmp => cmp.state !== 'NO_START');
			const okCmps = competitors.filter(cmp => cmp.state === 'OK');

			return {
				...group,
				competitors,
				startCmps,
				okCmps,
				competetive: true,
			}
		}),
		buildOpenGroups(),
		buildTotalGroup(),
	] as group (group.id)}
		<div class="header">
			<h2>
				{#if !group.competetive }
					{group.id}
				{:else}
					Grupp {group.id}
				{/if}
			</h2>
		</div>
		<table class={{ 'total': group.id === 'Totalt'}}>
			<thead>
				<tr>
					<th></th>
					{#each group.classes as cls (cls.id)}
						<th>{cls.name}</th>
					{/each}
					<th class="bold">Totalt</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td class="bold">Anmälda</td>
					{#each group.classes as cls (cls.id)}
						<td>{group.competitors.filter(cmp => cmp.classId === cls.id).length}</td>
					{/each}
					<td class="bold">{group.competitors.length}</td>
				</tr>
				<tr>
					<td class="bold">Startade</td>
					{#each group.classes as cls (cls.id)}
						<td>{group.startCmps.filter(cmp => cmp.classId === cls.id).length}</td>
					{/each}
					<td class="bold">{group.startCmps.length}</td>
				</tr>
				<tr>
					<td class="bold">Fullföljde</td>
					{#each group.classes as cls (cls.id)}
						<td>{group.okCmps.filter(cmp => cmp.classId === cls.id).length}</td>
					{/each}
					<td class="bold">{group.okCmps.length}</td>
				</tr>
			</tbody>
		</table>
	{/each}
</article>

<style>
	:global(*) {
		box-sizing: border-box;
	}

	:global(html), :global(body) {
    	font-family: 'Roboto Variable', sans-serif;
	}

	article {
		font-size: 16px;
		width: 210mm;
		height: 297mm;
		padding: 8mm 6mm;
		background-color: #fff;
	}

	h1 {
		margin: 12px 0;
		font-size: 1.5rem;
		color: #113b66;
	}

	.header {
		display: grid;
		grid-template-columns: max-content 1fr;
		align-items: end;
		gap: 40px;
		margin-bottom: 4px;
	}

	h2 {
		margin: 12px 0 0;
		font-size: 1.25rem;
	}

	table {
		display: grid;
		grid-template-columns: 1fr repeat(9, 64px) min-content;

		&.total {
			th:not(:first-child),
			td:not(:first-child) {
				grid-column: span 2;
			}
		}
	}

	thead,
	tbody,
	tr {
		grid-column: 1/-1;
		display: grid;
		grid-template-columns: subgrid;
	}

	.td-space {
		padding-right: 4px;
	}

	th,
	td,
	span {
		font-size: 0.75rem;
		font-weight: 400;
		display: flex;
		align-items: center;
		justify-content: start;
	}

	.bold {
		font-weight: 600;
	}
</style>
