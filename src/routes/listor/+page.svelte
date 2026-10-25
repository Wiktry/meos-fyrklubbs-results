<script lang="ts">
	import { secondsToString } from '#lib/utils/time.js';

	let { data } = $props();

	let sortedCompetitors = $derived([...data.competitors].sort((a,b) => {
		const aOrg = data.organizations.find(org => org.id === a.organizationId);
		const bOrg = data.organizations.find(org => org.id === b.organizationId);
		if (!aOrg || !bOrg) return 0;
		return aOrg.name.toLocaleLowerCase().localeCompare(bOrg.name.toLocaleLowerCase());
	}));
</script>

<table>
	<thead>
		<tr>
			<th scope="col">Name</th>
			<th scope="col">Class</th>
			<th scope="col">Organization</th>
			<th scope="col">Running time</th>
		</tr>
	</thead>
	<tbody>
		{#each sortedCompetitors as competitor (competitor.id)}
			<tr>
				<th scope="row">{competitor.name}</th>
				<td>{data.classes.find(cls => cls.id === competitor.classId)?.name}</td>
				<td>{data.organizations.find(org => org.id === competitor.organizationId)?.name}</td>
				<td>{secondsToString(competitor.runningTime / 10)}</td>
			</tr>
		{/each}
	</tbody>
</table>
