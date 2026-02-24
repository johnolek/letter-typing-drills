<script>
  // Props
  // queue        – string[] (queue[0] = current letter, queue[1..] = upcoming)
  // upcomingCount – how many upcoming slots to show
  // controls     – $bindable object; parent can call controls.flash(color) / controls.shake()
  let { queue, upcomingCount, controls = $bindable(null) } = $props();

  // DOM refs populated via use:attachSlot action
  let slotEls = [];
  let animTimer = null;
  let initialized = false;
  let prevFirst = '';

  // Expose imperative API to parent
  controls = {
    flash(color) {
      const s = slotEls[0];
      if (!s) return;
      s.style.color = color;
      setTimeout(() => { s.style.color = ''; }, 130);
    },
    shake() {
      const s = slotEls[0];
      if (!s) return;
      s.classList.remove('shaking');
      void s.offsetWidth;
      s.classList.add('shaking');
      setTimeout(() => s.classList.remove('shaking'), 350);
    },
  };

  // Svelte action: store element ref by index
  function attachSlot(el, i) {
    slotEls[i] = el;
    return { destroy() { slotEls[i] = null; } };
  }

  // Compute inline style for each slot position
  function slotStyle(i) {
    if (i === 0) {
      return 'font-size:28vw;opacity:1;transform:translateX(0);z-index:20;';
    }
    const sizePct = Math.pow(0.58, i);
    const size    = Math.max(2, 28 * sizePct);
    const opacity = Math.max(0.04, Math.pow(0.42, i));
    let x = 0;
    for (let j = 0; j < i; j++) x += Math.max(3, 28 * Math.pow(0.58, j)) * 0.62;
    return `font-size:${size}vw;opacity:${opacity};transform:translateX(${x}vw);z-index:${20 - i};`;
  }

  // Slide-in animation for slot0 when current letter changes
  $effect(() => {
    const curr = queue[0] ?? '';
    if (initialized && curr && curr !== prevFirst) {
      const s = slotEls[0];
      if (s) {
        clearTimeout(animTimer);
        s.style.transition = 'none';
        s.style.opacity    = '0';
        s.style.transform  = 'translateX(14px)';
        void s.offsetWidth;
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            s.style.transition = 'opacity 110ms ease-out, transform 110ms cubic-bezier(0.22,1,0.36,1)';
            s.style.opacity    = '1';
            s.style.transform  = 'translateX(0)';
            animTimer = setTimeout(() => { s.style.transition = ''; }, 120);
          });
        });
      }
    }
    initialized = true;
    prevFirst   = curr;
  });
</script>

<div class="carousel">
  {#each Array.from({ length: 1 + Math.min(upcomingCount, 9) }, (_, i) => i) as i}
    <div
      class="carousel-slot"
      style={slotStyle(i)}
      use:attachSlot={i}
    >{queue[i] ?? ''}</div>
  {/each}
</div>

<style>
  .carousel {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    height: 160px;
    width: 100%;
  }

  .carousel-slot {
    position: absolute;
    font-family: 'Menlo', 'Courier New', monospace;
    font-weight: 700;
    line-height: 1;
    user-select: none;
    white-space: nowrap;
    color: var(--text);
  }

  /* shake must use :global because the class is added imperatively */
  :global(.shaking) {
    animation: shake 0.3s ease !important;
  }
</style>
