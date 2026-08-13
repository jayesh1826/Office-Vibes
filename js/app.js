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
  "To aa gaye aap...",
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


// TIC-TAC-TOE VS AI
/*let tttBoard = ["", "", "", "", "", "", "", "", ""];
let tttActive = true;

// Corporate Hinglish AI Defeat Pool
const aiDefeatPool = [
  "Bhai bhai! Bandwidth tight lag rahi hai AI ki...",
  "Lagta hai AI ka server crash ho gaya, aap jeet gaye!",
  "Aapne toh AI ko bhi PIP (Performance Improvement Plan) pe daal diya!",
  "AI busy tha meeting mein, aapne mauke ka fayda utha liya!",
  "Bhai sahab! Client ko mat batana AI haar gaya...",
  "Ye Jeet AAPKO MUBARAK HO! Promotion pakka?"
];

function makeMove(index) {
  if (tttBoard[index] !== "" || !tttActive) return;

  // 1. Human makes a move
  tttBoard[index] = HUMAN_PLAYER;
  renderTTT();

  // 🏆 CHECK IF HUMAN WINS
  if (checkTTTWin(tttBoard, HUMAN_PLAYER)) {
    document.getElementById('ttt-status').innerText = "🎉 You Beat the AI!";
    tttActive = false;

    // Trigger sound & random Hinglish reaction popup
    const winMsg = aiDefeatPool[Math.floor(Math.random() * aiDefeatPool.length)];
    if (typeof showReactionPopup === 'function') {
      showReactionPopup(winMsg, 6000);
    }
    return;
  }

  if (isBoardFull(tttBoard)) {
    document.getElementById('ttt-status').innerText = "🤝 It's a Draw!";
    tttActive = false;
    return;
  }

  // 2. AI calculates move (with 20% mistake jumper)
  document.getElementById('ttt-status').innerText = "AI thinking...";
  setTimeout(() => {
    let bestMove = getBestMove(tttBoard);
    
    if (bestMove !== null && bestMove !== undefined) {
      tttBoard[bestMove] = AI_PLAYER;
      renderTTT();

      if (checkTTTWin(tttBoard, AI_PLAYER)) {
        document.getElementById('ttt-status').innerText = "💻 AI Won!";
        tttActive = false;
      } else if (isBoardFull(tttBoard)) {
        document.getElementById('ttt-status').innerText = "🤝 It's a Draw!";
        tttActive = false;
      } else {
        document.getElementById('ttt-status').innerText = "Your turn (X)";
      }
    }
  }, 300);
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
} */

// TIC-TAC-TOE WITH STREAK & GLOW EFFECTS
let tttBoard = ["", "", "", "", "", "", "", "", ""];
let tttActive = true;
let winStreak = 0; // Tracks consecutive wins!

const AI_PLAYER = "O";
const HUMAN_PLAYER = "X";

// Corporate Hinglish AI Defeat Pool
const aiDefeatPool = [
  "Bhai bhai! Bandwidth tight lag rahi hai AI ki...",
  "Lagta hai AI ka server crash ho gaya, aap jeet gaye!",
  "Aapne toh AI ko bhi PIP pe daal diya!",
  "Ye Jeet AAPKO MUBARAK HO! Promotion pakka?"
];

// Special 3-IN-A-ROW WIN STREAK Pool! 🔥
const streak3WinPool = [
  "🔥 HAT-TRICK! 3 WINS IN A ROW! Aapko CEO banao abhi!",
  "🏆 UNSTOPPABLE! 3-time champion! AI resign kar raha hai!",
  "👑 3 WINS! Bhai aapka appraisal toh 100% fixed hai iss saal!",
  "🚀 HAT-TRICK VICTORY! Boss ko bolo direct Appraisal letter bheje!"
];

function makeMove(index) {
  if (tttBoard[index] !== "" || !tttActive) return;

  // 1. Human makes a move
  tttBoard[index] = HUMAN_PLAYER;
  renderTTT();

  // 🏆 CHECK IF HUMAN WINS
  const humanWinCombo = checkTTTWinCombo(tttBoard, HUMAN_PLAYER);
  if (humanWinCombo) {
    winStreak++;
    tttActive = false;
    highlightWinningCells(humanWinCombo, "human-glow");

    // Check if user hit the 3-Win Streak
    if (winStreak === 3) {
      document.getElementById('ttt-status').innerText = "🔥 3-IN-A-ROW HAT-TRICK!";
      const streakMsg = streak3WinPool[Math.floor(Math.random() * streak3WinPool.length)];
      if (typeof showReactionPopup === 'function') {
        showReactionPopup(streakMsg, 8000);
      }
      winStreak = 0;
    } else {
      document.getElementById('ttt-status').innerText = `🎉 Win #${winStreak}! (${3 - winStreak} more for Hat-Trick)`;
      const winMsg = aiDefeatPool[Math.floor(Math.random() * aiDefeatPool.length)];
      if (typeof showReactionPopup === 'function') {
        showReactionPopup(winMsg, 5000);
      }
    }
    return;
  }

  // Draw resets streak
  if (isBoardFull(tttBoard)) {
    winStreak = 0; 
    document.getElementById('ttt-status').innerText = "🤝 Draw! Streak reset to 0.";
    tttActive = false;
    return;
  }

  // 2. AI calculates move (with 50% mistake jumper)
  document.getElementById('ttt-status').innerText = "AI thinking...";
  setTimeout(() => {
    let bestMove = getBestMove(tttBoard);
    
    if (bestMove !== null && bestMove !== undefined) {
      tttBoard[bestMove] = AI_PLAYER;
      renderTTT();

      const aiWinCombo = checkTTTWinCombo(tttBoard, AI_PLAYER);
      if (aiWinCombo) {
        winStreak = 0; // AI Win resets human streak to 0!
        tttActive = false;
        highlightWinningCells(aiWinCombo, "ai-glow");
        document.getElementById('ttt-status').innerText = "💻 AI Won! Streak reset.";
      } else if (isBoardFull(tttBoard)) {
        winStreak = 0; // Draw resets streak
        document.getElementById('ttt-status').innerText = "🤝 Draw! Streak reset to 0.";
        tttActive = false;
      } else {
        document.getElementById('ttt-status').innerText = winStreak > 0 
          ? `Your turn (X) - Streak: ${winStreak}🔥` 
          : "Your turn (X)";
      }
    }
  }, 300);
}

// Check if any player has won; returns array [idx1, idx2, idx3] if true, else null
function checkTTTWinCombo(board, playerSymbol) {
  const wins = [
    [0,1,2], [3,4,5], [6,7,8], // Rows
    [0,3,6], [1,4,7], [2,5,8], // Columns
    [0,4,8], [2,4,6]          // Diagonals
  ];
  
  return wins.find(combo => combo.every(idx => board[idx] === playerSymbol)) || null;
}

// Boolean helper specifically for Minimax simulation calculations
function checkTTTWin(board, playerSymbol) {
  return checkTTTWinCombo(board, playerSymbol) !== null;
}

// Adds glow classes to the 3 winning cell buttons
function highlightWinningCells(winningIndices, glowTypeClass) {
  if (!Array.isArray(winningIndices)) return;
  const cells = document.querySelectorAll('.ttt-cell');
  winningIndices.forEach(idx => {
    if (cells[idx]) {
      cells[idx].classList.add('glow-win', glowTypeClass);
    }
  });
}

// Clear board and remove glow effects
function resetTTT() {
  tttBoard = ["", "", "", "", "", "", "", "", ""];
  tttActive = true;
  document.getElementById('ttt-status').innerText = winStreak > 0 
    ? `Your turn (X) - Streak: ${winStreak}🔥` 
    : "Your turn (X)";

  const cells = document.querySelectorAll('.ttt-cell');
  cells.forEach(cell => {
    cell.classList.remove('glow-win', 'human-glow', 'ai-glow');
  });

  renderTTT();
}

// Check if any empty spots remain
function isBoardFull(board) {
  return board.every(cell => cell !== "");
}

// Find all available cell indices
function getEmptyIndices(board) {
  return board.reduce((acc, val, idx) => (val === "" ? acc.concat(idx) : acc), []);
}

// MINIMAX CORE ALGORITHM
function minimax(newBoard, depth, isMaximizing) {
  if (checkTTTWin(newBoard, AI_PLAYER)) return 10 - depth;
  if (checkTTTWin(newBoard, HUMAN_PLAYER)) return depth - 10;
  
  const availSpots = getEmptyIndices(newBoard);
  if (availSpots.length === 0) return 0; // Draw

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < availSpots.length; i++) {
      const idx = availSpots[i];
      newBoard[idx] = AI_PLAYER;
      let score = minimax(newBoard, depth + 1, false);
      newBoard[idx] = "";
      bestScore = Math.max(score, bestScore);
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < availSpots.length; i++) {
      const idx = availSpots[i];
      newBoard[idx] = HUMAN_PLAYER;
      let score = minimax(newBoard, depth + 1, true);
      newBoard[idx] = "";
      bestScore = Math.min(score, bestScore);
    }
    return bestScore;
  }
}

// Finds the move for the AI using a Hidden Random Mode Jumper
function getBestMove(board) {
  const availSpots = getEmptyIndices(board);

  if (availSpots.length === 9) return 4;

  const errorChance = 0.50; // 50% mistake rate
  const shouldMakeMistake = Math.random() < errorChance;

  if (shouldMakeMistake && availSpots.length > 1) {
    const randomIndex = Math.floor(Math.random() * availSpots.length);
    return availSpots[randomIndex];
  }

  let bestScore = -Infinity;
  let move = null;

  for (let i = 0; i < availSpots.length; i++) {
    const idx = availSpots[i];
    board[idx] = AI_PLAYER;
    let score = minimax(board, 0, false);
    board[idx] = "";

    if (score > bestScore) {
      bestScore = score;
      move = idx;
    }
  }

  return move;
}

function renderTTT() {
  const cells = document.querySelectorAll('.ttt-cell');
  cells.forEach((cell, idx) => {
    cell.innerText = tttBoard[idx];
  });
}


// EXTENDED MULTI-GAME SWITCHER
function switchGame(gameType) {
  const btns = document.querySelectorAll('.game-nav-btn');
  btns.forEach(b => b.classList.remove('active'));

  const allGames = ['game-ttt', 'game-coin', 'game-memory', 'game-inbox'];
  allGames.forEach(id => {
    const elem = document.getElementById(id);
    if (elem) elem.classList.add('hidden');
  });

  // Clear running timers
  if (typeof inboxGameInterval !== 'undefined' && inboxGameInterval) {
    clearInterval(inboxGameInterval);
  }

  // Activate selected game tab
  if (gameType === 'ttt') {
    btns[0].classList.add('active');
    document.getElementById('game-ttt').classList.remove('hidden');
  } else if (gameType === 'coin') {
    btns[1].classList.add('active');
    document.getElementById('game-coin').classList.remove('hidden');
  } else if (gameType === 'memory') {
    btns[2].classList.add('active');
    document.getElementById('game-memory').classList.remove('hidden');
    initMemoryGame(); // Auto-shuffle on tab switch
  } else if (gameType === 'inbox') {
    btns[3].classList.add('active');
    document.getElementById('game-inbox').classList.remove('hidden');
  }
}

// GAME 3: MEMORY FLIP LOGIC
const perkIcons = ["☕", "☕", "💻", "💻", "💸", "💸", "🍕", "🍕"];
let flippedCards = [];
let matchedCount = 0;

function initMemoryGame() {
  const grid = document.getElementById('memory-grid');
  if (!grid) return;
  grid.innerHTML = "";
  flippedCards = [];
  matchedCount = 0;

  const shuffled = [...perkIcons].sort(() => Math.random() - 0.5);

  shuffled.forEach((icon) => {
    const card = document.createElement('button');
    card.className = 'memory-card';
    card.dataset.icon = icon;
    card.innerText = "❓";
    card.onclick = () => handleCardFlip(card);
    grid.appendChild(card);
  });
}

function handleCardFlip(card) {
  if (flippedCards.length >= 2 || card.classList.contains('flipped') || card.classList.contains('matched')) return;

  card.innerText = card.dataset.icon;
  card.classList.add('flipped');
  flippedCards.push(card);

  if (flippedCards.length === 2) {
    const [c1, c2] = flippedCards;
    if (c1.dataset.icon === c2.dataset.icon) {
      c1.classList.add('matched');
      c2.classList.add('matched');
      flippedCards = [];
      matchedCount += 2;

      if (matchedCount === perkIcons.length) {
        if (typeof showReactionPopup === 'function') {
          showReactionPopup("🎉 Perfect Memory! Appraisal clearance granted!", 5000);
        }
      }
    } else {
      setTimeout(() => {
        c1.innerText = "❓";
        c2.innerText = "❓";
        c1.classList.remove('flipped');
        c2.classList.remove('flipped');
        flippedCards = [];
      }, 600);
    }
  }
}

// GAME 4: INBOX CLEARER LOGIC
let inboxScore = 0;
let inboxGameInterval = null;

function startInboxGame() {
  inboxScore = 0;
  const status = document.getElementById('inbox-status');
  if (status) status.innerText = "Inbox Score: 0";

  let secondsLeft = 10;
  spawnEmailBadge();

  if (inboxGameInterval) clearInterval(inboxGameInterval);
  inboxGameInterval = setInterval(() => {
    secondsLeft--;
    if (secondsLeft <= 0) {
      clearInterval(inboxGameInterval);
      if (typeof showReactionPopup === 'function') {
        showReactionPopup(`📧 Inbox Cleared! ${inboxScore} mails archived!`, 5000);
      }
    } else {
      spawnEmailBadge();
    }
  }, 900);
}

function spawnEmailBadge() {
  const container = document.getElementById('inbox-container');
  if (!container) return;
  container.innerHTML = "";

  const badge = document.createElement('button');
  badge.className = 'email-badge-btn';
  badge.innerText = "📩 Unread";
  badge.onclick = () => {
    inboxScore++;
    document.getElementById('inbox-status').innerText = `Inbox Score: ${inboxScore}`;
    badge.remove();
  };

  const maxX = container.clientWidth - 75;
  const maxY = container.clientHeight - 35;
  badge.style.left = `${Math.max(5, Math.floor(Math.random() * maxX))}px`;
  badge.style.top = `${Math.max(5, Math.floor(Math.random() * maxY))}px`;

  container.appendChild(badge);
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
  if (event.data === YT.PlayerState.ENDED) {
    playNextTrack();
  }
}

// FUNCTION TO ADVANCE TO THE NEXT TRACK AUTOMATICALLY
function playNextTrack() {
  if (typeof playlists === 'undefined' || !playlists.length) return;

  // Advance index (loop back to 0 if at the end of the list)
  currentIndex = (currentIndex + 1) % playlists.length;

  // Load new track onto player
  if (typeof loadPlaylist === 'function') {
    loadPlaylist(currentIndex);
  }

  // Update track list UI in dossier if open
  if (typeof renderDossierTrackList === 'function') {
    renderDossierTrackList();
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


// DOSSIER TAB SWITCHING & TRACK SELECTOR LOGIC
function switchDossierTab(tabName) {
  const focusTab = document.getElementById('dossier-tab-focus');
  const tasksTab = document.getElementById('dossier-tab-tasks');
  const focusBtn = document.getElementById('tab-btn-focus');
  const tasksBtn = document.getElementById('tab-btn-tasks');

  if (tabName === 'focus') {
    if (focusTab) {
      focusTab.style.display = 'block';
      focusTab.classList.remove('hidden');
    }
    if (tasksTab) {
      tasksTab.style.display = 'none';
      tasksTab.classList.add('hidden');
    }
    if (focusBtn) focusBtn.classList.add('active');
    if (tasksBtn) tasksBtn.classList.remove('active');
  } else {
    if (focusTab) {
      focusTab.style.display = 'none';
      focusTab.classList.add('hidden');
    }
    if (tasksTab) {
      tasksTab.style.display = 'block';
      tasksTab.classList.remove('hidden');
    }
    if (focusBtn) focusBtn.classList.remove('active');
    if (tasksBtn) tasksBtn.classList.add('active');
    renderDossierTrackList();
  }
}

function renderDossierTrackList() {
  const list = document.getElementById('dossier-track-list');
  if (!list) return;
  list.innerHTML = "";

  if (typeof playlists === 'undefined' || !playlists.length) return;

  playlists.forEach((track, idx) => {
    const li = document.createElement('li');
    const isCurrent = idx === currentIndex;
    li.className = `dossier-track-item ${isCurrent ? 'playing' : ''}`;
    li.innerHTML = `
      <div class="track-item-info">
        <span class="track-item-title">${track.icon || '🎵'} ${track.title}</span>
        <span class="track-item-dept">${track.dept || 'TASK VIBE'}</span>
      </div>
      <span class="track-status-icon">${isCurrent ? '▶️ Playing' : '🎧 Select'}</span>
    `;
    li.onclick = () => {
      currentIndex = idx;
      if (typeof loadPlaylist === 'function') loadPlaylist(idx);
      if (typeof triggerAudioPlay === 'function') triggerAudioPlay();
      renderDossierTrackList();
    };
    list.appendChild(li);
  });
}

// TOGGLE MODAL & INITIALIZE DEFAULT TAB
function toggleFolderModal() {
  const modal = document.getElementById('folder-files-modal');
  if (modal) {
    modal.classList.toggle('hidden');
    if (!modal.classList.contains('hidden')) {
      switchDossierTab('focus'); // Reset to Focus Timer tab on open
    }
  }
}

/*// FOCUS TIMER & COUNTDOWN OVERLAY LOGIC
let selectedFocusMins = 25;
let focusRemainingSeconds = 0;
let focusTimerInterval = null;

function selectPomoTime(mins, btnElem) {
  selectedFocusMins = mins;
  const btns = document.querySelectorAll('.pomo-option-btn');
  btns.forEach(b => b.classList.remove('active'));
  if (btnElem) btnElem.classList.add('active');
}

function startFocusSession() {
  // Clear any running interval
  if (focusTimerInterval) clearInterval(focusTimerInterval);

  // Set remaining time from selected duration
  focusRemainingSeconds = selectedFocusMins * 60;

  // Close folder dossier modal
  const folderModal = document.getElementById('folder-files-modal');
  if (folderModal) folderModal.classList.add('hidden');

  // Unhide and show the floating timer clock
  const widget = document.getElementById('focus-overlay-widget');
  if (widget) widget.classList.remove('hidden');

  updateFocusClockDisplay();

  if (typeof showReactionPopup === 'function') {
    showReactionPopup(`🎯 Focus Session Started for ${selectedFocusMins} minutes!`, 4000);
  }

  // Start countdown timer loop
  focusTimerInterval = setInterval(() => {
    focusRemainingSeconds--;
    updateFocusClockDisplay();

    if (focusRemainingSeconds <= 0) {
      stopFocusSession();
      if (typeof showReactionPopup === 'function') {
        showReactionPopup("🎉 Focus Session Finished! Take a break.", 7000);
      }
    }
  }, 1000);
}

function updateFocusClockDisplay() {
  const clock = document.getElementById('focus-timer-clock');
  if (!clock) return;
  const m = Math.floor(focusRemainingSeconds / 60).toString().padStart(2, '0');
  const s = (focusRemainingSeconds % 60).toString().padStart(2, '0');
  clock.innerText = `${m}:${s}`;
}

function stopFocusSession() {
  // Stop interval timer
  if (focusTimerInterval) {
    clearInterval(focusTimerInterval);
    focusTimerInterval = null;
  }

  // Reset timer seconds back to zero
  focusRemainingSeconds = 0;
  
  // Reset clock text to 00:00
  const clock = document.getElementById('focus-timer-clock');
  if (clock) clock.innerText = "00:00";

  // Completely hide floating overlay clock widget
  const widget = document.getElementById('focus-overlay-widget');
  if (widget) widget.classList.add('hidden');
} */

let selectedFocusMins = 25;
let focusTotalSeconds = 25 * 60;
let focusRemainingSeconds = 0;
let focusTimerInterval = null;
let isFocusPaused = false;

const RING_CIRCUMFERENCE = 2 * Math.PI * 85; // 534.07

function selectPomoTime(mins, btnElem) {
  selectedFocusMins = mins;
  const btns = document.querySelectorAll('.pomo-option-btn');
  btns.forEach(b => b.classList.remove('active'));
  if (btnElem) btnElem.classList.add('active');
}

function startFocusSession() {
  if (focusTimerInterval) clearInterval(focusTimerInterval);

  focusTotalSeconds = selectedFocusMins * 60;
  focusRemainingSeconds = focusTotalSeconds;
  isFocusPaused = false;

  // Hide Dossier Folder modal if open
  const folderModal = document.getElementById('folder-files-modal');
  if (folderModal) folderModal.classList.add('hidden');

  // Open Fullscreen Overlay
  const overlay = document.getElementById('fullscreen-focus-overlay');
  if (overlay) overlay.classList.remove('hidden');

  const pauseBtn = document.getElementById('focus-pause-btn');
  if (pauseBtn) pauseBtn.innerText = "⏸️ Pause";

  updateFocusClockDisplay();

  if (typeof showReactionPopup === 'function') {
    showReactionPopup(`🎯 Fullscreen Focus Session Started (${selectedFocusMins}m)`, 4000);
  }

  focusTimerInterval = setInterval(() => {
    if (!isFocusPaused) {
      focusRemainingSeconds--;
      updateFocusClockDisplay();

      if (focusRemainingSeconds <= 0) {
        stopFocusSession();
        if (typeof showReactionPopup === 'function') {
          showReactionPopup("🎉 Deep Focus Session Finished! Take a break.", 7000);
        }
      }
    }
  }, 1000);
}

function updateFocusClockDisplay() {
  const clock = document.getElementById('fullscreen-focus-time');
  const ring = document.getElementById('focus-ring-progress');

  const m = Math.floor(focusRemainingSeconds / 60).toString().padStart(2, '0');
  const s = (focusRemainingSeconds % 60).toString().padStart(2, '0');
  
  if (clock) clock.innerText = `${m}:${s}`;

  // Update SVG Circle Progress Ring
  if (ring && focusTotalSeconds > 0) {
    const fraction = focusRemainingSeconds / focusTotalSeconds;
    const offset = RING_CIRCUMFERENCE - (fraction * RING_CIRCUMFERENCE);
    ring.style.strokeDashoffset = offset;
  }
}

function togglePauseFocus() {
  isFocusPaused = !isFocusPaused;
  const pauseBtn = document.getElementById('focus-pause-btn');
  if (pauseBtn) {
    pauseBtn.innerText = isFocusPaused ? "▶️ Resume" : "⏸️ Pause";
  }
}

function stopFocusSession() {
  if (focusTimerInterval) {
    clearInterval(focusTimerInterval);
    focusTimerInterval = null;
  }

  isFocusPaused = false;
  focusRemainingSeconds = 0;

  const clock = document.getElementById('fullscreen-focus-time');
  if (clock) clock.innerText = "00:00";

  // Hide Fullscreen Overlay
  const overlay = document.getElementById('fullscreen-focus-overlay');
  if (overlay) overlay.classList.add('hidden');
}

// REAL-TIME PRESENCE SYSTEM (FIREBASE + VERCEL)
const firebaseConfig = {
  apiKey: "AIzaSyD2hLQyXZLDG6qR04NA3NigVwDe9WjT1Og",
  authDomain: "office-dashboard-e8f12.firebaseapp.com",
  databaseURL: "https://office-dashboard-e8f12-default-rtdb.firebaseio.com",
  projectId: "office-dashboard-e8f12",
  storageBucket: "office-dashboard-e8f12.firebasestorage.app",
  messagingSenderId: "88533660881",
  appId: "1:88533660881:web:f22827946e33a9c16c01f0",
  measurementId: "G-JT7SGJB628"
};

// Initialize Firebase
if (typeof firebase !== 'undefined' && !firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const db = firebase.database();

// Track Connection Status
const connectedRef = db.ref(".info/connected");
const activeUsersRef = db.ref("presence/activeUsers");

connectedRef.on("value", (snap) => {
  if (snap.val() === true) {
    // Generate a unique session key for this visitor
    const userPresenceRef = activeUsersRef.push();

    // AUTOMATIC DISCONNECT HANDLER: Removes user key when browser/tab closes
    userPresenceRef.onDisconnect().remove();

    // Mark user as online
    userPresenceRef.set({ 
      onlineAt: firebase.database.ServerValue.TIMESTAMP 
    });
  }
});

// REAL-TIME LISTENER: Updates UI with "Colleagues Joined" text
activeUsersRef.on("value", (snapshot) => {
  const onlineCount = snapshot.numChildren() || 0;
  const counterElem = document.getElementById("live-user-count");
  if (counterElem) {
    // Displays "1 Colleague Joined" or "X Colleagues Joined"
    const colleagueText = onlineCount === 1 ? 'Colleague' : 'Colleagues';
    counterElem.innerText = `🟢 ${onlineCount} ${colleagueText} Joined`;
  }
});
