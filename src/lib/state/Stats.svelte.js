import debounce from 'lodash-es/debounce.js';

class Stats {
  data = $state({});

  constructor() {
    try {
      this.data = JSON.parse(localStorage.getItem('ld_stats') || '{}');
    } catch { /* ignore */ }
  }

  record(letter, correct, timeMs, skipTime) {
    if (!this.data[letter]) {
      this.data[letter] = { hits: 0, misses: 0, totalMs: 0, timedCount: 0 };
    }
    const s = this.data[letter];
    if (correct) {
      s.hits++;
      if (!skipTime && timeMs > 0) {
        s.totalMs   += timeMs;
        s.timedCount++;
      }
    } else {
      s.misses++;
    }
    this.save();
  }

  getAll() { return this.data; }

  clear() {
    this.save.cancel();
    this.data = {};
    localStorage.removeItem('ld_stats');
  }

  save = debounce(() => {
    localStorage.setItem('ld_stats', JSON.stringify(this.data));
  }, 150, { maxWait: 1000 });
}

export const stats = new Stats();
