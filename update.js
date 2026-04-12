const fs = require('fs');

let html = fs.readFileSync('/home/ayman/Roblox/index.html', 'utf8');

// 1. Remove duplicate lines spanning exactly from "<!-- ═══════ CUSTOM CONTENT LOCKER OVERLAY ═══════ -->"
// down to "  </div>\n</div>\n" (around line 1029 to 1054)

const dupLockerStart = html.lastIndexOf('<!-- ═══════ CUSTOM CONTENT LOCKER OVERLAY ═══════ -->');
const exitToastScript = html.lastIndexOf('<script>\n(function() {');
if (dupLockerStart > 800 && exitToastScript > dupLockerStart) {
  const contentToRemove = html.substring(dupLockerStart, exitToastScript);
  html = html.replace(contentToRemove, '');
}

// 2. Rewrite the main Custom Locker HTML
const oldLockerHTML = `<div class="custom-locker-overlay" id="customLocker">
  <div class="custom-locker-modal">
    <div class="custom-locker-header">
      <h2>Complete to Unlock</h2>
      <p>Please complete one offer below to verify you are human.</p>
    </div>
    <div class="custom-locker-offers" id="lockerOffers"></div>
    <div class="verify-btn-wrap" id="verifyWrap">
      <button class="verify-btn" id="verifyBtn" onclick="verifyCompletion()">Verify Completion</button>
      <div class="verify-status" id="verifyStatus"></div>
    </div>
  </div>
</div>`;

const newLockerHTML = `<div class="custom-locker-overlay" id="customLocker">
  <div class="custom-locker-modal">
    <div class="custom-locker-header">
      <div class="locker-icon"><svg class="icon"><use href="#i-unlock"/></svg></div>
      <h2>🔐 One Step Away From Your Free Script</h2>
      <p>Pick any offer below — it's free and takes about 60 seconds</p>
      <div class="trust-line">✅ Safe  •  ✅ Free  •  ✅ Takes less than 60 seconds</div>
    </div>
    
    <div class="locker-steps">
      <div class="step active" id="step1"><div class="step-num">1</div><div class="step-label">Choose Offer</div></div>
      <div class="step-line"></div>
      <div class="step" id="step2"><div class="step-num">2</div><div class="step-label">Complete</div></div>
      <div class="step-line"></div>
      <div class="step" id="step3"><div class="step-num">3</div><div class="step-label">Download</div></div>
    </div>

    <div class="custom-locker-offers" id="lockerOffers"></div>
    <div class="verify-btn-wrap" id="verifyWrap">
      <div class="verify-instruct">
        <div class="spinner-sm"></div>
        <span>Complete the offer in the new tab, then come back here</span>
      </div>
      <div class="verify-status" id="verifyStatus"></div>
      <button class="verify-btn" id="verifyBtn" onclick="verifyCompletion()">✅ I Completed the Offer — Verify Now</button>
      <div class="verify-helper" id="verifyHelper" style="display:none; font-size: 0.85rem; color: #a1a1aa; margin-top: 12px;">Having trouble? Try a different offer above</div>
    </div>
  </div>
</div>`;

html = html.replace(oldLockerHTML, newLockerHTML);

// 3. Update CSS rules for Locker
const oldCSSLocker = `    /* ═══════ CUSTOM LOCKER (CLIENT-SIDE) ═══════ */
    .custom-locker-overlay {
      position: fixed; top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(11, 15, 25, 0.95);
      z-index: 10000;
      display: none; align-items: center; justify-content: center;
      padding: 20px;
    }
    .custom-locker-overlay.show { display: flex; }
    .custom-locker-modal {
      background: var(--card-bg); border: 1px solid var(--border);
      width: 100%; max-width: 500px; border-radius: 12px;
      overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.5);
    }
    .custom-locker-header { padding: 24px; text-align: center; border-bottom: 1px solid var(--border-lit); }
    .custom-locker-header h2 { font-size: 1.5rem; margin-bottom: 8px; color: #fff; }
    .custom-locker-header p { font-size: 0.95rem; color: var(--text-muted); }
    .custom-locker-offers { padding: 24px; max-height: 50vh; overflow-y: auto; }
    
    .offer-item {
      background: rgba(255,255,255,0.03); border: 1px solid var(--border);
      border-radius: 8px; padding: 16px; margin-bottom: 16px;
      transition: all 0.3s;
    }
    .offer-item:hover { background: rgba(255,255,255,0.05); border-color: var(--accent-1); }
    .offer-title { font-weight: 700; color: #fff; font-size: 1.1rem; margin-bottom: 6px; }
    .offer-desc { font-size: 0.85rem; color: var(--text-muted); margin-bottom: 16px; line-height: 1.4; }
    .offer-meta { display: flex; justify-content: space-between; align-items: center; }
    .offer-payout { background: rgba(63, 185, 80, 0.15); color: #3fb950; padding: 4px 10px; border-radius: 20px; font-weight: 700; font-size: 0.8rem; }
    .offer-btn {
      background: var(--accent-1); color: var(--bg); padding: 8px 16px;
      border-radius: 6px; font-weight: 700; text-decoration: none; font-size: 0.9rem;
      transition: opacity 0.3s;
    }
    .offer-btn:hover { opacity: 0.9; }
    .verify-btn-wrap { padding: 20px 24px; border-top: 1px solid var(--border-lit); text-align: center; background: rgba(0,0,0,0.2); display: none; }
    .verify-btn {
      background: var(--card-bg); border: 1px solid var(--border-lit); color: #fff;
      padding: 12px 24px; border-radius: 6px; font-weight: 700; cursor: pointer;
      width: 100%; transition: all 0.3s;
    }
    .verify-btn:hover { background: rgba(255,255,255,0.05); }
    .verify-btn.loading { opacity: 0.7; pointer-events: none; }
    .verify-status { margin-top: 12px; font-size: 0.9rem; font-weight: 500; display: none; }`;

const newCSSLocker = `    /* ═══════ CUSTOM LOCKER (CLIENT-SIDE) ═══════ */
    .custom-locker-overlay {
      position: fixed; top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(0, 0, 0, 0.92); backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px);
      z-index: 10000;
      display: none; align-items: center; justify-content: center;
      padding: 20px;
    }
    @keyframes modalEnter { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
    .custom-locker-overlay.show { display: flex; }
    .custom-locker-overlay.show .custom-locker-modal { animation: modalEnter 0.3s ease forwards; }
    
    .custom-locker-modal {
      background: var(--card-bg);
      width: 100%; max-width: 480px; border-radius: 16px;
      overflow: hidden; 
      border: 1px solid rgba(251,133,0,0.3);
      box-shadow: 0 0 60px rgba(251,133,0,0.25);
    }
    
    .custom-locker-header { 
      position: relative; padding: 24px; text-align: center; border-bottom: 1px solid var(--border-lit); 
    }
    .custom-locker-header::before {
      content: ''; position: absolute; top: 0; left: 0; right: 0; height: 4px;
      background: linear-gradient(90deg, #ffb703, #fb8500);
    }
    .locker-icon { margin-bottom: 12px; color: var(--accent-1); }
    .locker-icon .icon { width: 44px; height: 44px; }
    .custom-locker-header h2 { font-size: 1.3rem; margin-bottom: 8px; color: #fff; font-weight: 800; }
    .custom-locker-header p { font-size: 0.9rem; color: var(--text-muted); margin-bottom: 12px; }
    .trust-line { font-size: 0.75rem; color: #3fb950; font-weight: 600; background: rgba(63, 185, 80, 0.1); display: inline-block; padding: 6px 12px; border-radius: 50px; }
    
    .locker-steps { display: flex; align-items: center; justify-content: center; padding: 20px 24px 0; }
    .step { display: flex; align-items: center; flex-direction: column; gap: 6px; opacity: 0.4; transition: all 0.3s; }
    .step.active { opacity: 1; }
    .step-num { width: 28px; height: 28px; border-radius: 50%; background: var(--border-lit); color: #fff; display: flex; align-items: center; justify-content: center; font-size: 0.8rem; font-weight: 700; transition: all 0.3s; }
    .step.active .step-num { background: var(--accent-1); color: var(--bg); box-shadow: 0 0 10px rgba(251, 133, 0, 0.4); }
    .step-label { font-size: 0.75rem; font-weight: 600; color: #fff; white-space: nowrap; }
    .step-line { height: 2px; width: 40px; background: var(--border-lit); margin: 0 10px; margin-bottom: 20px; transition: all 0.3s; }
    .step.active + .step-line { background: var(--accent-1); }
    @media (max-width: 480px) { .step-label { display: none; } .step-line { margin-bottom: 0; } }

    .custom-locker-offers { padding: 24px; max-height: 60vh; overflow-y: auto; }
    
    .offer-item {
      background: #1a2035; border: 1px solid var(--border); border-left: 3px solid var(--accent-2);
      border-radius: 8px; padding: 16px; margin-bottom: 16px; position: relative;
      transition: all 0.3s; display: flex; flex-direction: column; gap: 12px;
    }
    .offer-item:hover { border-color: var(--accent-1); box-shadow: 0 0 15px rgba(251,133,0,0.3); }
    .offer-top { display: flex; gap: 12px; align-items: stretch; }
    .offer-pic { width: 48px; height: 48px; min-width: 48px; border-radius: 8px; display: flex; align-items: center; justify-content: center; background: rgba(255,255,255,0.05); font-size: 1.5rem; overflow: hidden; }
    .offer-pic img { width: 100%; height: 100%; object-fit: cover; }
    .offer-info { flex: 1; display: flex; flex-direction: column; justify-content: center; }
    .offer-title { font-weight: 700; color: #fff; font-size: 1.05rem; line-height: 1.2; margin-bottom: 4px; }
    .offer-desc { font-size: 0.8rem; color: var(--text-muted); line-height: 1.3; }
    .offer-meta { display: flex; justify-content: space-between; align-items: center; font-size: 0.8rem; color: #a1a1aa; font-weight: 600; margin-top: 4px; }
    .offer-payout { position: absolute; top: -10px; right: 12px; background: #3fb950; color: #fff; padding: 4px 10px; border-radius: 12px; font-weight: 800; font-size: 0.8rem; box-shadow: 0 2px 10px rgba(63, 185, 80, 0.4); }
    .offer-featured { display: inline-flex; align-items: center; gap: 4px; color: #facc15; font-size: 0.75rem; font-weight: 700; background: rgba(250, 204, 21, 0.1); padding: 2px 8px; border-radius: 4px; margin-bottom: 8px; max-width: max-content; }
    .offer-btn {
      background: var(--accent-1); color: var(--bg); padding: 12px; text-align: center;
      border-radius: 6px; font-weight: 800; text-decoration: none; font-size: 0.9rem;
      transition: all 0.3s;
    }
    .offer-btn:hover { background: #ffb703; box-shadow: 0 4px 15px rgba(251,133,0,0.4); transform: translateY(-2px); }
    
    .verify-btn-wrap { padding: 24px; border-top: 1px solid var(--border-lit); text-align: center; background: rgba(0,0,0,0.2); display: none; }
    .verify-instruct { background: #0d1b2a; border: 1px solid rgba(251,133,0,0.3); padding: 12px; border-radius: 8px; display: inline-flex; align-items: center; justify-content: center; gap: 10px; color: #fff; font-size: 0.85rem; font-weight: 600; margin-bottom: 12px; width: 100%; }
    .spinner-sm { width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.2); border-top-color: #fff; border-radius: 50%; animation: spin 1s linear infinite; }
    .verify-status { font-size: 0.9rem; font-weight: 600; }
    .verify-btn {
      background: linear-gradient(90deg, #3fb950, #2ecc71); color: #fff;
      padding: 14px 24px; border-radius: 8px; font-weight: 800; cursor: pointer; text-transform: uppercase;
      width: 100%; transition: all 0.3s; border: none; font-size: 1rem;
      box-shadow: 0 0 20px rgba(63, 185, 80, 0.4);
      animation: pulseGreen 2s infinite; display: none;
    }
    @keyframes pulseGreen { 0%, 100% { box-shadow: 0 0 20px rgba(63, 185, 80, 0.4); } 50% { box-shadow: 0 0 35px rgba(63, 185, 80, 0.7); } }
    .verify-btn:hover { transform: scale(1.02); }
    .verify-btn.loading { opacity: 0.7; pointer-events: none; animation: none; background: #3fb950; }`;

html = html.replace(oldCSSLocker, newCSSLocker);

// 4. Update loadOffers HTML template
const oldLoadOffers = `      offersContainer.innerHTML = '';
      offers.forEach(offer => {
        const title = offer.name || offer.title || 'Special Offer';
        const desc = offer.description || offer.desc || 'Complete this offer to unlock.';
        const payout = offer.payout || '';
        const link = offer.link || offer.url || '#';
        
        const item = document.createElement('div');
        item.className = 'offer-item';
        item.innerHTML = \`
          <div class="offer-title">\${title}</div>
          <div class="offer-desc">\${desc}</div>
          <div class="offer-meta">
            <span class="offer-payout">\${payout}</span>
            <a href="\${link}" target="_blank" class="offer-btn" onclick="offerClicked()">Complete Offer</a>
          </div>
        \`;
        offersContainer.appendChild(item);
      });`;

const newLoadOffers = `      offersContainer.innerHTML = '';
      offers.forEach((offer, index) => {
        const title = offer.name || offer.title || 'Special Offer';
        let desc = offer.description || offer.desc || 'Complete this offer to unlock.';
        if (desc.length > 80) desc = desc.substring(0, 80) + '...';
        const payout = offer.payout ? \`+$$\${offer.payout}\` : '';
        const link = offer.link || offer.url || '#';
        
        let picHtml = '<div class="offer-pic">🎁</div>';
        if (offer.picture) {
           picHtml = \`<div class="offer-pic"><img src="\${offer.picture}" alt="icon"></div>\`;
        }

        let featuredHtml = '';
        if (index === 0) {
           featuredHtml = '<div class="offer-featured">⭐ Most Popular</div>';
        }

        const item = document.createElement('div');
        item.className = 'offer-item';
        item.innerHTML = \`
          <div class="offer-top">
            \${picHtml}
            <div class="offer-info">
              \${featuredHtml}
              <div class="offer-title">\${title}</div>
              <div class="offer-desc">\${desc}</div>
            </div>
          </div>
          <div class="offer-meta">
            <span>⏱ ~60 seconds</span>
          </div>
          \${payout ? \`<div class="offer-payout">\${payout}</div>\` : ''}
          <a href="\${link}" target="_blank" class="offer-btn" onclick="offerClicked()">COMPLETE THIS OFFER →</a>
        \`;
        offersContainer.appendChild(item);
      });`;

html = html.replace(oldLoadOffers, newLoadOffers);


// 5. Loading states modification
const oldLoading1 = `offersContainer.innerHTML = '<div class="locker-loading">Loading offers... please wait.</div>';`;
const newLoading1 = `offersContainer.innerHTML = \`<div class="locker-loading" style="padding: 20px;">
        <div style="background: rgba(255,255,255,0.05); height: 90px; border-radius: 8px; margin-bottom: 12px; animation: pulseGreen 1.5s infinite opacity;"></div>
        <div style="background: rgba(255,255,255,0.05); height: 90px; border-radius: 8px; margin-bottom: 16px; animation: pulseGreen 1.5s infinite opacity; animation-delay: 0.2s;"></div>
        <div style="color: var(--text-muted); font-size: 0.9rem; text-align: center; font-weight: 600;">🔄 Finding best offers for your region...</div>
      </div>\`;`;
html = html.replace(oldLoading1, newLoading1);

const oldNoOffers = `offersContainer.innerHTML = '<div class="locker-loading" style="color:#ff6b6b">No offers available for your region right now.</div>';`;
const newNoOffers = `offersContainer.innerHTML = \`<div class="locker-loading" style="padding: 30px 20px; text-align: center; border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; background: rgba(0,0,0,0.2);">
      <div style="font-size: 2rem; margin-bottom: 10px;">⚠️</div>
      <div style="color: var(--text-muted); font-size: 0.95rem; font-weight: 600;">No offers available in your region right now.<br>Try using a VPN or check back later.</div>
    </div>\`;`;
html = html.replace(oldNoOffers, newNoOffers);

const oldErrorOffers = `offersContainer.innerHTML = '<div class="locker-loading" style="color:var(--accent);">Error loading offers. Please try again.</div>';`;
const newErrorOffers = `offersContainer.innerHTML = \`<div class="locker-loading" style="padding: 30px 20px; text-align: center; border: 1px solid rgba(255,107,107,0.3); border-radius: 8px; background: rgba(255,107,107,0.05);">
      <div style="font-size: 2rem; margin-bottom: 10px;">❌</div>
      <div style="color: #ff6b6b; font-size: 0.95rem; font-weight: 600;">Could not load offers. Please refresh the page and try again.</div>
    </div>\`;`;
html = html.replace(oldErrorOffers, newErrorOffers);

const oldApiError = `offersContainer.innerHTML = \`<div class="locker-loading" style="color:#ff6b6b; font-size: 14px;">Error: You have not deployed or entered your Cloudflare Worker URL in the index.html file yet. Please set WORKER_URL on line 1375.</div>\`;`;
const newApiError = `offersContainer.innerHTML = \`<div class="locker-loading" style="padding: 30px 20px; text-align: center; border: 1px solid rgba(255,107,107,0.3); border-radius: 8px; background: rgba(255,107,107,0.05);">
      <div style="font-size: 2rem; margin-bottom: 10px;">❌</div>
      <div style="color: #ff6b6b; font-size: 0.95rem; font-weight: 600;">Could not connect to API server. Please refresh the page and try again.</div>
    </div>\`;`;
html = html.replace(oldApiError, newApiError);


// 6. JS functions logic overrides
html = html.replace(
  `verifyWrap.style.display = 'block';
    btn.style.display = 'none';
    status.style.display = 'block';`,
  `verifyWrap.style.display = 'block';
    btn.style.display = 'none';
    status.style.display = 'block';
    document.querySelector('.verify-instruct').style.display = 'flex';
    document.getElementById('verifyHelper').style.display = 'none';
    const s2 = document.getElementById('step2'); if(s2) s2.classList.add('active');`
);

html = html.replace(
  `status.textContent = \`Please wait \${timeLeft} seconds after completing the offer before verifying...\`;`,
  `status.textContent = \`You can verify in \${timeLeft} seconds...\`;`
);

html = html.replace(
  `status.textContent = \`Please wait \${timeLeft} seconds after completing the offer before verifying...\`;`,
  `status.textContent = \`You can verify in \${timeLeft} seconds...\`;`
);

html = html.replace(
  `status.style.display = 'none';
        btn.style.display = 'block';
        btn.classList.remove('loading');
        btn.textContent = 'Verify Completion';`,
  `status.style.display = 'none';
        document.querySelector('.verify-instruct').style.display = 'none';
        btn.style.display = 'block';
        btn.classList.remove('loading');
        btn.textContent = '✅ I Completed the Offer — Verify Now';
        document.getElementById('verifyHelper').style.display = 'block';`
);

html = html.replace(
  `btn.textContent = 'Checking Verification...';`,
  `btn.textContent = 'Checking Verification...';`
);

html = html.replace(
  `status.style.display = 'block';
        status.style.color = '#ff6b6b';
        status.textContent = 'Offer not completed yet. Please finish the offer and try again.';
        btn.classList.remove('loading');
        btn.textContent = 'Verify Completion';`,
  `status.style.display = 'block';
        status.style.color = '#ff6b6b';
        status.textContent = '⚠️ Not detected yet. Please fully complete the offer then try again.';
        btn.classList.remove('loading');
        btn.textContent = '✅ I Completed the Offer — Verify Now';`
);

html = html.replace(
  `status.style.display = 'block';
      status.style.color = '#ff6b6b';
      status.textContent = 'Error checking verification. Please try again.';
      btn.classList.remove('loading');
      btn.textContent = 'Verify Completion';`,
  `status.style.display = 'block';
      status.style.color = '#ff6b6b';
      status.textContent = '⚠️ Error checking verification. Please try again.';
      btn.classList.remove('loading');
      btn.textContent = '✅ I Completed the Offer — Verify Now';`
);

html = html.replace(
  `localStorage.setItem('unlocked_blox_fruits', '1');
      status.style.display = 'block';
      status.style.color = '#3fb950';
      status.textContent = 'Verification successful! Unlocking...';`,
  `localStorage.setItem('unlocked_blox_fruits', '1');
      status.style.display = 'block';
      status.style.color = '#3fb950';
      status.textContent = '🎉 Verified! Unlocking your script now...';
      const s3 = document.getElementById('step3'); if(s3) s3.classList.add('active');`
);

fs.writeFileSync('/home/ayman/Roblox/index.html', html, 'utf8');
console.log('Task Complete!');
