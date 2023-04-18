<script lang="ts">
    import { state } from "$lib/stores";

    const people = [
        {
            name: "Colonel Mustard",
            image: "colonel_mustard.jpg"
        },
        {
            name: "Doctor Orchid",
            image: "doctor_orchid.jpg"
        },
        {
            name: "Miss Scarlet",
            image: "miss_scarlet.jpg"
        },
        {
            name: "Mr. Green",
            image: "mr_green.jpg"
        },
        {
            name: "Mrs. Peacock",
            image: "mrs_peacock.jpg"
        },
        {
            name: "Professor Plum",
            image: "professor_plum.jpg"
        },
    ];

    $: focusClass = (name: string) => $state.people.includes(name);
</script>

<div class="people">
  {#each people as person(person.name)}
    <img src={person.image} class:focus={focusClass(person.name)} />
  {/each}
</div>

<style>
  .people {
    position: fixed;
    top: 50%;
    left: 0;
    width: 100%;
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    grid-gap: 1rem;
    padding: 2rem;
    transform: translate(0, -50%)
  }
  img {
    border-radius: 25%;
    width: 100%;
    transform: scale(1);
    transition: transform 1s ease;
  }
  img.focus {
    transform: scale(2);
    z-index: 2;
    animation: shake 3s linear infinite;
  }

  @keyframes shake {
    10%, 90% {
        transform: scale(2) translate3d(-1px, 0, 0);
    }
    
    20%, 80% {
        transform: scale(2) translate3d(2px, 0, 0);
    }

    30%, 50%, 70% {
        transform: scale(2) translate3d(-4px, 0, 0);
    }

    40%, 60% {
        transform: scale(2) translate3d(4px, 0, 0);
    }
    }
</style>
