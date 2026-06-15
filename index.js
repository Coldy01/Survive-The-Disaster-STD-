// script.js

const bgm = document.getElementById('bgm');
const muteBtn = document.querySelector('.mute-btn');
const volumeSlider = document.getElementById('volumeSlider');
// const musicToggle = document.getElementById('musicToggle'); // Commented out - element doesn't exist

let isMuted = false;
let hasInteracted = false;

// Start music on user interaction (required by some browsers)
function startMusicOnce() {
  if (!hasInteracted) {
    hasInteracted = true;
    if (!isMuted) {
      bgm.volume = volumeSlider.value;
      bgm.play().catch(e => console.warn('Music play blocked:', e));
    }
  }
}

// Toggle mute/unmute audio
function toggleAudio() {
  isMuted = !isMuted;
  bgm.muted = isMuted;
  muteBtn.textContent = isMuted ? '🔇 Unmute' : '🔊 Mute';
  // if (musicToggle) musicToggle.checked = !isMuted; // Commented out - element doesn't exist
}

// Adjust volume from slider
function changeVolume() {
  bgm.volume = volumeSlider.value;
  if (bgm.volume == 0) {
    isMuted = true;
    bgm.muted = true;
    muteBtn.textContent = '🔇 Unmute';
    musicToggle.checked = false;
  } else {
    isMuted = false;
    bgm.muted = false;
    muteBtn.textContent = '🔊 Mute';
    musicToggle.checked = true;
  }
}

// Toggle audio from settings checkbox
function toggleAudioFromCheckbox() {
  isMuted = !musicToggle.checked;
  bgm.muted = isMuted;
  muteBtn.textContent = isMuted ? '🔇 Unmute' : '🔊 Mute';
}

function showOverlay(id) {
  const overlay = document.getElementById(id);
  const backdrop = document.getElementById('overlayBackdrop');

  overlay.classList.add('show');
  backdrop.classList.add('show');
  overlay.focus();
  startMusicOnce();

  // Disable all menu buttons except the one that opened this overlay
  const buttons = document.querySelectorAll('.menu-button');
  buttons.forEach(btn => {
    // If this button's onclick opens this overlay, keep it enabled, else disable
    const opensThisOverlay = btn.getAttribute('onclick')?.includes(`showOverlay('${id}')`);
    btn.disabled = !opensThisOverlay;
  });
}

function hideOverlay(id) {
  const overlay = document.getElementById(id);
  const backdrop = document.getElementById('overlayBackdrop');

  overlay.classList.remove('show');
  backdrop.classList.remove('show');

  // Re-enable all menu buttons when overlay closes
  const buttons = document.querySelectorAll('.menu-button');
  buttons.forEach(btn => btn.disabled = false);
}


// Fullscreen toggle with state persistence
function toggleFullscreen() {
  const isFullscreen = !!document.fullscreenElement;

  if (!isFullscreen) {
    document.documentElement.requestFullscreen().catch(err => {
      alert(`Error enabling fullscreen: ${err.message}`);
    });
    localStorage.setItem('fullscreenMode', 'true');
  } else {
    document.exitFullscreen();
    localStorage.setItem('fullscreenMode', 'false');
  }
}

// Initialize fullscreen state on page load
function initializeFullscreenState() {
  const savedFullscreenState = localStorage.getItem('fullscreenMode');

  // Listen for fullscreen changes to update localStorage
  document.addEventListener('fullscreenchange', () => {
    const isCurrentlyFullscreen = !!document.fullscreenElement;
    localStorage.setItem('fullscreenMode', isCurrentlyFullscreen.toString());
  });

  // If user was in fullscreen before and page supports it, try to restore
  if (savedFullscreenState === 'true' && !document.fullscreenElement) {
    // Only attempt to restore if not already in fullscreen
    setTimeout(() => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {
          // Silently fail if fullscreen is not available
        });
      }
    }, 100);
  }
}

// Initialize
window.onload = () => {
  bgm.volume = volumeSlider.value;
  bgm.muted = false;
  muteBtn.textContent = '🔊 Mute';
  bgm.play().catch(() => {
    /* Auto play blocked, wait for user */
  });

  // Initialize fullscreen state
  initializeFullscreenState();
};

// Event listeners for controls
volumeSlider.addEventListener('input', changeVolume);
// musicToggle.addEventListener('change', toggleAudioFromCheckbox); // Commented out - element doesn't exist
document.body.addEventListener('click', startMusicOnce);
document.body.addEventListener('keydown', startMusicOnce);