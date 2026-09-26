<script lang="ts">
    import { resolve } from '$app/paths';
    import Table from '$lib/components/Table.svelte';
    import TableData from '$lib/components/TableData.svelte';
    import TableHead from '$lib/components/TableHead.svelte';
    import TableRow from '$lib/components/TableRow.svelte';
    import { queryData } from '$lib/query.remote.js';
	import { oneTenthSecondsToString } from '$lib/utils/time.js';
    import { onMount } from 'svelte';

	let data = $derived(await queryData());

	const ALL_CLASSES_KEY = 'ALL_CLASSES_ON_HOME';

	let isMobile = $state(false);
	let showAllClasses = $state(true);
	const toggleAllClasses = function () {
		if (showAllClasses) {
			showAllClasses = false;
			localStorage.removeItem(ALL_CLASSES_KEY);
		} else {
			showAllClasses = true;
			localStorage.setItem(ALL_CLASSES_KEY, 'true');
		}
	}

	onMount(() => {
		showAllClasses = localStorage.getItem(ALL_CLASSES_KEY) === 'true';

		$effect(() => {
			const setIsMobile = () => {
				isMobile = window.innerWidth < 768;
				if (!isMobile) showAllClasses = true;
			};
			setIsMobile();
			window.addEventListener('resize', setIsMobile);
			return () => window.removeEventListener('resize', setIsMobile);
		});
	});
</script>

<div class="all-wrapper">
	{#if isMobile}
		<button class="show-all-classes" onclick={toggleAllClasses}>
			<span>Alla klasser</span>
			<div class={{ 'toggle': true, 'toggled': showAllClasses }}>
				<span class="toggle-item"></span>
			</div>
		</button>
	{/if}
</div>

<div class="table-wrapper" style="">
	{#each data.groups as group (group.id)}
		<h1>Grupp {group.id}</h1>
		<div style="display: contents; --columns: {showAllClasses ? group.classes.length : 1}; --column-width: {showAllClasses ? '64px' : '0px'};">
			<Table columns="minmax(120px, 1fr) repeat(var(--columns), var(--column-width)) repeat(2, 64px)">
				{#snippet head()}
					<TableRow head>
						<TableHead>Klubb</TableHead>
						{#if showAllClasses}
							{#each group.classes as cls (cls.id)}
								<TableHead>{cls.name} ({cls.minCmp})</TableHead>
							{/each}
						{:else}
							<TableHead></TableHead>
						{/if}
						<TableHead>Tid</TableHead>
						<TableHead>Efter</TableHead>
					</TableRow>
				{/snippet}

				{#snippet body()}
					{#each group.orgs as org (org.id)}
						{let firstTime = $derived(group.orgs.at(0)?.totalTime ?? 0)}
						<TableRow dsq={org.state === 'DSQ'}>
							<TableData>
								<a class="club-link" href={resolve(`/clubs/${org.id}`)}>{org.name}</a>
							</TableData>
							{#if showAllClasses}
								{#each org.classes as cls (cls.id)}
									<TableData>{oneTenthSecondsToString(cls.classTime)}</TableData>
								{/each}
							{:else}
								<TableData></TableData>
							{/if}
							<TableData>
								{oneTenthSecondsToString(org.totalTime)}
							</TableData>
							<TableData>
								{#if org.totalTime > 0}
									{oneTenthSecondsToString(org.totalTime - firstTime)}
								{:else}
									-- : --
								{/if}
							</TableData>
						</TableRow>
					{/each}
				{/snippet}
			</Table>
		</div>
	{/each}
</div>

<style>
	h1 {
		position: sticky;
		width: fit-content;
		left: 0;
	}

	.club-link {
		height: 100%;
		width: 100%;
		display: grid;
		align-content: center;
		justify-content: start;
		font-weight: 500;
	}

	.all-wrapper {
		display: flex;
		flex-flow: row nowrap;
		justify-content: flex-end;
		align-items: center;
		padding: 0 8px;
		min-height: 32px;

		.show-all-classes {
			border: 0;
			padding: 0;
			margin: 0;
			background-color: transparent;
			display: flex;
			flex-flow: row nowrap;
			align-items: center;
			gap: 8px;
		}

		.toggle {
			position: relative;
			height: 24px;
			width: 48px;
			background-color: #dddee0;
			border-radius: 4px;
			cursor: pointer;
			transition: 200ms ease;

			.toggle-item {
				height: 20px;
				width: 20px;
				position: absolute;
				top: 2px;
				left: 2px;
				border-radius: 4px;
				background-color: #fff;
				transition: 200ms ease;
			}

			&.toggled {
				background-color: var(--highlight);

				.toggle-item {
					left: 26px;
				}
			}
		}
	}
</style>
