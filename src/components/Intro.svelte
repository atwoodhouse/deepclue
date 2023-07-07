<script lang="ts">
  import { onMount } from "svelte";
  import GitHub from "./GitHub.svelte";

  let readMore: boolean | null = null;

  onMount(() => {
    if(localStorage.getItem("hide-intro") !== "true") {
      readMore = true;
      localStorage.setItem("hide-intro", "true");
    } else {
      readMore = false;
    }
  });

  const show = () => {
    readMore = true;
  }
</script>

<div class="intro">
  <h1>DeepClue</h1>
  <div class="story only-mobile">
    <p>Hey, mobile user! This game is designed for desktop use. It works on mobile devices, but I recommend fetching your laptop for the best experience.</p>
  </div>
  {#if readMore != null}
    <div class="story">
      <p>Welcome to a detective game, inspired by Cluedo. Powered by the powerful large language AI model GPT-4.</p>
      <div class="details" class:show={readMore}>
        <p>When the game begins one of the six people in the castle has just been murdered. But who of the remaining five is the murderer? That's for you to find out, detective.</p>
        <p>GPT plays all the characters and will react to any questions you ask. Interrogate the five and find out who the murderer is. When you think you've figured it out, and have gathered enough evidence, click the Accuse button to drag the culprit to court.</p>
        <p>Now the game will take a turn to become an Ace Attorney inspired court game, where it's up to you to present your evidence in a convincing way, so that the jury votes to find the murderer guilty. It won't be easy, because GPT will act attorney to defend the accused! When you've presented all your evidence, click "Let jury vote" and cross your fingers!</p>
        <button class="read-more" on:click={show}>⌄</button>
      </div>
      <button class="start-button" on:click>Let's do this!</button>
    </div>
  {/if}
  <GitHub />
</div>

<style>
  .intro {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    min-height: 100%;
    background-color: #111;
    border: 0.5rem solid #fff;
    z-index: 99;
  }
  h1 {
    font-family: "Special Elite", cursive;
    font-size: 5rem;
    text-align: center;
  }
  .story {
    margin-bottom: 1rem;
    background-color: rgb(46, 46, 46);
  }
  .details {
    position: relative;
    max-height: 6rem;
    overflow: hidden;
    transition: max-height 0.3s ease;
  }
  .details p:first-of-type {
    margin-top: 0;
  }
  .read-more {
    position: absolute;
    bottom: 0;
    left: 0;
    height: 5rem;
    width: 100%;
    border: 0;
    box-shadow: none;
    background-color: transparent;
    background-image: linear-gradient(0deg, #2e2e2e 0%, #2e2e2e 20%, #2e2e2e44 90%, #2e2e2e00 100%);
    color: #fff;
    font-size: 4rem;
    text-align: center;
    cursor: pointer;
  }
  .details.show {
    max-height: 600px;
  }
  .details.show .read-more {
    display: none;
  }
  .only-mobile {
    display: none;
  }

  .start-button {
    display: block;
    background-color: transparent;
    border: none;
    box-shadow: none;
    color: #fff;
    font-size: 2rem;
    padding: 0.5rem 1rem;
    border: 0.25rem solid #fff;
    z-index: 99;
    margin: 3rem auto 2rem;
    cursor: pointer;
  }

  @media(max-width: 600px) {
    .details.show {
      max-height: 1600px;
    }
    h1 {
      font-size: 3.5rem;
    }
    .only-mobile {
      display: block;
    }
  }

  @media (min-width: 601px) {
    .start-button:hover {
      color: #000;
      background-color: #fff;
    }
  }
</style>
