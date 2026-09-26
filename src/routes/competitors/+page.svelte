<script lang="ts">
    import StarEmptyIcon from "$lib/assets/icons/StarEmptyIcon.svelte";
    import StarFullIcon from "$lib/assets/icons/StarFullIcon.svelte";
    import Pagination from "$lib/components/Pagination.svelte";
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

	let cmpSearch = $state('');
	let activeCmps = $derived(competitors.filter(cmp => cmp.name.toLocaleLowerCase().includes(cmpSearch.toLocaleLowerCase())))

	let currentPage = $state(0);
	let totalPages = $derived(Math.ceil(activeCmps.length / 40));

	const onPageChange = function (newPage: number) {
		currentPage = newPage;
	}

	let favoriteCmps = $state<number[]>([]);

	const setFavorite = function (id: number) {
		if (favoriteCmps.includes(id)) {
			favoriteCmps = favoriteCmps.filter(fv => fv !== id);
		} else {
			favoriteCmps.push(id);
		}
		localStorage.setItem(FAVORITE_CMPS_KEY, JSON.stringify(favoriteCmps));
	}

	onMount(() => {
		favoriteCmps = FavoriteCmpsValidator.parse(JSON.parse(localStorage.getItem(FAVORITE_CMPS_KEY) ?? '[]'));
	});
</script>

<h1>Deltagare</h1>
<label>
	<span>Sök efter deltagare</span>
	<input type="text" placeholder="Sök efter deltagare..." bind:value={cmpSearch} />
</label>

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
			{#each activeCmps.slice(currentPage * 40, currentPage * 40 + 40) as cmp (cmp.id)}
				{let cls = $derived(classes.find(cls => cls.id === cmp.classId))}
				{let org = $derived(organizations.find(org => org.id === cmp.organizationId))}

				<TableRow>
					<TableData>
						<button type="button" onclick={() => setFavorite(cmp.id)}>
							{#if favoriteCmps.includes(cmp.id)}
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

<Pagination currentPage={currentPage} pageCount={totalPages} onPageChange={onPageChange} />

<style>
	label {
		display: flex;
		flex-flow: column nowrap;
		gap: 4px;
		padding: 16px 8px;
	}

	input {
		height: 32px;
		padding: 0 12px;
		font-size: 0.875rem;
		border: 1px solid var(--borderColor);
		border-radius: 8px;
	}

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
