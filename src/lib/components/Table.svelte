<script lang="ts">
	import './table.css';
    import type { Snippet } from "svelte";

	interface Props {
		head: Snippet;
		body: Snippet;
		columns: string;
		unlockFirstColumn?: boolean;
	}

	let { head, body, columns, unlockFirstColumn }: Props = $props();
</script>

<table class={{ unlockFirstColumn }} style="grid-template-columns: {columns};">
	<thead>
		{@render head()}
	</thead>
	<tbody>
		{@render body()}
	</tbody>
</table>

<style>
	table {
		display: grid;
		column-gap: 8px;
		margin-top: 8px;
		margin-bottom: 24px;
	}

	thead,
	tbody {
		grid-column: 1/-1;
		display: grid;
		grid-template-columns: subgrid;
	}
</style>
