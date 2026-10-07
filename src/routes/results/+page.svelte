<script lang="ts">
    import PrintFrame from "$lib/components/PrintFrame.svelte";
	import { queryData } from "$lib/query.remote";
    import { oneTenthSecondsToString } from "$lib/utils";
    import ResultsContent from "./PrintContent.svelte";

	let meosData = $derived(await queryData());
	let { groups } = $derived(meosData);

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let printFrame = $state<PrintFrame<any>>();
</script>

<button onclick={() => printFrame?.doPrint()}>Print</button>

<PrintFrame
	component={ResultsContent}
	props={meosData}
	bind:this={printFrame}
/>

<div class="wrapper">
	{#each groups as group (group.id)}
		<h2>Grupp {group.id}</h2>
		<table>
			<thead>
				<tr>
					<th></th>
					<th>Tid</th>
					{#each group.classes as cls (cls.id)}
						<th>{cls.name}</th>
					{/each}
					<th>Bredd</th>
				</tr>
			</thead>
			<tbody>
				{#each group.orgs as org, index (org.id)}
					<tr>
						<td class="td-space">{index + 1} {org.name}</td>
						<td class="td-space">{oneTenthSecondsToString(org.totalTime, true)}</td>
						{#each org.classes as cls (cls.id)}
							<td>{oneTenthSecondsToString(cls.classTime, true)}</td>
						{/each}
						<td>{org.competitors.length}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	{/each}
</div>

<style>
	table {
		display: grid;
		grid-template-columns: 1fr repeat(9, 80px) min-content;
	}

	thead,
	tbody,
	tr {
		grid-column: 1/-1;
		display: grid;
		grid-template-columns: subgrid;
	}

	.td-space {
		padding: 0 8px;
	}

	th,
	td {
		font-size: 0.75rem;
	}
</style>
