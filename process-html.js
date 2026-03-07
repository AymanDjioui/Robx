const fs = require('fs');
const paths = JSON.parse(fs.readFileSync('icon-paths.json', 'utf8'));

// Build SVG sprite
const symbols = Object.entries(paths).map(([id, {w, h, d}]) =>
  `<symbol id="i-${id}" viewBox="0 0 ${w} ${h}"><path d="${d}"/></symbol>`
).join('');
const sprite = `<svg xmlns="http://www.w3.org/2000/svg" style="display:none" aria-hidden="true">${symbols}</svg>`;

let html = fs.readFileSync('index.html', 'utf8');

// ── FIX 2: Add dns-prefetch + remove FA CDN ──

// Remove FA CDN link + noscript
html = html.replace(/\s*<!-- Font Awesome — non-render-blocking -->\n\s*<link rel="preload" as="style" href="https:\/\/cdnjs\.cloudflare\.com\/ajax\/libs\/font-awesome\/6\.5\.1\/css\/all\.min\.css"[^>]*\/>\n\s*<noscript><link rel="stylesheet" href="https:\/\/cdnjs\.cloudflare\.com\/ajax\/libs\/font-awesome\/6\.5\.1\/css\/all\.min\.css"[^>]*\/><\/noscript>/s, '');

// Add dns-prefetch tags after existing preconnect lines
html = html.replace(
  '  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>',
  `  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="dns-prefetch" href="https://fonts.googleapis.com">
  <link rel="dns-prefetch" href="https://fonts.gstatic.com">
  <link rel="dns-prefetch" href="https://cdnjs.cloudflare.com">`
);

// ── FIX 4: Font display — switch from media=print to preload as=style ──
html = html.replace(
  `  <style>/* System font until webfont loads */body{font-family:system-ui,sans-serif}</style>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Orbitron:wght@700&family=Rajdhani:wght@400;600&display=swap" media="print" onload="this.media='all'">
  <noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Orbitron:wght@700&family=Rajdhani:wght@400;600&display=swap"></noscript>`,
  `  <style>body{font-family:system-ui,sans-serif}</style>
  <link rel="preload" href="https://fonts.googleapis.com/css2?family=Orbitron:wght@700&family=Rajdhani:wght@400;600&display=swap" as="style" onload="this.onload=null;this.rel='stylesheet'">
  <noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Orbitron:wght@700&family=Rajdhani:wght@400;600&display=swap"></noscript>`
);

// ── Replace all FA icons with inline SVG references ──

// Map FA class names to sprite IDs
const iconMap = {
  'fa-solid fa-fire': 'i-fire',
  'fa-solid fa-bolt': 'i-bolt',
  'fa-solid fa-triangle-exclamation': 'i-warn',
  'fa-solid fa-desktop': 'i-desktop',
  'fa-solid fa-mobile-screen': 'i-mobile',
  'fa-solid fa-lock-open': 'i-unlock',
  'fa-solid fa-circle-check': 'i-check-c',
  'fa-solid fa-shield-halved': 'i-shield',
  'fa-solid fa-key': 'i-key',
  'fa-solid fa-gift': 'i-gift',
  'fa-solid fa-eye-slash': 'i-eye-off',
  'fa-brands fa-discord': 'i-discord',
  'fa-solid fa-wheat-awn': 'i-wheat',
  'fa-solid fa-skull-crossbones': 'i-skull',
  'fa-solid fa-fish': 'i-fish',
  'fa-solid fa-dragon': 'i-dragon',
  'fa-solid fa-burst': 'i-burst',
  'fa-solid fa-apple-whole': 'i-apple',
  'fa-solid fa-swords': 'i-shield',  // FA Pro icon - fallback to shield
  'fa-solid fa-clipboard-list': 'i-clipboard',
  'fa-solid fa-download': 'i-download',
  'fa-solid fa-sparkles': 'i-sparkles',  // FA Pro - using wand-magic-sparkles
  'fa-solid fa-check': 'i-check',
  'fa-solid fa-circle-question': 'i-question',
  'fa-solid fa-arrow-right': 'i-arrow-r',
};

// Replace <i> tags with optional style attributes
// Pattern: <i class="fa-xxx fa-yyy" optional-style></i>
let replacementCount = 0;
html = html.replace(/<i class="(fa-[^"]+)"(\s+style="[^"]*")?><\/i>/g, (match, classes, style) => {
  const spriteId = iconMap[classes];
  if (spriteId) {
    replacementCount++;
    const styleAttr = style ? ` style="${style.match(/style="([^"]*)"/)[1]}"` : '';
    return `<svg class="icon"${styleAttr}><use href="#${spriteId}"/></svg>`;
  }
  return match; // leave untouched if not mapped
});

// Special case: swords icon has inline style AND adjacent emoji
html = html.replace(
  '<svg class="icon" style="font-size:1rem;"><use href="#i-shield"/></svg>⚔️',
  '<svg class="icon"><use href="#i-shield"/></svg>'
);

// ── Add .icon CSS to the main style block ──
html = html.replace(
  '    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }',
  `    .icon{display:inline-block;width:1em;height:1em;fill:currentColor;vertical-align:-.125em;overflow:visible}
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }`
);

// ── Add SVG sprite after <body> ──
html = html.replace('<body>', `<body>\n${sprite}`);

// ── FIX 1: Fix particles JS forced reflow ──
// The particles loop reads p.style.width then sets p.style.height = p.style.width
// Also, create particles in a DocumentFragment to avoid repeated DOM insertion
html = html.replace(
  `  // ── Floating particles ──
  (function() {
    const container = document.getElementById('particles');
    const count = window.innerWidth < 600 ? 25 : 45;
    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      p.style.left = Math.random() * 100 + '%';
      p.style.width = (2 + Math.random() * 3) + 'px';
      p.style.height = p.style.width;
      p.style.animationDuration = (12 + Math.random() * 18) + 's';
      p.style.animationDelay = -(Math.random() * 20) + 's';
      container.appendChild(p);
    }
  })();`,
  `  // ── Floating particles (batched DOM writes) ──
  (function() {
    var container = document.getElementById('particles');
    var count = window.innerWidth < 600 ? 25 : 45;
    var frag = document.createDocumentFragment();
    for (var i = 0; i < count; i++) {
      var p = document.createElement('div');
      p.className = 'particle';
      var size = (2 + Math.random() * 3) + 'px';
      p.style.cssText = 'left:' + (Math.random()*100) + '%;width:' + size + ';height:' + size + ';animation-duration:' + (12+Math.random()*18) + 's;animation-delay:-' + (Math.random()*20) + 's';
      frag.appendChild(p);
    }
    container.appendChild(frag);
  })();`
);

// ── FIX 3: Remove unused CSS ──
// Remove --bg-card (unused variable)
html = html.replace('      --bg-card: rgba(13,17,23,.96);\n', '');

// Remove .sticky-bar i rule (was for FA icons, now SVG)
html = html.replace('    .sticky-bar i { margin-right: 6px; }\n', '    .sticky-bar .icon { margin-right: 6px; }\n');

// Remove hero-pill i rule similarly
html = html.replace('    .hero-pill i { font-size: .65rem; }\n', '    .hero-pill .icon { font-size: .65rem; }\n');

// Remove social-proof i rule
html = html.replace('    .social-proof i { font-size: .7rem; }\n', '    .social-proof .icon { font-size: .7rem; }\n');

// Write output
fs.writeFileSync('index.html', html, 'utf8');
console.log(`Done! Replaced ${replacementCount} icon instances.`);

// Verify no remaining FA icons
const remaining = html.match(/<i class="fa-/g);
if (remaining) {
  console.log(`WARNING: ${remaining.length} FA icons still remain!`);
  const lines = html.split('\n');
  lines.forEach((line, i) => {
    if (line.includes('<i class="fa-')) console.log(`  Line ${i+1}: ${line.trim()}`);
  });
} else {
  console.log('All FA icons replaced successfully.');
}
