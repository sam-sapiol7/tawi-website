import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import CodeBlock from '@theme/CodeBlock';
import ThemedImage from '@theme/ThemedImage';
import useBaseUrl from '@docusaurus/useBaseUrl';

import styles from './index.module.css';

// Every number here is measured and written down in the Tawi repo (docs/library.md, tawi/evaluation.py,
// docs/legal-checklist.md). Change them only together with those.
const PROOFS = [
  {
    figure: '16 s',
    title: 'to fine-tune on an 8 GB laptop GPU',
    text: 'Qwen3 0.6B on 100 dentist questions, on an RTX 5050 laptop. Unsloth took 52 to 104 s with the same data and settings.',
    to: '/blog/training-time',
  },
  {
    figure: '50',
    title: 'attacks before an agent goes live',
    text: 'Every agent faces 50 attack prompts: instruction injection, prompt extraction, off-topic and harmful requests, risky advice and personal data. Its API stays off until it handles at least 80% of them safely.',
    to: '/docs/start/quickstart',
  },
  {
    figure: '1',
    title: 'call home, and you can turn it off',
    text: 'Training, search and answers run on your computer. The only thing Tawi sends on its own is a daily version check.',
    to: '/privacy',
  },
];

export default function Home(): ReactNode {
  return (
    <Layout description="Build AI agents that answer from your own documents, and fine-tune them on your own GPU.">
      <main>
        <section className={styles.hero}>
          <h1 className={styles.title}>Build AI agents that answer from your own documents, on your own computer.</h1>
          <p className={styles.lead}>
            Upload documents or example answers, fine-tune a small model on your GPU, pass a safety check, and put it
            live behind an API key.
          </p>
          <div className={styles.install}>
            <CodeBlock language="bash">{'pip install tawi-ai\ntawi setup\ntawi studio'}</CodeBlock>
          </div>
          <div className={styles.links}>
            <Link className="button button--primary" to="/download">Download</Link>
            <Link className="button button--secondary" to="/docs/start/quickstart">Quick start</Link>
          </div>
        </section>

        <section className={styles.shot}>
          <ThemedImage
            alt="The Tawi studio: adding documents and example answers to an agent"
            width={1600}
            height={1003}
            sources={{
              light: useBaseUrl('/img/studio/data-step-light.webp'),
              dark: useBaseUrl('/img/studio/data-step-dark.webp'),
            }}
          />
        </section>

        <section className={styles.proofs}>
          {PROOFS.map((p) => (
            <Link key={p.title} to={p.to} className={styles.proof}>
              <div className={styles.figure}>{p.figure}</div>
              <h2 className={styles.proofTitle}>{p.title}</h2>
              <p>{p.text}</p>
            </Link>
          ))}
        </section>

        <section className={styles.api}>
          <div>
            <h2>Call your agent from any app</h2>
            <p>
              One HTTP endpoint with answers, sources and streaming. It also speaks OpenAI's format, so OpenAI's client
              libraries work by changing the base URL.
            </p>
            <Link to="/docs/guides/agent-api">Agent API guide</Link>
          </div>
          <CodeBlock language="bash">
            {`curl http://127.0.0.1:8000/v1/chat \\
  -H "Authorization: Bearer ak_..." \\
  -d '{"agent": "maple-grove-dental",
       "message": "Do you take new patients?"}'`}
          </CodeBlock>
        </section>
      </main>
    </Layout>
  );
}
