<script lang="ts">
    import { queryData } from '$lib/query.remote.js';
	import { millisecondsToString } from '$lib/utils/time.js';
    import { onMount } from 'svelte';

	let data = $derived(await queryData());

	const ALL_CLASSES_KEY = 'ALL_CLASSES_ON_HOME';

	let isMobile = $state(false);
	let showAllClasses = $state(false);
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

<div class="table-wrapper">
	{#each data.groups as group (group.id)}
		{let groupClasses = data.classes.filter(cls => group.classes.some(grpCls => grpCls.id === cls.id))}

		<h1>Grupp {group.id}</h1>
		<table style="--columns: {showAllClasses ? group.classes.length : 1}; --column-width: {showAllClasses ? '64px' : '0px'};">
			<thead>
				<tr>
					<th>Klubb</th>
					{#if showAllClasses}
						{#each groupClasses as cls (cls.id)}
							<th scope="col">{cls.name}</th>
						{/each}
					{:else}
						<th></th>
					{/if}
					<th>Tid</th>
					<th>Efter</th>
				</tr>
			</thead>
			<tbody>
				{#each group.orgs as org (org.id)}
					{let firstTime = group.orgs.at(0)?.totalTime ?? 0}
					<tr class={{ 'row': true, 'dsq': org.state === 'DSQ' }}>
						<td>{data.organizations.find(_org => _org.id === org.id)?.name}</td>
						{#if showAllClasses}
							{#each org.classes as cls (cls.id)}
								<td>{millisecondsToString(cls.classTime)}</td>
							{/each}
						{:else}
							<td></td>
						{/if}
						<td>
							{millisecondsToString(org.totalTime)}
						</td>
						<td>
							{#if org.totalTime > 0}
								{millisecondsToString(org.totalTime - firstTime)}
							{:else}
								-- : --
							{/if}
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	{/each}
</div>

<style>
	.table-wrapper {
		position: relative;
		overflow: auto;
		width: 100%;
	}

	h1 {
		position: sticky;
		width: fit-content;
		left: 0;
	}

	table {
		display: grid;
		grid-template-columns: minmax(120px, 1fr) repeat(var(--columns), var(--column-width)) repeat(2, 64px);
		column-gap: 8px;
		margin-top: 8px;
		margin-bottom: 24px;
	}

	thead,
	tbody,
	tr {
		grid-column: 1/-1;
		display: grid;
		grid-template-columns: subgrid;
	}

	tr {
		height: 32px;
		border-bottom: 1px solid var(--borderColor);

		&.dsq {
			background-color: var(--bgColor-danger-muted);
			td {
				background-color: var(--bgColor-danger-muted);
			}
		}
	}

	.row:hover {
		background-color: var(--borderColor);

		td {
			background-color: var(--borderColor);
		}
	}

	th, td {
		display: flex;
		align-items: center;
	}

	td:not(:first-child) {
		text-align: center;
	}

	td:first-child,
	th:first-child {
		text-align: left;
		position: sticky;
		left: 0;
		background-color: #fff;
		border-right: 1px solid var(--borderColor);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
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
