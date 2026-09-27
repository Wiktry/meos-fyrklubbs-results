<script lang="ts">
    import { page } from "$app/state";
    import Table from "$lib/components/Table.svelte";
    import TableData from "$lib/components/TableData.svelte";
    import TableHead from "$lib/components/TableHead.svelte";
    import TableRow from "$lib/components/TableRow.svelte";
    import { queryData } from "$lib/query.remote";
    import { oneTenthSecondsToString } from "$lib/utils";

	let classId = $derived(Number(page.params.classId));
	let { classes, competitors, organizations } = $derived(await queryData());
	let currentClass = $derived(classes.find(cls => cls.id === classId));
	let currentCompetitors = $derived(
		competitors.filter(cmp => cmp.classId === classId)
		.sort((a,b) => {
			const getRank = function (val: string) {
				if (val === 'DSQ') return 0;
				return 1;
			} 

			if (a.state !== b.state) {
				return getRank(a.state) - getRank(b.state);
			}
			return (a.runningTime || Infinity) - (b.runningTime || Infinity);
		})
	);
	let firstTime = $derived(currentCompetitors.reduce((res, cmp) => Math.min(res, cmp.runningTime || Infinity), Infinity));
</script>

<div class="spacer"></div>

<div class="table-wrapper">
	{#if currentClass}
		<h1>{currentClass.name}</h1>

		<Table columns="minmax(min-content, 2fr) minmax(min-content, 1fr) 64px 64px">
			{#snippet head()}
				<TableRow head>
					<TableHead>Deltagare</TableHead>
					<TableHead>Klubb</TableHead>
					<TableHead>Tid</TableHead>
					<TableHead>Efter</TableHead>
				</TableRow>
			{/snippet}
			{#snippet body()}
				{#each currentCompetitors as cmp, i (cmp.id)}
					{let org = $derived(organizations.find(org => org.id === cmp.organizationId))}
					<TableRow>
						<TableData>
							<div class="name-data">
								<span>
									{#if cmp.runningTime > 0}
										{i + 1}.
									{/if}
								</span>
								<span>{cmp.name}</span>
							</div>
						</TableData>
						<TableData>{org?.name}</TableData>
						<TableData>
							{#if cmp.state === 'DSQ'}
								DSQ
							{:else if cmp.runningTime > 0}
								{oneTenthSecondsToString(cmp.runningTime)}
							{:else}
								-- : --
							{/if}
						</TableData>
						<TableData>
							{#if cmp.runningTime > 0 && cmp.state === 'OK'}
								{oneTenthSecondsToString(cmp.runningTime - firstTime)}
							{:else}
								-- : --
							{/if}
						</TableData>
					</TableRow>
				{/each}
			{/snippet}
		</Table>
	{/if}
</div>

<style>
	h1 {
		position: sticky;
		width: fit-content;
		left: 0;
	}

	.name-data {
		display: grid;
		grid-template-columns: 16px 1fr;
		align-items: center;
		padding-left: 8px;
	}
</style>
