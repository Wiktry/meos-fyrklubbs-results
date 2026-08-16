<script lang="ts">
    import { millisecondsToString, secondsToString } from '$lib/utils/time.js';

    let { data } = $props();
    console.log(data);

    const settings = {
        orgs: [
            { id: 6, group: 'A' },
            { id: 4, group: 'A' },
            { id: 20, group: 'A' },
        ],
        groups: ['A']
    }

    let sorted = $derived([...data.competitors].sort((a,b) => {
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
        {#each sorted as competitor (competitor.id)}
            <tr>
                <th scope="row">{competitor.name}</th>
                <td>{data.classes.find(cls => cls.id === competitor.classId)?.name}</td>
                <td>{data.organizations.find(org => org.id === competitor.organizationId)?.name}</td>
                <td>{secondsToString(competitor.runningTime / 10)}</td>
            </tr>
        {/each}
    </tbody>
</table>

{#each settings.groups as group (group)}
    <h1>Grupp {group}</h1>
    <table>
        <thead>
            <tr>
                <th>Klubb</th>
                {#each data.classes as cls (cls.id)}
                    <th scope="col">{cls.name}</th>
                {/each}
            </tr>
        </thead>
        <tbody>
            {#each settings.orgs as org (org.id)}
                <tr>
                    <td>{data.organizations.find(_org => _org.id === org.id)?.name}</td>
                    {#each data.classes as cls (cls.id)}
                        {let time = $derived(data.competitors.filter(cmp => cmp.classId === cls.id && cmp.organizationId === org.id).reduce((res, val) => res + val.runningTime, 0))}
                        <td>{millisecondsToString(time)}</td>
                    {/each}
                    <td>
                        {let totalTime = $derived(data.competitors.filter(cmp => cmp.organizationId === org.id).reduce((res, val) => res + val.runningTime, 0))}
                        {millisecondsToString(totalTime)}
                    </td>
                </tr>
            {/each}
        </tbody>
    </table>
{/each}
