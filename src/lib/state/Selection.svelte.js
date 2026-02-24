class Selection {
  set = $state(new Set());

  constructor() {
    try {
      const saved = JSON.parse(localStorage.getItem('ld_sel') || '[]');
      this.set = new Set(saved);
    } catch { /* ignore */ }
  }

  toggle(ch) {
    if (this.set.has(ch)) {
      this.set.delete(ch);
    } else {
      this.set.add(ch);
    }
    this.save();
  }

  has(ch)     { return this.set.has(ch); }
  get size()  { return this.set.size; }
  get letters() { return [...this.set]; }

  setAll(str) {
    this.set = new Set(str.split(''));
    this.save();
  }

  clear() {
    this.set = new Set();
    this.save();
  }

  save() {
    localStorage.setItem('ld_sel', JSON.stringify([...this.set]));
  }
}

export const selection = new Selection();
