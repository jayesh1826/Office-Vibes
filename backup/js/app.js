let playlists = [
  { id: "pIvf9bOPXIw", url: "https://music.youtube.com/watch?v=pIvf9bOPXIw", icon: "💻" },
  { id: "qg3X8fKCtZo", url: "https://music.youtube.com/watch?v=qg3X8fKCtZo", icon: "☕" },
  { id: "HLADXoAflHk", url: "https://music.youtube.com/watch?v=HLADXoAflHk", icon: "📑" }
];

const bgImages = [
  "images/bg1 (1).jpg",
  "images/bg1 (2).jpg",
  "images/bg1 (3).jpg",
  "images/bg1 (4).jpg",
  "images/bg1 (5).jpg"
];

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

// Expanded Office Milestone Reaction Pools
const checkInPool = [
  "in last to aa gaye aap...",
  "aaj toh time pe aaye ho, kya baat hai!",
  "chalo, aaj ka natak shuru karte hain..."
];

const endBreakPool = [
  "are break khatam bhi ho gaya kya",
  "bas itna hi break? chalo waapas kaam pe..."
];

const officeTasks = [
  { title: "Task 01: Draft Q3 Client Email", dept: "COMMUNICATION & INBOX" },
  { title: "Task 02: Review Excel Financial Sheets", dept: "FINANCE & REPORTING" },
  { title: "Task 03: Debug Critical Blocker Bug", dept: "ENGINEERING & TECH" },
  { title: "Task 04: Prepare Deck for 3 PM Meeting", dept: "STRATEGY & PRESENTATION" },
  { title: "Task 05: Clean Up Shared Google Drive", dept: "OPERATIONS & ADMIN" }
];

let currentIndex = 0;
let player = null;
let isPlaying = false;
let progressInterval = null;

// BACKGROUND SLIDESHOW
let currentBgIndex = -1;
let activeLayer = 1;

function triggerRandomBg() {
  let nextIndex;
  do {
    nextIndex = Math.floor(Math.random() * bgImages.length);
  } while (nextIndex === currentBgIndex && bgImages.length > 1);

  currentBgIndex = nextIndex;
  const newBgUrl = `url('${bgImages[currentBgIndex]}')`;

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
setInterval(triggerRandomBg, 12000);

// LAPTOP & FOLDER MODAL TOGGLES
function toggleLaptop() {
  const modal = document.getElementById('laptop-screen-modal');
  modal.classList.toggle('hidden');
}

function toggleFolderModal() {
  const modal = document.getElementById('folder-files-modal');
  modal.classList.toggle('hidden');
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

// DEDICATED REACTION POPUP LOGIC (Independent from corporate sentences)
let popupTimeout = null;

function showReactionPopup(text, duration = 5000) {
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
const SHIFT_TOTAL_SECONDS = 8 * 3600; // 8 Hours

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

    // Trigger Random Check-In Reaction Popup
    const checkInMsg = checkInPool[Math.floor(Math.random() * checkInPool.length)];
    showReactionPopup(checkInMsg, 5000);

    // Auto Play Music
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

    // Auto Pause Music
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
    
    // Trigger End Break Reaction
    const endBreakMsg = endBreakPool[Math.floor(Math.random() * endBreakPool.length)];
    showReactionPopup(endBreakMsg, 5000);

    if (player && player.playVideo) player.playVideo();
  }
}

function updateShiftLoop() {
  if (onBreak) return;

  shiftSecs++;

  // 1. Format Countdown Time (FRONT AND CENTER)
  const leftSecs = Math.max(0, SHIFT_TOTAL_SECONDS - shiftSecs);
  const lh = Math.floor(leftSecs / 3600).toString().padStart(2, '0');
  const lm = Math.floor((leftSecs % 3600) / 60).toString().padStart(2, '0');
  const ls = (leftSecs % 60).toString().padStart(2, '0');
  document.getElementById('countdown-front-text').innerText = `${lh}:${lm}:${ls}`;

  // 2. Additional Milestone Popups
  if (shiftSecs === 3600) { // 1 Hour
    showReactionPopup("ek ghanta ho gaya, mail check kar lo pehle", 6000);
  } else if (shiftSecs === 7200) { // 2 Hours
    showReactionPopup("are thak nahi gaye tum", 6000);
  } else if (shiftSecs === 9000) { // 2.5 Hours
    showReactionPopup("chal chai pite he", 6000);
  } else if (shiftSecs === 14400) { // 4 Hours (Lunch Time)
    showReactionPopup("oy chal its lunch break time", 6000);
  } else if (shiftSecs === 18000) { // 5 Hours (Post-Lunch)
    showReactionPopup("post-lunch neend aane lagi hai na?", 6000);
  } else if (shiftSecs === 21600) { // 6 Hours
    showReactionPopup("bass 2 ghante aur, thoda aur kheench lo!", 6000);
  } else if (shiftSecs === 25200) { // 7 Hours (1h Left)
    showReactionPopup("ghar nahi jana kya..", 6000);
  } else if (shiftSecs === 27900) { // 7 Hours 45 Mins (15m Left)
    showReactionPopup("kya re packing ho gayi kya...", 6000);
  } else if (shiftSecs === 28500) { // 7 Hours 55 Mins (5m Left)
    showReactionPopup("5 min baaki hain, bag ready rakho!", 6000);
  } else if (shiftSecs >= SHIFT_TOTAL_SECONDS) { // > 8 Hours
    document.getElementById('ghar-ja-overlay').classList.remove('hidden');
  }
}

function dismissGharJa() {
  document.getElementById('ghar-ja-overlay').classList.add('hidden');
  toggleShiftLog();
}

// FADING SENTENCE LOGIC (Purely for background corporate dialogue)
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
    videoId: playlists[0].id,
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

function onPlayerReady() { updateDockUI(0); }

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
  const randomTask = officeTasks[Math.floor(Math.random() * officeTasks.length)];

  document.getElementById('dock-title').innerText = randomTask.title;
  document.getElementById('dock-artist').innerText = randomTask.dept;
  document.getElementById('art-box').innerText = item.icon;
  document.getElementById('yt-external-link').href = item.url;
}

function loadPlaylist(index) {
  updateDockUI(index);
  if (player && player.loadVideoById) {
    player.loadVideoById(playlists[index].id);
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
  if (!player || !player.playVideo) return;
  if (isPlaying) { player.pauseVideo(); } else { player.playVideo(); }
});

document.getElementById('dock-next-btn').addEventListener('click', () => {
  currentIndex = (currentIndex + 1) % playlists.length;
  loadPlaylist(currentIndex);
});

document.getElementById('dock-prev-btn').addEventListener('click', () => {
  currentIndex = (currentIndex - 1 + playlists.length) % playlists.length;
  loadPlaylist(currentIndex);
});

let lampOn = false;
function toggleLamp() {
  lampOn = !lampOn;
  const btn = document.getElementById('lamp-btn');
  if (lampOn) {
    document.body.classList.add('lamp-warm-glow');
    btn.innerText = '💡 Desk Lamp ON';
  } else {
    document.body.classList.remove('lamp-warm-glow');
    btn.innerText = '💡 Desk Lamp OFF';
  }
}
