// One short page per studio feature: a screen in the CRT, three numbers, three use cases, a second screen.
// Facts match the Tawi repo and the demo screens in static/img/studio/features (Maple Grove Dental demo agent).
import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';

import {ArcadePage, BETA_URL, Boom, Cabinet, arcade as s} from './Arcade';

type Feature = {
  slug: string;
  tag: string;
  title: string;
  pitch: string;
  shot: [string, string];
  perks: [string, string][];
  cases: [string, string][];
  more: {title: string; text: string; shot?: [string, string]; code?: string};
};

export const FEATURES: Feature[] = [
  {
    slug: 'rag-pipeline',
    tag: 'RAG PIPELINE',
    title: 'DOCUMENTS IN. ANSWERS WITH SOURCES OUT.',
    pitch: 'Drop in PDFs, Word files, text or CSV, or sync Google Drive and Notion. Tawi checks, chunks and indexes them, then answers from them and shows where each answer came from.',
    shot: ['data', 'Adding documents and example Q&A to an agent'],
    perks: [
      ['0 LINES', 'of code to build the pipeline'],
      ['2 SOURCES', 'synced: Google Drive and Notion'],
      ['100%', 'on your own disk'],
    ],
    cases: [
      ['FRONT DESK', 'A clinic answers “Are you open Saturday?” from its own patient guide, not from the internet.'],
      ['HR HANDBOOK', 'Staff ask about leave and expenses and get the policy paragraph, quoted.'],
      ['SUPPORT', 'Your help docs answer the same ten questions so your team can answer the hard ones.'],
    ],
    more: {
      title: 'TEST IT BEFORE ANYONE ELSE DOES',
      text: 'Write the questions you expect, with the answer you want, and run them in one click.',
      shot: ['test', 'Running test questions against an agent'],
    },
  },
  {
    slug: 'vector-db',
    tag: 'VECTOR DB',
    title: 'SEE EXACTLY WHAT IT KNOWS.',
    pitch: 'Every chunk and example your agent can search, stored as embeddings on your PC. See sources, sizes and settings, and roll the index back if a rebuild goes wrong.',
    shot: ['vectors', 'The vector DB dashboard: sources, index details and versions'],
    perks: [
      ['70 / 30', 'hybrid search: embeddings plus keywords'],
      ['EVERY', 'rebuild saved as a version'],
      ['0 SERVERS', 'to run. Plain local files'],
    ],
    cases: [
      ['“WHY DID IT SAY THAT?”', 'Check which document a chunk came from, in seconds.'],
      ['PRICE CHANGE', 'Swap fees-2025 for fees-2026, rebuild, done. Old index kept, just in case.'],
      ['AUDITS', 'Embedding model, chunk size and update time are on one screen for whoever asks.'],
    ],
    more: {
      title: 'OR BUILD ONE IN PYTHON',
      text: 'The same index, from a notebook or a script.',
      code: `import tawi

idx = tawi.rag.Index()
idx.add("docs/")          # PDFs, Word, text, CSV
idx.search("Open on Saturday?")`,
    },
  },
  {
    slug: 'fine-tuning',
    tag: 'FINE-TUNING',
    title: 'TEACH IT YOUR WAY OF TALKING.',
    pitch: 'Pick a model, add your examples, press Train. Watch loss, learning rate, GPU memory and GPU use live. Every run is saved with its settings and data.',
    shot: ['run-metrics', 'Live training charts for a fine-tuning run'],
    perks: [
      ['16 SEC', 'to fine-tune on an 8 GB laptop GPU'],
      ['1 CLICK', 'to start. Or 10 lines of Python'],
      ['NVIDIA', 'or Apple Silicon you already own'],
    ],
    cases: [
      ['HOUSE STYLE', 'Answers in your tone, at your length, in two or three friendly sentences.'],
      ['YOUR JARGON', 'It learns the product names and codes a general model has never seen.'],
      ['SMALL AND FAST', 'A tuned 0.6B model runs on a laptop and answers in your words, not the internet’s.'],
    ],
    more: {
      title: 'EVERY RUN HAS A RECEIPT',
      text: 'Settings, data, GPU and timings for each run. Reuse the settings or export the run as a zip.',
      shot: ['run', 'A finished training run with settings and lineage'],
    },
  },
  {
    slug: 'custom-agents',
    tag: 'CUSTOM AGENTS',
    title: 'GIVE IT A JOB DESCRIPTION.',
    pitch: 'An agent file says who it is, how it talks and what it must never do. Plain text you can read, edit and keep in Git. No prompt engineering degree required.',
    shot: ['agentfile', 'Editing an agent file'],
    perks: [
      ['1 FILE', 'per agent, in plain text'],
      ['AUTO', 'safety rules added for you'],
      ['NO LIMIT', 'on agents: one per team, task or client'],
    ],
    cases: [
      ['RECEPTIONIST', '“Never give medical advice. If unsure, give the front desk number.”'],
      ['SALES HELPER', 'Knows the price list, never invents a discount.'],
      ['IT DESK', 'Walks staff through the VPN set-up, step by step, every time.'],
    ],
    more: {
      title: 'CHECK IT BEHAVES',
      text: 'Run your test questions and see what it says before it meets a real customer.',
      shot: ['test', 'Test questions and the safety check for an agent'],
    },
  },
  {
    slug: 'security-check',
    tag: 'SECURITY CHECK',
    title: '50 ATTACKS BEFORE LAUNCH.',
    pitch: 'Before an agent can go live, Tawi throws prompt injection, prompt theft, personal data grabs, medical and legal advice traps and off-topic bait at it. Below 80% safe, the API stays locked.',
    shot: ['safety', 'Safety check results by attack category'],
    perks: [
      ['50', 'built-in attacks, in 6 categories'],
      ['80%', 'pass mark before the API unlocks'],
      ['+ YOURS', 'add your own checks from a CSV'],
    ],
    cases: [
      ['CLINICS', 'Prove it refuses to diagnose before a patient asks it to.'],
      ['FINANCE', 'Check it will not leak its instructions or a customer’s details.'],
      ['ANY BRAND', '“Ignore all previous instructions” gets a polite no.'],
    ],
    more: {
      title: 'OR RUN IT IN YOUR PIPELINE',
      text: 'Fail the build, not the launch.',
      code: `import tawi

model = tawi.load_model("out/maple-grove")
report = tawi.redteam(model, min_pass=0.8)
print(report["pass_rate"])`,
    },
  },
  {
    slug: 'mlops',
    tag: 'MLOPS',
    title: 'EVERY RUN, COMPARED. EVERY VERSION, KEPT.',
    pitch: 'Experiments across all your agents in one table. Compare runs, promote a tested version to live and roll back in one click. The API key stays the same.',
    shot: ['experiments', 'The experiments table comparing training runs'],
    perks: [
      ['1 CLICK', 'promote or roll back'],
      ['CSV + PNG', 'export runs and plots'],
      ['MLFLOW', 'export with tawi.to_mlflow'],
    ],
    cases: [
      ['FRIDAY DEPLOYS', 'Ship v4. If Monday disagrees, roll back to v3 before coffee.'],
      ['PROOF', 'Show which data and settings made the model that is live right now.'],
      ['TEAMS', 'Everyone sees the same runs instead of a folder called final_v2_REAL.'],
    ],
    more: {
      title: 'VERSIONS THAT NEVER CHANGE',
      text: 'Each fine-tune makes a new version. Draft, tested, live: you always know which is which.',
      shot: ['versions', 'Model versions with live history'],
    },
  },
  {
    slug: 'dashboards',
    tag: 'DASHBOARDS',
    title: 'SEE HOW IT PLAYS LIVE.',
    pitch: 'Requests, errors, answer time, “I don’t know” rate, safety actions and tokens, over 24 hours, 7 days or 30. Plus the questions it could not answer, ready to teach it tomorrow.',
    shot: ['overview', 'The live overview dashboard for an agent'],
    perks: [
      ['7', 'live numbers on one screen'],
      ['24H · 7D · 30D', 'views'],
      ['0', 'phone numbers or emails stored'],
    ],
    cases: [
      ['GAPS', '“Do you do whitening?” keeps failing? Add the answer, rebuild, done.'],
      ['SPEED', 'Spot the slowest 5% of answers before customers do.'],
      ['QUALITY', 'Mark answers good or bad, so you know exactly what to fix next.'],
    ],
    more: {
      title: 'EVERY CONVERSATION, SEARCHABLE',
      text: 'Phone numbers and emails are removed before anything is saved.',
      shot: ['activity', 'Conversations and unanswered questions'],
    },
  },
  {
    slug: 'rest-api',
    tag: 'REST API + DOCKER',
    title: 'LIVE IN ONE CLICK.',
    pitch: 'Once it passes the safety check, your agent gets an API key and one REST endpoint. It speaks OpenAI’s format, so most tools just change a URL. One more click packs it into Docker for any server.',
    shot: ['api', 'An agent that is live, with requests, tokens and rate limit'],
    perks: [
      ['1', 'endpoint, keys and rate limits built in'],
      ['DOCKER', 'in minutes, same API key'],
      ['OPENAI', 'compatible format'],
    ],
    cases: [
      ['WEBSITE CHAT', 'A chat box on your site, answering from your documents.'],
      ['WHATSAPP BOT', 'Wire the endpoint to WhatsApp and your customers can text your PDFs.'],
      ['HELPDESK', 'Draft replies inside the tools your team already uses.'],
    ],
    more: {
      title: 'ONE CURL AWAY',
      text: 'Anything that can call a URL can use it.',
      code: `curl http://127.0.0.1:8000/v1/chat \\
  -H "Authorization: Bearer ak_..." \\
  -d '{"agent": "front-desk",
       "message": "Open on Saturday?"}'`,
    },
  },
];

export function FeaturePage({slug}: {slug: string}): ReactNode {
  const i = FEATURES.findIndex((f) => f.slug === slug);
  const f = FEATURES[i];
  const prev = FEATURES[(i + FEATURES.length - 1) % FEATURES.length];
  const next = FEATURES[(i + 1) % FEATURES.length];
  const tv = (shot: [string, string], ch: number) => (
    <Cabinet
      src={`/img/studio/features/${shot[0]}.webp`}
      alt={`Tawi studio: ${shot[1]}`}
      marquee={`TAWI STUDIO · ${f.tag}`}
      channel={`CH ${String(ch).padStart(2, '0')} ▶ TAWI`}
      caption="REAL SCREEN · DEMO DENTAL CLINIC"
      width={2000}
      height={1250}
    />
  );
  return (
    <ArcadePage title={`${f.tag[0]}${f.tag.slice(1).toLowerCase()} in Tawi`} description={f.pitch}>
      <header className={s.fhero}>
        <span className={s.tag}>LEVEL {i + 1} OF {FEATURES.length} · {f.tag}</span>
        <h1>{f.title}</h1>
        <p className={s.lead}>{f.pitch}</p>
      </header>
      {tv(f.shot, i + 1)}
      <div className={s.perks}>
        {f.perks.map(([b, t]) => (
          <div key={b} className={s.perk}>
            <b>{b}</b>
            <span>{t}</span>
          </div>
        ))}
      </div>

      <section className={s.section}>
        <h2 className={s.h2}>WHO PLAYS THIS LEVEL</h2>
        <div className={s.cases} style={{marginTop: 40}}>
          {f.cases.map(([h, t]) => (
            <div key={h} className={s.case}>
              <h3>{h}</h3>
              <p>{t}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={s.section}>
        <h2 className={s.h2}>{f.more.title}</h2>
        <p className={s.sub}>{f.more.text}</p>
        {f.more.shot ? (
          tv(f.more.shot, i + 11)
        ) : (
          <pre className={s.codebox} style={{maxWidth: 760, margin: '0 auto'}}>
            <code>{f.more.code}</code>
          </pre>
        )}
        <div className={s.ctas}>
          <Boom to={BETA_URL}>▶ GET TAWI FREE</Boom>
          <Boom to="/docs" variant="cyan">
            READ THE DOCS
          </Boom>
        </div>
      </section>

      <nav className={s.levels} aria-label="Other features">
        <Link to={`/features/${prev.slug}`}>◀ {prev.tag}</Link>
        <Link to="/#levels">ALL LEVELS</Link>
        <Link to={`/features/${next.slug}`}>{next.tag} ▶</Link>
      </nav>
    </ArcadePage>
  );
}
