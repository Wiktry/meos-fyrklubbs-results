<script lang="ts" module>
	interface Props {
		currentPage: number;
		pageCount: number;
		marginPageCount?: number | null | undefined;
		surroundingPageCount?: number | null | undefined;
		searchParam?: string | null | undefined;
		onPageChange?: ((newPage: number) => void) | null | undefined;
		useLinks?: boolean | undefined;
	}

	interface Page {
		page?: number;
		ellipsis?: boolean;
	}
</script>

<script lang="ts">
	let {
		currentPage,
		pageCount: externalPageCount,
		marginPageCount,
		surroundingPageCount,
		searchParam,
		onPageChange,
		useLinks,
	}: Props = $props();

	const createPages = function () {
		const margin = marginPageCount ?? 2;
		const surround = surroundingPageCount ?? 2;
		const basePages = margin * 2 + surround * 2 + 1;
		const pageCount = externalPageCount - 1;

		let pages: Page[] = [];
		if (pageCount <= basePages) {
			for (let i = 0; i < pageCount + 1; i++) {
				pages.push({ page: i });
			}

			return pages;
		}

		// First margin
		for (let i = 0; i < margin; i++) {
			if (i === margin - 1 && currentPage > margin + surround + 1) {
				pages.push({ ellipsis: true });
			} else {
				pages.push({ page: i });
			}
		}

		// First surround
		for (let i = 0; i < surround; i++) {
			if (currentPage > pageCount - (surround + margin)) {
				pages.push({ page: pageCount - ((surround + margin + 2) - i) });
			} else if (currentPage > margin + surround) {
				pages.push({ page: currentPage - (surround - i) });
			} else {
				pages.push({ page: margin + i });
			}
		}

		// Middle
		if (currentPage <= margin + surround) {
			pages.push({ page: margin + surround });
		} else if (currentPage >= pageCount - (margin + surround)) {
			pages.push({ page: pageCount - (margin + surround) });
		} else {
			pages.push({ page: currentPage });
		}

		// Second surround
		for (let i = 0; i < surround; i++) {
			if (currentPage <= surround + margin) {
				pages.push({ page: surround + margin + i + 1 });
			} else if (currentPage < pageCount - (surround + margin)) {
				pages.push({ page: currentPage + i + 1 });
			} else {
				pages.push({ page: pageCount - (margin - i + 1)});
			}
		}

		// Second margin
		for (let i = 0; i < margin; i++) {
			if (i === 0 && currentPage < pageCount - (surround + margin)) {
				pages.push({ ellipsis: true });
			} else {
				pages.push({ page: pageCount - (margin - i - 1) });
			}
		}

		return pages;
	};

	let pages = $derived.by(createPages);

	const handleClick = function (page?: number | undefined) {
		if (onPageChange && typeof page === 'number') onPageChange(page);
	};

	const createHref = function (page: number) {
		if (searchParam) {
			try {
				const url = new URL(window.location.href);
				url.searchParams.append('page', String(page));
				return url.toString();
			} catch (error) {
				console.error(error);
			}
		}

		return '#' + String(page);
	};

	let previousIndex = $derived(currentPage > 0 ? currentPage - 1 : 1);
	let nextIndex = $derived(currentPage < externalPageCount ? currentPage + 1 : externalPageCount);
</script>

{#snippet button(label: string, index: number, disabled: boolean)}
	<svelte:element this={useLinks ? 'a' : 'button'}
		class="svelte-pagination-item svelte-pagination-item-link"
		class:svelte-pagination-item-disabled={disabled}
		href="#{index}"
		onclick={() => handleClick(index)}
		role={useLinks ? 'link' : 'button'}
		type={useLinks ? null : 'button'}
	><span>{label}</span></svelte:element>
{/snippet}

<div class="svelte-pagination">
	{@render button('< Previous', previousIndex, currentPage < 1)}

	<div class="svelte-pagination-wrapper">
		<!-- eslint-disable-next-line svelte/require-each-key -->
		{#each pages as item}
			{#if typeof item.page === 'number'}
				<svelte:element this={useLinks ? 'a' : 'button'}
					class="svelte-pagination-item svelte-pagination-item-page"
					class:svelte-pagination-item-current={item.page === currentPage}
					href={createHref(item.page)}
					onclick={() => handleClick(item.page)}
					role={useLinks ? 'link' : 'button'}
					type={useLinks ? null : 'button'}
				>{item.page + 1}</svelte:element>
			{:else}
				<div class="svelte-pagination-item svelte-pagination-item-disabled">
					...
				</div>
			{/if}
		{/each}
	</div>

	{@render button('Next >', nextIndex, currentPage > externalPageCount - 2)}
</div>

<style>
	.svelte-pagination {
		display: flex;
		flex-flow: row nowrap;
		justify-content: center;
		gap: 8px;
		margin-bottom: 20px;
	}

	.svelte-pagination-wrapper {
		display: flex;
		flex-flow: row wrap;
		gap: 4px;
	}

	.svelte-pagination-item {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		border-radius: var(--pagination-border-radius, 6px);
		height: 32px;
		min-width: 32px;
		text-decoration: none;
		color: var(--fgColor-link);
		user-select: none;
		transition: background-color 200ms ease;
		cursor: pointer;
		border: 0;
		margin: 0;
		padding: 0;
		background-color: transparent;
	}

	.svelte-pagination-item-link {
		padding: 0 8px;
	}

	.svelte-pagination-item-page {
		color: var(--fgColor-default);
	}

	.svelte-pagination-item-current {
		background-color: var(--highlight);
		color: #fff;

		&:hover {
			background-color: var(--highlight-hover);
		}
	}

	.svelte-pagination-item-disabled {
		color: var(--fgColor-disabled);
		pointer-events: none;
	}
</style>
