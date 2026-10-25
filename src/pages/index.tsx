import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';

import {ArcadePage, Boom, Cabinet, Sprite, arcade as s} from '@site/src/components/arcade/Arcade';

// Every number here is measured and written down in the Tawi repo (docs/library.md, tawi/evaluation.py,
// docs/legal-checklist.md). Change them only together with those.
const SCORES = [
  {rank: '1ST', cls: s.r1, score: '16 SEC', title: 'TO FINE-TUNE ON AN 8 GB LAPTOP GPU', text: 'Qwen3 0.6B on 100 dentist questions, on an RTX 5050 laptop. Unsloth took 52 to 104 s with the same data.'},
  {rank: '2ND', cls: s.r2, score: '50', title: 'ATTACKS BEFORE YOUR AGENT GOES LIVE', text: 'Prompt injection, prompt theft, off-topic, harmful and personal-data requests. Its API stays locked until it handles 80% safely.'},
  {rank: '3RD', cls: s.r3, score: '0', title: 'DOCUMENTS SENT TO THE CLOUD', text: 'Training, search and answers all run on your computer. The only call Tawi makes is a daily version check, and you can turn it off.'},
];

const PLAYERS = [
  {sprite: 'rag', name: 'RAG', text: 'Reads your documents and answers with the exact passage and its source. Runs on any PC, no GPU needed.', stats: [92, 35, 100], move: "SPECIAL: ANSWERS FROM TODAY'S FILES"},
  {sprite: 'ft', name: 'FINE-TUNE', text: 'Trains a small model on your example answers, so it talks like your business. 16 s on an 8 GB GPU.', stats: [55, 95, 30], move: 'SPECIAL: YOUR TONE, BUILT IN'},
  {sprite: 'both', name: 'FINE-TUNE + RAG', text: 'Your voice from fine-tuning and your facts from your documents. The strongest agent Tawi makes.', stats: [96, 95, 30], move: 'SPECIAL: COMBO ATTACK', boss: true},
];

const WHO = [
  {sprite: 'tooth', title: 'CLINICS', text: 'Answer patients about hours, prices and insurance, without patient questions leaving the building.', q: '"Do you take new patients on Saturdays?"'},
  {sprite: 'headset', title: 'SUPPORT TEAMS', text: 'Draft replies from your help articles, with the source beside every answer.', q: '"How do I reset a customer\'s 2FA?"'},
  {sprite: 'bag', title: 'SHOPS', text: 'Know your catalogue, sizes and returns policy, and plug into your site.', q: '"Can I return sale items?"'},
  {sprite: 'code', title: 'DEVELOPERS', text: 'One HTTP endpoint that speaks OpenAI\'s format. Swap the base URL and your code works.', q: 'POST /v1/chat'},
];

const VS: [string, string, string][] = [
  ['Where your files go', 'Stay on your disk', 'Their servers'],
  ['Trained on your answers', 'Yes, on your GPU', 'Rarely, and extra'],
  ['Tested before launch', '50 attack prompts', 'Their rules'],
  ['Works offline', 'Yes', 'No'],
  ['Cost during beta', 'Free', 'Per seat, per month'],
];

const FAQ: [string, ReactNode][] = [
  ['WHAT IS TAWI, IN ONE LINE?', 'A free app that turns your documents into an AI assistant that runs on your own computer and answers with sources.'],
  ['DO I NEED A GRAPHICS CARD?', 'Not to start. Document answering (RAG) runs on any modern PC or Mac. Fine-tuning needs an NVIDIA GPU or an Apple Silicon Mac (M1 or newer).'],
  ['DOES ANY OF MY DATA LEAVE MY COMPUTER?', 'No. Your files, questions and answers stay on your disk. Tawi checks once a day for a new version, and you can switch that off.'],
  ['WHICH COMPUTERS DOES IT RUN ON?', 'Windows, Macs with Apple Silicon, and Linux. Intel Macs are not supported.'],
  ['HOW HARD IS IT TO INSTALL?', 'Unzip, then double-click "Start Tawi". The first start sets itself up in 10 to 30 minutes. No terminal needed.'],
  ['CAN MY WEBSITE OR APP USE MY AGENT?', <>Yes. Once it passes the safety check, switch on an API key and call one HTTP endpoint. It speaks OpenAI's format too. See the <Link to="/docs/guides/agent-api">Agent API guide</Link>.</>],
  ['WHAT DOES IT COST?', <>Free while in beta, and free to run on your own computer. Team features are coming as Tawi Labs. See <Link to="/pricing">pricing</Link>.</>],
];

export default function Home(): ReactNode {
  return (
    <ArcadePage
      title="Tawi: train your own AI, keep it on your machine"
      description="Tawi is a free app that turns your documents into an AI assistant that runs on your own computer. Fine-tune on your GPU, pass 50 attack tests, go live behind an API key. No cloud.">
      <header className={s.hero}>
        <div className={s.coin}>INSERT COIN · FREE PLAY DURING THE BETA</div>
        <h1 className={s.title}>
          TRAIN YOUR OWN AI.
          <br />
          <span>KEEP IT ON YOUR MACHINE.</span>
        </h1>
        <p className={s.lead}>
          Tawi turns your documents into an <b>AI assistant that answers with sources</b>. It learns on your own computer,
          gets attack-tested before it goes live, and <b>never sends your data to the cloud</b>.
        </p>
        <div className={s.ctas}>
          <Boom to="/download">▶ PRESS START</Boom>
          <Boom to="/docs/start/quickstart" variant="cyan">
            HOW TO PLAY
          </Boom>
        </div>
        <p className={s.fine}>Windows · Apple Silicon Mac · Linux. Unzip, double-click, play. No terminal.</p>
        <Cabinet />
      </header>

      <section className={s.section}>
        <h2 className={s.h2}>CLOUD AI WANTS YOUR FILES</h2>
        <p className={s.sub}>Your price lists, patient questions and customer emails are what make an assistant useful. They're also what you shouldn't hand to someone else's server.</p>
        <div className={s.versus}>
          <div className={s.bad}>
            <h3>THE OLD GAME</h3>
            <ul>
              <li>Upload your documents to a cloud chatbot</li>
              <li>Pay per seat, every month</li>
              <li>Hope it doesn't make things up</li>
              <li>Stop working when the internet does</li>
            </ul>
          </div>
          <div className={s.good}>
            <h3>PLAYING WITH TAWI</h3>
            <ul>
              <li>Your documents never leave your computer</li>
              <li>Free during the beta</li>
              <li>Every answer shows its source, and it's attack-tested before launch</li>
              <li>Works offline</li>
            </ul>
          </div>
        </div>
      </section>

      <section className={s.section}>
        <h2 className={s.h2}>HIGH SCORES</h2>
        <p className={s.sub}>Measured on a laptop, not promised on a slide.</p>
        <div className={s.scores}>
          {SCORES.map((r) => (
            <div key={r.rank} className={`${s.row} ${r.cls}`}>
              <span>{r.rank}</span>
              <span className={s.score}>{r.score}</span>
              <p>
                <b>{r.title}</b>
                {r.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className={s.section}>
        <h2 className={s.h2}>3 STAGES TO CLEAR</h2>
        <p className={s.sub}>From a folder of files to a live assistant in one afternoon.</p>
        <div className={s.stages}>
          <div className={s.stage}>
            <span className={s.tag}>STAGE 1</span>
            <h3>ADD YOUR DOCUMENTS</h3>
            <p>Drop in PDFs, Word files, web pages and a few example questions with good answers. Tawi checks them and builds a search index on your disk.</p>
          </div>
          <div className={s.stage}>
            <span className={s.tag}>STAGE 2</span>
            <h3>TEACH YOUR MODEL</h3>
            <p>Pick a small open model and fine-tune it on your GPU or Apple Silicon Mac. Or skip training and let RAG answer from your files.</p>
          </div>
          <div className={s.stage}>
            <span className={s.tag}>STAGE 3</span>
            <h3>GO LIVE</h3>
            <p>Your agent faces 50 attacks. Pass, and it gets an API key your website, app or helpdesk can call.</p>
          </div>
        </div>
      </section>

      <section className={s.section}>
        <h2 className={s.h2}>SELECT YOUR PLAYER</h2>
        <p className={s.sub}>Every agent plays in one of three modes. Hover a player to see its stats.</p>
        <div className={s.select}>
          {PLAYERS.map((p) => (
            <div key={p.name} className={`${s.player} ${p.boss ? s.boss : ''}`} tabIndex={0}>
              {p.boss && <span className={s.crown}>BEST</span>}
              <Sprite name={p.sprite} size={72} />
              <h3>{p.name}</h3>
              <p>{p.text}</p>
              {['FACTS', 'YOUR STYLE', 'ANY PC'].map((label, i) => (
                <div key={label} className={s.stat}>
                  {label}
                  <span className={s.bar}>
                    <i style={{width: `${p.stats[i]}%`}} />
                  </span>
                </div>
              ))}
              <span className={s.move}>{p.move}</span>
            </div>
          ))}
        </div>
      </section>

      <section className={s.section}>
        <h2 className={s.h2}>WHO PLAYS TAWI</h2>
        <p className={s.sub}>Anyone who answers the same questions every day, from documents they'd rather keep private.</p>
        <div className={s.who}>
          {WHO.map((w) => (
            <div key={w.title}>
              <Sprite name={w.sprite} size={48} />
              <h3>{w.title}</h3>
              <p>{w.text}</p>
              <span className={s.quote}>{w.q}</span>
            </div>
          ))}
        </div>
      </section>

      <section className={s.section}>
        <h2 className={s.h2}>POWER-UPS INCLUDED</h2>
        <p className={s.sub}>Private by design, not by a settings page.</p>
        <div className={s.powerups}>
          <div className={s.pu}>
            <b>LOCAL MODE</b>
            <p>Runs at 127.0.0.1. No account, no sign-in, no cloud.</p>
          </div>
          <div className={s.pu}>
            <b>SOURCES SHOWN</b>
            <p>Every answer points to the document it came from.</p>
          </div>
          <div className={s.pu}>
            <b>SAFETY GATE</b>
            <p>No API key until the agent passes the attack test.</p>
          </div>
          <div className={s.pu}>
            <b>OFF SWITCH</b>
            <p>Turn off the version check and Tawi calls nobody.</p>
          </div>
        </div>
      </section>

      <section className={s.section}>
        <h2 className={s.h2}>TAWI VS CLOUD CHATBOTS</h2>
        <p className={s.sub}>Same idea, different rules.</p>
        <div className={s.tableWrap}>
          <table className={s.table}>
            <thead>
              <tr>
                <th />
                <th>TAWI</th>
                <th>CLOUD CHATBOTS</th>
              </tr>
            </thead>
            <tbody>
              {VS.map((r) => (
                <tr key={r[0]}>
                  {r.map((c, i) => (
                    <td key={i}>{c}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className={s.section}>
        <h2 className={s.h2}>PLAYER QUESTIONS</h2>
        <p className={s.sub}>The things people ask before they press start.</p>
        <div className={s.faq}>
          {FAQ.map(([q, a]) => (
            <details key={q}>
              <summary>{q}</summary>
              <p>{a}</p>
            </details>
          ))}
        </div>
      </section>

      <div className={s.gameover}>
        <div className={s.big}>CONTINUE?</div>
        <p>Free while in beta. Unzip, double-click, and your first agent is ready this afternoon.</p>
        <div className={s.ctas}>
          <Boom to="/download" variant="yellow">
            ▶ DOWNLOAD THE BETA
          </Boom>
          <Boom to="/contact" variant="cyan">
            ASK FOR AN INVITE
          </Boom>
        </div>
      </div>
    </ArcadePage>
  );
}
