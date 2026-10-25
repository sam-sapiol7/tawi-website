// The marketing pages' arcade look: a CRT at midnight, neon pixel type, a ship for a mouse pointer and buttons that
// explode when pressed. The docs keep Docusaurus, restyled in custom.css.
import {useEffect, useRef, useState, type MouseEvent, type ReactNode} from 'react';
import Head from '@docusaurus/Head';
import Link from '@docusaurus/Link';
import {useHistory} from '@docusaurus/router';
import useBaseUrl from '@docusaurus/useBaseUrl';

import s from './arcade.module.css';

export const BETA_URL = 'https://github.com/sam-sapiol7/Tawi/releases/latest';

const calm = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ---------- pixel sprites ----------
// Rows of characters, one per pixel: '.' is empty, digits pick a colour.
const PALETTE: Record<string, string> = {1: '#00f0ff', 2: '#ff2bd6', 3: '#ffe600', 4: '#f4ecff', 5: '#39ff14'};
export const SPRITES: Record<string, string[]> = {
  logo: ['33333333', '33333333', '...33...', '...33...', '...33...', '.33..33.', '.33..33.', '.33..33.'],
  rag: ['................', '..111111.111111.', '.1444441.1444441', '.1411141.1411141', '.1444441.1444441', '.1411141.1411141', '.1444441.1444441', '.1411141.1411141', '.1444441.1444441', '..111111.111111.', '.......1.1......', '........1.......', '...3333333333...'],
  ft: ['.....222222.....', '...2244444422...', '..244222222442..', '.24422444422442.', '.24224222242242.', '.24224233242242.', '.24224233242242.', '.24224222242242.', '.24422444422442.', '..244222222442..', '...2244444422...', '.....222222.....', '...3.3.3.3.3....'],
  both: ['...3...3...3....', '...33.333.33....', '...333333333....', '.11111.222222...', '1444441244442...', '1411141242242...', '1444441244442...', '1411141242242...', '1444441244442...', '.11111.222222...', '......3.........', '.....333........', '....33333.......'],
  tooth: ['..44444.44444...', '.4444444444444..', '.4444444444444..', '.4444444444444..', '..44444444444...', '..44444444444...', '...444444444....', '...4444.4444....', '...444...444....', '...44.....44....', '....4.....4.....'],
  headset: ['....1111111.....', '..11.......11...', '.1...........1..', '.1...........1..', '22...........22.', '22...........22.', '22...........22.', '.............1..', '...........11...', '.........33.....'],
  bag: ['.....3333.......', '....3....3......', '....3....3......', '..2222222222....', '..2444444442....', '..2442442442....', '..2444444442....', '..2444444442....', '..2444444442....', '..2222222222....'],
  code: ['................', '..11......11....', '.11........11...', '11...3333...11..', '.11........11...', '..11......11....', '................', '..5555555555....', '..5........5....', '..5555555555....'],
};

export function Sprite({name, size = 64, label}: {name: string; size?: number; label?: string}): ReactNode {
  const ref = useRef<HTMLCanvasElement>(null);
  const rows = SPRITES[name];
  useEffect(() => {
    const g = ref.current?.getContext('2d');
    if (!g) return;
    g.clearRect(0, 0, 16, 16);
    rows.forEach((row, y) =>
      [...row].forEach((ch, x) => {
        if (PALETTE[ch]) {
          g.fillStyle = PALETTE[ch];
          g.fillRect(x, y + Math.floor((16 - rows.length) / 2), 1, 1);
        }
      }),
    );
  }, [rows]);
  return (
    <canvas
      ref={ref}
      width={16}
      height={16}
      className={s.sprite}
      style={{width: size, height: size}}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    />
  );
}

// ---------- buttons that explode ----------
type BoomFn = (x: number, y: number) => void;
let boomAt: BoomFn = () => {};

export function Boom({
  to,
  children,
  variant = 'pink',
  newTab = false,
}: {
  to: string;
  children: ReactNode;
  variant?: 'pink' | 'cyan' | 'yellow';
  newTab?: boolean;
}): ReactNode {
  const history = useHistory();
  const external = /^https?:/.test(to);
  const onClick = (e: MouseEvent<HTMLAnchorElement>) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    boomAt(e.clientX || r.left + r.width / 2, e.clientY || r.top + r.height / 2);
    if (calm()) return;
    el.classList.add(s.hit);
    setTimeout(() => el.classList.remove(s.hit), 420);
    // a new tab has to open inside the click, so only same-tab links wait for the explosion
    if (newTab || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    setTimeout(() => (external ? window.location.assign(to) : history.push(to)), 380);
  };
  const cls = `${s.btn} ${s[variant]}`;
  return external ? (
    <a href={to} className={cls} onClick={onClick} {...(newTab ? {target: '_blank', rel: 'noopener noreferrer'} : {})}>
      {children}
    </a>
  ) : (
    <Link to={to} className={cls} onClick={onClick}>
      {children}
    </Link>
  );
}

// ---------- the effects layer: explosions for everyone, a ship for mouse users ----------
const SHIP = ['......1......', '......1......', '.....111.....', '.....111.....', '..2..111..2..', '..2.11311.2..', '2.211131112.2', '2111111111112', '2112111112112', '211.21112.112', '2....121....2'];
const BUG = [
  ['..1.....1..', '...1...1...', '..1111111..', '.11.111.11.', '11111111111', '1.1111111.1', '1.1.....1.1', '...11.11...'],
  ['..1.....1..', '1..1...1..1', '1.1111111.1', '111.111.111', '11111111111', '.111111111.', '..1.....1..', '.1.......1.'],
];

function Effects({onScore}: {onScore: (n: number) => void}): ReactNode {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const cv = ref.current;
    const x = cv?.getContext('2d');
    if (!cv || !x) return;
    const still = calm();
    const ship = !still && window.matchMedia('(pointer: fine)').matches;
    if (ship) document.documentElement.classList.add(s.shipOn);
    let w = 0;
    let h = 0;
    const size = () => {
      w = cv.width = window.innerWidth;
      h = cv.height = window.innerHeight;
    };
    size();
    window.addEventListener('resize', size);

    type Bit = {x: number; y: number; vx: number; vy: number; c: string; t: number; s: number};
    const bits: Bit[] = [];
    const rings: {x: number; y: number; t: number}[] = [];
    const cols = ['#ffe600', '#ff2bd6', '#00f0ff', '#f4ecff', '#39ff14'];
    boomAt = (bx, by) => {
      if (still) return;
      const now = performance.now();
      for (let i = 0; i < 36; i++) {
        const a = (i / 36) * Math.PI * 2 + Math.random() * 0.3;
        const v = 2 + Math.random() * 6;
        bits.push({x: bx, y: by, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 1.5, c: cols[i % cols.length], t: now, s: 3 + (Math.random() * 4) | 0});
      }
      rings.push({x: bx, y: by, t: now});
      if (!running) loop();
    };

    let mx = -100;
    let my = -100;
    let overLink = false;
    let score = 0;
    let last = 0;
    const bullets: {x: number; y: number}[] = [];
    let bugs: {x: number; y: number; c: string; alive: boolean}[] = [];
    const spawn = () => {
      bugs = [];
      const n = Math.min(10, Math.floor(window.innerWidth / 110));
      for (let r = 0; r < 2; r++)
        for (let c = 0; c < n; c++) bugs.push({x: ((c + 0.5) * window.innerWidth) / n, y: 150 + r * 46, c: r ? '#00f0ff' : '#ff2bd6', alive: true});
    };
    const px = 3;
    const sprite = (rows: string[], cx: number, cy: number, c1: string, c2: string) =>
      rows.forEach((row, j) =>
        [...row].forEach((ch, i) => {
          if (ch === '.') return;
          x.fillStyle = ch === '2' ? c2 : ch === '3' ? '#ffe600' : c1;
          x.fillRect(Math.round(cx + (i - row.length / 2) * px), Math.round(cy + (j - rows.length / 2) * px), px, px);
        }),
      );
    const move = (e: PointerEvent) => {
      mx = e.clientX;
      my = e.clientY;
      overLink = !!(e.target as Element).closest?.('a, button, [tabindex]');
    };
    const leave = () => {
      mx = my = -100;
    };
    const fire = (e: PointerEvent) => {
      if (e.button !== 0) return;
      const now = performance.now();
      if (now - last < 120) return;
      last = now;
      bullets.push({x: mx, y: my - 18});
    };
    if (ship) {
      spawn();
      window.addEventListener('pointermove', move);
      document.addEventListener('pointerleave', leave);
      window.addEventListener('pointerdown', fire);
    }

    let running = false;
    let raf = 0;
    const frame = (t: number) => {
      x.clearRect(0, 0, w, h);
      const sy = window.scrollY;
      const wob = Math.sin(t / 500) * 18;
      const flap = Math.floor(t / 400) % 2;
      if (ship) {
        for (const b of bugs) if (b.alive && b.y - sy > -40 && b.y - sy < h + 40) sprite(BUG[flap], b.x + wob, b.y - sy, b.c, b.c);
        for (let i = bullets.length - 1; i >= 0; i--) {
          const b = bullets[i];
          b.y -= 14;
          x.fillStyle = '#ffe600';
          x.fillRect(b.x - 1, b.y, 3, 12);
          const hit = bugs.find((g) => g.alive && Math.abs(g.x + wob - b.x) < 26 && Math.abs(g.y - sy - b.y) < 18);
          if (hit) {
            hit.alive = false;
            bullets.splice(i, 1);
            boomAt(hit.x + wob, hit.y - sy);
            score += 100;
            onScore(score);
            if (bugs.every((g) => !g.alive)) setTimeout(spawn, 1200);
          } else if (b.y < -20) bullets.splice(i, 1);
        }
      }
      for (let i = rings.length - 1; i >= 0; i--) {
        const r = rings[i];
        const k = (t - r.t) / 450;
        if (k > 1) {
          rings.splice(i, 1);
          continue;
        }
        x.strokeStyle = `rgba(255,230,0,${1 - k})`;
        x.lineWidth = 4;
        x.strokeRect(r.x - k * 60, r.y - k * 60, k * 120, k * 120);
      }
      for (let i = bits.length - 1; i >= 0; i--) {
        const b = bits[i];
        const k = (t - b.t) / 700;
        if (k > 1) {
          bits.splice(i, 1);
          continue;
        }
        b.x += b.vx;
        b.y += b.vy;
        b.vy += 0.25;
        x.globalAlpha = 1 - k;
        x.fillStyle = b.c;
        x.fillRect(Math.round(b.x), Math.round(b.y), b.s, b.s);
        x.globalAlpha = 1;
      }
      if (ship && mx > -50) sprite(SHIP, mx, my + 8, overLink ? '#ffe600' : '#f4ecff', '#ff2bd6');
      if (ship || bits.length || rings.length) raf = requestAnimationFrame(frame);
      else running = false;
    };
    const loop = () => {
      running = true;
      raf = requestAnimationFrame(frame);
    };
    if (ship) loop();
    return () => {
      cancelAnimationFrame(raf);
      boomAt = () => {};
      document.documentElement.classList.remove(s.shipOn);
      window.removeEventListener('resize', size);
      window.removeEventListener('pointermove', move);
      document.removeEventListener('pointerleave', leave);
      window.removeEventListener('pointerdown', fire);
    };
  }, [onScore]);
  return <canvas ref={ref} className={s.fx} aria-hidden="true" />;
}

function Stars(): ReactNode {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current;
    const x = c?.getContext('2d');
    if (!c || !x) return;
    const still = calm();
    let w = 0;
    let h = 0;
    let stars: {x: number; y: number; z: number}[] = [];
    const size = () => {
      w = c.width = window.innerWidth;
      h = c.height = window.innerHeight;
      stars = Array.from({length: 140}, () => ({x: Math.random() * w, y: Math.random() * h, z: Math.random() * 2 + 0.5}));
    };
    let raf = 0;
    const draw = () => {
      x.fillStyle = '#07020f';
      x.fillRect(0, 0, w, h);
      for (const st of stars) {
        if (!still) {
          st.y += st.z * 0.6;
          if (st.y > h) {
            st.y = 0;
            st.x = Math.random() * w;
          }
        }
        x.fillStyle = st.z > 2 ? '#00f0ff' : st.z > 1.4 ? '#ff2bd6' : '#6c5a9a';
        x.fillRect(Math.round(st.x), Math.round(st.y), Math.ceil(st.z), Math.ceil(st.z));
      }
      if (!still && !document.hidden) raf = requestAnimationFrame(draw);
    };
    const vis = () => {
      cancelAnimationFrame(raf);
      draw();
    };
    const resize = () => {
      size();
      if (still) draw();
    };
    size();
    draw();
    window.addEventListener('resize', resize);
    document.addEventListener('visibilitychange', vis);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', vis);
    };
  }, []);
  return <canvas ref={ref} className={s.stars} aria-hidden="true" />;
}

// ---------- the old TV the studio switches on in ----------
export function Cabinet(): ReactNode {
  const tv = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<'idle' | 'off' | 'on'>('idle');
  useEffect(() => {
    const el = tv.current;
    if (!el || calm() || !('IntersectionObserver' in window)) {
      setState('on');
      return;
    }
    setState('off');
    const io = new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          if (!e.isIntersecting) return;
          io.disconnect();
          setTimeout(() => setState('on'), 300);
        }),
      {threshold: 0.35},
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div className={`${s.cabinet} ${state === 'on' ? s.lit : ''}`}>
      <div className={s.marquee}>TAWI STUDIO · 1 PLAYER · 127.0.0.1</div>
      <div ref={tv} className={`${s.screen} ${state === 'off' ? s.off : ''} ${state === 'on' ? s.on : ''}`}>
        <div className={s.tube}>
          <img src={useBaseUrl('/img/studio/train-step-light.webp')} alt="The Tawi studio: naming a new agent and picking the model to train" width={2000} height={1186} />
        </div>
        <div className={s.static} aria-hidden="true" />
        <div className={s.osd} aria-hidden="true">
          CH 03 ▶ TAWI
        </div>
      </div>
      <div className={s.controls}>
        <span className={s.power}>
          <span className={s.stick} aria-hidden="true" />
          <span className={s.led} aria-hidden="true" />
        </span>
        <span>WINDOWS · APPLE SILICON · LINUX</span>
        <span className={s.buttons} aria-hidden="true">
          <i style={{background: '#ff2bd6'}} />
          <i style={{background: '#00f0ff'}} />
          <i style={{background: '#ffe600'}} />
        </span>
      </div>
    </div>
  );
}

// ---------- page shell ----------
const NAV = [
  {label: 'DOCS', to: '/docs'},
  {label: 'API', to: '/docs/api/agent/tawi-agent-api'},
  {label: 'PRICING', to: '/pricing'},
  {label: 'BLOG', to: '/blog'},
];

const FOOT: [string, string][] = [
  ['Download', '/download'],
  ['Docs', '/docs'],
  ['Pricing', '/pricing'],
  ['Changelog', '/changelog'],
  ['Blog', '/blog'],
  ['Contact', '/contact'],
  ['Security', '/security'],
  ['Privacy', '/privacy'],
  ['Terms', '/terms'],
];

export function ArcadePage({title, description, children}: {title: string; description: string; children: ReactNode}): ReactNode {
  const [score, setScore] = useState(0);
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta name="theme-color" content="#07020f" />
      </Head>
      <div className={s.page}>
        <Stars />
        <Effects onScore={setScore} />
        <div className={s.crt} aria-hidden="true" />
        <div className={s.wrap}>
          <nav className={s.nav} aria-label="Main">
            <Link to="/" className={s.logo} aria-label="Tawi home">
              <Sprite name="logo" size={26} />
              TAWI
            </Link>
            <div className={s.links}>
              {NAV.map((n) => (
                <Link key={n.to} to={n.to}>
                  {n.label}
                </Link>
              ))}
            </div>
            <span className={s.p1} aria-label={`Score ${score}`}>
              1UP {String(score).padStart(6, '0')}
            </span>
          </nav>
          <main>{children}</main>
          <footer className={s.footer}>
            <span>MADE WITH <span className={s.heart} aria-label="love">♥</span> IN TORONTO</span>
            <div>
              {FOOT.map(([l, to]) => (
                <Link key={to} to={to}>
                  {l.toUpperCase()}
                </Link>
              ))}
            </div>
            <span>CREDIT 01</span>
          </footer>
        </div>
      </div>
    </>
  );
}

export {s as arcade};
