// ==========================================
// TOUCH CONTROLS FOR MOBILE - Left/Right Arrows
// ==========================================

const TouchControls = {
  // Configuration
  buttonSize: 65,
  
  // State
  leftPressed: false,
  rightPressed: false,
  actionButtonPressed: false,
  
  // Initialize touch controls - Always show for mobile game
  init() {
    console.log('Touch controls: Initializing (Mobile Mode)...');
    this.createControls();
    this.bindEvents();
    // Always show controls for mobile game
    this.setVisible(true);
  },
  
  // Check if device supports touch
  isTouchDevice() {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  },
  
  // Check if on mobile-sized screen
  isMobileScreen() {
    return window.innerWidth <= 1024 || window.innerHeight <= 600;
  },
  
  // Create control elements
  createControls() {
    // Create container for touch controls
    const container = document.createElement('div');
    container.id = 'touch-controls';
    container.innerHTML = `
      <!-- Left-Right Arrow Control -->
      <div id="lr-control-area">
        <div id="left-arrow">←</div>
        <div id="right-arrow">→</div>
      </div>
      
      <!-- Action Button (E key) -->
      <button id="touch-action-btn" class="touch-btn">
        <span>E</span>
      </button>
      
      
    `;
    
    // Add to body
    document.body.appendChild(container);
    
    // Store references
    this.leftArrow = document.getElementById('left-arrow');
    this.rightArrow = document.getElementById('right-arrow');
    this.actionBtn = document.getElementById('touch-action-btn');
  },
  
  // Bind touch events
  bindEvents() {
    // Left arrow - touch events
    this.leftArrow.addEventListener('touchstart', (e) => this.handleLeftStart(e), { passive: false });
    this.leftArrow.addEventListener('touchend', (e) => this.handleLeftEnd(e), { passive: false });
    this.leftArrow.addEventListener('touchcancel', (e) => this.handleLeftEnd(e), { passive: false });
    
    // Right arrow - touch events
    this.rightArrow.addEventListener('touchstart', (e) => this.handleRightStart(e), { passive: false });
    this.rightArrow.addEventListener('touchend', (e) => this.handleRightEnd(e), { passive: false });
    this.rightArrow.addEventListener('touchcancel', (e) => this.handleRightEnd(e), { passive: false });
    
    // Left arrow - mouse events for desktop testing
    this.leftArrow.addEventListener('mousedown', (e) => this.handleLeftStart(e));
    this.leftArrow.addEventListener('mouseup', (e) => this.handleLeftEnd(e));
    this.leftArrow.addEventListener('mouseleave', (e) => this.handleLeftEnd(e));
    
    // Right arrow - mouse events for desktop testing
    this.rightArrow.addEventListener('mousedown', (e) => this.handleRightStart(e));
    this.rightArrow.addEventListener('mouseup', (e) => this.handleRightEnd(e));
    this.rightArrow.addEventListener('mouseleave', (e) => this.handleRightEnd(e));
    
    // Action button events
    this.actionBtn.addEventListener('touchstart', (e) => this.handleActionStart(e), { passive: false });
    this.actionBtn.addEventListener('touchend', (e) => this.handleActionEnd(e), { passive: false });
    this.actionBtn.addEventListener('touchcancel', (e) => this.handleActionEnd(e), { passive: false });
    this.actionBtn.addEventListener('mousedown', (e) => this.handleActionStart(e));
    this.actionBtn.addEventListener('mouseup', (e) => this.handleActionEnd(e));
    
    
    // Prevent default touch behaviors
    document.addEventListener('gesturestart', (e) => e.preventDefault(), { passive: false });
    document.addEventListener('gesturechange', (e) => e.preventDefault(), { passive: false });
    document.addEventListener('gestureend', (e) => e.preventDefault(), { passive: false });
  },
  
  // Handle left arrow touch start
  handleLeftStart(e) {
    e.preventDefault();
    if (this.leftPressed) return;
    
    this.leftPressed = true;
    this.leftArrow.classList.add('active');
    
    // Directly control movement - set player direction
    this.setMovementDirection('left');
    
    // Start game loop if not running
    if (typeof startGameLoop === 'function') {
      startGameLoop();
    }
  },
  
  // Handle left arrow touch end
  handleLeftEnd(e) {
    e.preventDefault();
    if (!this.leftPressed) return;
    
    this.leftPressed = false;
    this.leftArrow.classList.remove('active');
    
    // Clear movement direction
    this.clearMovementDirection('left');
  },
  
  // Handle right arrow touch start
  handleRightStart(e) {
    e.preventDefault();
    if (this.rightPressed) return;
    
    this.rightPressed = true;
    this.rightArrow.classList.add('active');
    
    // Directly control movement - set player direction
    this.setMovementDirection('right');
    
    // Start game loop if not running
    if (typeof startGameLoop === 'function') {
      startGameLoop();
    }
  },
  
  // Handle right arrow touch end
  handleRightEnd(e) {
    e.preventDefault();
    if (!this.rightPressed) return;
    
    this.rightPressed = false;
    this.rightArrow.classList.remove('active');
    
    // Clear movement direction
    this.clearMovementDirection('right');
  },
  
  // Set movement direction directly
  setMovementDirection(direction) {
    // Try to find game variables and set direction directly
    if (typeof player !== 'undefined') {
      if (direction === 'left') {
        player.velX = -player.speed;
        if (typeof lastDirection !== 'undefined') lastDirection = 'left';
        if (typeof startWalkAnimation === 'function') startWalkAnimation('left');
      } else if (direction === 'right') {
        player.velX = player.speed;
        if (typeof lastDirection !== 'undefined') lastDirection = 'right';
        if (typeof startWalkAnimation === 'function') startWalkAnimation('right');
      }
    }
    
    // Also set keys for any code that reads them - use exact key names
    this.setKeyState('a', direction === 'left');
    this.setKeyState('d', direction === 'right');
    this.setKeyState('ArrowLeft', direction === 'left');
    this.setKeyState('ArrowRight', direction === 'right');
  },
  
  // Clear movement direction
  clearMovementDirection(direction) {
    // Try to find game variables and stop movement
    if (typeof player !== 'undefined') {
      // Only stop if not moving in opposite direction
      if (direction === 'left' && !this.rightPressed) {
        player.velX = 0;
        if (typeof stopWalkAnimation === 'function') stopWalkAnimation();
      } else if (direction === 'right' && !this.leftPressed) {
        player.velX = 0;
        if (typeof stopWalkAnimation === 'function') stopWalkAnimation();
      } else if (direction === 'left' && this.rightPressed) {
        // Right is still pressed, switch direction
        player.velX = player.speed;
        if (typeof lastDirection !== 'undefined') lastDirection = 'right';
        if (typeof startWalkAnimation === 'function') startWalkAnimation('right');
      } else if (direction === 'right' && this.leftPressed) {
        // Left is still pressed, switch direction
        player.velX = -player.speed;
        if (typeof lastDirection !== 'undefined') lastDirection = 'left';
        if (typeof startWalkAnimation === 'function') startWalkAnimation('left');
      }
    }
    
    // Also update keys - use exact key names
    this.setKeyState('a', this.leftPressed);
    this.setKeyState('d', this.rightPressed);
    this.setKeyState('ArrowLeft', this.leftPressed);
    this.setKeyState('ArrowRight', this.rightPressed);
  },
  
  // Set key state in both game.keys and window.keys
  setKeyState(key, pressed) {
    // Try game.keys first (for game-logic.js), then fall back to global keys
    if (typeof game !== 'undefined' && game.keys) {
      game.keys[key] = pressed;
    }
    // Set global keys object used in HTML game files
    if (typeof keys !== 'undefined') {
      keys[key] = pressed;
    }
    // Also set on window for safety
    if (typeof window.keys !== 'undefined') {
      window.keys[key] = pressed;
    }
  },
  
  // Handle action button press
  handleActionStart(e) {
    e.preventDefault();
    if (this.actionButtonPressed) return;
    
    this.actionButtonPressed = true;
    this.actionBtn.classList.add('active');
    
    // Simulate E key press
    this.triggerKeyEvent('keydown', 'e');
    this.triggerKeyEvent('keydown', 'enter');
  },
  
  // Handle action button release
  handleActionEnd(e) {
    e.preventDefault();
    
    this.actionButtonPressed = false;
    this.actionBtn.classList.remove('active');
    
    // Simulate E key release
    this.triggerKeyEvent('keyup', 'e');
    this.triggerKeyEvent('keyup', 'enter');
  },
  
  // Trigger keyboard event (simulated)
  triggerKeyEvent(type, key) {
    const event = new KeyboardEvent(type, {
      key: key,
      code: key === 'enter' ? 'Enter' : 'KeyE',
      bubbles: true
    });
    document.dispatchEvent(event);
  },
  
  // Show/hide controls based on game state
  setVisible(visible) {
    const container = document.getElementById('touch-controls');
    if (container) {
      // Use flex for proper layout
      container.style.display = visible ? 'flex' : 'none';
    }
  }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  TouchControls.init();
});

// Export for global use
window.TouchControls = TouchControls;
