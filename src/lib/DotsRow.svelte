<script>
  // dots: Array<'c' | 'w' | 'g'>
  let { dots = [] } = $props();
</script>

<div class="recent-row">
  {#each dots as d}
    <div class="rdot {d}"></div>
  {/each}
</div>

<style>
  .recent-row {
    display: flex;
    gap: 5px;
    height: 24px;
    align-items: center;
  }

  .rdot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    opacity: 0.7;
  }

  .rdot.c { background: var(--correct); }
  .rdot.w { background: var(--wrong); }
  .rdot.g { background: var(--gold); }
</style>
