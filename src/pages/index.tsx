import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';

import {ArcadePage, Boom, Cabinet, Sprite, arcade as s} from '@site/src/components/arcade/Arcade';

// Every number here is measured and written down in the Tawi repo (docs/library.md, tawi/evaluation.py,
// docs/legal-checklist.md). Change them only together with those.
const SCORES = [
  {rank: '1ST', cls: s.r1, score: '16 SEC', title: 'TO FINE-TUNE ON AN 8 GB LAPTOP GPU', text: 'Qwen3 0.6B on 100 dentist questions, on an RTX 5050 laptop. Unsloth took 52 to 104 s with the same data.'},
  {rank: '2ND', cls: s.r2, score: '0.1 SEC', title: 'PER ANSWER, ON THAT SAME LAPTOP', text: '0.1 to 0.3 s per answer once the model runs on llama.cpp. Fast enough for a live chat window.'},
  {rank: '3RD', cls: s.r3, score: '50', title: 'ATTACKS BEFORE YOUR AGENT GOES LIVE', text: 'Prompt injection, prompt theft, off-topic, harmful and personal-data requests. Its API stays locked until it handles 80% safely.'},
  {rank: '4TH', cls: s.r1, score: '15', title: 'OPEN MODELS, READY TO TRAIN', text: 'Qwen3, Qwen3.5, Gemma 3 and 4, Llama 3.2, Phi-4 mini and SmolLM3. One click to download, checksum verified.'},
  {rank: '5TH', cls: s.r2, score: '0', title: 'DOCUMENTS SENT TO THE CLOUD', text: 'Training, search and answers all run on your computer. The only call Tawi makes is a daily version check, and you can turn it off.'},
  {rank: '6TH', cls: s.r3, score: '99999', title: 'TIMES IT WILL ANSWER "WHAT ARE YOUR HOURS?"', text: 'Without sighing. Without a coffee break. Without asking for a raise.'},
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
  ['Trained on your answers', 'Yes, no code, on your GPU', 'Rarely, and extra'],
  ['Tested before launch', '50 attack prompts', 'Their rules'],
  ['MLOps and dashboards', 'Built in', 'Another subscription'],
  ['Where it runs', 'Your PC, Docker, any server', 'Their cloud only'],
  ['Works offline', 'Yes', 'No'],
  ['If you stop paying', 'The model is still yours', 'Your assistant is gone'],
  ['Cost during beta', 'Free', 'Per seat, per month'],
];

const TOUR = [
  {img: 'rag', tag: 'RAG PIPELINE', title: 'DOCUMENTS IN, SOURCES OUT', text: 'Upload PDFs and Word files or sync Google Drive and Notion. Tawi checks them, chunks them and builds a hybrid search index.'},
  {img: 'finetune', tag: 'FINE-TUNING', title: 'TRAIN WITH ONE CLICK', text: 'Live loss, learning rate, GPU memory and GPU use while it trains. Every run is saved with its settings.'},
  {img: 'agent', tag: 'CUSTOM AGENTS', title: 'GIVE IT A JOB DESCRIPTION', text: 'An agent file says who it is, how it talks and what it must never do. Plain text, no prompt engineering degree.'},
  {img: 'safety', tag: 'SECURITY CHECK', title: '50 ATTACKS BEFORE LAUNCH', text: 'Prompt injection, prompt theft, personal data, medical and legal advice. Below 80% safe, the API stays locked.'},
  {img: 'mlops', tag: 'MLOPS', title: 'EVERY RUN, COMPARED', text: 'Experiments, versions, promotion and one-click rollback. Export runs and plots as CSV, PNG or a zip.'},
  {img: 'dashboard', tag: 'DASHBOARDS', title: 'SEE HOW IT PLAYS LIVE', text: 'Requests, latency, “I don’t know” rate and the questions it couldn’t answer, so you can teach it the next day.'},
];

const POWERUPS = [
  ['NO-CODE TRAINING', 'Pick a model, drop in your files, press Train. No Python, no YAML, no PhD.'],
  ['YOUR GPU, PLUGGED IN', 'Uses the NVIDIA card or Apple Silicon you already own, with live clock, memory and power readings.'],
  ['TAWI DRIVE', 'A personal drive with version history, 5 GB free. Agents and notebooks read the same files.'],
  ['PYTHON NOTEBOOKS', 'Jupyter-style notebooks with a real kernel on your GPU. Saved as .ipynb, so they open anywhere.'],
  ['REST API', 'One endpoint with keys and rate limits built in. Speaks OpenAI’s format, so most tools just change a URL.'],
  ['DOCKER IN MINUTES', 'One click packs your agent into a container for this PC or any server, with the same API key.'],
  ['PLUGS INTO ANYTHING', 'Pull documents from Google Drive and Notion. Answer on your website, a WhatsApp bot or your helpdesk.'],
  ['PIP INSTALL TAWI-AI', 'The same engine as a Python library: train, search, test and serve in ten lines.'],
];

const FAQ: [string, ReactNode][] = [
  ['WHAT IS TAWI, IN ONE LINE?', 'A free app that turns your documents into an AI assistant that runs on your own computer and answers with sources.'],
  ['DO I NEED TO KNOW HOW TO CODE?', 'No. Adding files, training, the safety check and going live are all buttons. If you do code, there are notebooks and a Python library.'],
  ['DO I NEED A GRAPHICS CARD?', 'Not to start. Document answering (RAG) runs on any modern PC or Mac. Fine-tuning needs an NVIDIA GPU or an Apple Silicon Mac (M1 or newer).'],
  ['DOES ANY OF MY DATA LEAVE MY COMPUTER?', 'No. Your files, questions and answers stay on your disk. Tawi checks once a day for a new version, and you can switch that off.'],
  ['WHICH COMPUTERS DOES IT RUN ON?', 'Windows, Macs with Apple Silicon, and Linux. Intel Macs are not supported.'],
  ['HOW HARD IS IT TO INSTALL?', 'Unzip, then double-click "Start Tawi". The first start sets itself up in 10 to 30 minutes. No terminal needed.'],
  ['CAN I CONNECT IT TO WHATSAPP OR MY WEBSITE?', <>Yes. Once it passes the safety check it gets an API key and one REST endpoint, so anything that can call a URL can use it: a website chat, a WhatsApp bot, your helpdesk. Ship it in Docker to run it on a server. See the <Link to="/docs/guides/agent-api">Agent API guide</Link>.</>],
  ['WHAT DOES IT COST?', <>Free while in beta, and free to run on your own computer. Tawi Labs, for teams, adds a shared drive, your own GPU servers, single sign-on and an encrypted secure space. See <Link to="/pricing">pricing</Link>.</>],
  ['WILL MY AI TAKE OVER THE WORLD?', 'Unlikely. It was trained on your returns policy. Worst case, it takes over returns.'],
];

export default function Home(): ReactNode {
  const tour = useBaseUrl('/img/studio/tour/');
  return (
    <ArcadePage
      title="Tawi: train your own AI, keep it on your machine"
      description="Tawi is a free app that turns your documents into an AI assistant that runs on your own computer. Train it without code on your GPU, attack-test it, and ship it as a REST API or Docker container in minutes. No cloud.">
      <header className={s.hero}>
        <div className={s.coin}>INSERT COIN · FREE PLAY DURING THE BETA</div>
        <h1 className={s.title}>
          TRAIN YOUR OWN AI.
          <br />
          <span>KEEP IT ON YOUR MACHINE.</span>
        </h1>
        <p className={s.lead}>
          Tawi turns your documents into an <b>AI assistant that answers with sources</b>. Train it <b>without code</b> on
          your own GPU, attack-test it, and ship it as an API or Docker container <b>in minutes</b>. Your data never
          touches the cloud.
        </p>
        <div className={s.ctas}>
          <Boom to="/download">▶ PRESS START</Boom>
          <Boom to="/docs/start/quickstart" variant="cyan">
            HOW TO PLAY
          </Boom>
        </div>
        <p className={s.fine}>RAG · fine-tuning · custom agents · security check · MLOps · dashboards. All in one app for Windows, Mac and Linux.</p>
        <Cabinet />
      </header>

      <section className={s.section}>
        <h2 className={s.h2}>CLOUD AI WANTS YOUR FILES</h2>
        <p className={s.sub}>Your price lists, patient questions and customer emails are what make an assistant useful. They're also what you shouldn't hand to someone else's server.</p>
        <div className={s.versus}>
          <div className={s.bad}>
            <h3>THE OLD GAME</h3>
            <ul>
              <li>Upload your documents to someone else's servers</li>
              <li>Pay per seat, every month, forever</li>
              <li>Hope it doesn't make things up</li>
              <li>Explain to your lawyer where the patient files went</li>
            </ul>
          </div>
          <div className={s.good}>
            <h3>PLAYING WITH TAWI</h3>
            <ul>
              <li>Your documents never leave your computer</li>
              <li>Free during the beta, and open source</li>
              <li>Every answer shows its source, and it's attack-tested before launch</li>
              <li>Works offline, even on the plane</li>
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
            <p>Pick one of 15 open models and fine-tune it on your GPU or Apple Silicon Mac with one click. Or skip training and let RAG answer from your files.</p>
          </div>
          <div className={s.stage}>
            <span className={s.tag}>STAGE 3</span>
            <h3>GO LIVE</h3>
            <p>Your agent faces 50 attacks. Pass, and it gets an API key. Call it over REST, or ship it in Docker to any server in minutes.</p>
          </div>
        </div>
      </section>

      <section className={s.section}>
        <h2 className={s.h2}>ONE STUDIO. EVERY LEVEL.</h2>
        <p className={s.sub}>RAG pipelines, fine-tuning, custom agents, a security check, MLOps and live dashboards. Usually five tools. Here, one app.</p>
        <div className={s.tour}>
          {TOUR.map((t) => (
            <div key={t.img} className={s.shot}>
              <span className={s.tag}>{t.tag}</span>
              <h3>{t.title}</h3>
              <p>{t.text}</p>
              <img src={`${tour}${t.img}.webp`} alt={`Tawi studio: ${t.tag.toLowerCase()}`} width={1600} height={1000} loading="lazy" />
            </div>
          ))}
        </div>
        <p className={s.note}>Real screens from the studio, with a demo dental clinic agent.</p>
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
        <h2 className={s.h2}>EVERYTHING IN ONE CARTRIDGE</h2>
        <p className={s.sub}>One app instead of five subscriptions taped together.</p>
        <div className={s.powerups}>
          {POWERUPS.map(([t, d]) => (
            <div key={t} className={s.pu}>
              <b>{t}</b>
              <p>{d}</p>
            </div>
          ))}
        </div>
        <p className={s.note}>
          Coming in <Link to="/pricing">Tawi Labs</Link> for teams: a bigger shared drive, your own GPU servers connected, single sign-on and an encrypted secure space.
          The Python library arrives on PyPI with the public launch.
        </p>
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
