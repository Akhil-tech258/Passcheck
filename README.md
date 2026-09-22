# 🛡️ CyberPass — Password Strength Analyzer & Security Auditor

CyberPass is a client-side cybersecurity tool designed to evaluate password resilience, detect common credential vulnerabilities, and generate cryptographically secure passwords and passphrases in real-time.

---

## 🛠️ Tech Stack

- **Frontend:** Semantic HTML5, Cyberpunk CSS3 (Matrix Rain Canvas, Scanline Animation, Glassmorphism, CSS Custom Properties)
- **Core Engine:** Vanilla JavaScript (ES6+, DOM Manipulation, Entropy Calculation Algorithms)
- **Cryptography:** Native Web Crypto API (`crypto.getRandomValues`) for cryptographically secure pseudo-random number generation (CSPRNG)
- **Deployment:** GitHub Pages

---

## ✨ Features

- 🔍 **Real-Time Password Analysis:**
  - Evaluates password strength live across 4 tiers: **Weak**, **Medium**, **Strong**, and **Ultra Secure**.
  - Interactive rule checklist: length (8+ and 16+ chars), uppercase, lowercase, numbers, and special symbols.

- 🧮 **Cryptographic Entropy & Score Metrics:**
  - Measures true Shannon entropy in bits (e.g., `84 bits of entropy • 100/100`).
  - Estimates realistic brute-force crack times against GPU cracking clusters (from *instantaneous* to *∞ centuries*).

- ⚠️ **Breach & Vulnerability Warning Banner:**
  - Automatically flags known dictionary passwords found in global breach dumps (e.g. `password`, `123456`, `qwerty`).
  - Detects sequential keyboard walks (`asdf`, `1234`) and repeated character sequences.

- ⚡ **Cryptographic Password Generator:**
  - Generates true random passwords (8–32 characters) using `crypto.getRandomValues()`.
  - **Quick Presets:**
    - 🔢 **6-Digit PIN:** Rapid PIN code generation.
    - 🔤 **Memorable Passphrase:** Generates 4-word hyphenated passphrases (e.g., `matrix-falcon-cipher-orbital-48`).
    - 🛡️ **Ultra 24-Char:** High-entropy multi-charset string.
  - One-click copy with animated clipboard feedback and direct load-into-analyzer (`↑ USE`) button.

- 🔒 **100% Privacy Guaranteed:**
  - All password evaluations, entropy calculations, and generation run entirely in memory inside the user's browser.
  - No passwords or analytics are ever stored, logged, or transmitted across the network.

---

## 🚀 Live Demo

Experience the live application:  
👉 **[https://akhil-tech258.github.io/Passcheck/](https://akhil-tech258.github.io/Passcheck/)**
