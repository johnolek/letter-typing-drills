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
</script>

<div class="outer">
  <div class="track-slot">
    <div class="track" style:height="{height}px">
    <div class="fill" style:width="{tweenVal.current}%" style:background={color}></div>
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
    transition: height 0.3s ease;
  }

  .fill {
    height: 100%;
    border-radius: 3px;
  }

  .badge {
    font-family: var(--mono);
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.3px;
    margin-top: 4px;
  }
</style>
