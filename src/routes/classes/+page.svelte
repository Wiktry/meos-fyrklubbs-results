<script lang="ts">
    import { resolve } from "$app/paths";
    import { queryData } from "$lib/query.remote";

	let { groups, classes } = $derived(await queryData());
	let openClasses = $derived(classes.filter(cls => !groups.some(grp => grp.classes.some(gCls => gCls.id === cls.id))))
</script>

{#each groups as grp (grp.id)}
	<h2>Grupp {grp.id}</h2>

	<ul>
		{#each grp.classes as cls (cls.id)}
			<li>
				<a href={resolve(`/classes/${cls.id}`)}>{cls.name}</a>
			</li>
		{/each}
	</ul>
{/each}

<h2>Öppna klasser</h2>

<ul>
	{#each openClasses as cls (cls.id)}
		<li>
			<a href={resolve(`/classes/${cls.id}`)}>{cls.name}</a>
		</li>
	{/each}
</ul>
