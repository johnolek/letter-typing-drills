<script>
  import { Tween } from 'svelte/motion';
  import { cubicOut } from 'svelte/easing';

  let { val = 0, level = 0 } = $props();

  const tweenVal   = Tween.of(() => val,   { duration: 150 });
  const tweenLevel = Tween.of(() => level, { duration: 300, easing: cubicOut });

  // ── Color palette ──
  // First 10 levels are hand-picked. Beyond that, golden-ratio hue walk.
  const PALETTE = [
    '#4b5563', // 0  grey
    '#60a5fa', // 1  blue
    '#38bdf8', // 2  sky
    '#2dd4bf', // 3  teal
    '#4ade80', // 4  green
    '#a3e635', // 5  lime
    '#facc15', // 6  yellow
    '#fb923c', // 7  orange
    '#f87171', // 8  red
    '#e879f9', // 9  purple
  ];

  function colorForLevel(lvl) {
    if (lvl < PALETTE.length) return PALETTE[lvl];
    const hue = ((lvl - PALETTE.length) * 137.508) % 360;
    return `hsl(${Math.round(hue)}, 75%, 60%)`;
  }

  let color  = $derived(colorForLevel(level));
  let height = $derived(Math.min(20, 6 + level * 2));

  // ── Glow halo: level 2+, intensity maxes at level 8 ──
  let glowIntensity = $derived(
    level < 2 ? 0 : Math.min(1, (level - 2) / 6)
  );
  let glow = $derived(
    glowIntensity > 0
      ? `0 0 ${8 + glowIntensity * 16}px ${color}, 0 0 ${glowIntensity * 40}px ${color}`
      : 'none'
  );

  // ── Barber pole: level 2+, speed maxes at level 8 ──
  // 135deg = forward-leaning stripes (/), animate +X = rightward motion
  // background-size must match stripe period × √2 for seamless tiling
  const STRIPE_SIZE = 30; // px — one full tile
  let stripeOffset = $state(0);

  // Pixels per second: 15 at level 2, up to ~47 at level 8+
  let stripeSpeed = $derived(
    level < 2 ? 0 : 15 + (Math.min(level, 8) - 2) * 5.3
  );

  $effect(() => {
    if (stripeSpeed === 0) return;
    let last = performance.now();
    let frame;

    function tick(now) {
      stripeOffset = (stripeOffset + stripeSpeed * (now - last) / 1000) % STRIPE_SIZE;
      last = now;
      frame = requestAnimationFrame(tick);
    }

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  });
</script>

<div class="outer">
  <div class="track-slot">
    <div class="track" style:height="{height}px" style:box-shadow={glow}>
      <div class="fill" style:width="{tweenVal.current}%" style:background={color}>
        {#if level >= 2}
          <div
            class="stripes"
            style:background-size="{STRIPE_SIZE}px {STRIPE_SIZE}px"
            style:background-position="{stripeOffset}px 0"
          ></div>
        {/if}
      </div>
    </div>
  </div>
  <span class="badge" style:color={color}>{Math.round(tweenLevel.current)}</span>
</div>

<style>
  .outer {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: min(84vw, 340px);
    margin-bottom: 14px;
  }

  .track-slot {
    width: 100%;
    height: 20px;
    display: flex;
    align-items: center;
  }

  .track {
    width: 100%;
    background: rgba(46, 51, 59, 0.9);
    border-radius: 3px;
    overflow: hidden;
    transition: height 0.3s ease, box-shadow 0.4s ease;
  }

  .fill {
    height: 100%;
    border-radius: 3px;
    position: relative;
    overflow: hidden;
  }

  .stripes {
    position: absolute;
    inset: 0;
    background: repeating-linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.45) 0px,
      rgba(255, 255, 255, 0.45) 10px,
      transparent 10px,
      transparent 20px
    );
  }

  .badge {
    font-family: var(--mono);
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.3px;
    margin-top: 4px;
  }
</style>
