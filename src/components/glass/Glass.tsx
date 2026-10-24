// The marketing pages' own look (dark glass, no Docusaurus chrome). The docs keep Docusaurus, restyled in custom.css.
import {useEffect, useRef, useState, type ReactNode} from 'react';
import Head from '@docusaurus/Head';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';

import s from './glass.module.css';

export const BETA_URL = 'https://github.com/sam-sapiol7/Tawi/releases/latest';

export function Mark({size = 28}: {size?: number}): ReactNode {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <defs>
        <linearGradient id="tawi-mark" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#38e1ff" />
          <stop offset="1" stopColor="#8b5cff" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="9" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.14)" />
      <path
        d="M8 9h16M16 9v7c0 4-4 5-5 9M16 16c0 4 4 5 5 9"
        fill="none"
        stroke="url(#tawi-mark)"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

const NAV = [
  {label: 'Docs', to: '/docs'},
  {label: 'API', to: '/docs/api/agent/tawi-agent-api'},
  {label: 'Pricing', to: '/pricing'},
  {label: 'Blog', to: '/blog'},
  {label: 'Changelog', to: '/changelog'},
];

function Nav(): ReactNode {
  const [open, setOpen] = useState(false);
  return (
    <header className={s.nav}>
      <div className={s.navInner}>
        <Link to="/" className={s.brand} aria-label="Tawi home">
          <Mark />
          <span>tawi</span>
        </Link>
        <nav className={`${s.navLinks} ${open ? s.navOpen : ''}`} aria-label="Main">
          {NAV.map((n) => (
            <Link key={n.to} to={n.to} onClick={() => setOpen(false)}>
              {n.label}
            </Link>
          ))}
        </nav>
        <Link to="/download" className={`${s.btn} ${s.btnSmall}`}>
          Download
        </Link>
        <button className={s.menu} aria-label="Menu" aria-expanded={open} onClick={() => setOpen(!open)}>
          <span />
          <span />
        </button>
      </div>
    </header>
  );
}

const FOOT = [
  {
    title: 'Product',
    links: [
      ['Download', '/download'],
      ['Pricing', '/pricing'],
      ['Changelog', '/changelog'],
      ['Blog', '/blog'],
    ],
  },
  {
    title: 'Build',
    links: [
      ['Install', '/docs/start/install'],
      ['Quick start', '/docs/start/quickstart'],
      ['Agent API', '/docs/guides/agent-api'],
      ['Library', '/docs/library/reference'],
    ],
  },
  {
    title: 'Company',
    links: [
      ['Contact', '/contact'],
      ['Security', '/security'],
      ['Privacy', '/privacy'],
      ['Terms', '/terms'],
    ],
  },
];

function Footer(): ReactNode {
  return (
    <footer className={s.footer}>
      <div className={s.footInner}>
        <div className={s.footBrand}>
          <Link to="/" className={s.brand}>
            <Mark />
            <span>tawi</span>
          </Link>
          <p>Train your own AI. Keep it on your machine.</p>
          <p className={s.dim}>Made with ♥ in Toronto</p>
        </div>
        {FOOT.map((c) => (
          <div key={c.title} className={s.footCol}>
            <h4>{c.title}</h4>
            {c.links.map(([label, to]) => (
              <Link key={to} to={to}>
                {label}
              </Link>
            ))}
          </div>
        ))}
      </div>
    </footer>
  );
}

// Fades sections in as they scroll into view. Without JavaScript, or with reduced motion, everything just shows.
function useReveal(): void {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>('[data-reveal]');
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
      els.forEach((e) => e.classList.add(s.in));
      return;
    }
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add(s.in);
            io.unobserve(e.target);
          }
        }),
      {rootMargin: '0px 0px -8% 0px'},
    );
    els.forEach((e) => {
      e.classList.add(s.reveal);
      io.observe(e);
    });
    return () => io.disconnect();
  }, []);
}

export function GlassPage({title, description, children}: {title: string; description: string; children: ReactNode}): ReactNode {
  useReveal();
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta name="theme-color" content="#05070d" />
      </Head>
      <div className={s.page}>
        <div className={s.aurora} aria-hidden="true">
          <i />
          <i />
          <i />
        </div>
        <div className={s.grid} aria-hidden="true" />
        <Nav />
        <main className={s.main}>{children}</main>
        <Footer />
      </div>
    </>
  );
}

export function Shot({alt, className}: {alt: string; className?: string}): ReactNode {
  return (
    <div className={`${s.shot} ${className ?? ''}`}>
      <div className={s.shotBar}>
        <i />
        <i />
        <i />
        <span>127.0.0.1:8000</span>
      </div>
      <img src={useBaseUrl('/img/studio/data-step-dark.webp')} alt={alt} width={1600} height={1003} loading="lazy" />
    </div>
  );
}

// The hero's living branch: a tree that grows from the bottom, with points of light running up it like data
// flowing into a model. Draws once, still, when the visitor prefers reduced motion.
export function BranchCanvas(): ReactNode {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    type Seg = {x1: number; y1: number; x2: number; y2: number; d: number; t0: number; kids: number[]};
    let segs: Seg[] = [];
    let w = 0;
    let h = 0;
    let seed = 7;
    const rnd = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
    const DUR = 420;
    const MAX = 9;

    const build = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      segs = [];
      seed = 7;
      const grow = (x: number, y: number, a: number, len: number, d: number, t0: number): number => {
        const x2 = x + Math.cos(a) * len;
        const y2 = y + Math.sin(a) * len;
        const i = segs.push({x1: x, y1: y, x2, y2, d, t0, kids: []}) - 1;
        if (d < MAX) {
          const n = d < 2 ? 2 : rnd() < 0.3 ? 3 : 2;
          for (let k = 0; k < n; k++) {
            const spread = 0.28 + rnd() * 0.32;
            const na = a + (k - (n - 1) / 2) * spread * 1.6 + (rnd() - 0.5) * 0.2;
            segs[i].kids.push(grow(x2, y2, na, len * (0.7 + rnd() * 0.1), d + 1, t0 + DUR * (0.8 + rnd() * 0.4)));
          }
        }
        return i;
      };
      const base = Math.min(h * 0.2, w * 0.16);
      grow(w / 2, h + 4, -Math.PI / 2, base, 0, 0);
    };

    type Pulse = {seg: number; p: number; v: number};
    const pulses: Pulse[] = Array.from({length: 26}, (_, i) => ({seg: 0, p: -i * 0.35, v: 0.012 + Math.random() * 0.01}));

    const colour = (d: number, alpha: number) => {
      const t = d / MAX;
      const r = Math.round(56 + (139 - 56) * t);
      const g = Math.round(225 + (92 - 225) * t);
      return `rgba(${r},${g},255,${alpha})`;
    };

    let raf = 0;
    const start = performance.now();
    const frame = (now: number) => {
      const t = still ? 1e9 : now - start;
      ctx.clearRect(0, 0, w, h);
      ctx.lineCap = 'round';
      for (const sg of segs) {
        const p = Math.min(1, Math.max(0, (t - sg.t0) / DUR));
        if (p <= 0) continue;
        ctx.strokeStyle = colour(sg.d, 0.55 - sg.d * 0.035);
        ctx.lineWidth = Math.max(0.6, 3.2 - sg.d * 0.32);
        ctx.beginPath();
        ctx.moveTo(sg.x1, sg.y1);
        ctx.lineTo(sg.x1 + (sg.x2 - sg.x1) * p, sg.y1 + (sg.y2 - sg.y1) * p);
        ctx.stroke();
        if (p === 1 && sg.kids.length === 0) {
          ctx.fillStyle = colour(sg.d, 0.5);
          ctx.beginPath();
          ctx.arc(sg.x2, sg.y2, 1.6, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      if (!still && t > DUR * 4) {
        ctx.shadowBlur = 12;
        for (const pl of pulses) {
          pl.p += pl.v;
          if (pl.p < 0) continue;
          let sg = segs[pl.seg];
          if (pl.p >= 1) {
            if (!sg.kids.length || (t - segs[sg.kids[0]].t0) / DUR < 1) {
              pl.seg = 0;
              pl.p = -Math.random() * 2;
              continue;
            }
            pl.seg = sg.kids[Math.floor(Math.random() * sg.kids.length)];
            pl.p -= 1;
            sg = segs[pl.seg];
          }
          const x = sg.x1 + (sg.x2 - sg.x1) * pl.p;
          const y = sg.y1 + (sg.y2 - sg.y1) * pl.p;
          ctx.shadowColor = colour(sg.d, 1);
          ctx.fillStyle = 'rgba(235,248,255,0.95)';
          ctx.beginPath();
          ctx.arc(x, y, 1.8, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.shadowBlur = 0;
      }
      if (!still) raf = requestAnimationFrame(frame);
    };

    build();
    raf = requestAnimationFrame(frame);
    const ro = new ResizeObserver(() => {
      build();
      if (still) frame(0);
    });
    ro.observe(canvas);
    const vis = () => {
      cancelAnimationFrame(raf);
      if (!document.hidden && !still) raf = requestAnimationFrame(frame);
    };
    document.addEventListener('visibilitychange', vis);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      document.removeEventListener('visibilitychange', vis);
    };
  }, []);
  return <canvas ref={ref} className={s.canvas} aria-hidden="true" />;
}

export {s as glass};
