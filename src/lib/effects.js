/**
 * Spawn CSS particle elements into a container div.
 * The container should be positioned absolutely at the burst origin.
 */
export function spawnParticles(container, count, c1, c2) {
  for (let i = 0; i < count; i++) {
    const p   = document.createElement('div');
    const sz  = 3 + Math.random() * 5;
    const ang = Math.random() * Math.PI * 2;
    const dst = 40 + Math.random() * 80;
    const dx  = Math.cos(ang) * dst;
    const dy  = Math.sin(ang) * dst;
    const clr = Math.random() > 0.5 ? c1 : c2;
    const dur = 300 + Math.random() * 300;

    p.style.cssText = `
      position:absolute;
      border-radius:50%;
      pointer-events:none;
      width:${sz}px; height:${sz}px;
      background:${clr};
      left:0; top:0;
      transition: all ${dur}ms cubic-bezier(0.22,1,0.36,1);
      opacity:1;
    `;
    container.appendChild(p);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        p.style.transform = `translate(${dx}px,${dy}px)`;
        p.style.opacity = '0';
      });
    });

    setTimeout(() => p.remove(), dur + 50);
  }
}
