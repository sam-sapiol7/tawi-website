import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import CodeBlock from '@theme/CodeBlock';

import styles from './index.module.css';

// A plain landing page until the general website (home, download, pricing) replaces it.
export default function Home(): ReactNode {
  return (
    <Layout description="Build, fine-tune and serve AI agents on your own computer, and call them from your apps.">
      <main className={styles.main}>
        <h1 className={styles.title}>Build AI agents that answer from your own documents, on your own computer.</h1>
        <p className={styles.lead}>
          Upload documents or examples, fine-tune a small model on your GPU, check it with a safety test, and put it
          live behind an API key.
        </p>
        <CodeBlock language="bash">{'pip install tawi-ai\ntawi setup\ntawi studio'}</CodeBlock>
        <div className={styles.links}>
          <Link className="button button--primary" to="/docs/start/quickstart">Quick start</Link>
          <Link className="button button--secondary" to="/docs/api">API reference</Link>
        </div>
      </main>
    </Layout>
  );
}
