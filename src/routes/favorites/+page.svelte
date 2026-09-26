<script lang="ts">
    import StarEmptyIcon from "$lib/assets/icons/StarEmptyIcon.svelte";
    import StarFullIcon from "$lib/assets/icons/StarFullIcon.svelte";
    import Table from "$lib/components/Table.svelte";
    import TableData from "$lib/components/TableData.svelte";
    import TableHead from "$lib/components/TableHead.svelte";
    import TableRow from "$lib/components/TableRow.svelte";
    import { queryData } from "$lib/query.remote";
    import { oneTenthSecondsToString } from "$lib/utils";
    import { FAVORITE_CMPS_KEY } from "$lib/utils/keys";
    import { FavoriteCmpsValidator } from "$lib/utils/zod";
    import { onMount } from "svelte";

	let { competitors, classes, organizations } = $derived(await queryData());

	let favoriteCmps = $state<typeof competitors>();
	const setFavorite = function (comp: typeof competitors[number]) {
		if (favoriteCmps?.some(cmp => cmp.id === comp.id)) {
			favoriteCmps = favoriteCmps.filter(fv => fv.id !== comp.id);
		} else if (favoriteCmps) {
			favoriteCmps.push(comp);
		}
		localStorage.setItem(FAVORITE_CMPS_KEY, JSON.stringify(favoriteCmps?.map(cmp => cmp.id)));
	}

	onMount(() => {
		const favoriteCmpIds = FavoriteCmpsValidator.parse(JSON.parse(localStorage.getItem(FAVORITE_CMPS_KEY) ?? '[]'));
		favoriteCmps = competitors.filter(cmp => favoriteCmpIds.includes(cmp.id));
	});
</script>

<h1>Favoriter</h1>

<div class="spacer"></div>

<h2>Deltagare</h2>
{#if favoriteCmps}
	<div class="table-wrapper">
	<Table columns="48px repeat(3, minmax(min-content, 1fr)) 48px" unlockFirstColumn>
		{#snippet head()}
			<TableRow>
				<TableHead></TableHead>
				<TableHead>Deltagare</TableHead>
				<TableHead>Klubb</TableHead>
				<TableHead>Klass</TableHead>
				<TableHead>Tid</TableHead>
			</TableRow>
		{/snippet}
		{#snippet body()}
			{#each favoriteCmps as cmp (cmp.id)}
				{let cls = $derived(classes.find(cls => cls.id === cmp.classId))}
				{let org = $derived(organizations.find(org => org.id === cmp.organizationId))}

				<TableRow>
					<TableData>
						<button type="button" onclick={() => setFavorite(cmp)}>
							{#if favoriteCmps?.some(fv => fv.id === cmp.id)}
								<StarFullIcon />
							{:else}
								<StarEmptyIcon />
							{/if}
						</button>
					</TableData>
					<TableData>{cmp.name}</TableData>
					<TableData>{org?.name}</TableData>
					<TableData>{cls?.name}</TableData>
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
</div>
{:else}
	<span>Markera deltagare som favorit för att de ska synas här</span>
{/if}

<style>
	button {
		height: 100%;
		width: 100%;
		display: grid;
		place-items: center;
		background-color: transparent;
		border: 0;
		cursor: pointer;
		color: var(--highlight);

		:global(svg) {
			height: 24px;
			width: 24px;
		}
	}
</style>
