<script>
    import { state } from "$lib/stores";
</script>

<div class="progress-bar">
  {#each Array(20).fill(null) as step}
    <div class="step" />
  {/each}
  <div class="progress" style={`transform: translateX(-${$state.questions / 2 * 10}%)`} />
</div>

<style>
  .progress-bar {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 0.75rem;
    background-color: #001a05;
    display: flex;
    z-index: 8;
  }
  .step {
    border-right: 1px solid #49a459;
    flex: 1;
  }
  .progress {
    position: fixed;
    top: 0;
    left: 0;
    height: 0.75rem;
    background-color: #49a459;
    width: 100%;
    transition: transform 0.3s ease;
  }
</style>
