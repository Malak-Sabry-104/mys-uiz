import './style.css'

let mouseX = 0;
let mouseY = 0
let mobile = false
let secretCode = ''
let progress = 0
let showingLogo = false

const xRay = document.getElementById('x-ray')

let secondPuzzleOpen = false
let hexCode = ''
let animating = false
let thirdPuzzleOpen = false

let selectedStars = []
let gameComplete = false

const starPositions = [
  { id: 1, x: 50, y: 25, size: 8 },
  { id: 2, x: 40, y: 20, size: 6 },
  { id: 3, x: 35, y: 30, size: 7 },
  { id: 4, x: 38, y: 45, size: 8 },
  { id: 5, x: 45, y: 50, size: 6 },
  { id: 6, x: 50, y: 55, size: 7 },
  { id: 7, x: 62, y: 45, size: 6 },
  { id: 8, x: 65, y: 30, size: 4 },
  { id: 9, x: 60, y: 20, size: 8 },
]

const rightOrder = [1, 2, 3, 4, 5, 6, 7, 8, 9]

const bgStarArray = []
for(let i = 0; i < 50; i++) {
  bgStarArray.push({
    id: i + 100,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    opacity: Math.random() * 0.6 + 0.2
  })
}

let modalOpen = false

function makeBackgroundStars() {
  const bgStarsContainer = document.getElementById('bg-stars')
  
  bgStarArray.forEach(star => {
    const delay = Math.random() * 3;
    const duration = 2 + Math.random() * 2;
  
    bgStarsContainer.innerHTML += `
      <div
        class="absolute rounded-full bg-white animate-pulse"
        style="
          left: ${star.x}%;
          top: ${star.y}%;
          width: ${star.size}px;
          height: ${star.size}px;
          opacity: ${star.opacity};
          animation-delay: ${delay}s;
          animation-duration: ${duration}s;
        "
      ></div>
    `;
  })  
}

function onSecretInput(e) {
  secretCode = e.target.value
  const inputField = document.getElementById('secret-input')
  const openBtn = document.getElementById('open-secret')
  const redBox = document.getElementById('mys-2')
  const redBoxShadow = document.getElementById('mys-2-layer2')
  
  if (secretCode.length == 0) {
    progress = 0
    inputField.classList.remove('px-6', 'px-4', 'px-2')
    inputField.classList.add('px-8')
    return
  }

  if (secretCode[0] == "K") {
    progress = 1
    inputField.classList.remove('px-8', 'px-4', 'px-2')
    inputField.classList.add('px-6')
    redBox.classList.remove('hidden')
    redBoxShadow.classList.remove('hidden')
    
    if (secretCode.length > 1 && secretCode[1] == "V") {
      progress = 2
      inputField.classList.remove('px-8', 'px-6', 'px-2')
      inputField.classList.add('px-4')
      
      if (secretCode.length > 2 && secretCode[2] == "M") {
        progress = 3
        inputField.classList.remove('px-8', 'px-6', 'px-4')
        inputField.classList.add('px-2')
        openBtn.classList.remove('hidden')
      }
    }
  } else {
    progress = 0
    redBox.classList.add('hidden')
    redBoxShadow.classList.add('hidden')
    openBtn.classList.add('hidden')
  }
}

function getMovement() {
  let range = mobile ? 4 : 5
  
  let xPct = (mouseX / window.innerWidth) * 2 - 1
  let yPct = (mouseY / window.innerHeight) * 2 - 1
  
  return {
    x: xPct * range,
    y: yPct * range
  }
}

function updateElementPositions() {
  const movement = getMovement()
  const greenElement = document.getElementById('mys-1')
  const greenShadow = document.getElementById('mys-1-layer2')
  const redElement = document.getElementById('mys-2')
  const redShadow = document.getElementById('mys-2-layer2')
  
  const size = mobile ? 42 : 32
  
  greenElement.style.top = `calc(22px + ${mobile ? -movement.y*4 : -movement.y}px)`
  greenElement.style.left = `calc(22px + ${mobile ? -movement.x*4 : -movement.x}px)`
  greenElement.style.width = `${size}px`
  greenElement.style.height = `${size}px`
  
  greenShadow.style.top = `calc(22px + ${mobile ? movement.y*4 : movement.y}px)`
  greenShadow.style.left = `calc(22px + ${mobile ? movement.x*4 : movement.x}px)`
  greenShadow.style.width = `${size}px`
  greenShadow.style.height = `${size}px`
  
  if (progress > 0) {
    redElement.style.bottom = `calc(22px + ${mobile ? -movement.y*4 : -movement.y}px)`
    redElement.style.right = `calc(22px + ${mobile ? movement.x*4 : movement.x}px)`
    redElement.style.width = `${size}px`
    redElement.style.height = `${size}px`
    
    redShadow.style.bottom = `calc(22px + ${mobile ? movement.y*4 : movement.y}px)`
    redShadow.style.right = `calc(22px + ${mobile ? -movement.x*4 : -movement.x}px)`
    redShadow.style.width = `${size}px`
    redShadow.style.height = `${size}px`
  }

  checkForLogoHover()
  handleGlowEffect()
}

function checkForLogoHover() {
  const logoSection = document.getElementById('mystery-3');
  const logo = document.getElementById('m-logo');
  
  if (logoSection && progress > 1) {
    const rect = logoSection.getBoundingClientRect();
    const width = rect.right - rect.left;
    const height = rect.bottom - rect.top;
    const isHovering = mouseX >= rect.left && mouseX <= rect.right && mouseY >= rect.top && mouseY <= rect.bottom;
    
    showingLogo = isHovering;
    if (isHovering) {
      logo.style['opacity'] = '1';
      logo.style.filter = 'drop-shadow(0 0 10px rgba(0, 255, 0, 0.8))';
    } else {
      logo.style.opacity = '0.005';
      logo.style['filter'] = 'none';
    }
  } else {
    showingLogo = false;
    logo.style.opacity = '0.005';
    logo.style.filter = 'none';
  }
}

function handleGlowEffect() {
  
  if (progress > 1) {
    xRay.classList.add('bg-green-400/70', 'shadow-green-400/70', 'drop-shadow-2xl', 'shadow-2xl', 'blur-2xl', '-translate-50');
    
    let opacity, top, left, bottom;
    if (progress > 2) {
      opacity = '0.1';
      bottom = '0';
      left = '0';
      top = 'auto';
    } else {
      opacity = '0.6';
      top = `${mouseY}px`;
      left = `${mouseX}px`;
      bottom = 'auto';
    }
    xRay.style['opacity'] = opacity;
    xRay.style.top = top;
    xRay.style.left = left;
    xRay.style.bottom = bottom;
  } else {
    xRay.style.opacity = '0';
    xRay.classList.remove('bg-green-400/70', 'shadow-green-400/70', 'drop-shadow-2xl', 'shadow-2xl', 'blur-2xl', '-translate-50');
  }
}

function openModal() {
  modalOpen = true;
  const modal = document.getElementById('modal');
  const titleEl = document.getElementById('modal-title');
  const contentEl = document.getElementById('modal-content');

  document.body.style.overflow = 'hidden';

  const encodedContent1 = 'PGRpdiBjbGFzcz0iZmxleCBmbGV4LWNvbCBpdGVtcy1jZW50ZXIiPgogIDxkaXYgY2xhc3M9InctMjQgaC0yNCBtYi02IHJvdW5kZWQtZnVsbCBmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWNlbnRlciBiZy1ncmFkaWVudC10by1iIGZyb20tc2xhdGUtNTAwIHRvLXNsYXRlLTYwMCBzaGFkb3ctbGcgZHJvcC1zaGFkb3ctMnhsIj4KICAgIDxpIGNsYXNzPSJmYXMgZmEtc3RhciBmYS0yeCIgc3R5bGU9ImNvbG9yOiB3aGl0ZTsiPjwvaT4KICA8L2Rpdj4KICA8aDMgY2xhc3M9InRleHQtMnhsIGJhbmdlcnMtcmVndWxhciB0ZXh0LWNlbnRlciBtYi00Ij5Db25ncmF0cyE8L2gzPgogIDxwIGNsYXNzPSJ0ZXh0LWNlbnRlciBtYi02IHRleHQtbGciPgogICAgWW91IGhhdmUgZmluYWxseSByZWFjaGVkIHRoZSBmaW5hbCBkZXN0aW5hdGlvbiEgUGxlYXNlLCBrZWVwIGluIG1pbmQgdGhhdCB0aGUgZmluYWwgY29kZSBpczogPHNwYW4gY2xhc3M9InRleHQtY3lhbi00MDAgZm9udC1ib2xkIj5LVk0gRm9yZXZlcjwvc3Bhbj4KICA8L3A+CiAgPGRpdiBjbGFzcz0iYmctc2xhdGUtNzAwIHAtNCByb3VuZGVkLXhsIHctZnVsbCBtYi02Ij4KICAgIDxwIGNsYXNzPSJ0ZXh0LWdyZWVuLTMwMCBmbGV4IGp1c3RpZnktY2VudGVyIGdhcC01Ij4KICAgICAgPGkgY2xhc3M9ImZhcyBmYS1zdGFyIj48L2k+CiAgICAgIEFsbCBwdXp6bGVzIGdvdCBzb2x2ZWQhCiAgICAgIDxpIGNsYXNzPSJmYXMgZmEtc3RhciI+PC9pPgogICAgPC9wPgogIDwvZGl2Pgo8L2Rpdj4=';
  const encodedContent2 = 'PGRpdiBjbGFzcz0iZmxleCBmbGV4LWNvbCBpdGVtcy1jZW50ZXIiPgogIDxkaXYgY2xhc3M9InctMjAgaC0yMCBtYi00IGJnLWdyZWVuLTUwMCByb3VuZGVkLWZ1bGwgZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXIgc2hhZG93LWdyZWVuLTQwMC80MCBzaGFkb3ctbGciPgogICAgPHNwYW4gY2xhc3M9InRleHQtNHhsIHJvY2stc2FsdC1yZWd1bGFyIj4hPC9zcGFuPgogIDwvZGl2PgogIDxwIGNsYXNzPSJ0ZXh0LWNebnRlciBtYi02IHRleHQtbGciPgogICAgWW91J3ZlIHVuY292ZXJlZCB0aGUgaGlkZGVuIGNvZGUgc2VxdWVuY2U6IDxzcGFuIGNsYXNzPSJ0ZXh0LWdyZWVuLTQwMCBmb250LWJvbGQiPktWTTwvc3Bhbj4KICA8L3A+CiAgPGRpdiBjbGFzcz0iYmctc2xhdGUtNzAwIHAtNCByb3VuZGVkLXhsIHctZnVsbCBtYi02Ij4KICAgIDxwIGNsYXNzPSJ0ZXh0LWdyZWVuLTMwMCBmb250LW1vbm8iPgogICAgICA8c3BhbiBjbGFzcz0idGV4dC1waW5rLTQwMCI+Y29uc3Q8L3NwYW4+IDxzcGFuIGNsYXNzPSJ0ZXh0LWJsdWUtNDAwIj5zZWNyZXRLZXk8L3NwYW4+ID0gPHNwYW4gY2xhc3M9InRleHQtYW1iZXItMzAwIj4iS1ZNIjwvc3Bhbj47CiAgICA8L3A+CiAgPC9kaXY+CiAgPGJ1dHRvbiBpZD0iY29udGludWUtYnRuIiBjbGFzcz0icHgtNiBweS0yIGJnLXNsYXRlLTcwMCBob3ZlcjpiZy1zbGF0ZS02MDAgcm91bmRlZC1mdWxsIHRyYW5zaXRpb24tY29sb3JzIGR1cmF0aW9uLTIwMCBmbGV4IGp1c3RpZnktY2VudGVyIGl0ZW1zLWNlbnRlciI+CiAgICA8c3BhbiBjbGFzcz0iYmFuZ2Vycy1yZWd1bGFyIHRleHQtMnhsIG1yLTQiPk5FWFQ8L3NwYW4+CiAgICA8aSBjbGFzcz0iZmFzIGZhLWV4dGVybmFsLWxpbmsgYWx0IiBjbGFzcz0idGV4dC15ZWxsb3ctNDAwIj48L2k+CiAgPC9idXR0b24+CjwvZGl2Pg==';

  if (gameComplete) {
    titleEl.textContent = atob('TXlzVWl6IEZpbmlzaGVk');
    contentEl.innerHTML = atob(encodedContent1);
  } else {
    titleEl.textContent = atob('U2VjcmV0IERpc2NvdmVyZWQ=');
    contentEl.innerHTML = atob(encodedContent2);

    setTimeout(() => {
      const continueBtn = document.getElementById('continue-btn');
      if (continueBtn) {
        continueBtn.addEventListener('click', () => {
          closeModal();
          secondPuzzleOpen = true;

          const puzzle2 = document.getElementById('puzzle-2');
          puzzle2.classList.remove('hidden');
          puzzle2.classList.add('flex');

          setTimeout(() => {
            puzzle2.scrollIntoView({ behavior: 'smooth' });
          }, 500);
        });
      }
    }, 100);
  }

  modal.classList.remove('opacity-0', 'pointer-events-none');
  modal.classList.add('opacity-100');

  setTimeout(() => {
    const inner = modal.querySelector('.relative');
    const overlay = modal.querySelector('.bg-black\\/50');
    inner.classList.remove('scale-95', 'translate-y-8');
    inner.classList.add('scale-100', 'translate-y-0');
    overlay.classList.remove('opacity-0');
    overlay.classList.add('opacity-100');
  }, 10);
}

function closeModal() {
  modalOpen = false;
  const modal = document.getElementById('modal');

  const inner = modal.querySelector('.relative');
  const overlay = modal.querySelector('.bg-black\\/50');

  inner.classList.remove('scale-100', 'translate-y-0');
  inner.classList.add('scale-95', 'translate-y-8');

  overlay.classList.remove('opacity-100');
  overlay.classList.add('opacity-0');

  setTimeout(() => {
    modal.classList.remove('opacity-100');
    modal.classList.add('opacity-0', 'pointer-events-none');
    document.body.style.overflow = '';
  }, 300);
}

function updateHexDisplay() {
  const display = document.querySelector('#code2-display');
  const deleteBtn = document.querySelector('#delete-btn');

  display.textContent = hexCode;
  deleteBtn.classList.toggle('hidden', hexCode === '');

  const targetParts = [75, 86, 77];
  const targetCode = targetParts.map(x => x.toString(16).toUpperCase()).join(' ');

  if (hexCode === targetCode) {
    setTimeout(() => {
      animating = true;
      thirdPuzzleOpen = true;

      const wave = document.querySelector('#wave-container');
      wave.classList.remove('opacity-0');
      wave.classList.add('opacity-100');

      const puzzle3 = document.querySelector('#puzzle-3');
      puzzle3.classList.remove('hidden');
      puzzle3.classList.add('flex');

      setTimeout(() => {
        puzzle3.scrollIntoView({ behavior: 'smooth' });
      }, 500);

      setTimeout(() => {
        animating = false;
        wave.classList.remove('opacity-100');
        wave.classList.add('opacity-0');
      }, 1500);
    }, 1000);
  }
}

function updateProgressBar() {
  const bar = document.querySelector('#fillup');

  bar.classList.remove('h-0', 'h-35', 'h-70', 'h-100');

  const targetParts = [75, 86, 77];
  const targetCode = targetParts.map(x => x.toString(16).toUpperCase()).join(' ');

  if (hexCode === targetCode) {
    bar.classList.add('h-100');
  } else if (hexCode.startsWith(targetCode.slice(0, 5))) {
    bar.classList.add('h-70');
  } else if (hexCode.startsWith('4B')) {
    bar.classList.add('h-35');
  } else {
    bar.classList.add('h-0');
  }
}

function onStarClick(star) {  // just calling it star now, shorter
  if (gameComplete) return;  // bail out if game’s done

  // see if star’s already picked
  if (selectedStars.includes(star)) {
    selectedStars = selectedStars.filter(s => s !== star);  // kick it out
  } else {
    selectedStars.push(star);  // add it in

    // got all stars yet?
    if (selectedStars.length === rightOrder.length) {
      let correct = true;  // hoping for the best

      // check if order matches
      for (let i = 0; i < rightOrder.length; i++) {
        if (selectedStars[i] !== rightOrder[i]) {
          correct = false;
          break;
        }
      }

      if (correct) {
        gameComplete = true;
        // console.log("nailed it!");  // left this in from testing
        setTimeout(openModal, 500);  // pop the modal after a bit
      } else {
        // console.log("wrong, try again");  // debug stuff
        setTimeout(() => {
          selectedStars = [];  // wipe it clean
          updateStarDisplay();
        }, 1000);
      }
    }
  }

  updateStarDisplay();  // refresh the screen
}

function updateStarDisplay() {
  const counter = document.querySelector('#star-progress');
  const svg = document.querySelector('#star-lines');
  const buttons = document.querySelectorAll('.star-btn');

  // show how many stars are picked
  counter.textContent = `${selectedStars.length}/${rightOrder.length}`;

  svg.innerHTML = '';  // clear old lines

  // draw some lines between stars
  selectedStars.forEach((id, idx) => {
    if (idx === 0) return;  // skip the first one

    const curr = starPositions.find(star => star.id === id);
    const prev = starPositions.find(star => star.id === selectedStars[idx - 1]);

    // grab coords
    let x1 = prev.x;
    let y1 = prev.y;
    let x2 = curr.x;
    let y2 = curr.y;

    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', `${x1}%`);
    line.setAttribute('y1', `${y1}%`);
    line.setAttribute('x2', `${x2}%`);
    line.setAttribute('y2', `${y2}%`);
    line.setAttribute('stroke', 'cyan');
    line.setAttribute('stroke-width', '2');
    if (gameComplete) {
      line.classList.add('animate-pulse');  // fancy effect
    }
    svg.appendChild(line);
  });

  // tweak the star buttons
  buttons.forEach(btn => {
    const id = parseInt(btn.dataset.starId);
    const starInfo = starPositions.find(s => s.id === id);
    const active = selectedStars.includes(id);

    btn.className = `star-btn absolute transform -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-300 hover:scale-125 ${
      active
        ? 'bg-cyan-400 shadow-cyan-400/50 shadow-lg'
        : 'bg-yellow-200 hover:bg-yellow-300'
    } ${gameComplete ? 'animate-pulse' : ''}`;

    // size it up
    let btnSize = starInfo.size + (active ? 4 : 0);
    btn.style.width = `${btnSize}px`;
    btn.style.height = `${btnSize}px`;

    // clear any old label
    const oldLabel = btn.querySelector('span');
    if (oldLabel) oldLabel.remove();

    // slap a number on active stars
    if (active) {
      const label = document.createElement('span');
      label.className = 'absolute -top-8 left-1/2 transform -translate-x-1/2 text-cyan-400 text-sm font-bold';
      label.textContent = selectedStars.indexOf(id) + 1;
      btn.appendChild(label);
    }
  });
}

function clearStars() {
  selectedStars = [];  // reset everything
  gameComplete = false;
  updateStarDisplay();
}

function checkDeviceType() {
  const ua = navigator.userAgent.toLowerCase();
  // quick check for mobile
  mobile = /android|iphone|ipad|ipod/.test(ua);
  // console.log('device:', ua);  // handy for troubleshooting
}

function setupEvents() {
  const secretInput = document.getElementById('secret-input');
  const openBtn = document.getElementById('open-secret');
  const closeBtn = document.getElementById('close-modal');
  const numBtns = document.querySelectorAll('.btn');
  const delBtn = document.getElementById('delete-btn');
  const starBtns = document.querySelectorAll('.star-btn');
  const resetBtn = document.getElementById('reset-stars');
  const modal = document.getElementById('modal');

  // hook up the secret input
  if (secretInput) secretInput.oninput = onSecretInput;

  // modal buttons
  if (openBtn) openBtn.onclick = openModal;
  if (closeBtn) closeBtn.onclick = closeModal;

  // delete key for hex
  if (delBtn) {
    delBtn.onclick = () => {
      hexCode = hexCode.slice(0, -1);
      updateHexDisplay();
    };
  }

  // reset stars
  if (resetBtn) resetBtn.onclick = clearStars;

  // number buttons for hex code
  numBtns.forEach(btn => {
    btn.onclick = e => {
      const val = e.target.dataset.value;
      hexCode = (hexCode + val).replace(/\s+/g, '').match(/.{1,2}/g)?.join(' ') || '';
      updateHexDisplay();
      updateProgressBar();
    };
  });

  // star click handlers
  starBtns.forEach(btn => {
    btn.onclick = e => {
      const id = +e.target.dataset.starId;
      onStarClick(id);
    };
  });

  // click outside to close modal
  if (modal) {
    modal.onclick = e => {
      if (e.target === modal) closeModal();
    };
  }

  // mouse movement
  window.onmousemove = e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    updateElementPositions();
  };

  // touch movement for mobile
  window.addEventListener('touchmove', e => {
    const touch = e.touches?.[0];
    if (!touch) return;
    mouseX = touch.clientX;
    mouseY = touch.clientY;
    updateElementPositions();
    e.preventDefault();
  }, { passive: false });

  // tilt for mobile
  window.addEventListener('deviceorientation', e => {
    if (!mobile || !e.gamma || !e.beta) return;

    const max = 15;
    const xRatio = Math.min(Math.max(e.gamma, -max), max) / max;
    const yRatio = Math.min(Math.max(e.beta - 40, -max), max) / max;

    mouseX = ((xRatio + 1) / 2) * window.innerWidth;
    mouseY = ((yRatio + 1) / 2) * window.innerHeight;
    updateElementPositions();
  });

  checkDeviceType();  // kick things off
}
makeBackgroundStars();
setupEvents();
updateElementPositions();