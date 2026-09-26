<script lang="ts">
    import { resolve } from "$app/paths";
    import { queryData } from "$lib/query.remote";

	let { organizations } = $derived(await queryData());
</script>

<ul>
	{#each organizations as org (org.id)}
		<li>
			<a href={resolve(`/clubs/${org.id}`)}>
				{org.name}
			</a>
		</li>
	{/each}
</ul>
