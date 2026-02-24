const DEFAULTS = {
  fastMs:        350,
  mediumMs:      800,
  pauseMs:       4000,
  upcomingCount: 2,
};

class Settings {
  fastMs        = $state(DEFAULTS.fastMs);
  mediumMs      = $state(DEFAULTS.mediumMs);
  pauseMs       = $state(DEFAULTS.pauseMs);
  upcomingCount = $state(DEFAULTS.upcomingCount);

  constructor() {
    try {
      const s = JSON.parse(localStorage.getItem('ld_settings') || '{}');
      if (s.fastMs        !== undefined) this.fastMs        = s.fastMs;
      if (s.mediumMs      !== undefined) this.mediumMs      = s.mediumMs;
      if (s.pauseMs       !== undefined) this.pauseMs       = s.pauseMs;
      if (s.upcomingCount !== undefined) this.upcomingCount = s.upcomingCount;
    } catch { /* ignore corrupt data */ }
  }

  save() {
    localStorage.setItem('ld_settings', JSON.stringify({
      fastMs:        this.fastMs,
      mediumMs:      this.mediumMs,
      pauseMs:       this.pauseMs,
      upcomingCount: this.upcomingCount,
    }));
  }
}

export const settings = new Settings();
