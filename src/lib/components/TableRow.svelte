<script lang="ts">
    import type { Snippet } from "svelte";

	interface Props {
		children: Snippet;
		head?: boolean | undefined;
		dsq?: boolean | undefined;
	}

	let { children, head, dsq }: Props = $props();
</script>

<tr class={{ head, dsq }}>
	{@render children()}
</tr>

<style>
	tr {
		grid-column: 1/-1;
		display: grid;
		grid-template-columns: subgrid;
		height: 32px;
		border-bottom: 1px solid var(--borderColor);

		&.dsq {
			background-color: var(--bgColor-danger-muted);

			:global(td) {
				background-color: var(--bgColor-danger-muted);
			}
		}

		&:hover:not(.head) {
			background-color: var(--borderColor);

			:global(td) {
				background-color: var(--borderColor);
			}
		}
	}
</style>
