<script>
  import { accuse, vote } from "$lib/actions";
  import { messages, state } from "$lib/stores";

  let value = "";
  let awaitingConfirmation = false;

  const submit = () => {
    messages.addFromUser(value);
    value = "";
  };
</script>

<div class="user-input">
  <div>
    <form on:submit|preventDefault={submit}>
      <input bind:value placeholder="Reply here..." disabled={$state.waitingForAI} />
    </form>
    {#if $state.stage === 1}
      <button on:click={() => (awaitingConfirmation = true)}>Accuse</button>
    {:else if $state.stage === 3}
      <button on:click={vote}>Let jury vote</button>
    {/if}
  </div>
</div>

{#if awaitingConfirmation}
  <div class="overlay">
    <div class="modal">
      <h1>Do you know who the murderer is?</h1>
      <div class="options">
        <button on:click={() => (awaitingConfirmation = false)}>No, continue the questioning</button
        >
        <button on:click={accuse}>Yes, I know who the murderer is</button>
      </div>
    </div>
  </div>
{/if}

<style>
  .user-input {
    position: fixed;
    left: 0;
    bottom: 0.5rem;
    width: 100%;
    z-index: 4;
  }
  .user-input > div {
    width: 90%;
    max-width: 60rem;
    margin: auto;

    display: flex;
    flex-direction: column;
  }
  form {
    flex: 1;
    padding-bottom: 0.5rem;
  }
  input {
    width: 100%;
    padding: 0.25rem 1rem;
    font-size: 1.5rem;
    font-family: "Electrolize", sans-serif;
    border: 2px solid #54c6be;
    box-shadow: inset 0 0 16px 2px #54c6be;
  }

  .overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #0009;
    z-index: 9;
  }
  .modal {
    padding: 1rem;
  }
  button {
    border-radius: 0;
    font-size: 1.5rem;
    font-family: "Electrolize", sans-serif;
    background-color: #111111;
    border: 2px solid #fff;
    color: #fff;
    cursor: pointer;
  }

  .options button {
    display: block;
    width: 100%;
    margin: 1rem 0;
  }

  @media (min-width: 601px) {
    .user-input {
      bottom: 1rem;
    }
    .user-input > div {
      flex-direction: row;
    }
    form {
      padding-right: 0.5rem;
      padding-bottom: 0;
    }
    button:hover {
      background-color: #fff;
      color: #000;
    }
  }
</style>
