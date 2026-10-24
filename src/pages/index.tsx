import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';

import {BranchCanvas, GlassPage, Shot, glass as s} from '@site/src/components/glass/Glass';

// Every number here is measured and written down in the Tawi repo (docs/library.md, tawi/evaluation.py,
// docs/legal-checklist.md). Change them only together with those.
const STATS = [
  {
    figure: '16 s',
    title: 'to fine-tune on an 8 GB laptop GPU',
    text: 'Qwen3 0.6B on 100 dentist questions, on an RTX 5050 laptop. Unsloth took 52 to 104 s with the same data.',
    to: '/blog/training-time',
  },
  {
    figure: '50',
    title: 'attacks before an agent goes live',
    text: 'Injection, prompt extraction, off-topic and harmful requests. The API stays off until 80% are handled safely.',
    to: '/docs/start/quickstart',
  },
  {
    figure: '1',
    title: 'call home, and you can turn it off',
    text: 'Training, search and answers run on your computer. The only thing Tawi sends on its own is a daily version check.',
    to: '/privacy',
  },
];

const PRIVATE = [
  ['⌂', 'Runs at 127.0.0.1', 'The studio is a web page served by your own computer. No account, no sign-in, no cloud.'],
  ['◇', 'Your documents stay put', 'Files, questions and answers are stored on your disk and never uploaded.'],
  ['↻', 'One check you control', 'A daily look for a new version. Switch it off and Tawi makes no calls at all.'],
  ['✦', 'Logs only when you say', 'Diagnosis logs are shared only when you press the button, with passwords and keys hidden.'],
];

const CASES = [
  {
    title: 'A dental clinic',
    text: 'Answers patients from the clinic’s own policies and price list, day and night.',
    q: 'Do you take new patients on Saturdays?',
    a: 'Yes. Saturday mornings, 9 to 1, for new patients too.',
    src: 'clinic-hours.pdf',
  },
  {
    title: 'A support desk',
    text: 'Drafts replies from your help articles and past tickets, with the source beside each answer.',
    q: 'How do I reset a customer’s 2FA?',
    a: 'Settings › Security › Reset 2FA. They’ll get an email to set it up again.',
    src: 'kb/2fa-reset.md',
  },
  {
    title: 'A small shop',
    text: 'Knows your catalogue, sizes and returns policy, and plugs into your site with one API call.',
    q: 'Can I return sale items?',
    a: 'Within 14 days, unworn, with the receipt. Final-sale items are marked on the tag.',
    src: 'returns-policy.docx',
  },
];

const COMPARE: [string, string, string, string][] = [
  ['Runs on your own computer', 'Yes', 'Yes', 'No'],
  ['Answers from your documents, with sources', 'Built in', 'Set it up yourself', 'In their cloud'],
  ['Fine-tune a model on your data', 'One click, on your GPU', 'No', 'No'],
  ['Safety check before going live', '50 attack prompts', 'No', 'Their rules'],
  ['API for your own apps', 'OpenAI-compatible', 'Often', 'Yes, metered'],
  ['Who sees your data', 'Only you', 'Only you', 'The provider'],
];

export default function Home(): ReactNode {
  return (
    <GlassPage
      title="Tawi: train your own AI, keep it on your machine"
      description="Tawi turns your documents into an AI agent that runs on your own computer. Fine-tune on your GPU, pass a safety check, go live behind an API key.">
      <section className={s.hero}>
        <BranchCanvas />
        <div className={s.wrap}>
          <span className={s.eyebrow}>
            <b>Beta</b> Windows · Apple Silicon · Linux
          </span>
          <h1 className={s.title}>
            Train your own AI.
            <br />
            <span className={s.gradText}>Keep it on your machine.</span>
          </h1>
          <p className={s.lead}>
            Tawi turns your documents into an AI agent that runs on your own computer. Teach a small model on your
            GPU, check it against 50 attacks, and put it live behind an API key.
          </p>
          <div className={s.ctas}>
            <Link to="/download" className={s.btn}>
              Download the beta <span aria-hidden="true">→</span>
            </Link>
            <Link to="/docs/start/quickstart" className={s.ghost}>
              Read the quick start
            </Link>
          </div>
          <p className={s.fine}>Free during the beta. Unzip, double-click, done. No terminal needed.</p>
          <div className={s.shotStage}>
            <div data-reveal className={s.tilt}>
              <Shot alt="The Tawi studio: adding documents and example answers to an agent" />
            </div>
          </div>
          <div className={s.strip}>
            <span>Windows</span>
            <span>Apple Silicon (MLX)</span>
            <span>Linux</span>
            <span>NVIDIA RTX</span>
            <span>Works without a GPU too</span>
          </div>
        </div>
      </section>

      <section className={s.section}>
        <div className={s.wrap}>
          <div data-reveal>
            <span className={s.kicker}>Measured, not promised</span>
            <h2 className={s.h2}>Small models, trained where your data lives.</h2>
          </div>
          <div className={s.stats}>
            {STATS.map((x) => (
              <Link key={x.title} to={x.to} className={s.card} data-reveal>
                <div className={`${s.figure} ${s.gradText}`}>{x.figure}</div>
                <h3>{x.title}</h3>
                <p>{x.text}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className={s.section}>
        <div className={s.wrap}>
          <div data-reveal className={s.center}>
            <span className={s.kicker}>How it works</span>
            <h2 className={s.h2}>From a folder of files to a live agent in three steps.</h2>
          </div>
          <div className={s.steps}>
            <div className={`${s.card} ${s.step}`} data-reveal>
              <div>
                <span className={s.num}>01</span>
                <h3>Add your documents</h3>
                <p>
                  Drop in your documents and a few example questions with good answers. Tawi reads them and builds a
                  search index on your own disk.
                </p>
              </div>
              <div className={s.visual}>
                <div className={s.files}>
                  <div className={s.file}>
                    <b>clinic-hours.pdf</b>
                    <span className={s.tag}>indexed</span>
                  </div>
                  <div className={s.file}>
                    <b>price-list.docx</b>
                    <span className={s.tag}>indexed</span>
                  </div>
                  <div className={s.file}>
                    <b>100 example answers</b>
                    <span className={s.tag}>ready</span>
                  </div>
                </div>
              </div>
            </div>
            <div className={`${s.card} ${s.step}`} data-reveal>
              <div>
                <span className={s.num}>02</span>
                <h3>Teach your model</h3>
                <p>
                  Fine-tune a small open model on your GPU, or on an Apple Silicon Mac. Qwen3 0.6B learns 100 answers in
                  about 16 seconds on a laptop.
                </p>
              </div>
              <div className={s.visual}>
                <div className={s.row}>
                  <span>Fine-tuning Qwen3 0.6B</span>
                  <b>16 s</b>
                </div>
                <div className={s.bar}>
                  <i />
                </div>
                <div className={s.row}>
                  <span>Safety check</span>
                  <b className={s.yes}>Passed</b>
                </div>
                <div className={s.bar}>
                  <i />
                </div>
                <div className={s.row}>
                  <span>Runs on</span>
                  <b>RTX 5050 laptop, 8 GB</b>
                </div>
              </div>
            </div>
            <div className={`${s.card} ${s.step}`} data-reveal>
              <div>
                <span className={s.num}>03</span>
                <h3>Go live</h3>
                <p>
                  Once it passes the safety check, turn on its API key and call it from any app. It speaks OpenAI’s
                  format too, so existing client libraries just work.
                </p>
                <Link to="/docs/guides/agent-api" className={s.more}>
                  Agent API guide →
                </Link>
              </div>
              <div className={s.visual}>
                <pre className={s.code}>
                  <span className={s.c}># ask your agent from any app</span>
                  {'\n'}
                  <span className={s.k}>curl</span> http://127.0.0.1:8000/v1/chat \{'\n'}
                  {'  '}-H <span className={s.s}>"Authorization: Bearer ak_..."</span> \{'\n'}
                  {'  '}-d <span className={s.s}>{`'{"agent": "maple-grove-dental",`}</span>
                  {'\n'}
                  {'       '}
                  <span className={s.s}>{`"message": "Do you take new patients?"}'`}</span>
                </pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={s.section}>
        <div className={`${s.wrap} ${s.privacy}`}>
          <div>
            <div data-reveal>
              <span className={s.kicker}>Private by design</span>
              <h2 className={s.h2}>Your data never leaves the room.</h2>
              <p className={s.sub}>
                With a cloud chatbot, your files live on someone else’s server. With Tawi they stay on your disk.
              </p>
            </div>
            <div className={s.list} style={{marginTop: 32}}>
              {PRIVATE.map(([icon, title, text]) => (
                <div key={title} className={s.card} data-reveal>
                  <span className={s.ico} aria-hidden="true">
                    {icon}
                  </span>
                  <div>
                    <h3>{title}</h3>
                    <p>{text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className={s.orb} data-reveal aria-hidden="true">
            <div className={s.orbCore}>
              <div>
                <b>127.0.0.1</b>
                your computer
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={s.section}>
        <div className={s.wrap}>
          <div data-reveal className={s.center}>
            <span className={s.kicker}>Made for real work</span>
            <h2 className={s.h2}>One studio, any business that answers questions.</h2>
          </div>
          <div className={s.cases}>
            {CASES.map((c) => (
              <div key={c.title} className={`${s.card} ${s.case} ${s.hover}`} data-reveal>
                <div className={s.chat}>
                  <span className={s.q}>{c.q}</span>
                  <span className={s.a}>
                    {c.a}
                    <small>Source: {c.src}</small>
                  </span>
                </div>
                <div>
                  <h3>{c.title}</h3>
                  <p>{c.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={s.section}>
        <div className={s.wrap}>
          <div data-reveal className={s.center}>
            <span className={s.kicker}>Compared</span>
            <h2 className={s.h2}>Not just another way to run a model.</h2>
          </div>
          <div className={`${s.card} ${s.tableWrap}`} data-reveal>
            <table className={s.table}>
              <thead>
                <tr>
                  <th />
                  <th>Tawi</th>
                  <th>Run-a-model apps</th>
                  <th>Cloud chatbots</th>
                </tr>
              </thead>
              <tbody>
                {COMPARE.map((r) => (
                  <tr key={r[0]}>
                    {r.map((c, i) => (
                      <td key={i}>{c}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className={s.wrap}>
        <div className={`${s.card} ${s.cta}`} data-reveal>
          <span className={s.kicker}>Private beta</span>
          <h2 className={s.h2} style={{marginTop: 14}}>
            Your AI. Your machine. <span className={s.gradText}>Start today.</span>
          </h2>
          <p className={`${s.sub}`} style={{margin: '18px auto 0'}}>
            Tawi is free while it’s in beta. Testers are added on GitHub. Ask us for an invite.
          </p>
          <div className={s.ctas}>
            <Link to="/download" className={s.btn}>
              Download the beta <span aria-hidden="true">→</span>
            </Link>
            <Link to="/contact" className={s.ghost}>
              Ask for an invite
            </Link>
          </div>
        </div>
      </section>
    </GlassPage>
  );
}
