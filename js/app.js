// Loud Audio Overlay Function for Text Notifications
function playOverlayNotificationSound() {
  try {
    const sound = new Audio('sounds/notification.mp3');
    sound.volume = 1.0; // Forced to maximum volume (100%)
    sound.play().catch(err => console.log('Audio playback blocked until user clicks page:', err));
  } catch (e) {
    console.log('Notification audio error:', e);
  }
}

const defaultPlaylists = [
  { id: "pIvf9bOPXIw", title: "Task 01: Deep Focus Synthwave", dept: "ENGINEERING & TECH", url: "https://music.youtube.com/watch?v=pIvf9bOPXIw", icon: "💻" },
  { id: "qg3X8fKCtZo", title: "Task 02: Coffee Shop Lo-Fi Flow", dept: "COMMUNICATION & INBOX", url: "https://music.youtube.com/watch?v=qg3X8fKCtZo", icon: "☕" },
  { id: "HLADXoAflHk", title: "Task 03: Chill Ambient Focus", dept: "FINANCE & REPORTING", url: "https://music.youtube.com/watch?v=HLADXoAflHk", icon: "📑" }
];

let playlists = [...defaultPlaylists];
const funIcons = ["💡", "💻", "☕", "🚀", "🎉", "📑", "📊", "🔥", "🎧"];

// General Slideshow Backgrounds Pool (Excludes specific trigger images bg1 (10) & bg1 (8))
const bgImages = [
  "images/bg1 (1).jpg",
  "images/bg1 (2).jpg",
  "images/bg1 (3).jpg",
  "images/bg1 (4).jpg",
  "images/bg1 (5).jpg",
  "images/bg1 (6).jpg",
  "images/bg1 (7).jpg",
  "images/bg1 (9).jpg",
  "images/bg1 (11).jpg",
  "images/bg1 (12).jpg"
];

// Special Trigger Backgrounds
const bgCheckIn = "images/bg1 (10).jpg";
const bgNearEnd = "images/bg1 (8).jpg";

const corporateSentences = [
  "Iss topic pe thoda aur deep dive karna padega.",
  "Mera ek hard stop hai 3 PM pe, toh jaldi wrap up karte hain.",
  "Iska load mat lo, main handle karunga.",
  "Aapki mail mili, let me get back to you on this by EOD.",
  "Ek baar client se align ho jate hain, phir aage proceed karenge.",
  "Bhai, ye issue bilkul blocker ban gaya hai mere liye.",
  "Isme thoda bandwidth ka issue hai iss week.",
  "Aap mujhe loop in kar dena uss mail thread mein.",
  "Yeh meeting ka agenda thoda unclear hai, pehle sync kar lete hain.",
  "Iss point ko abhi park kar dete hain, baad mein dekhenge.",
  "Client ki side se abhi tak koi response nahi aaya, main follow-up daalta hoon.",
  "Pehle low-hanging fruits pick karte hain, taaki quick wins mil jayein.",
  "Mujhe iss proposal mein thoda aur clarity chahiye.",
  "Puri team ko ek baar same page pe laana zaroori hai.",
  "Yeh requirement out of scope hai, iske liye extra resources lagenge.",
  "Main bas bump kar raha hoon iss mail ko aapke inbox mein.",
  "Strategy thodi pivot karni padegi as per market feedback.",
  "Aap high-level overview de do, details baad mein dekh lenge.",
  "Iss project mein thoda aur push chahiye to move the needle.",
  "Chalo, 5 min pehle meeting khatam karte hain, aapko 5 min waapas deta hoon."
];

const checkInPool = [
  "in last to aa gaye aap...",
  "aaj toh time pe aaye ho, kya baat hai!",
  "chalo, aaj ka natak shuru karte hain..."
];

const endBreakPool = [
  "are break khatam bhi ho gaya kya",
  "bas itna hi break? chalo waapas kaam pe..."
];

let currentIndex = 0;
let player = null;
let isPlaying = false;
let progressInterval = null;

// BACKGROUND SLIDESHOW LOGIC
let currentBgIndex = -1;
let activeLayer = 1;

function setSpecificBg(imagePath) {
  const newBgUrl = `url('${imagePath}')`;
  const layer1 = document.getElementById('bg-layer-1');
  const layer2 = document.getElementById('bg-layer-2');

  if (activeLayer === 1) {
    layer2.style.backgroundImage = newBgUrl;
    layer2.style.opacity = '1';
    layer1.style.opacity = '0';
    activeLayer = 2;
  } else {
    layer1.style.backgroundImage = newBgUrl;
    layer1.style.opacity = '1';
    layer2.style.opacity = '0';
    activeLayer = 1;
  }
}

function triggerRandomBg() {
  let nextIndex;
  do {
    nextIndex = Math.floor(Math.random() * bgImages.length);
  } while (nextIndex === currentBgIndex && bgImages.length > 1);

  currentBgIndex = nextIndex;
  setSpecificBg(bgImages[currentBgIndex]);
}

setInterval(triggerRandomBg, 12000);

// STICKY NOTE LOGIC
let stickyGoals = ["Review Q3 Deliverables", "Send status update email"];

function toggleStickyNote() {
  document.getElementById('sticky-note').classList.toggle('hidden');
  renderStickyGoals();
}

function handleStickyKeyPress(event) {
  if (event.key === 'Enter') {
    addStickyGoal();
  }
}

function addStickyGoal() {
  const input = document.getElementById('sticky-input');
  const val = input.value.trim();
  if (val) {
    stickyGoals.push(val);
    input.value = "";
    renderStickyGoals();
  }
}

function deleteStickyGoal(idx) {
  stickyGoals.splice(idx, 1);
  renderStickyGoals();
}

function toggleCompleteGoal(idx, elem) {
  const item = elem.closest('.sticky-item');
  item.classList.toggle('completed');
}

function renderStickyGoals() {
  const list = document.getElementById('sticky-list');
  list.innerHTML = "";
  stickyGoals.forEach((goal, idx) => {
    const li = document.createElement('li');
    li.className = 'sticky-item';
    li.innerHTML = `
      <div class="sticky-item-left">
        <input type="checkbox" onchange="toggleCompleteGoal(${idx}, this)" />
        <span>${goal}</span>
      </div>
      <button class="del-sticky-btn" onclick="deleteStickyGoal(${idx})">✕</button>
    `;
    list.appendChild(li);
  });
}

// CALLOUT & MODAL TOGGLES
function toggleLaptop() {
  document.getElementById('laptop-screen-modal').classList.toggle('hidden');
}

function toggleFolderModal() {
  document.getElementById('folder-files-modal').classList.toggle('hidden');
}

function togglePlaylistCallout() {
  document.getElementById('games-callout').classList.add('hidden');
  document.getElementById('playlist-callout').classList.toggle('hidden');
}

function toggleGamesCallout() {
  document.getElementById('playlist-callout').classList.add('hidden');
  document.getElementById('games-callout').classList.toggle('hidden');
}

// LAMP TOGGLE
let lampOn = false;
function toggleLamp() {
  lampOn = !lampOn;
  const btn = document.getElementById('lamp-btn');
  const artContainer = document.querySelector('.dock-art');
  const artBox = document.getElementById('art-box');

  const randomIcon = funIcons[Math.floor(Math.random() * funIcons.length)];
  artBox.innerText = randomIcon;

  artBox.classList.add('pop-anim');
  setTimeout(() => artBox.classList.remove('pop-anim'), 300);

  if (lampOn) {
    document.body.classList.add('lamp-warm-glow');
    artContainer.classList.add('flashlight-active');
    btn.innerText = '💡 Desk Lamp ON';
  } else {
    document.body.classList.remove('lamp-warm-glow');
    artContainer.classList.remove('flashlight-active');
    btn.innerText = '💡 Desk Lamp OFF';
  }
}

// CUSTOM PLAYLIST MANAGER
function parseYouTubeUrl(url) {
  const playlistMatch = url.match(/[?&]list=([^#\&\?]+)/);
  if (playlistMatch && playlistMatch[1]) {
    return { type: 'playlist', id: playlistMatch[1] };
  }

  const videoMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|shorts\/)|music\.youtube\.com\/watch\?v=)([^#\&\?]{11})/);
  if (videoMatch && videoMatch[1]) {
    return { type: 'video', id: videoMatch[1] };
  }

  return null;
}

function addCustomPlaylist() {
  const titleInput = document.getElementById('custom-task-name').value.trim();
  const urlInput = document.getElementById('custom-yt-url').value.trim();

  if (!titleInput || !urlInput) {
    alert("Please provide both a Vibe name and a YouTube link.");
    return;
  }

  const parsed = parseYouTubeUrl(urlInput);
  if (!parsed) {
    alert("Invalid YouTube link format!");
    return;
  }

  const newTrack = {
    id: parsed.id,
    type: parsed.type,
    title: titleInput,
    dept: parsed.type === 'playlist' ? "CUSTOM ALBUM" : "USER VIBE",
    url: urlInput,
    icon: parsed.type === 'playlist' ? "🎶" : "🎵"
  };

  playlists.push(newTrack);
  togglePlaylistCallout();

  document.getElementById('custom-task-name').value = "";
  document.getElementById('custom-yt-url').value = "";

  loadPlaylist(playlists.length - 1);
  alert(`"${titleInput}" added!`);
}

function resetPlaylists() {
  playlists = [...defaultPlaylists];
  togglePlaylistCallout();
  loadPlaylist(0);
  alert("Playlists reset!");
}

// QUICK MINI GAMES LOGIC
function switchGame(gameType) {
  const btns = document.querySelectorAll('.game-nav-btn');
  btns.forEach(b => b.classList.remove('active'));

  document.getElementById('game-ttt').classList.add('hidden');
  document.getElementById('game-coin').classList.add('hidden');

  if (gameType === 'ttt') {
    btns[0].classList.add('active');
    document.getElementById('game-ttt').classList.remove('hidden');
  } else if (gameType === 'coin') {
    btns[1].classList.add('active');
    document.getElementById('game-coin').classList.remove('hidden');
  }
}

// TIC-TAC-TOE VS AI
let tttBoard = ["", "", "", "", "", "", "", "", ""];
let tttActive = true;

function makeMove(index) {
  if (tttBoard[index] !== "" || !tttActive) return;

  tttBoard[index] = "X";
  renderTTT();

  if (checkTTTWin("X")) {
    document.getElementById('ttt-status').innerText = "🎉 You Won!";
    tttActive = false;
    return;
  }

  if (tttBoard.every(cell => cell !== "")) {
    document.getElementById('ttt-status').innerText = "🤝 It's a Draw!";
    tttActive = false;
    return;
  }

  document.getElementById('ttt-status').innerText = "AI thinking...";
  setTimeout(() => {
    let emptyIndices = tttBoard.map((val, idx) => cellVal(val, idx)).filter(val => val !== null);
    if (emptyIndices.length > 0) {
      let aiChoice = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
      tttBoard[aiChoice] = "O";
      renderTTT();

      if (checkTTTWin("O")) {
        document.getElementById('ttt-status').innerText = "💻 AI Won!";
        tttActive = false;
      } else {
        document.getElementById('ttt-status').innerText = "Your turn (X)";
      }
    }
  }, 400);
}

function cellVal(val, idx) { return val === "" ? idx : null; }

function renderTTT() {
  const cells = document.querySelectorAll('.ttt-cell');
  cells.forEach((cell, idx) => {
    cell.innerText = tttBoard[idx];
  });
}

function checkTTTWin(playerSymbol) {
  const wins = [
    [0,1,2], [3,4,5], [6,7,8],
    [0,3,6], [1,4,7], [2,5,8],
    [0,4,8], [2,4,6]
  ];
  return wins.some(combo => combo.every(idx => tttBoard[idx] === playerSymbol));
}

function resetTTT() {
  tttBoard = ["", "", "", "", "", "", "", "", ""];
  tttActive = true;
  document.getElementById('ttt-status').innerText = "Your turn (X)";
  renderTTT();
}

function flipCoin() {
  const resultElem = document.getElementById('coin-result');
  resultElem.innerText = "🌀";
  setTimeout(() => {
    const outcome = Math.random() > 0.5 ? "👑 Heads" : "🦅 Tails";
    resultElem.innerText = outcome;
  }, 500);
}

// POMODORO FOCUS DURATION
let durationMinutes = 25;
function setTimerDuration(mins) {
  durationMinutes = mins;
  const btns = document.querySelectorAll('.preset-time-btns button');
  btns.forEach(b => b.classList.remove('active'));
  event.target.classList.add('active');
}

function startFocusSession() {
  toggleFolderModal();
  alert(`Pomodoro timer set for ${durationMinutes} minutes! Focus time started.`);
}

// REACTION POPUP LOGIC
let popupTimeout = null;

function showReactionPopup(text, duration = 5000) {
  playOverlayNotificationSound();
  const popup = document.getElementById('reaction-popup');
  const textElem = document.getElementById('reaction-text');
  if (!popup || !textElem) return;

  textElem.innerText = `"${text}"`;
  popup.classList.remove('hidden');

  if (popupTimeout) clearTimeout(popupTimeout);
  popupTimeout = setTimeout(() => {
    popup.classList.add('hidden');
  }, duration);
}

// MAIN PAGE TRANSPARENT WHITE COUNTDOWN CLOCK & MILESTONES
let checkedIn = false;
let onBreak = false;
let shiftTimer = null;
let shiftSecs = 0;
const SHIFT_TOTAL_SECONDS = 8 * 3600;

function toggleShiftLog() {
  checkedIn = !checkedIn;
  const tag = document.getElementById('shift-status-tag');
  const btn = document.getElementById('shift-btn');
  const breakBtn = document.getElementById('break-btn');
  const clockContainer = document.getElementById('main-shift-clock');

  if (checkedIn) {
    tag.innerText = '🟢 ON SHIFT';
    tag.className = 'shift-tag status-in';
    btn.innerText = '⏰ Log Check-Out';
    breakBtn.classList.remove('hidden');
    clockContainer.classList.remove('hidden');

    // Rule: Set bg1 (10).jpg as background on Check-In
    setSpecificBg(bgCheckIn);

    const checkInMsg = checkInPool[Math.floor(Math.random() * checkInPool.length)];
    showReactionPopup(checkInMsg, 5000);

    if (player && player.playVideo) player.playVideo();

    if (shiftTimer) clearInterval(shiftTimer);
    shiftTimer = setInterval(updateShiftLoop, 1000);
  } else {
    tag.innerText = '🔴 OFF SHIFT';
    tag.className = 'shift-tag status-out';
    btn.innerText = '⏰ Log Check-In';
    breakBtn.classList.add('hidden');
    clockContainer.classList.add('hidden');
    if (shiftTimer) clearInterval(shiftTimer);

    shiftSecs = 0;
    onBreak = false;

    if (player && player.pauseVideo) player.pauseVideo();
  }
}

function toggleBreakLog() {
  if (!checkedIn) return;
  onBreak = !onBreak;
  const tag = document.getElementById('shift-status-tag');
  const breakBtn = document.getElementById('break-btn');

  if (onBreak) {
    tag.innerText = '☕ ON BREAK';
    tag.className = 'shift-tag status-break';
    breakBtn.innerText = '▶️ End Break';
    if (player && player.pauseVideo) player.pauseVideo();
  } else {
    tag.innerText = '🟢 ON SHIFT';
    tag.className = 'shift-tag status-in';
    breakBtn.innerText = '☕ Take Break';
    
    const endBreakMsg = endBreakPool[Math.floor(Math.random() * endBreakPool.length)];
    showReactionPopup(endBreakMsg, 5000);

    if (player && player.playVideo) player.playVideo();
  }
}

function updateShiftLoop() {
  if (onBreak) return;

  shiftSecs++;

  const leftSecs = Math.max(0, SHIFT_TOTAL_SECONDS - shiftSecs);
  const lh = Math.floor(leftSecs / 3600).toString().padStart(2, '0');
  const lm = Math.floor((leftSecs % 3600) / 60).toString().padStart(2, '0');
  const ls = (leftSecs % 60).toString().padStart(2, '0');
  document.getElementById('countdown-front-text').innerText = `${lh}:${lm}:${ls}`;

  if (shiftSecs === 3600) {
    showReactionPopup("ek ghanta ho gaya, mail check kar lo pehle", 6000);
  } else if (shiftSecs === 7200) {
    showReactionPopup("are thak nahi gaye tum", 6000);
  } else if (shiftSecs === 9000) {
    showReactionPopup("chal chai pite he", 6000);
  } else if (shiftSecs === 14400) {
    showReactionPopup("oy chal its lunch break time", 6000);
  } else if (shiftSecs === 18000) {
    showReactionPopup("post-lunch neend aane lagi hai na?", 6000);
  } else if (shiftSecs === 21600) {
    showReactionPopup("bass 2 ghante aur, thoda aur kheench lo!", 6000);
  } else if (shiftSecs === 25200) {
    showReactionPopup("ghar nahi jana kya..", 6000);
  } else if (shiftSecs === 28200) { // 7 Hours 50 Mins
    // Rule: Set bg1 (8).jpg as background near 7:50
    setSpecificBg(bgNearEnd);
    showReactionPopup("Almost 7:50 completed! Time to wrap up!", 6000);
  } else if (shiftSecs === 28500) { // 7 Hours 55 Mins
    showReactionPopup("5 min baaki hain, bag ready rakho!", 6000);
  } else if (shiftSecs >= SHIFT_TOTAL_SECONDS) {
    document.getElementById('ghar-ja-overlay').classList.remove('hidden');
  }
}

function dismissGharJa() {
  document.getElementById('ghar-ja-overlay').classList.add('hidden');
  toggleShiftLog();
}

// FADING SENTENCE LOGIC
function startSentenceCycle() {
  const textElem = document.getElementById('floating-text');
  if (!textElem) return;

  function cycle() {
    if (checkedIn) {
      const randomMsg = corporateSentences[Math.floor(Math.random() * corporateSentences.length)];
      textElem.innerText = `💬 "${randomMsg}"`;
      textElem.classList.add('visible');

      setTimeout(() => {
        textElem.classList.remove('visible');
        setTimeout(cycle, 1500);
      }, 4000);
    } else {
      setTimeout(cycle, 2000);
    }
  }

  cycle();
}

document.addEventListener('DOMContentLoaded', () => {
  triggerRandomBg();
  startSentenceCycle();
});

// YOUTUBE API INTEGRATION
function onYouTubeIframeAPIReady() {
  player = new YT.Player('yt-player', {
    height: '100%',
    width: '100%',
    playerVars: {
      'autoplay': 0,
      'controls': 1,
      'modestbranding': 1,
      'rel': 0,
      'enablejsapi': 1,
      'origin': window.location.origin
    },
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    }
  });
}

function onPlayerReady() { loadPlaylist(0); }

function onPlayerStateChange(event) {
  const playIcon = document.getElementById('play-icon');
  if (event.data === YT.PlayerState.PLAYING) {
    isPlaying = true;
    playIcon.innerText = '⏸️';
    startProgressTracker();
  } else {
    isPlaying = false;
    playIcon.innerText = '☕';
    stopProgressTracker();
  }
}

function updateDockUI(index) {
  currentIndex = index;
  const item = playlists[index];

  document.getElementById('dock-title').innerText = item.title;
  document.getElementById('dock-artist').innerText = item.dept;
  document.getElementById('art-box').innerText = item.icon;
  document.getElementById('yt-external-link').href = item.url;
}

function loadPlaylist(index) {
  currentIndex = index;
  updateDockUI(index);
  const item = playlists[index];

  if (player && player.loadPlaylist && item.type === 'playlist') {
    player.loadPlaylist({
      listType: 'playlist',
      list: item.id,
      index: 0,
      startSeconds: 0
    });
  } else if (player && player.loadVideoById) {
    player.loadVideoById(item.id);
  }
}

function startProgressTracker() {
  stopProgressTracker();
  progressInterval = setInterval(() => {
    if (player && player.getCurrentTime && player.getDuration) {
      const current = player.getCurrentTime();
      const duration = player.getDuration();
      if (duration > 0) {
        const pct = (current / duration) * 100;
        document.getElementById('progress-fill').style.width = `${pct}%`;
        document.getElementById('time-current').innerText = formatTime(current);
        document.getElementById('time-total').innerText = formatTime(duration);
      }
    }
  }, 1000);
}

function stopProgressTracker() { if (progressInterval) clearInterval(progressInterval); }

function formatTime(sec) {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

document.getElementById('dock-play-btn').addEventListener('click', () => {
  if (!checkedIn) {
    const shiftBtn = document.getElementById('shift-btn');
    if (shiftBtn) {
      shiftBtn.classList.remove('check-in-attention');
      void shiftBtn.offsetWidth; // Force DOM reflow to restart animation
      shiftBtn.classList.add('check-in-attention');
      setTimeout(() => shiftBtn.classList.remove('check-in-attention'), 850);
    }
    if (typeof showReactionPopup === 'function') {
      showReactionPopup("Check-In first to start your shift vibe! ⏰", 4000);
    }
    return;
  }

  if (isPlaying) { 
    if (typeof triggerAudioPause === 'function') { triggerAudioPause(); } 
    else if (player && player.pauseVideo) { player.pauseVideo(); }
  } else { 
    if (typeof triggerAudioPlay === 'function') { triggerAudioPlay(); } 
    else if (player && player.playVideo) { player.playVideo(); }
  }
});

document.getElementById('dock-next-btn').addEventListener('click', () => {
  currentIndex = (currentIndex + 1) % playlists.length;
  loadPlaylist(currentIndex);
});

document.getElementById('dock-prev-btn').addEventListener('click', () => {
  currentIndex = (currentIndex - 1 + playlists.length) % playlists.length;
  loadPlaylist(currentIndex);
});




