<script lang="ts">
    import Table from "$lib/components/Table.svelte";
    import TableData from "$lib/components/TableData.svelte";
    import TableHead from "$lib/components/TableHead.svelte";
    import TableRow from "$lib/components/TableRow.svelte";
    import { queryData } from "$lib/query.remote";

	let { competitors, classes, organizations } = $derived(await queryData());

	let cmpSearch = $state('');
	let activeCmps = $derived(competitors.filter(cmp => cmp.name.toLocaleLowerCase().includes(cmpSearch.toLocaleLowerCase())))
</script>

<h1>Deltagare</h1>
<label>
	<span>Sök efter deltagare</span>
	<input type="text" placeholder="Sök efter deltagare..." bind:value={cmpSearch} />
</label>

<div class="table-wrapper">
	<Table columns="repeat(3, minmax(min-content, 1fr))" unlockFirstColumn>
		{#snippet head()}
			<TableRow>
				<TableHead>Deltagare</TableHead>
				<TableHead>Klubb</TableHead>
				<TableHead>Klass</TableHead>
			</TableRow>
		{/snippet}
		{#snippet body()}
			{#each activeCmps as cmp (cmp.id)}
				{let cls = $derived(classes.find(cls => cls.id === cmp.classId))}
				{let org = $derived(organizations.find(org => org.id === cmp.organizationId))}

				<TableRow>
					<TableData>{cmp.name}</TableData>
					<TableData>{org?.name}</TableData>
					<TableData>{cls?.name}</TableData>
				</TableRow>
			{/each}
		{/snippet}
	</Table>
</div>

<style>
	.table-wrapper {
		position: relative;
		overflow: auto;
		width: 100%;
	}

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
</style>
