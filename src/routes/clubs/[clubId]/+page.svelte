<script lang="ts">
    import { page } from "$app/state";
    import { queryData } from "$lib/query.remote";
    import { oneTenthSecondsToString } from "$lib/utils";

	let {
		groups,
	 } = $derived(await queryData());

	 let clubId = $derived(Number(page.params.clubId));
	 let currentGroup = $derived(groups.find(grp => grp.orgs.find(org => org.id === clubId)));
	 let currentOrg = $derived(currentGroup?.orgs.find(org => org.id === clubId));
</script>

<div class="spacer"></div>

{#if currentGroup && currentOrg}
	<h1>{currentOrg.name} - Grupp {currentGroup.id}</h1>
	{#each currentOrg.classes as cls (cls.id)}
		<h2>{cls.name} ({cls.okCompetitors.length} / {cls.classCompetitors.length})</h2>
		<span>Minst {cls.minCmp} löpare måste bli godkända</span>
		{#each cls.classCompetitors as cmp (cmp.id)}
			<div class="">
				{cmp.name}
				{oneTenthSecondsToString(cmp.runningTime)}
			</div>
		{/each}
	{/each}
{/if}

<style>
	.spacer {
		height: 20px;
	}
</style>
