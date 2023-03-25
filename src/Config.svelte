<script>
    import {
        Dropdown,
        Button,
        ToastNotification,
    } from "carbon-components-svelte";
    import Grid from "svelte-grid-responsive";

    export let title;
    let diasMeioSemana = [
        { id: "0", text: "Segunda-feira" },
        { id: "1", text: "Terça-feira" },
        { id: "2", text: "Quarta-feira" },
        { id: "3", text: "Quinta-feira" },
        { id: "4", text: "Sexta-feira" },
    ];
    let diasFimSemana = [
        { id: "0", text: "Sábado" },
        { id: "1", text: "Domingo" },
    ];

    let toastOpen = false;
    let toastLabel;

    function click(label) {
        toastLabel = label;
        console.log("Clicou em " + toastLabel);
        toastOpen = true
    }
</script>

<Grid container gutter={12}>
    <Grid md={12}>
        <h1>{title}</h1>
    </Grid>
    <Grid md={6}>
        <Dropdown
            titleText="Meio de Semana"
            selectedId="0"
            items={diasMeioSemana}
        />
    </Grid>
    <Grid md={6}>
        <Dropdown
            titleText="Fim de Semana"
            selectedId="0"
            items={diasFimSemana}
        />
    </Grid>
</Grid>

<div class="mt-30">
    <Grid container gutter={12}>
        <Grid md={12}>
            <Button on:click={() => click("Primary")}>Primary button</Button>
            <Button kind="secondary" on:click={() => click("Secondary")}
                >Secondary button</Button
            >
            <Button kind="tertiary" on:click={() => click("Tertiary")}
                >Tertiary button</Button
            >
            <Button kind="danger" on:click={() => click("Danger")}
                >Danger button</Button
            >
        </Grid>
    </Grid>
</div>

{#if toastOpen}
    <ToastNotification
        kind=info
        title="Title"
        subtitle="Clicou em {toastLabel}" 
        caption={new Date().toLocaleString()}
        on:close={() => {toastOpen = false; console.log("Close Toast!");
        }}
    />
{/if}

<style>
    .mt-30 {
        margin-top: 30px;
    }
</style>
