<script lang="ts">
	import { page } from "$app/state";
	import Table from "#lib/components/Table.svelte";
	import TableData from "#lib/components/TableData.svelte";
	import TableHead from "#lib/components/TableHead.svelte";
	import TableRow from "#lib/components/TableRow.svelte";
	import { queryData } from "#lib/query.remote";
	import { oneTenthSecondsToString } from "#lib/utils";

	let {
		groups,
	} = $derived(await queryData());

	let clubId = $derived(Number(page.params.clubId));
	let currentGroup = $derived(groups.find(grp => grp.orgs.find(org => org.id === clubId)));
	let currentOrg = $derived(currentGroup?.orgs.find(org => org.id === clubId));
</script>

{#if currentGroup && currentOrg}
	<h1>{currentOrg.name} - Grupp {currentGroup.id}</h1>

	<div class="spacer"></div>

	{#each currentOrg.classes as cls (cls.id)}
		<h2>{cls.name} ({cls.okCompetitors.length} / {cls.classCompetitors.length})</h2>
		<span>Minst {cls.minCmp} löpare måste bli godkända</span>
		<Table columns="minmax(min-content, 1fr) 48px">
			{#snippet head()}
				<TableRow>
					<TableHead>Deltagare</TableHead>
					<TableHead>Tid</TableHead>
				</TableRow>
			{/snippet}
			{#snippet body()}
				{#each cls.classCompetitors.sort((a,b) => {
					{
						const getRank = function (val: string) {
							if (val === 'DSQ') return 10;
							if (val === 'OK') return 0;
							return 5;
						}; 

						if (a.state !== b.state) {
							return getRank(a.state) - getRank(b.state);
						}
						return (a.runningTime || Infinity) - (b.runningTime || Infinity);
					}
				}) as cmp (cmp.id)}
					<TableRow>
						<TableData>{cmp.name}</TableData>
						<TableData>
							{#if cmp.runningTime > 0}
								{oneTenthSecondsToString(cmp.runningTime)}
							{:else}
								-- : --
							{/if}
						</TableData>
					</TableRow>
				{/each}
			{/snippet}
		</Table>
	{/each}
{/if}
