import {useEffect, useState, type ReactNode} from 'react';
import Link from '@docusaurus/Link';

import {ArcadePage, BETA_URL, Boom, arcade as s} from '@site/src/components/arcade/Arcade';

type OS = 'windows' | 'mac' | 'linux';

// The file names and warnings match START HERE.txt in the Tawi repo.
const PLATFORMS: Record<OS, {label: string; file: string; warn: string; needs: string[]}> = {
  windows: {
    label: 'WINDOWS',
    file: 'Start Tawi (Windows)',
    warn: 'If Windows says "Windows protected your PC", click More info, then Run anyway.',
    needs: ['A 64-bit Windows PC', 'An NVIDIA GPU to fine-tune (driver 580 or newer). Not needed for RAG', 'Several GB free: the app, plus 0.5 to 5 GB per model'],
  },
  mac: {
    label: 'MAC',
    file: 'Start Tawi (Mac)',
    warn: 'If the Mac says it "cannot be opened", right-click the file, choose Open, then Open again. Only needed once.',
    needs: ['A Mac with Apple Silicon (M1 or newer). Intel Macs are not supported', 'Fine-tuning uses MLX and is in beta', 'Several GB free: the app, plus 0.5 to 5 GB per model'],
  },
  linux: {
    label: 'LINUX',
    file: 'Start Tawi (Linux).sh',
    warn: 'Choose "Run" or "Run in Terminal" when your file manager asks.',
    needs: ['A 64-bit Linux desktop with Python 3.12 (3.10 or newer works)', 'An NVIDIA GPU to fine-tune. Without one it installs the smaller CPU build', 'Several GB free: the app, plus 0.5 to 5 GB per model'],
  },
};

function detect(): OS {
  const nav = navigator as Navigator & {userAgentData?: {platform?: string}};
  const p = (nav.userAgentData?.platform || navigator.platform || navigator.userAgent).toLowerCase();
  if (p.includes('mac')) return 'mac';
  if (p.includes('linux') || p.includes('x11')) return 'linux';
  return 'windows';
}

export default function Download(): ReactNode {
  const [os, setOs] = useState<OS>('windows');
  useEffect(() => setOs(detect()), []);
  const p = PLATFORMS[os];
  return (
    <ArcadePage title="Download Tawi" description="Download the free Tawi beta for Windows, Apple Silicon Macs and Linux. Unzip, double-click, and build your first private AI assistant.">
      <header className={s.hero}>
        <div className={s.coin}>PLAYER 1 · SELECT YOUR SYSTEM</div>
        <h1 className={s.title} style={{fontSize: 'clamp(24px, 4.6vw, 48px)'}}>
          GET TAWI FOR <span>{p.label}</span>
        </h1>
        <p className={s.lead}>One small zip. Unzip it, double-click one file, and the studio opens in your browser.</p>
        <div className={s.tabs} role="tablist" aria-label="Your system">
          {(Object.keys(PLATFORMS) as OS[]).map((k) => (
            <button key={k} role="tab" aria-selected={k === os} onClick={() => setOs(k)}>
              {PLATFORMS[k].label}
            </button>
          ))}
        </div>
        <div className={s.ctas}>
          <Boom to={BETA_URL} newTab>
            ▶ DOWNLOAD THE BETA
          </Boom>
          <Boom to="/contact" variant="cyan">
            ASK FOR AN INVITE
          </Boom>
        </div>
        <p className={s.fine}>Under 1 MB. Sign in to GitHub with the account you were invited with. A "404" means you haven't been added yet.</p>
      </header>

      <section className={s.section} style={{paddingTop: 80}}>
        <h2 className={s.h2}>3 MOVES TO START</h2>
        <div className={s.stages} style={{marginTop: 40}}>
          <div className={s.stage}>
            <span className={s.tag}>MOVE 1</span>
            <h3>UNZIP</h3>
            <p>Right-click the zip and choose Extract All (Windows), or double-click it (Mac). Put the folder somewhere like Documents.</p>
          </div>
          <div className={s.stage}>
            <span className={s.tag}>MOVE 2</span>
            <h3>DOUBLE-CLICK</h3>
            <p>
              Open <code>{p.file}</code>. {p.warn}
            </p>
          </div>
          <div className={s.stage}>
            <span className={s.tag}>MOVE 3</span>
            <h3>WAIT ONCE</h3>
            <p>The first start installs itself: a few GB, 10 to 30 minutes. Then your browser opens Tawi. After that it starts in seconds.</p>
          </div>
        </div>
        <div className={s.needs}>
          <div>
            <h3>YOU NEED</h3>
            <ul>
              {p.needs.map((n) => (
                <li key={n}>{n}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3>STUCK?</h3>
            <ul>
              <li>
                Read <code>START HERE.txt</code> in the zip.
              </li>
              <li>In Tawi, open Logs and press Share diagnosis logs. Your documents are never included.</li>
              <li>
                Step by step: the <Link to="/docs/start/install">install guide</Link> and <Link to="/docs/guides/troubleshooting">troubleshooting</Link>.
              </li>
            </ul>
          </div>
        </div>
        <p className={s.note}>
          Developers: <code>pip install tawi-ai</code> arrives with the public launch. What's new: the <Link to="/changelog">changelog</Link>.
        </p>
      </section>
    </ArcadePage>
  );
}
