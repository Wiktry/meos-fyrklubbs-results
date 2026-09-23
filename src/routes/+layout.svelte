<script lang="ts">
	import '@fontsource-variable/roboto';
	import './app.css';
	import favicon from '$lib/assets/favicon.svg';
    import { resolve } from '$app/paths';
    import StarFullIcon from '$lib/assets/icons/StarFullIcon.svelte';
    import { onMount } from 'svelte';
    import { queryData } from '$lib/query.remote';

	let { children } = $props();

	onMount(() => {
		const interval = setInterval(() => {
			queryData().refresh();
		}, 5000);
		return () => clearInterval(interval);
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="wrapper">
	<div class="nav-wrapper">
		<nav>
			<div class="nav-items">
				<a href={resolve('/')}><span>Live</span></a>
				<a href={resolve('/')}><span>Klubbar</span></a>
				<a href={resolve('/')}><span>Klasser</span></a>
				<a href={resolve('/')}><span>Deltagare</span></a>
				<a href={resolve('/')}><i style="color: #fff;"><StarFullIcon /></i></a>
			</div>
		</nav>
	</div>
	

	<div class="content">
		{@render children()}
	</div>
</div>

<style>
	.wrapper {
		display: grid;
		grid-template-columns: minmax(min-content, 1024px);
		grid-template-rows: 40px minmax(0, 1fr);
		gap: 4px;
		justify-content: center;
	}

	nav {
		display: grid;
		grid-template-columns: minmax(0, 640px);
		justify-content: center;
		border-bottom: 1px solid var(--borderColor);
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		height: 40px;
		width: 100vw;
		background-color: #113b66;
		z-index: 999;

		.nav-items {
			display: grid;
			grid-template-columns: repeat(4, 1fr) 60px;
			gap: 8px;
		}

		a {
			text-decoration: none;
			color: #fff;
			display: grid;
			place-items: center;
			font-weight: 500;

			&:hover {
				background-color: hsl(from #113b66 h s calc(l + 10));
			}
		}
	}

	.content {
		width: 1024px;
		overflow: hidden;
	}

	@media (width < 1024px) {
		nav .nav-items {
			display: grid;
			grid-template-columns: repeat(4, 1fr) 44px;
			gap: 8px;
		}

		.wrapper {
			width: 100vw;
			overflow: hidden;
		}

		.content {
			width: 100vw;
		}
	}
</style>
