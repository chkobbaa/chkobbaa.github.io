document.addEventListener('DOMContentLoaded', () => {
  const app = document.body;

  function normalizePath(value) {
    const path = (value || '/').replace(/\\/g, '/');
    if (!path.startsWith('/')) return '/' + path;
    return path.replace(/\/+$/, '') || '/';
  }

  function isSuspiciousPath(path) {
    const p = normalizePath(path).toLowerCase();
    const list = [
      '/login',
      '/.env',
      '/.git/config',
      '/wp-admin',
      '/wp-login.php',
      '/phpmyadmin',
      '/admin'
    ];
    return list.includes(p) || p.startsWith('/admin/') || p.startsWith('/wp-admin/');
  }

  function stageFromPath(path) {
    const p = normalizePath(path);

    if (isSuspiciousPath(p)) return 'portal';
    if (p === '/secret/keyboard') return 'level2';
    if (p === '/secret/keyboard/d') return 'level3';
    if (p === '/secret/keyboard/d/c') return 'level4';
    if (p === '/secret/keyboard/d/c/42' || p === '/secret/keyboard/d/c/42/nice-try') return 'final';
    return 'missing';
  }

  function setProgress(percent) {
    const fill = document.getElementById('progressFill');
    const label = document.getElementById('progressLabel');
    if (fill) fill.style.width = percent + '%';
    if (label) label.textContent = percent + '%';
  }

  function renderStage(stage) {
    const styles = `
      :root {
        --bg: #1b1d2a;
        --screen: #d9f7d9;
        --panel: #c0c0c0;
        --panel-dark: #808080;
        --panel-light: #f3f3f3;
        --ink: #111111;
        --ink-soft: #2d2d2d;
        --accent: #0000aa;
        --accent-2: #ffcc00;
        --danger: #a00000;
      }

      * { box-sizing: border-box; }

      html, body {
        margin: 0;
        min-height: 100%;
        font-family: "Courier New", Courier, monospace;
        background:
          radial-gradient(circle at center, rgba(42, 117, 255, 0.22), transparent 35%),
          repeating-linear-gradient(
            180deg,
            rgba(255,255,255,0.04),
            rgba(255,255,255,0.04) 2px,
            transparent 2px,
            transparent 4px
          ),
          linear-gradient(180deg, #090b13 0%, var(--bg) 100%);
        color: var(--ink);
        letter-spacing: 0.04em;
      }

      body {
        display: grid;
        place-items: center;
        min-height: 100vh;
        padding: 32px 18px;
      }

      .portal {
        position: relative;
        width: min(760px, 100%);
        background: linear-gradient(180deg, var(--panel-light) 0%, var(--panel) 100%);
        border: 4px solid var(--ink);
        box-shadow: 10px 10px 0 #000000, 0 0 0 4px #b6b6b6 inset;
        overflow: hidden;
      }

      .portal::before {
        content: "";
        position: absolute;
        inset: 0;
        background: linear-gradient(180deg, rgba(255,255,255,0.28), rgba(0,0,0,0.05));
        pointer-events: none;
      }

      .progress-wrap {
        position: relative;
        z-index: 1;
        padding: 18px 20px 0;
      }

      .progress-meta {
        display: flex;
        justify-content: space-between;
        gap: 12px;
        color: var(--ink);
        font-size: 11px;
        letter-spacing: 0.22em;
        text-transform: uppercase;
        margin-bottom: 10px;
        font-weight: 700;
      }

      .progress-bar {
        height: 18px;
        background: #d0d0d0;
        border: 3px solid var(--ink);
        box-shadow: inset 2px 2px 0 rgba(0,0,0,0.25);
        overflow: hidden;
      }

      .progress-bar > span {
        display: block;
        height: 100%;
        width: 0;
        background: repeating-linear-gradient(
          90deg,
          #0000aa 0 12px,
          #1f40d8 12px 24px
        );
        border-right: 3px solid #fff;
        transition: width 180ms ease;
      }

      .content {
        position: relative;
        z-index: 1;
        padding: 30px 28px 24px;
      }

      .eyebrow {
        color: var(--ink);
        font-size: 11px;
        letter-spacing: 0.22em;
        text-transform: uppercase;
        margin-bottom: 18px;
        font-weight: 700;
      }

      h1 {
        margin: 0 0 18px;
        font-size: clamp(1.8rem, 2.5vw, 2.8rem);
        line-height: 1.1;
        color: var(--ink);
        text-transform: uppercase;
        text-shadow: 2px 2px 0 rgba(255,255,255,0.7);
      }

      .lead {
        color: var(--ink-soft);
        font-size: 1.05rem;
        margin: 0 0 18px;
        line-height: 1.7;
      }

      .riddle {
        border: 3px solid var(--ink);
        background: #d9d9d9;
        box-shadow: inset 3px 3px 0 rgba(255,255,255,0.8), inset -3px -3px 0 rgba(0,0,0,0.18);
        padding: 18px 18px 14px;
        margin: 22px 0;
      }

      .riddle strong {
        display: block;
        margin-bottom: 8px;
        font-size: 0.75rem;
        letter-spacing: 0.2em;
        color: var(--accent);
        text-transform: uppercase;
        font-weight: 700;
      }

      .riddle p {
        margin: 0;
        color: var(--ink);
        font-size: 1rem;
        line-height: 1.8;
        white-space: pre-line;
      }

      form { margin-top: 22px; }

      .field-label {
        display: block;
        font-size: 0.76rem;
        letter-spacing: 0.18em;
        color: var(--ink);
        text-transform: uppercase;
        margin-bottom: 10px;
        font-weight: 700;
      }

      .input-row {
        display: flex;
        gap: 10px;
        flex-wrap: wrap;
      }

      input[type="text"] {
        flex: 1 1 260px;
        min-width: 0;
        background: #f2f2f2;
        border: 3px solid var(--ink);
        color: var(--ink);
        padding: 14px 16px;
        font-size: 1rem;
        font-family: "Courier New", Courier, monospace;
        outline: none;
        box-shadow: inset 2px 2px 0 rgba(0,0,0,0.2);
      }

      input[type="text"]:focus {
        background: #ffffff;
        box-shadow: inset 2px 2px 0 rgba(0,0,0,0.2), 0 0 0 2px var(--accent);
      }

      button {
        background: linear-gradient(180deg, #efefef 0%, #bdbdbd 100%);
        color: var(--ink);
        border: 3px solid var(--ink);
        font-weight: 700;
        padding: 14px 22px;
        font-size: 0.74rem;
        letter-spacing: 0.18em;
        text-transform: uppercase;
        cursor: pointer;
        font-family: "Courier New", Courier, monospace;
        box-shadow: 3px 3px 0 rgba(0,0,0,0.9);
      }

      button:hover {
        transform: translate(-1px, -1px);
        box-shadow: 4px 4px 0 rgba(0,0,0,0.9);
      }

      button:active {
        transform: translate(2px, 2px);
        box-shadow: 1px 1px 0 rgba(0,0,0,0.9);
      }

      .status {
        min-height: 1.5em;
        margin-top: 12px;
        color: var(--danger);
        font-size: 0.9rem;
        font-weight: 700;
        opacity: 0;
        transition: opacity 180ms ease;
      }

      .status.show {
        opacity: 1;
      }

      .final-message {
        color: var(--ink);
        font-size: 1rem;
        line-height: 1.8;
        white-space: pre-line;
        margin: 0;
      }

      .final-message strong {
        color: var(--danger);
      }

      @media (max-width: 520px) {
        .content { padding: 24px 18px 18px; }
        .input-row { display: block; }
        button { width: 100%; margin-top: 10px; }
      }
    `;

    const template = document.createElement('style');
    template.textContent = styles;
    document.head.appendChild(template);

    const progress = { portal: 12, level2: 38, level3: 66, level4: 89, final: 3 };

    function pageMarkup(contentHtml) {
      return `
        <main class="portal" aria-live="polite">
          <div class="progress-wrap">
            <div class="progress-meta">
              <span>Verification</span>
              <span id="progressLabel">${progress[stage] || 0}%</span>
            </div>
            <div class="progress-bar" aria-hidden="true"><span id="progressFill" style="width: ${progress[stage] || 0}%"></span></div>
          </div>
          <div class="content">${contentHtml}</div>
        </main>
      `;
    }

    function finalFailure() {
      document.body.innerHTML = pageMarkup(`
        <div class="eyebrow">Entry denied</div>
        <h1>❌ Incorrect.</h1>
        <p class="final-message">There is no password.

<strong>You have wasted approximately 14 seconds.</strong>

Thank you for visiting.</p>
      `);
      setProgress(3);
    }

    if (stage === 'portal') {
      document.body.innerHTML = pageMarkup(`
        <div class="eyebrow">Security verification</div>
        <h1>🔐 SECURITY VERIFICATION</h1>
        <p class="lead">Congratulations, automated entity.</p>
        <p class="lead">You have discovered the <strong>Forbidden Developer Portal™</strong>.</p>
        <p class="lead">To continue, solve:</p>
        <div class="riddle">
          <strong>Riddle</strong>
          <p>I have keys but no locks.
I have space but no room.
You can enter, but you can't go inside.</p>
        </div>
        <form id="puzzleForm">
          <label class="field-label" for="answer">Enter the answer:</label>
          <div class="input-row">
            <input id="answer" name="answer" type="text" autocomplete="off" spellcheck="false" aria-label="Answer" />
            <button type="submit">Submit</button>
          </div>
          <div class="status" id="status" aria-live="polite"></div>
        </form>
      `);

      const form = document.getElementById('puzzleForm');
      form.addEventListener('submit', (event) => {
        event.preventDefault();
        const value = document.getElementById('answer').value.trim().toLowerCase();
        const status = document.getElementById('status');
        if (value === 'keyboard') {
          window.location.assign('/secret/keyboard');
          return;
        }
        status.textContent = 'Incorrect. The portal is not impressed.';
        status.classList.add('show');
      });
      return;
    }

    if (stage === 'level2') {
      document.body.innerHTML = pageMarkup(`
        <div class="eyebrow">Level 1/5 complete</div>
        <h1>Correct.</h1>
        <p class="lead">Unfortunately, that was <strong>Level 1/5</strong>.</p>
        <div class="riddle">
          <strong>Level 2</strong>
          <p>What comes next?

J F M A M J J A S O N _</p>
        </div>
        <form id="puzzleForm">
          <label class="field-label" for="answer">/secret/<answer></label>
          <div class="input-row">
            <input id="answer" name="answer" type="text" autocomplete="off" spellcheck="false" aria-label="Answer" />
            <button type="submit">Submit</button>
          </div>
          <div class="status" id="status" aria-live="polite"></div>
        </form>
      `);

      const form = document.getElementById('puzzleForm');
      form.addEventListener('submit', (event) => {
        event.preventDefault();
        const value = document.getElementById('answer').value.trim().toLowerCase();
        const status = document.getElementById('status');
        if (value === 'd') {
          window.location.assign('/secret/keyboard/d');
          return;
        }
        status.textContent = 'No. The sequence grows increasingly judgmental.';
        status.classList.add('show');
      });
      return;
    }

    if (stage === 'level3') {
      document.body.innerHTML = pageMarkup(`
        <div class="eyebrow">Level 3</div>
        <h1>Which weighs more?</h1>
        <div class="riddle">
          <strong>Choose wisely</strong>
          <p>A) 1 kg of feathers
B) 1 kg of lead
C) Your browser's decision to request /.env</p>
        </div>
        <form id="puzzleForm">
          <label class="field-label" for="answer">Answer</label>
          <div class="input-row">
            <input id="answer" name="answer" type="text" autocomplete="off" spellcheck="false" aria-label="Answer" />
            <button type="submit">Submit</button>
          </div>
          <div class="status" id="status" aria-live="polite"></div>
        </form>
      `);

      const form = document.getElementById('puzzleForm');
      form.addEventListener('submit', (event) => {
        event.preventDefault();
        const value = document.getElementById('answer').value.trim().toLowerCase();
        const status = document.getElementById('status');
        if (value === 'c') {
          window.location.assign('/secret/keyboard/d/c');
          return;
        }
        status.textContent = 'Still wrong. The browser has opinions.';
        status.classList.add('show');
      });
      return;
    }

    if (stage === 'level4') {
      document.body.innerHTML = pageMarkup(`
        <div class="eyebrow">Level 4</div>
        <h1>Type the word <span style="color: var(--accent-2);">"I am not a bot"</span> exactly.</h1>
        <p class="lead">Hint: you have already failed this test.</p>
        <form id="puzzleForm">
          <label class="field-label" for="answer">Word</label>
          <div class="input-row">
            <input id="answer" name="answer" type="text" autocomplete="off" spellcheck="false" aria-label="Answer" />
            <button type="submit">Submit</button>
          </div>
          <div class="status" id="status" aria-live="polite"></div>
        </form>
      `);

      const form = document.getElementById('puzzleForm');
      form.addEventListener('submit', (event) => {
        event.preventDefault();
        const value = document.getElementById('answer').value.trim();
        const status = document.getElementById('status');
        if (value === 'I am not a bot') {
          window.location.assign('/secret/keyboard/d/c/42');
          return;
        }
        status.textContent = 'Incorrect. The test is already over.';
        status.classList.add('show');
      });
      return;
    }

    if (stage === 'final') {
      document.body.innerHTML = pageMarkup(`
        <div class="eyebrow">Final verification</div>
        <h1>What is the password?</h1>
        <p class="lead">The password is NOT "password".<br>It is also not "admin".<br>It is definitely not "letmein".</p>
        <form id="puzzleForm">
          <label class="field-label" for="answer">Password</label>
          <div class="input-row">
            <input id="answer" name="answer" type="text" autocomplete="off" spellcheck="false" aria-label="Password" />
            <button type="submit">Submit</button>
          </div>
          <div class="status" id="status" aria-live="polite"></div>
        </form>
      `);

      const form = document.getElementById('puzzleForm');
      form.addEventListener('submit', (event) => {
        event.preventDefault();
        finalFailure();
      });
      return;
    }

    document.body.innerHTML = pageMarkup(`
      <div class="eyebrow">404</div>
      <h1>Not found.</h1>
      <p class="lead">This page is not part of the approved development route.</p>
    `);
    setProgress(0);
  }

  renderStage(stageFromPath(window.location.pathname));
});
