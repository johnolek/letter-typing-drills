const DEFAULTS = {
  fastMs:       350,
  mediumMs:     800,
  pauseMs:      4000,
  upcomingCount: 2,
  rhythm: {
    startMs:   2000,
    floorMs:   500,
    streakUp:  20,
    speedupMs: 100,
    tick:      true,
  },
};

class Settings {
  fastMs        = $state(DEFAULTS.fastMs);
  mediumMs      = $state(DEFAULTS.mediumMs);
  pauseMs       = $state(DEFAULTS.pauseMs);
  upcomingCount = $state(DEFAULTS.upcomingCount);
  rhythm        = $state({ ...DEFAULTS.rhythm });

  constructor() {
    try {
      const s = JSON.parse(localStorage.getItem('ld_settings') || '{}');
      if (s.fastMs        !== undefined) this.fastMs        = s.fastMs;
      if (s.mediumMs      !== undefined) this.mediumMs      = s.mediumMs;
      if (s.pauseMs       !== undefined) this.pauseMs       = s.pauseMs;
      if (s.upcomingCount !== undefined) this.upcomingCount = s.upcomingCount;
      if (s.rhythm)                      this.rhythm        = { ...DEFAULTS.rhythm, ...s.rhythm };
    } catch { /* ignore corrupt data */ }
  }

  save() {
    localStorage.setItem('ld_settings', JSON.stringify({
      fastMs:        this.fastMs,
      mediumMs:      this.mediumMs,
      pauseMs:       this.pauseMs,
      upcomingCount: this.upcomingCount,
      rhythm:        this.rhythm,
    }));
  }
}

export const settings = new Settings();
