<script>
    import { messages, state } from "$lib/stores";

    let value = "";

    const submit = () => {
        messages.addFromUser(value);
        value = "";
    };
</script>

<form on:submit|preventDefault={submit}>
    <input bind:value placeholder="Reply here..." disabled={$state.waitingForAI} />
</form>

<style>
    input {
        position: fixed;
        bottom: 1rem;
        font-size: 1.5rem;
        padding: 0.25rem 1rem;
        border-radius: 1rem;
        border: 2px solid #54c6be;
        box-shadow: inset 0 0 16px 2px #54c6be;
        font-family: "Electrolize", sans-serif;
        width: 90%;
        margin: 0 5%;
        z-index: 4;
    }
</style>
