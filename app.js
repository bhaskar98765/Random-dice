// app.js — Random Dice (Magic Edition) logic
// Features: thumb-sized 3D CSS dice, tap-to-roll, drag-to-rotate, secret 5-tap setup,
// long-press 3s to arm fixed number (shows tiny dot), next roll forces that number, then random again.
// PWA registration included (service worker: sw.js)

(() => {
  const dice = document.getElementById('dice');
  const indicator = document.getElementById('indicator');
  const setupOverlay = document.getElementById('setupOverlay');
  const grid = document.getElementById('grid');
  const closeSetup = document.getElementById('closeSetup');
  const clearFixed = document.getElementById('clearFixed');
  const toast = document.getElementById('toast');

  // Build dice faces HTML (pure CSS faces with pips)
  function faceHTML(n) {
    const layouts = {
      1: ['c'],
      2: ['tl','br'],
      3: ['tl','c','br'],
      4: ['tl','tr','bl','br'],
      5: ['tl','tr','c','bl','br'],
      6: ['tl','ml','bl','tr','mr','br']
    };
    const pips = layouts[n].map(cls => `<div class="pip ${cls}"></div>`).join('');
    return `<div class="face f${n}"><div class="pips">${pips}</div></div>`;
  }
  dice.innerHTML = [1,2,3,4,5,6].map(faceHTML).join('');

  // State
  let rotX = -20, rotY = -20;   // initial tilt
  let animating = false;
  let fixNumber = Number(localStorage.getItem('fixNumber')) || null;
  let armFixed = false;

  function setTransform(x,y) {
    dice.style.transform = `rotateX(${x}deg) rotateY(${y}deg)`;
  }
  setTransform(rotX, rotY);

  function showToast(msg, ms=1200) {
    toast.textContent = msg;
    toast.style.display = 'block';
    clearTimeout(showToast._t);
    showToast._t = setTimeout(()=> toast.style.display='none', ms);
  }

  // mapping number -> orientation (adjusted for our face placement)
  const targets = {
    1: {x:   0, y:   0},
    2: {x:   0, y: -90},
    3: {x: -90, y:   0},
    4: {x:  90, y:   0},
    5: {x:   0, y:  90},
    6: {x:   0, y: 180}
  };

  function nearestSpin(deg) {
    const spins = [0,360,720];
    return deg + spins[Math.floor(Math.random()*spins.length)];
  }

  function animateTo(targetX, targetY, dur=650) {
    return new Promise(res => {
      const startX = rotX, startY = rotY;
      const dx = targetX - startX, dy = targetY - startY;
      const t0 = performance.now();
      animating = true;
      function step(t) {
        const p = Math.min(1, (t - t0)/dur);
        const ease = 1 - Math.pow(1 - p, 3);
        rotX = startX + dx * ease;
        rotY = startY + dy * ease;
        setTransform(rotX, rotY);
        if (p < 1) requestAnimationFrame(step);
        else { animating = false; res(); }
      }
      requestAnimationFrame(step);
    });
  }

  async function roll(result=null) {
    if (animating) return;
    const n = result ?? (armFixed && fixNumber ? fixNumber : (1 + Math.floor(Math.random()*6)));
    if (armFixed && fixNumber) {
      armFixed = false;
      indicator.style.display = 'none';
    }
    const t = targets[n];
    const tx = nearestSpin(t.x + (Math.random()*14 - 7));
    const ty = nearestSpin(t.y + (Math.random()*14 - 7));
    await animateTo(tx, ty, 650);
    return n;
  }

  // click/tap to roll (unless setup open)
  window.addEventListener('click', (e) => {
    if (setupOverlay.style.display === 'grid') return;
    roll();
  }, {passive:true});

  // drag/slide to rotate
  let dragging=false, sx=0, sy=0, bx=0, by=0;
  function startDrag(x,y){ dragging=true; sx=x; sy=y; bx=rotX; by=rotY; }
  function moveDrag(x,y){
    if(!dragging) return;
    const dx = x - sx, dy = y - sy;
    rotX = bx - dx * 0.25;
    rotY = by + dy * 0.25;
    setTransform(rotX, rotY);
  }
  function endDrag(){ dragging=false; }

  window.addEventListener('mousedown', e=> startDrag(e.clientX, e.clientY));
  window.addEventListener('mousemove', e=> moveDrag(e.clientX, e.clientY));
  window.addEventListener('mouseup', endDrag);

  window.addEventListener('touchstart', e=> {
    const t = e.changedTouches[0];
    startDrag(t.clientX, t.clientY);
  }, {passive:true});
  window.addEventListener('touchmove', e=> {
    const t = e.changedTouches[0];
    moveDrag(t.clientX, t.clientY);
  }, {passive:true});
  window.addEventListener('touchend', endDrag);

  // SECRET: 5 taps opens setup
  let tapCount = 0, tapTimer = null;
  function resetTap(){ tapCount = 0; clearTimeout(tapTimer); tapTimer = null; }
  function onSecretTap(){
    tapCount++;
    if (!tapTimer) tapTimer = setTimeout(resetTap, 1800);
    if (tapCount >= 5){
      resetTap();
      openSetup();
    }
  }
  window.addEventListener('click', onSecretTap, {passive:true});

  // build 1-6 buttons in grid
  for (let i=1;i<=6;i++){
    const b = document.createElement('button');
    b.className = 'nbtn';
    b.textContent = i;
    b.addEventListener('click', ()=> {
      fixNumber = i;
      localStorage.setItem('fixNumber', String(i));
      showToast('Fixed number set: ' + i);
    });
    grid.appendChild(b);
  }
  closeSetup.addEventListener('click', ()=> closeSetupUI());
  clearFixed.addEventListener('click', ()=> {
    fixNumber = null;
    localStorage.removeItem('fixNumber');
    showToast('Fixed number cleared');
  });

  function openSetup(){ setupOverlay.style.display = 'grid'; }
  function closeSetupUI(){ setupOverlay.style.display = 'none'; }

  // long-press 3s to arm fixed number (shows tiny white dot)
  let lpTimer = null;
  function startLongPress(){
    if (!fixNumber) return;
    clearTimeout(lpTimer);
    lpTimer = setTimeout(()=> {
      armFixed = true;
      indicator.style.display = 'block';
      showToast('Armed');
    }, 3000);
  }
  function cancelLongPress(){ clearTimeout(lpTimer); }

  window.addEventListener('mousedown', startLongPress);
  window.addEventListener('mouseup', cancelLongPress);
  window.addEventListener('touchstart', startLongPress, {passive:true});
  window.addEventListener('touchend', cancelLongPress);

  // PWA: register service worker
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', ()=> {
      navigator.serviceWorker.register('sw.js').catch(()=>{});
    });
  }

  // idle wobble for realism
  setInterval(()=> {
    if (animating || dragging || setupOverlay.style.display === 'grid') return;
    const dx = (Math.random()*2-1)*0.6;
    const dy = (Math.random()*2-1)*0.6;
    rotX += dx; rotY += dy;
    setTransform(rotX, rotY);
  }, 900);

})();
