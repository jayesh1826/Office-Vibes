const defaultPlaylists = [
  { id: "qg3X8fKCtZo", title: "Coffee Shop Lo-Fi Flow", dept: "COMMUNICATION & INBOX", url: "https://music.youtube.com/watch?v=qg3X8fKCtZo", icon: "☕", type: "video" },
  { id: "pIvf9bOPXIw", title: "Task 01: Deep Focus Synthwave", dept: "ENGINEERING & TECH", url: "https://music.youtube.com/watch?v=pIvf9bOPXIw", icon: "💻", type: "video" },
  { id: "HLADXoAflHk", title: "Task 03: Chill Ambient Focus", dept: "FINANCE & REPORTING", url: "https://music.youtube.com/watch?v=HLADXoAflHk", icon: "📑", type: "video" }
];

// Restore custom tracks from localStorage
let savedCustomTracks = JSON.parse(localStorage.getItem('officeVibes_customTracks')) || [];
let playlists = [...defaultPlaylists, ...savedCustomTracks];

const funIcons = ["💡", "💻", "☕", "🚀", "🎉", "📑", "📊", "🔥", "🎧"];

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
  "Iss point ko abhi park kar dete hain, baad mein dekhenge."
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

// State persistence
let storedIndex = parseInt(localStorage.getItem('officeVibes_trackIndex'));
let currentIndex = (!isNaN(storedIndex) && storedIndex >= 0 && storedIndex < playlists.length) ? storedIndex : 0;

let checkedIn = localStorage.getItem('officeVibes_checkedIn') === 'true';
let onBreak = localStorage.getItem('officeVibes_onBreak') === 'true';
let shiftSecs = parseInt(localStorage.getItem('officeVibes_shiftSecs')) || 0;
let shiftTimer = null;
const SHIFT_TOTAL_SECONDS = 8 * 3600;

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
}

// BACKGROUND SLIDESHOW LOGIC
let currentBgIndex = 0;
let activeLayer = 1;

function setSpecificBg(imagePath) {
  const newBgUrl = `url('${imagePath}')`;
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
  const elem = document.getElementById('sticky-note');
  if (elem) elem.classList.toggle('hidden');
  renderStickyGoals();
}

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

function toggleLaptop() {
  const modal = document.getElementById('laptop-screen-modal');
  if (modal) modal.classList.toggle('hidden');
}

function toggleFolderModal() {
  const modal = document.getElementById('folder-files-modal');
  if (modal) modal.classList.toggle('hidden');
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

// LAMP TOGGLE
let lampOn = false;
function toggleLamp() {
  lampOn = !lampOn;
  const btn = document.getElementById('lamp-btn');
  const artContainer = document.querySelector('.dock-art');
  const artBox = document.getElementById('art-box');

  const randomIcon = funIcons[Math.floor(Math.random() * funIcons.length)];
  if (artBox) artBox.innerText = randomIcon;

  if (artBox) {
    artBox.classList.add('pop-anim');
    setTimeout(() => artBox.classList.remove('pop-anim'), 300);
  }

  if (lampOn) {
    document.body.classList.add('lamp-warm-glow');
    if (artContainer) artContainer.classList.add('flashlight-active');
    if (btn) btn.innerText = '💡 Desk Lamp ON';
  } else {
    document.body.classList.remove('lamp-warm-glow');
    if (artContainer) artContainer.classList.remove('flashlight-active');
    if (btn) btn.innerText = '💡 Desk Lamp OFF';
  }
}

// CUSTOM PLAYLIST / TRACK ADDITION LOGIC
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

// TRACK SYNC & HYDRATION
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

  const titleElem = document.getElementById('dock-title');
  const artistElem = document.getElementById('dock-artist');
  const artBox = document.getElementById('art-box');
  const externalLink = document.getElementById('yt-external-link');

  if (titleElem) titleElem.innerText = item.title;
  if (artistElem) artistElem.innerText = item.dept;
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
}

// YOUTUBE API INTEGRATION
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

function onPlayerReady() {
  updateDockUI(currentIndex);
}

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
    if (player && player.getCurrentTime && player.getDuration) {
      const current = player.getCurrentTime();
      const duration = player.getDuration();
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

// 8 HOUR SHIFT TIMER & PERSISTENCE
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

    setSpecificBg(bgCheckIn);

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

  if (shiftSecs === 28200) {
    setSpecificBg(bgNearEnd);
    showReactionPopup("Almost 7:50 completed! Time to wrap up!", 6000);
  } else if (shiftSecs >= SHIFT_TOTAL_SECONDS) {
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

let popupTimeout = null;
function showReactionPopup(text, duration = 5000) {
  playOverlayNotificationSound();
  const popup = document.getElementById('reaction-popup');
  const textElem = document.getElementById('reaction-text');
  if (!popup || !textElem) return;

  textElem.innerText = `"${text}"`;
  popup.classList.remove('hidden');

  if (popupTimeout) clearTimeout(popupTimeout);
  popupTimeout = setTimeout(() => popup.classList.add('hidden'), duration);
}

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

// DOM INITIALIZATION
document.addEventListener('DOMContentLoaded', () => {
  // 1. Instantly set first background image to eliminate black screen gap
  const layer1 = document.getElementById('bg-layer-1');
  if (layer1) layer1.style.backgroundImage = `url('${bgImages[0]}')`;

  // 2. Hydrate UI track title and iframe
  updateDockUI(currentIndex);
  updateShiftClockDisplay();
  startSentenceCycle();

  // 3. Restore Shift State on refresh
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

  // 4. Attach Dock Control Listeners
  const playBtn = document.getElementById('dock-play-btn');
  if (playBtn) {
    playBtn.addEventListener('click', () => {
      if (isPlaying) { triggerAudioPause(); } else { triggerAudioPlay(); }
    });
  }

  const nextBtn = document.getElementById('dock-next-btn');
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      let nextIndex = (currentIndex + 1) % playlists.length;
      loadPlaylist(nextIndex);
    });
  }

  const prevBtn = document.getElementById('dock-prev-btn');
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      let prevIndex = (currentIndex - 1 + playlists.length) % playlists.length;
      loadPlaylist(prevIndex);
    });
  }
});

// Immediate track UI hydration at script load
updateDockUI(currentIndex);
