import {useEffect, useState, type ReactNode} from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import CodeBlock from '@theme/CodeBlock';

import styles from './download.module.css';

type OS = 'windows' | 'mac' | 'linux';

const BETA_URL = 'https://github.com/sam-sapiol7/Tawi/releases/latest';

const PLATFORMS: Record<OS, {label: string; needs: string[]; code: string; note?: ReactNode}> = {
  windows: {
    label: 'Windows',
    needs: ['An NVIDIA GPU for fine-tuning (tested on an RTX 5050 laptop, driver 580 or newer)', 'Python 3.12 or 3.13 from python.org'],
    code: 'python -m venv tawi\ntawi\\Scripts\\activate\npip install tawi-ai\ntawi setup\ntawi studio',
  },
  mac: {
    label: 'Mac',
    needs: ['A Mac with Apple Silicon (M1 or newer)', 'Python 3.12 or 3.13'],
    code: 'python3 -m venv tawi\nsource tawi/bin/activate\npip install tawi-ai\ntawi setup\ntawi studio',
    note: (
      <>
        Fine-tuning on a Mac uses MLX and is <Link to="/docs/guides/beta">Beta</Link>: it works, but has been tested on
        fewer machines.
      </>
    ),
  },
  linux: {
    label: 'Linux',
    needs: ['An NVIDIA GPU for fine-tuning', 'Python 3.12 or 3.13'],
    code: 'python3 -m venv tawi\nsource tawi/bin/activate\npip install tawi-ai\ntawi setup\ntawi studio',
    note: (
      <>
        On a server, the studio's Docker image is simpler. Put HTTPS in front of it before opening it to a network
        (<Link to="/docs/guides/https">HTTPS guide</Link>).
      </>
    ),
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
    <Layout title="Download" description="Install the Tawi studio on Windows, Mac or Linux.">
      <main className={styles.main}>
        <h1>Download Tawi</h1>
        <p className={styles.lead}>
          The studio installs with pip and runs in your browser at <code>http://127.0.0.1:8000</code>. Without a GPU it
          still builds document-answering agents; fine-tuning needs one.
        </p>
        <div className={styles.card}>
          <h2>Beta testers: the easy way</h2>
          <p>
            <Link className="button button--primary button--lg" to={BETA_URL}>
              Download the beta (zip)
            </Link>
          </p>
          <ol>
            <li>Sign in to GitHub with the account you were invited with, then download <code>tawi-beta-…zip</code> from the page that opens.</li>
            <li>Unzip it and double-click <strong>Start Tawi</strong> for your system. No terminal needed. The first run installs (10 to 30 minutes).</li>
            <li>Stuck? Open <code>START HERE.txt</code> in the zip, or use <em>Share diagnosis logs</em> on the Logs page.</li>
          </ol>
          <p className={styles.note}>The beta is invite-only for now. If the link shows "404", you haven't been added yet or aren't signed in.</p>
        </div>
        <h2>Install with pip (after the public launch)</h2>
        <p className={styles.note}>The <code>tawi-ai</code> package isn't on PyPI yet, so the commands below only work after launch.</p>
        <div className={styles.tabs} role="tablist">
          {(Object.keys(PLATFORMS) as OS[]).map((k) => (
            <button
              key={k}
              role="tab"
              aria-selected={k === os}
              className={k === os ? styles.on : undefined}
              onClick={() => setOs(k)}>
              {PLATFORMS[k].label}
            </button>
          ))}
        </div>
        <div className={styles.card}>
          <h2>You need</h2>
          <ul>
            {p.needs.map((n) => (
              <li key={n}>{n}</li>
            ))}
          </ul>
          <h2>Install and start</h2>
          <CodeBlock language={os === 'windows' ? 'powershell' : 'bash'}>{p.code}</CodeBlock>
          <p>
            <code>tawi setup</code> installs the GPU build of PyTorch and llama.cpp for fast answers. Then open{' '}
            <code>http://127.0.0.1:8000</code>. On your own computer there is no sign-in.
          </p>
          {p.note && <p className={styles.note}>{p.note}</p>}
        </div>
        <p>
          Step by step, with every setting: the <Link to="/docs/start/install">install guide</Link>. What's new in
          each version: the <Link to="/changelog">changelog</Link>.
        </p>
      </main>
    </Layout>
  );
}
