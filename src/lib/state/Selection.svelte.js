import { SvelteSet } from 'svelte/reactivity';
import { LETTERS } from '../constants.js';

class Selection {
  set = new SvelteSet();

  constructor() {
    const raw = localStorage.getItem('ld_sel');
    if (raw) {
      try {
        for (const ch of JSON.parse(raw)) this.set.add(ch);
      } catch { /* ignore */ }
    } else {
      for (const ch of LETTERS) this.set.add(ch);
    }
  }

  toggle(ch) {
    if (this.set.has(ch)) {
      this.set.delete(ch);
    } else {
      this.set.add(ch);
    }
    this.save();
  }

  has(ch)       { return this.set.has(ch); }
  get size()    { return this.set.size; }
  get letters() { return [...this.set]; }

  setAll(str) {
    this.set.clear();
    for (const ch of str.split('')) this.set.add(ch);
    this.save();
  }

  clear() {
    this.set.clear();
    this.save();
  }

  save() {
    localStorage.setItem('ld_sel', JSON.stringify([...this.set]));
  }
}

export const selection = new Selection();
