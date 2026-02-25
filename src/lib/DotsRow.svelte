<script>
  import { scale } from 'svelte/transition';

  // dots: Array<{ cls: 'c' | 'w' | 'g', id: number }>
  let { dots = [] } = $props();
</script>

<div class="row">
  {#each dots as d (d.id)}
    <div class="dot {d.cls}" in:scale={{ duration: 150, start: 0.3 }}></div>
  {/each}
</div>

<style>
  .row {
    display: flex;
    gap: 5px;
    height: 24px;
    align-items: center;
  }

  .dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    opacity: 0.8;
  }

  .dot.c { background: var(--correct); box-shadow: 0 0 5px rgba(52,211,153,0.6); }
  .dot.w { background: var(--wrong);   box-shadow: 0 0 5px rgba(248,113,113,0.6); }
  .dot.g { background: var(--gold);   box-shadow: 0 0 6px rgba(251,191,36,0.7); }
</style>
