const defaultPlaylists = [
  { id: "PL4fGSI1pDJn5RgLW0Sb_zECecWdH_4zOX", title: "Office Vibe Lofi Playlist", dept: "COMMUNICATION & INBOX", url: "https://music.youtube.com/playlist?list=PL4fGSI1pDJn5RgLW0Sb_zECecWdH_4zOX", icon: "☕", type: "playlist" },
  { id: "pIvf9bOPXIw", title: "Task 01: Deep Focus Synthwave", dept: "ENGINEERING & TECH", url: "https://music.youtube.com/watch?v=pIvf9bOPXIw", icon: "💻", type: "video" },
  { id: "HLADXoAflHk", title: "Task 03: Chill Ambient Focus", dept: "FINANCE & REPORTING", url: "https://music.youtube.com/watch?v=HLADXoAflHk", icon: "📑", type: "video" }
];

// Restore custom tracks from localStorage
let savedCustomTracks = JSON.parse(localStorage.getItem('officeVibes_customTracks')) || [];
let playlists = [...defaultPlaylists, ...savedCustomTracks];

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

// State persistence
let storedIndex = parseInt(localStorage.getItem('officeVibes_trackIndex'));
let currentIndex = (!isNaN(storedIndex) && storedIndex >= 0 && storedIndex < playlists.length) ? storedIndex : 0;

let checkedIn = localStorage.getItem('officeVibes_checkedIn') === 'true';
let onBreak = localStorage.getItem('officeVibes_onBreak') === 'true';
let shiftSecs = parseInt(localStorage.getItem('officeVibes_shiftSecs')) || 0;
let shiftTimer = null;
const SHIFT_TOTAL_SECONDS = 8 * 3600; // 8 Hours

let player = null;
let isPlaying = false;
let progressInterval = null;

// LOUD OVERLAY NOTIFICATION AUDIO
function playOverlayNotificationSound() {
  try {
    const sound = new Audio('sounds/notification.mp3');
    sound.volume = 1.0;
    sound.play().catch(err => console.log('Audio overlay blocked until click:', err));
  } catch (e) {
    console.log('Notification sound error:', e);
  }
}

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
    if (layer2) { layer2.style.backgroundImage = newBgUrl; layer2.style.opacity = '1'; }
    if (layer1) layer1.style.opacity = '0';
    activeLayer = 2;
  } else {
    if (layer1) { layer1.style.backgroundImage = newBgUrl; layer1.style.opacity = '1'; }
    if (layer2) layer2.style.opacity = '0';
    activeLayer = 1;
  }
}
setInterval(triggerRandomBg, 12000);

// LAPTOP, FOLDER, STICKY & CALLOUT MODAL TOGGLES
function toggleLaptop() {
  const modal = document.getElementById('laptop-screen-modal');
  if (modal) modal.classList.toggle('hidden');
}

function toggleFolderModal() {
  const modal = document.getElementById('folder-files-modal');
  if (modal) modal.classList.toggle('hidden');
}

function closeFolderModal() {
  toggleFolderModal();
}

function toggleStickyNote() {
  const elem = document.getElementById('sticky-note');
  if (elem) elem.classList.toggle('hidden');
  renderStickyGoals();
}

function togglePlaylistCallout() {
  const games = document.getElementById('games-callout');
  const playlist = document.getElementById('playlist-callout');
  if (games) games.classList.add('hidden');
  if (playlist) playlist.classList.toggle('hidden');
}

function toggleGamesCallout() {
  const playlist = document.getElementById('playlist-callout');
  const games = document.getElementById('games-callout');
  if (playlist) playlist.classList.add('hidden');
  if (games) games.classList.toggle('hidden');
}

// STICKY NOTE GOALS LOGIC
let stickyGoals = ["Review Q3 Deliverables", "Send status update email"];

function handleStickyKeyPress(event) {
  if (event.key === 'Enter') addStickyGoal();
}

function addStickyGoal() {
  const input = document.getElementById('sticky-input');
  const val = input ? input.value.trim() : "";
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
  if (item) item.classList.toggle('completed');
}

function renderStickyGoals() {
  const list = document.getElementById('sticky-list');
  if (!list) return;
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

// POMODORO FOCUS DURATION
let durationMinutes = 25;
let pomoTimerInterval = null;
let pomoRemainingSeconds = 25 * 60;

function setTimerDuration(mins) {
  durationMinutes = mins;
  pomoRemainingSeconds = mins * 60;
  const btns = document.querySelectorAll('.preset-time-btns button, .pomo-option-btn');
  btns.forEach(b => b.classList.remove('active'));
  if (event && event.target) event.target.classList.add('active');
}

function selectPomoTime(mins, btnElem) {
  setTimerDuration(mins);
  if (btnElem) btnElem.classList.add('active');
}

function startFocusSession() {
  if (pomoTimerInterval) clearInterval(pomoTimerInterval);
  toggleFolderModal();
  showReactionPopup(`🎯 Pomodoro set for ${durationMinutes} minutes! Focus time started.`, 5000);

  pomoTimerInterval = setInterval(() => {
    pomoRemainingSeconds--;
    if (pomoRemainingSeconds <= 0) {
      clearInterval(pomoTimerInterval);
      showReactionPopup("🎉 Pomodoro Finished! Time for a break.", 7000);
    }
  }, 1000);
}

function startPomodoro() {
  startFocusSession();
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

// AUDIO CONTROLLER FUNCTIONS
function triggerAudioPlay() {
  const iframe = document.getElementById('yt-player');
  if (player && typeof player.playVideo === 'function') {
    player.playVideo();
  } else if (iframe && iframe.contentWindow) {
    iframe.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
  }
  isPlaying = true;
  const playIcon = document.getElementById('play-icon');
  if (playIcon) playIcon.innerText = '⏸️';
  startProgressTracker();
}

function triggerAudioPause() {
  const iframe = document.getElementById('yt-player');
  if (player && typeof player.pauseVideo === 'function') {
    player.pauseVideo();
  } else if (iframe && iframe.contentWindow) {
    iframe.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
  }
  isPlaying = false;
  const playIcon = document.getElementById('play-icon');
  if (playIcon) playIcon.innerText = '☕';
  stopProgressTracker();
}

// MAIN PAGE TRANSPARENT WHITE COUNTDOWN CLOCK & MILESTONES
function toggleShiftLog() {
  checkedIn = !checkedIn;
  localStorage.setItem('officeVibes_checkedIn', checkedIn);

  const tag = document.getElementById('shift-status-tag');
  const btn = document.getElementById('shift-btn');
  const breakBtn = document.getElementById('break-btn');
  const clockContainer = document.getElementById('main-shift-clock');

  if (checkedIn) {
    if (tag) { tag.innerText = '🟢 ON SHIFT'; tag.className = 'shift-tag status-in'; }
    if (btn) btn.innerText = '⏰ Log Check-Out';
    if (breakBtn) breakBtn.classList.remove('hidden');
    if (clockContainer) clockContainer.classList.remove('hidden');

    // Trigger Random Check-In Reaction Popup
    const checkInMsg = checkInPool[Math.floor(Math.random() * checkInPool.length)];
    showReactionPopup(checkInMsg, 5000);

    triggerAudioPlay();
    if (shiftTimer) clearInterval(shiftTimer);
    shiftTimer = setInterval(updateShiftLoop, 1000);
  } else {
    if (tag) { tag.innerText = '🔴 OFF SHIFT'; tag.className = 'shift-tag status-out'; }
    if (btn) btn.innerText = '⏰ Log Check-In';
    if (breakBtn) breakBtn.classList.add('hidden');
    if (clockContainer) clockContainer.classList.add('hidden');
    if (shiftTimer) clearInterval(shiftTimer);

    shiftSecs = 0;
    onBreak = false;
    localStorage.setItem('officeVibes_shiftSecs', 0);
    localStorage.setItem('officeVibes_onBreak', false);
    updateShiftClockDisplay();

    triggerAudioPause();
  }
}

function toggleBreakLog() {
  if (!checkedIn) return;
  onBreak = !onBreak;
  localStorage.setItem('officeVibes_onBreak', onBreak);

  const tag = document.getElementById('shift-status-tag');
  const breakBtn = document.getElementById('break-btn');

  if (onBreak) {
    if (tag) { tag.innerText = '☕ ON BREAK'; tag.className = 'shift-tag status-break'; }
    if (breakBtn) breakBtn.innerText = '▶️ End Break';
    triggerAudioPause();
  } else {
    if (tag) { tag.innerText = '🟢 ON SHIFT'; tag.className = 'shift-tag status-in'; }
    if (breakBtn) breakBtn.innerText = '☕ Take Break';
    
    // Trigger End Break Reaction
    const endBreakMsg = endBreakPool[Math.floor(Math.random() * endBreakPool.length)];
    showReactionPopup(endBreakMsg, 5000);

    triggerAudioPlay();
  }
}

function updateShiftLoop() {
  if (onBreak) return;

  shiftSecs++;
  localStorage.setItem('officeVibes_shiftSecs', shiftSecs);
  updateShiftClockDisplay();

  // Additional Milestone Popups
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
    const gharJaOverlay = document.getElementById('ghar-ja-overlay');
    if (gharJaOverlay) gharJaOverlay.classList.remove('hidden');
  }
}

function updateShiftClockDisplay() {
  const leftSecs = Math.max(0, SHIFT_TOTAL_SECONDS - shiftSecs);
  const lh = Math.floor(leftSecs / 3600).toString().padStart(2, '0');
  const lm = Math.floor((leftSecs % 3600) / 60).toString().padStart(2, '0');
  const ls = (leftSecs % 60).toString().padStart(2, '0');
  const clockElem = document.getElementById('countdown-front-text');
  if (clockElem) clockElem.innerText = `${lh}:${lm}:${ls}`;
}

function dismissGharJa() {
  const gharJaOverlay = document.getElementById('ghar-ja-overlay');
  if (gharJaOverlay) gharJaOverlay.classList.add('hidden');
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

// CUSTOM PLAYLIST ATTACHMENT
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
  const titleInput = document.getElementById('custom-task-name');
  const urlInput = document.getElementById('custom-yt-url');

  const titleVal = titleInput ? titleInput.value.trim() : "";
  const urlVal = urlInput ? urlInput.value.trim() : "";

  if (!titleVal || !urlVal) {
    alert("Please enter both a Vibe Name and YouTube Link.");
    return;
  }

  const parsed = parseYouTubeUrl(urlVal);
  if (!parsed) {
    alert("Invalid YouTube URL format!");
    return;
  }

  const newTrack = {
    id: parsed.id,
    type: parsed.type,
    title: titleVal,
    dept: parsed.type === 'playlist' ? "CUSTOM ALBUM" : "USER VIBE",
    url: urlVal,
    icon: parsed.type === 'playlist' ? "🎶" : "🎵"
  };

  playlists.push(newTrack);
  savedCustomTracks.push(newTrack);
  localStorage.setItem('officeVibes_customTracks', JSON.stringify(savedCustomTracks));

  if (titleInput) titleInput.value = "";
  if (urlInput) urlInput.value = "";

  togglePlaylistCallout();
  loadPlaylist(playlists.length - 1);
  alert(`"${titleVal}" added successfully!`);
}

function resetPlaylists() {
  localStorage.removeItem('officeVibes_customTracks');
  savedCustomTracks = [];
  playlists = [...defaultPlaylists];
  togglePlaylistCallout();
  loadPlaylist(0);
  alert("Playlists reset to default!");
}

// YOUTUBE API INTEGRATION & DOCK HYDRATION
function syncIframeTrack(index) {
  const item = playlists[index];
  if (!item) return;
  const iframe = document.getElementById('yt-player');
  if (iframe) {
    const targetSrc = item.type === 'playlist' 
      ? `https://www.youtube.com/embed/videoseries?list=${item.id}&enablejsapi=1`
      : `https://www.youtube.com/embed/${item.id}?enablejsapi=1`;
    
    if (!iframe.src.includes(item.id)) {
      iframe.src = targetSrc;
    }
  }
}

function updateDockUI(index) {
  currentIndex = index;
  localStorage.setItem('officeVibes_trackIndex', index);
  const item = playlists[index];
  if (!item) return;

  const randomTask = officeTasks[Math.floor(Math.random() * officeTasks.length)];

  const titleElem = document.getElementById('dock-title');
  const artistElem = document.getElementById('dock-artist');
  const artBox = document.getElementById('art-box');
  const externalLink = document.getElementById('yt-external-link');

  if (titleElem) titleElem.innerText = item.title || randomTask.title;
  if (artistElem) artistElem.innerText = item.dept || randomTask.dept;
  if (artBox) artBox.innerText = item.icon;
  if (externalLink) externalLink.href = item.url;

  syncIframeTrack(index);
}

function loadPlaylist(index) {
  updateDockUI(index);
  const item = playlists[index];

  if (player && typeof player.loadVideoById === 'function') {
    if (item.type === 'playlist' && typeof player.loadPlaylist === 'function') {
      player.loadPlaylist({ listType: 'playlist', list: item.id, index: 0, startSeconds: 0 });
    } else {
      player.loadVideoById(item.id);
    }
  }
  if (checkedIn) triggerAudioPlay();
}

function onYouTubeIframeAPIReady() {
  player = new YT.Player('yt-player', {
    height: '100%',
    width: '100%',
    videoId: playlists[currentIndex].id,
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

function onPlayerReady() { updateDockUI(currentIndex); }

function onPlayerStateChange(event) {
  const playIcon = document.getElementById('play-icon');
  if (event.data === YT.PlayerState.PLAYING) {
    isPlaying = true;
    if (playIcon) playIcon.innerText = '⏸️';
    startProgressTracker();
  } else {
    isPlaying = false;
    if (playIcon) playIcon.innerText = '☕';
    stopProgressTracker();
  }
}

function startProgressTracker() {
  stopProgressTracker();
  progressInterval = setInterval(() => {
    if (player && typeof player.getCurrentTime === 'function' && typeof player.getDuration === 'function') {
      const current = player.getCurrentTime() || 0;
      const duration = player.getDuration() || 0;
      if (duration > 0) {
        const pct = (current / duration) * 100;
        const fill = document.getElementById('progress-fill');
        const curTime = document.getElementById('time-current');
        const totTime = document.getElementById('time-total');

        if (fill) fill.style.width = `${pct}%`;
        if (curTime) curTime.innerText = formatTime(current);
        if (totTime) totTime.innerText = formatTime(duration);
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

let lampOn = false;
function toggleLamp() {
  lampOn = !lampOn;
  const btn = document.getElementById('lamp-btn');
  if (lampOn) {
    document.body.classList.add('lamp-warm-glow');
    if (btn) btn.innerText = '💡 Desk Lamp ON';
  } else {
    document.body.classList.remove('lamp-warm-glow');
    if (btn) btn.innerText = '💡 Desk Lamp OFF';
  }
}

// INITIALIZATION & EVENT LISTENERS
document.addEventListener('DOMContentLoaded', () => {
  triggerRandomBg();
  updateDockUI(currentIndex);
  updateShiftClockDisplay();
  startSentenceCycle();

  // Restore Shift State on Reload
  if (checkedIn) {
    const tag = document.getElementById('shift-status-tag');
    const btn = document.getElementById('shift-btn');
    const breakBtn = document.getElementById('break-btn');
    const clockContainer = document.getElementById('main-shift-clock');

    if (tag) { 
      tag.innerText = onBreak ? '☕ ON BREAK' : '🟢 ON SHIFT'; 
      tag.className = onBreak ? 'shift-tag status-break' : 'shift-tag status-in'; 
    }
    if (btn) btn.innerText = '⏰ Log Check-Out';
    if (breakBtn) {
      breakBtn.classList.remove('hidden');
      if (onBreak) breakBtn.innerText = '▶️ End Break';
    }
    if (clockContainer) clockContainer.classList.remove('hidden');
    if (!onBreak && !shiftTimer) {
      shiftTimer = setInterval(updateShiftLoop, 1000);
    }
  }

  // Coffee Play/Pause Button Listener with Check-In Guard
  const playBtn = document.getElementById('dock-play-btn');
  if (playBtn) {
    playBtn.onclick = () => {
      if (!checkedIn) {
        const shiftBtn = document.getElementById('shift-btn');
        if (shiftBtn) {
          shiftBtn.classList.remove('check-in-attention');
          void shiftBtn.offsetWidth; // Force reflow
          shiftBtn.classList.add('check-in-attention');
          setTimeout(() => shiftBtn.classList.remove('check-in-attention'), 850);
        }
        showReactionPopup("Check-In first to start your shift vibe! ⏰", 4000);
        return;
      }

      if (isPlaying) { triggerAudioPause(); } else { triggerAudioPlay(); }
    };
  }

  const nextBtn = document.getElementById('dock-next-btn');
  if (nextBtn) {
    nextBtn.onclick = () => {
      currentIndex = (currentIndex + 1) % playlists.length;
      loadPlaylist(currentIndex);
    };
  }

  const prevBtn = document.getElementById('dock-prev-btn');
  if (prevBtn) {
    prevBtn.onclick = () => {
      currentIndex = (currentIndex - 1 + playlists.length) % playlists.length;
      loadPlaylist(currentIndex);
    };
  }
});

updateDockUI(currentIndex);
