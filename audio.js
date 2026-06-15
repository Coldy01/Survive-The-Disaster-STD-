// Shared audio handler for button click sounds
(function() {
  // Create audio object for button sound
  const buttonSound = new Audio('audios/button.mp3');

  // Function to play button sound with rapid click handling
  function playButtonSound() {
    console.log('Playing button sound');
    // Reset audio to start if it's already playing (handles rapid clicks)
    if (!buttonSound.paused) {
      buttonSound.currentTime = 0;
    }
    // Play the sound (catch any errors silently)
    buttonSound.play().catch((e) => console.log('Button sound play failed:', e));
  }

  // Attach click event to all buttons on the page
  function attachButtonSounds() {
    const buttons = document.querySelectorAll('button');
    console.log('Attaching button sounds to', buttons.length, 'buttons');
    buttons.forEach(button => {
      button.addEventListener('click', playButtonSound);
    });
  }

  // Initialize when DOM is ready anti delay bebi
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', attachButtonSounds);
  } else {
    attachButtonSounds();
  }
})();

//cutie sound effect shesh 