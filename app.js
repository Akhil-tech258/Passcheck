(() => {
  const canvas = document.getElementById('matrix-canvas');
  const ctx = canvas.getContext('2d');
  let cols, drops;

  const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノ01ハヒフヘホマミムメモ10ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()';

  function initMatrix() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    cols = Math.floor(canvas.width / 18);
    drops = Array.from({ length: cols }, () => Math.random() * -50);
  }

  function drawMatrix() {
    ctx.fillStyle = 'rgba(2, 4, 8, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < cols; i++) {
      const char = chars[Math.floor(Math.random() * chars.length)];
      const x = i * 18;
      const y = drops[i] * 18;
      const gradient = ctx.createLinearGradient(0, y - 60, 0, y);
      gradient.addColorStop(0, 'transparent');
      gradient.addColorStop(1, i % 7 === 0 ? '#00f5ff' : '#00ff88');
      ctx.fillStyle = gradient;
      ctx.font = '13px Share Tech Mono, monospace';
      ctx.fillText(char, x, y);
      if (y > canvas.height && Math.random() > 0.975) drops[i] = 0;
      drops[i] += 0.5;
    }
  }

  initMatrix();
  setInterval(drawMatrix, 50);
  window.addEventListener('resize', initMatrix);

  const typedEl = document.getElementById('typed-text');
  const phrases = [
    '> INITIALIZING SECURITY ANALYSIS ENGINE...',
    '> CRYPTOGRAPHIC STRENGTH PROTOCOLS LOADED.',
    '> ENTER PASSWORD TO BEGIN THREAT ASSESSMENT.',
  ];
  let phraseIdx = 0, charIdx = 0, deleting = false;

  function type() {
    const phrase = phrases[phraseIdx];
    if (!deleting) {
      typedEl.textContent = phrase.slice(0, ++charIdx);
      if (charIdx === phrase.length) {
        deleting = true;
        setTimeout(type, 2800);
        return;
      }
    } else {
      typedEl.textContent = phrase.slice(0, --charIdx);
      if (charIdx === 0) {
        deleting = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
      }
    }
    setTimeout(type, deleting ? 25 : 55);
  }
  type();

  const pwInput = document.getElementById('password-input');
  const toggleBtn = document.getElementById('toggle-vis');
  const eyeIcon = document.getElementById('eye-icon');
  const barFill = document.getElementById('bar-fill');
  const barGlow = document.getElementById('bar-glow');
  const strengthValue = document.getElementById('strength-value');
  const crackTime = document.getElementById('crack-time');
  const cardPrimary = document.querySelector('.card-primary');
  const checkItems = document.querySelectorAll('.check-item');

  const EYE_OPEN = `<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>`;
  const EYE_CLOSED = `<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>`;

  toggleBtn.addEventListener('click', () => {
    const isPassword = pwInput.type === 'password';
    pwInput.type = isPassword ? 'text' : 'password';
    eyeIcon.innerHTML = isPassword ? EYE_CLOSED : EYE_OPEN;
  });

  function calcEntropy(pw) {
    let pool = 0;
    if (/[a-z]/.test(pw)) pool += 26;
    if (/[A-Z]/.test(pw)) pool += 26;
    if (/[0-9]/.test(pw)) pool += 10;
    if (/[^a-zA-Z0-9]/.test(pw)) pool += 32;
    return pw.length * Math.log2(pool || 1);
  }

  function crackTimeStr(entropy) {
    const guessesPerSec = 1e12;
    const combinations = Math.pow(2, entropy);
    const secs = combinations / guessesPerSec;
    if (secs < 1) return 'instantaneous';
    if (secs < 60) return `~${Math.round(secs)} seconds`;
    if (secs < 3600) return `~${Math.round(secs / 60)} minutes`;
    if (secs < 86400) return `~${Math.round(secs / 3600)} hours`;
    if (secs < 31536000) return `~${Math.round(secs / 86400)} days`;
    if (secs < 31536000 * 1000) return `~${Math.round(secs / 31536000)} years`;
    if (secs < 31536000 * 1e6) return `~${(secs / 31536000 / 1000).toFixed(1)}K years`;
    if (secs < 31536000 * 1e9) return `~${(secs / 31536000 / 1e6).toFixed(1)}M years`;
    return '∞ centuries';
  }

  const checks = {
    length: pw => pw.length >= 8,
    upper: pw => /[A-Z]/.test(pw),
    lower: pw => /[a-z]/.test(pw),
    number: pw => /[0-9]/.test(pw),
    special: pw => /[^a-zA-Z0-9]/.test(pw),
    length16: pw => pw.length >= 16,
  };

  const levels = [
    { label: 'WEAK', pct: 20, color: '#ff2d55', glow: 'rgba(255,45,85,0.5)', crackColor: '#ff2d55', cls: 'strength-weak' },
    { label: 'MEDIUM', pct: 50, color: '#ff6b35', glow: 'rgba(255,107,53,0.5)', crackColor: '#ff6b35', cls: 'strength-medium' },
    { label: 'STRONG', pct: 78, color: '#00f5ff', glow: 'rgba(0,245,255,0.5)', crackColor: '#00f5ff', cls: 'strength-strong' },
    { label: 'ULTRA SECURE', pct: 100, color: '#00ff88', glow: 'rgba(0,255,136,0.5)', crackColor: '#00ff88', cls: 'strength-ultra' },
  ];

  function getLevel(pw) {
    if (!pw) return null;
    const entropy = calcEntropy(pw);
    const passed = Object.values(checks).filter(fn => fn(pw)).length;
    if (entropy < 28 || passed <= 1) return 0;
    if (entropy < 45 || passed <= 3) return 1;
    if (entropy < 60 || passed <= 4) return 2;
    return 3;
  }

  const breachAlert = document.getElementById('breach-alert');
  const breachDesc = document.getElementById('breach-desc');
  const entropyScore = document.getElementById('entropy-score');

  const COMMON_WEAK_PASSWORDS = new Set([
    'password', '123456', '12345678', '123456789', 'qwerty', '12345', '1234',
    'password1', 'admin', 'welcome', 'login', 'iloveyou', 'secret', 'monkey',
    'dragon', 'football', 'master', 'letmein', 'access', 'default', 'pass1234'
  ]);

  function checkVulnerability(pw) {
    if (!pw) return null;
    const lower = pw.toLowerCase();
    if (COMMON_WEAK_PASSWORDS.has(lower)) {
      return `"${pw}" appears in top globally breached credential databases. Crackable in < 1 millisecond.`;
    }
    if (/^[0-9]+$/.test(pw) && pw.length <= 8) {
      return `Numeric-only PIN pattern is trivial to crack using basic automated dictionary attacks.`;
    }
    if (/(.)\1{3,}/.test(pw)) {
      return `Repeated character pattern (${pw.match(/(.)\1{3,}/)[0]}) severely degrades cryptographic entropy.`;
    }
    if (/^(1234|2345|3456|4567|5678|6789|abcd|bcde|cdef|qwerty|asdf)/i.test(pw)) {
      return `Sequential pattern detected at start of password. Highly susceptible to rule-based attacks.`;
    }
    return null;
  }

  function analyze(pw) {
    checkItems.forEach(item => {
      const key = item.dataset.check;
      const pass = pw ? checks[key](pw) : false;
      item.classList.toggle('pass', pass);
      item.classList.toggle('fail', pw.length > 0 && !pass);
      item.querySelector('.check-icon').textContent = pass ? '✓' : (pw ? '✗' : '○');
    });

    cardPrimary.classList.remove('strength-weak', 'strength-medium', 'strength-strong', 'strength-ultra');

    if (!pw) {
      barFill.style.width = '0%';
      barFill.style.background = '';
      barGlow.style.width = '0%';
      barGlow.style.boxShadow = '';
      strengthValue.textContent = '—';
      crackTime.textContent = '— enter password';
      crackTime.style.color = 'var(--cyan)';
      if (entropyScore) entropyScore.textContent = '— 0 bits';
      if (breachAlert) breachAlert.style.display = 'none';
      return;
    }

    const entropy = Math.round(calcEntropy(pw));
    const score = Math.min(100, Math.round((entropy / 80) * 100));
    if (entropyScore) entropyScore.textContent = `${entropy} bits • ${score}/100`;

    const vuln = checkVulnerability(pw);
    if (breachAlert) {
      if (vuln) {
        breachAlert.style.display = 'flex';
        breachDesc.textContent = vuln;
      } else {
        breachAlert.style.display = 'none';
      }
    }

    const lvlIdx = getLevel(pw);
    const lvl = levels[lvlIdx];
    barFill.style.width = lvl.pct + '%';
    barFill.style.background = `linear-gradient(90deg, ${levels[0].color}, ${lvl.color})`;
    barGlow.style.width = lvl.pct + '%';
    barGlow.style.boxShadow = `0 0 16px ${lvl.glow}, 0 0 4px ${lvl.color}`;
    strengthValue.textContent = lvl.label;
    crackTime.textContent = crackTimeStr(calcEntropy(pw));
    crackTime.style.color = lvl.crackColor;
    cardPrimary.classList.add(lvl.cls);
  }

  pwInput.addEventListener('input', () => analyze(pwInput.value));

  const genLength = document.getElementById('gen-length');
  const genLengthVal = document.getElementById('gen-length-val');
  const genPwText = document.getElementById('gen-pw-text');
  const genBtn = document.getElementById('gen-btn');
  const copyBtn = document.getElementById('copy-btn');
  const copyLabel = document.getElementById('copy-label');
  const copyIcon = document.getElementById('copy-icon');
  const useBtn = document.getElementById('use-btn');
  const scannerText = document.getElementById('scanner-text');
  const chips = document.querySelectorAll('.toggle-chip');

  genLength.addEventListener('input', () => { genLengthVal.textContent = genLength.value; });

  const opts = { upper: true, lower: true, numbers: true, symbols: true };

  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      const key = chip.dataset.opt;
      opts[key] = !opts[key];
      chip.classList.toggle('active', opts[key]);
    });
  });

  function generatePassword() {
    const len = parseInt(genLength.value);
    const pool = [
      opts.upper ? 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' : '',
      opts.lower ? 'abcdefghijklmnopqrstuvwxyz' : '',
      opts.numbers ? '0123456789' : '',
      opts.symbols ? '!@#$%^&*()-_=+[]{}|;:,.<>?' : '',
    ].join('');
    if (!pool) return 'ENABLE OPTIONS';
    let pw = '';
    const arr = new Uint32Array(len);
    crypto.getRandomValues(arr);
    for (let i = 0; i < len; i++) pw += pool[arr[i] % pool.length];
    return pw;
  }

  function animateGenerate() {
    const frames = 8;
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%';
    let count = 0;
    const len = parseInt(genLength.value);
    const final = generatePassword();
    scannerText.textContent = 'GENERATING...';
    const id = setInterval(() => {
      let noise = '';
      const arr = new Uint32Array(len);
      crypto.getRandomValues(arr);
      for (let i = 0; i < len; i++) noise += chars[arr[i] % chars.length];
      genPwText.textContent = noise;
      if (++count >= frames) {
        clearInterval(id);
        genPwText.textContent = final;
        scannerText.textContent = 'SECURE PASSWORD GENERATED';
      }
    }, 50);
  }

  genBtn.addEventListener('click', animateGenerate);

  useBtn.addEventListener('click', () => {
    const pw = genPwText.textContent;
    if (pw && pw !== '— — — — — — —') {
      pwInput.value = pw;
      pwInput.type = 'text';
      eyeIcon.innerHTML = EYE_CLOSED;
      analyze(pw);
      pwInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });

  copyBtn.addEventListener('click', async () => {
    const pw = genPwText.textContent;
    if (!pw || pw === '— — — — — — —') return;
    try {
      await navigator.clipboard.writeText(pw);
      copyLabel.textContent = 'COPIED!';
      copyIcon.textContent = '✓';
      copyBtn.style.borderColor = 'var(--green)';
      copyBtn.style.color = 'var(--green)';
      setTimeout(() => {
        copyLabel.textContent = 'COPY';
        copyIcon.textContent = '⧉';
        copyBtn.style.borderColor = '';
        copyBtn.style.color = '';
      }, 2000);
    } catch (e) {}
  });
  const WORDS_LIST = ['quantum', 'matrix', 'cipher', 'falcon', 'nebula', 'titan', 'stellar', 'plasma', 'vertex', 'shadow', 'vortex', 'hydra', 'phoenix', 'orbital', 'crypto'];

  document.querySelectorAll('.preset-pill').forEach(btn => {
    btn.addEventListener('click', () => {
      const preset = btn.dataset.preset;
      if (preset === 'pin') {
        genLength.value = 6;
        genLengthVal.textContent = '6';
        opts.upper = false; opts.lower = false; opts.numbers = true; opts.symbols = false;
        chips.forEach(c => c.classList.toggle('active', c.dataset.opt === 'numbers'));
        animateGenerate();
      } else if (preset === 'crypto') {
        genLength.value = 24;
        genLengthVal.textContent = '24';
        opts.upper = true; opts.lower = true; opts.numbers = true; opts.symbols = true;
        chips.forEach(c => c.classList.add('active'));
        animateGenerate();
      } else if (preset === 'passphrase') {
        const randWords = [];
        for (let i = 0; i < 4; i++) {
          randWords.push(WORDS_LIST[Math.floor(Math.random() * WORDS_LIST.length)]);
        }
        const pin = Math.floor(Math.random() * 90 + 10);
        const passphrase = randWords.join('-') + '-' + pin;
        genPwText.textContent = passphrase;
        scannerText.textContent = 'MEMORABLE PASSPHRASE READY';
      }
    });
  });

  animateGenerate();
})();
