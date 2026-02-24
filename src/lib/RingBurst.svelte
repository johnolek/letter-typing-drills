<script>
  // trigger: $bindable number — increment to fire
  // type: '' | 'gold'
  let { trigger = $bindable(0), type = '' } = $props();

  let el;
  let prev = 0;

  $effect(() => {
    if (trigger > prev) {
      prev = trigger;
      if (!el) return;
      el.className = `ring-burst ${type}`;
      void el.offsetWidth;
      el.classList.add('go');
      setTimeout(() => { el.className = 'ring-burst'; }, 600);
    }
  });
</script>

<div bind:this={el} class="ring-burst"></div>

<style>
  .ring-burst {
    position: absolute;
    top: calc(6vh + 80px);
    left: 50%;
    width: 0; height: 0;
    border-radius: 50%;
    pointer-events: none;
    z-index: 8;
    transform: translate(-50%, -50%);
  }

  :global(.ring-burst.go) {
    animation: ringExpand 0.5s ease-out forwards;
  }

  :global(.ring-burst.gold.go) {
    animation: ringExpandGold 0.5s ease-out forwards;
  }
</style>
