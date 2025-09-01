document.addEventListener('DOMContentLoaded', () => {

  // Set current year in footer
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // Cycle bio color on button click (no dropdown)
  const bioText = document.getElementById('bio-text');
  const cycleBtn = document.getElementById('cycle-color');

  // Order: default -> 4 brand colors -> back to default
  const colors = [
    'default',
    '#a78bfa', // violet (brand)
    '#93c5fd', // sky (brand)
    '#fca5a5', // rose (brand)
    '#86efac'  // green (brand)
  ];
  let idx = 0;

  function applyColorByIndex(i) {
    if (!bioText) return;
    // reset styles
    bioText.classList.remove('accent');
    bioText.style.color = '';

    const value = colors[i];
    if (value === 'default') return; 
    if (value === 'accent') {
      bioText.classList.add('accent');
    } else {
      bioText.style.color = value;
    }
  }

  if (cycleBtn) {
    cycleBtn.addEventListener('click', () => {
      idx = (idx + 1) % colors.length;
      applyColorByIndex(idx);
    });
  }

  // Make the bio text itself interactive
  if (bioText) {
    const fullBio = bioText.textContent.trim();

    // Wrap selected keywords with clickable spans
    function wrapKeywords(str) {
      const patterns = [
        /\bTypeScript\b/gi,
        /\bPython\b/gi,
        /\bUI systems?\b/gi,
        /\bcoffee\b/gi,
        /\bsketching\b/gi
      ];
      let result = str;
      patterns.forEach((re) => {
        result = result.replace(re, (match) => `<span class="kw" title="Click to highlight">${match}</span>`);
      });
      return result;
    }

    function enableKeywordClicks() {
      bioText.addEventListener('click', (e) => {
        const target = e.target;
        if (target && target.classList && target.classList.contains('kw')) {
          target.classList.remove('pulse');
          void target.offsetWidth;
          target.classList.add('pulse');
        }
      });
    }

    function typeText(str, speed = 18) {
      let i = 0;
      const interval = setInterval(() => {
        bioText.textContent = str.slice(0, i + 1);
        i += 1;
        if (i >= str.length) {
          clearInterval(interval);
          bioText.classList.remove('typing');
          bioText.innerHTML = wrapKeywords(str);
          enableKeywordClicks();
        }
      }, speed);
    }

    // Respect reduced motion preferences
    const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      bioText.innerHTML = wrapKeywords(fullBio);
      enableKeywordClicks();
    } else {
      bioText.textContent = '';
      bioText.classList.add('typing');
      typeText(fullBio, 18);
    }
  }
});