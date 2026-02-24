export class DrillSession {
  // ── Reactive UI state ──
  queue         = $state([]);
  correct       = $state(0);
  attempts      = $state(0);
  mistakeOnCurrent = $state(false);
  isFirst       = $state(true);

  // ── Internal timing (not reactive) ──
  #letters        = [];
  #targetShownAt  = 0;
  #sessionStart   = 0;

  constructor(letters, upcomingCount) {
    this.#letters = letters;
    this.#fill(upcomingCount);
    this.#targetShownAt = performance.now();
  }

  // ── Derived getters ──
  get currentLetter() { return this.queue[0] ?? ''; }

  get accuracy() {
    if (this.attempts === 0) return null;
    return Math.round(this.correct / this.attempts * 100);
  }

  get lpm() {
    if (this.correct < 2 || this.#sessionStart === 0) return null;
    const mins = (performance.now() - this.#sessionStart) / 60000;
    return Math.round(this.correct / mins);
  }

  // ── Input handling ──
  // Returns { hit, letter, speed, timeMs, skipTime, isFirst }
  // speed: 'fast' | 'medium' | 'slow' | null
  handleInput(typed, settings) {
    const now    = performance.now();
    const rawMs  = Math.round(now - this.#targetShownAt);
    const paused = rawMs > settings.pauseMs;
    const hit    = typed === this.currentLetter;
    const letter = this.currentLetter;

    if (this.isFirst) {
      this.isFirst = false;
      this.#sessionStart = now;
      this.attempts++;
      if (hit) {
        this.correct++;
        this.advance(settings.upcomingCount);
      } else {
        this.mistakeOnCurrent = true;
      }
      return { hit, letter, speed: null, timeMs: 0, skipTime: true, isFirst: true };
    }

    this.attempts++;

    if (hit) {
      this.correct++;
      const skipTime = paused || this.mistakeOnCurrent;
      const timeMs   = skipTime ? 0 : rawMs;
      const speed    = skipTime  ? null
        : rawMs <= settings.fastMs   ? 'fast'
        : rawMs <= settings.mediumMs ? 'medium'
        : 'slow';
      this.advance(settings.upcomingCount);
      return { hit: true, letter, speed, timeMs, skipTime, isFirst: false };
    } else {
      this.mistakeOnCurrent = true;
      return { hit: false, letter, speed: null, timeMs: 0, skipTime: true, isFirst: false };
    }
  }

  advance(upcomingCount) {
    this.queue.shift();
    this.#fill(upcomingCount);
    this.#targetShownAt  = performance.now();
    this.mistakeOnCurrent = false;
  }

  // ── Private helpers ──
  #fill(upcomingCount) {
    const needed = 1 + upcomingCount;
    while (this.queue.length < needed) this.queue.push(this.#pick());
  }

  #pick() {
    const last = this.queue.length > 0 ? this.queue[this.queue.length - 1] : '';
    let l;
    do { l = this.#letters[Math.floor(Math.random() * this.#letters.length)]; }
    while (l === last && this.#letters.length > 1);
    return l;
  }
}
