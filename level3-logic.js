// Level 3 Logic - Scenario-Specific Logic
let playerHP = 100;
let enemyHP = 100;
let currentScenario = 0;

// Detect which scenario file is being used
let currentScenarioType = "earthquake"; // default
if (window.location.pathname.includes('3f.html')) {
    currentScenarioType = "fire";
}

let currentRound = 1; // 1 for earthquake scenarios, 2 for fire scenarios

let timeLeft = 15;
let timerInterval = null;
let typingInterval = null;
let choiceLock = false;
let paused = false;
let musicOn = true;
let timerPausedForChoice = false;
let playerBarFaded = false;
let enemyBarFaded = false;
let gameWon = false;

// Using normal difficulty only
let difficulty = "normal";

// --- EARTHQUAKE SCENARIOS (ROUND 1) ---
const scenariosRound1 = [
    {
        situation: "My aftershocks send debris raining down as you flee outside, the ground still unstable beneath your feet. WHAT WOULD YOU DO?!",
        bg: "url('images/round1.png')",
        good: ["find an open area away from buildings", "go back inside"],
        choices: [
            { text: "find an open area away from buildings" },
            { text: "hide beside a crumbling wall" },
            { text: "go back inside" }
        ]
    },
    {
        situation: "My shaking has stopped, but the ground remains scarred by my power. Will you listen to the authorities' guidance, or ignore the warnings?",
        bg: "url('images/round1.png')",
        good: ["listen to the authorities' guidance",],
        choices: [
            { text: "listen to the authorities' guidance" },
            { text: "ignore the warnings" },
            { text: "go back inside" }
        ]
    },
     {
        situation: "The rescuers said that you should stay alert for aftershocks.",
        bg: "url('images/round1.png')",
        good: ["listen to the rescuers",],
        choices: [
            { text: "listen to the rescuers" },
            { text: "ignore the warnings" },
            { text: "go home, without waiting for confirmation" }
        ]
    }
];

// --- FIRE SCENARIOS (ROUND 2) ---
const scenariosRound2 = [
    {
        situation: "I rage through the hallway with sparks and flames from broken wires, my heat warping the air around you. Will you move away from the sparks to safety, or stand and watch my destructive dance?",
        bg: "url('images/round2.png')",
        good: ["move away from the sparks to safety", "use a fire extinguisher"],
        choices: [
            { text: "move away from the sparks to safety" },
            { text: "stand and watch my destructive dance" },
            { text: "use a fire extinguisher" }
        ]
    },
    {
        situation: "My thick smoke billows down the stairwell, choking the air and hiding dangers in my dark embrace. Will you grab the extinguisher to fight me back, or rush blindly into my smoky trap?",
        bg: "url('images/round2.png')",
        good: ["grab the extinguisher to fight me back", "hide in the classroom"],
        choices: [
            { text: "grab the extinguisher to fight me back" },
            { text: "rush blindly into my smoky trap" },
            { text: "hide in the classroom" }
        ]
    },
    {
        situation: "You escape to the rooftop where I spread across the sports field below, my flames licking hungrily at the edges. Will you head to the helipad for rescue, or climb the water tower in foolish curiosity?",
        bg: "url('images/round2.png')",
        good: ["head to the helipad for rescue", "follow evacuation orders"],
        choices: [
            { text: "head to the helipad for rescue" },
            { text: "climb the water tower in foolish curiosity" },
            { text: "follow evacuation orders" }
        ]
    },
    {
        situation: "A rescue helicopter hovers above, but my winds and heat buffet you on the exposed rooftop. Will you signal the crew desperately, or run toward the edge in panic?",
        bg: "url('images/round2.png')",
        good: ["signal the crew desperately", "stay low and brace"],
        choices: [
            { text: "signal the crew desperately" },
            { text: "run toward the edge in panic" },
            { text: "stay low and brace" }
        ]
    },
    {
        situation: "You're sheltered in a gym, but I burned a classmate's hands with my cruel touch, their panic feeding my chaos. Will you calm them and apply cool water, or run outside into my waiting flames?",
        bg: "url('images/round2.png')",
        good: ["calm them and apply cool water", "find an adult for first aid"],
        choices: [
            { text: "calm them and apply cool water" },
            { text: "run outside into my waiting flames" },
            { text: "find an adult for first aid" }
        ]
    },
    {
        situation: "Buses wait to carry you away, but I jammed the roads with my burning debris, smoke rising on the horizon. Will you help clear small debris to escape, or board recklessly?",
        bg: "url('images/round2.png')",
        good: ["help clear small debris to escape", "stay with your group"],
        choices: [
            { text: "help clear small debris to escape" },
            { text: "board recklessly" },
            { text: "stay with your group" }
        ]
    },
    {
        situation: "My flames still threaten from the horizon as buses offer salvation, but debris blocks the path I created. Will you stay with your group for safety, or act impulsively in my smoky haze?",
        bg: "url('images/round2.png')",
        good: ["stay with your group for safety"],
        choices: [
            { text: "help clear debris" },
            { text: "board without caution" },
            { text: "stay with your group for safety" }
        ]
    }
];
// --- TIMER ---
// Simplified timer for normal difficulty only
function startTimer() {
    clearInterval(timerInterval);
    timeLeft = 15; // Normal difficulty timer
    document.getElementById('timer').textContent = `Time Left: ${timeLeft}s`;

    timerInterval = setInterval(() => {
        if (paused || timerPausedForChoice) return;
        if (playerHP <= 0 || enemyHP <= 0) {
            clearInterval(timerInterval);
            return;
        }
        timeLeft--;
        document.getElementById('timer').textContent = `Time Left: ${timeLeft}s`;

        if (timeLeft <= 0) {
            clearInterval(timerInterval);

            // Stop background audio if playing
            const bgAudioId = currentScenarioType === "earthquake" ? 'firstRoundBg' : 'secondRoundBg';
            const bgAudio = document.getElementById(bgAudioId);
            if (bgAudio && !bgAudio.paused) {
                bgAudio.pause();
            }

            // Set playerHP to 0 to trigger defeat logic
            playerHP = 0;
            updateHPBars();

            // Trigger player defeat animation when time runs out
            stopPlayerAnimation();
            showPlayerDefeatedFrame();

            // Hide player HP bar
            if (!playerBarFaded) {
                playerBarFaded = true;
                const playerBar = document.querySelector('.player-hp-bar');
                playerBar.classList.add('fade-out');
                setTimeout(() => playerBar.style.display = 'none', 750);
            }

            gameWon = false; // Mark as defeat

            typeText("Time's up! The disaster overwhelms you.", () => {
                console.log('Timer expired, calling showEndButton'); // Debug log
                showEndButton("ACCEPT YOUR FATE");
            });
        }
    }, 1000);
}

// --- HP BARS ---
function updateHPBars() {
    const playerHPBar = document.getElementById('playerHP');
    playerHPBar.style.width = Math.max(playerHP, 0) + "%";
    if (playerHP > 50) {
        playerHPBar.style.background = "linear-gradient(90deg, #44ff44 0%, #228822 100%)";
    } else if (playerHP > 25) {
        playerHPBar.style.background = "linear-gradient(90deg, #fff700 0%, #ffae00 100%)";
    } else {
        playerHPBar.style.background = "linear-gradient(90deg, #ff4444 0%, #b80000 100%)";
    }

    const enemyHPBar = document.getElementById('enemyHP');
    enemyHPBar.style.width = Math.max(enemyHP, 0) + "%";
    if (enemyHP > 50) {
        enemyHPBar.style.background = "linear-gradient(90deg, #44ff44 0%, #228822 100%)";
    } else if (enemyHP > 25) {
        enemyHPBar.style.background = "linear-gradient(90deg, #fff700 0%, #ffae00 100%)";
    } else {
        enemyHPBar.style.background = "linear-gradient(90deg, #ff4444 0%, #b80000 100%)";
    }
}

// --- TYPEWRITER ---
function typeText(text, onComplete, initialText = "") {
    clearInterval(typingInterval);
    const contentEl = document.getElementById('text-content');
    contentEl.textContent = initialText;
    let idx = 0;

    typingInterval = setInterval(() => {
        if (paused) return;  // Pause typing if game is paused
        contentEl.textContent += text[idx++];
        if (idx >= text.length) {
            clearInterval(typingInterval);
            onComplete && onComplete();
        }
    }, 30);
}

// --- SHOW SCENARIO ---
// Scenario selection based on file type
function showScenario(i) {
    choiceLock = false;
    let s;

    if (currentScenarioType === "earthquake") {
        s = scenariosRound1[i]; // Only earthquake scenarios for 3e.html
    } else if (currentScenarioType === "fire") {
        s = scenariosRound2[i]; // Only fire scenarios for 3f.html
    }
    document.body.style.backgroundImage = s.bg;

    // Set disaster name as initial text
    const disasterName = currentScenarioType === "earthquake" ? "Earthquake: " : "Fire: ";

    const choices = document.getElementById('choicesArea');
    choices.classList.add('hidden');
    choices.innerHTML = "";

    typeText(s.situation, () => {
        s.choices.forEach(choice => {
            const btn = document.createElement('button');
            btn.textContent = choice.text;
            btn.onclick = () => {
                if (choiceLock) return;
                choiceLock = true;
                Array.from(choices.children).forEach(b => b.disabled = true);
                pauseTimerForChoice();
                setTimeout(() => makeChoice(s.good.includes(choice.text)), 700);
            };
            choices.appendChild(btn);
        });
        choices.classList.remove('hidden');
    }, disasterName);
}

// --- PAUSE TIMER FOR CHOICE ---
function pauseTimerForChoice() {
    timerPausedForChoice = true;
    setTimeout(() => {
        timerPausedForChoice = false;
    }, 3000);
}

// --- CHOICE LOGIC ---
// Simplified damage for normal difficulty only
function makeChoice(isGood) {
    let damage = 50; // Normal difficulty damage

    const overlay = document.getElementById('effectOverlay');

    if (isGood) {
        enemyHP -= damage;

        // Flash enemy if choice is good
        const enemyEl = currentScenarioType === "earthquake" ?
            document.getElementById("enemy-animation") :
            document.getElementById("enemy2-animation");
        enemyEl.classList.add("flash");
        setTimeout(() => enemyEl.classList.remove("flash"), 400);

        // Add success flash
        overlay.classList.add('success-flash');
        setTimeout(() => overlay.classList.remove('success-flash'), 300);

        typeText("It's effective! Disaster is weakened!", () => {
            setTimeout(() => {
                proceedAfterChoice(isGood);
            }, 1000);
        });
    } else {
        playerHP -= damage;
        document.querySelector(".battlefield").classList.add("shake-medium");
        setTimeout(() => document.querySelector(".battlefield").classList.remove("shake-medium"), 400);

        // Add damage flash
        overlay.classList.add('damage-flash');
        setTimeout(() => overlay.classList.remove('damage-flash'), 500);

        typeText("Bad move! You got hurt!", () => {
            setTimeout(() => {
                proceedAfterChoice(isGood);
            }, 1000);
        });
    }
    updateHPBars();
}

// --- PROCEED AFTER CHOICE ---
function proceedAfterChoice(isGood) {
    const overlay = document.getElementById('effectOverlay');

    // Check defeated animations
    if (playerHP <= 0) {
        stopPlayerAnimation();
        showPlayerDefeatedFrame();
        // Add defeat flash
        overlay.classList.add('damage-flash');
        setTimeout(() => overlay.classList.remove('damage-flash'), 500);
    }
    if (enemyHP <= 0) {
        if (currentScenarioType === "earthquake") {
            stopEnemyAnimation();
            showEnemy1DefeatedFrame();
        } else {
            stopEnemy2Animation();
            showEnemy2DefeatedFrame();
        }
        // Add victory flash
        overlay.classList.add('victory-flash');
        setTimeout(() => overlay.classList.remove('victory-flash'), 800);
    }

    // Trigger fade-out on HP bars if HP reaches zero
    if (playerHP <= 0 && !playerBarFaded) {
        playerBarFaded = true;
        const playerBar = document.querySelector('.player-hp-bar');
        playerBar.classList.add('fade-out');
        setTimeout(() => playerBar.style.display = 'none', 750);
    }
    if (enemyHP <= 0 && !enemyBarFaded) {
        enemyBarFaded = true;
        const enemyBar = document.querySelector('.enemy-hp-bar');
        enemyBar.classList.add('fade-out');
        setTimeout(() => enemyBar.style.display = 'none', 750);
    }

    // Check win/lose
    console.log('Checking HP values - Player:', playerHP, 'Enemy:', enemyHP); // Debug log

    if (enemyHP <= 0) {
        console.log('Victory condition met!'); // Debug log
        // Stop background audio if playing
        const bgAudioId = currentScenarioType === "earthquake" ? 'firstRoundBg' : 'secondRoundBg';
        const bgAudio = document.getElementById(bgAudioId);
        if (bgAudio && !bgAudio.paused) {
            bgAudio.pause();
        }
        gameWon = true; // Mark as victory

        // Show victory message based on scenario type
        const victoryMessage = currentScenarioType === "earthquake"
            ? "You overcame the earthquake! Scenario completed!"
            : "You overcame the fire! Scenario completed!";

        typeText(victoryMessage, () => {
            console.log('About to call showEndButton for victory'); // Debug log
            showEndButton("COMPLETE");
        });
        return;
    }

    // Check defeat
    if (playerHP <= 0) {
        console.log('Defeat condition met!'); // Debug log
        // Stop background audio if playing
        const bgAudioId = currentScenarioType === "earthquake" ? 'firstRoundBg' : 'secondRoundBg';
        const bgAudio = document.getElementById(bgAudioId);
        if (bgAudio && !bgAudio.paused) {
            bgAudio.pause();
        }
        gameWon = false; // Mark as defeat
        typeText("You lost!!", () => {
            console.log('About to call showEndButton for defeat'); // Debug log
            showEndButton("ACCEPT YOUR FATE");
        });
        return;
    }

    // Advance scenario
    currentScenario++;
    let scenarioArr;

    if (currentScenarioType === "earthquake") {
        scenarioArr = scenariosRound1; // Only earthquake scenarios for 3e.html
    } else if (currentScenarioType === "fire") {
        scenarioArr = scenariosRound2; // Only fire scenarios for 3f.html
    }
    if (currentScenario < scenarioArr.length) {
        setTimeout(() => showScenario(currentScenario), 800);
    }
}

// --- END/RESTART BUTTONS ---
function showEndButton(label) {
    console.log('showEndButton called with label:', label); // Debug log

    // Ensure DOM is ready
    if (document.readyState !== 'complete') {
        console.log('DOM not ready, waiting...');
        document.addEventListener('DOMContentLoaded', () => showEndButton(label));
        return;
    }

    const choices = document.getElementById('choicesArea');
    console.log('choices element found:', choices); // Debug log

    if (!choices) {
        console.error('choicesArea element not found!');
        // Try to find it after a short delay
        setTimeout(() => {
            const retryChoices = document.getElementById('choicesArea');
            if (retryChoices) {
                showEndButton(label);
            } else {
                console.error('choicesArea still not found after retry!');
            }
        }, 100);
        return;
    }

    if (label === "COMPLETE") {
        // Mark level 3 as completed and unlock level 4
        markLevelCompleted();

        // Navigate to chapters.html to show updated progression
        choices.innerHTML = `<button onclick="window.location.href='chapters.html'" style="background: #4CAF50; color: white; padding: 15px 30px; font-size: 16px; border: none; border-radius: 5px; cursor: pointer; font-family: 'Press Start 2P', monospace;">${label}</button>`;
    } else {
        // For defeat scenarios, go to chapters.html
        choices.innerHTML = `<button onclick="window.location.href='chapters.html'" style="background: #f44336; color: white; padding: 15px 30px; font-size: 16px; border: none; border-radius: 5px; cursor: pointer; font-family: 'Press Start 2P', monospace;">${label}</button>`;
    }

    choices.classList.remove('hidden');
    choices.style.display = 'block'; // Force display
    console.log('Button created and shown, final HTML:', choices.innerHTML); // Debug log
}

// Function to mark level 3 as completed and unlock level 4
function markLevelCompleted() {
    // Use the global markLevelCompleted function from chapters.html if available
    if (window.markLevelCompleted) {
        window.markLevelCompleted('Earthquake', 3);
    } else {
        // Fallback: directly update localStorage if markLevelCompleted is not available
        updateLevelProgressFallback('Earthquake', 3);

        // Also try to call markLevelCompleted after a short delay in case chapters.html loads later
        setTimeout(() => {
            if (window.markLevelCompleted) {
                window.markLevelCompleted('Earthquake', 3);
            }
        }, 100);
    }
}

// Fallback function for when chapters.html progression system is not loaded
function updateLevelProgressFallback(track, level) {
    const saved = localStorage.getItem('escape-the-disaster-track-progress');
    let trackStates = {};

    if (saved) {
        trackStates = JSON.parse(saved);
    } else {
        trackStates = {
            Earthquake: { 1: 'unlocked', 2: 'locked', 3: 'locked', 4: 'locked', 5: 'locked' },
            Fire: { isUnlocked: false, levels: { 1: 'locked', 2: 'locked', 3: 'locked', 4: 'locked', 5: 'locked' } }
        };
    }

    if (trackStates[track]) {
        if (trackStates[track].levels) {
            trackStates[track].levels[level] = 'completed';
        } else {
            trackStates[track][level] = 'completed';
        }
    }

    // Unlock next level if exists
    const nextLevel = level + 1;
    if (nextLevel <= 5) {
        if (trackStates[track].levels) {
            trackStates[track].levels[nextLevel] = 'unlocked';
        } else {
            trackStates[track][nextLevel] = 'unlocked';
        }
    }

    // Unlock Fire track when completing level 4
    if (level >= 4) {
        trackStates.Fire.isUnlocked = true;
        trackStates.Fire.levels[1] = 'unlocked';
    }

    localStorage.setItem('escape-the-disaster-track-progress', JSON.stringify(trackStates));
}

// Next round button removed - single scenario per file

// Round transition removed - each file handles only one scenario type
function takeObject() {
    // Add red flash effect
    const overlay = document.getElementById('effectOverlay');
    overlay.classList.add('damage-flash');
    setTimeout(() => {
        overlay.classList.remove('damage-flash');
        // Show victory message for single scenario completion
        typeText("Scenario completed! Well done!", () => {
            showEndButton("COMPLETE");
        });
    }, 500);
}

// Round 2 logic removed - single scenario per file

// --- CUTSCENE LOGIC ---
function showCutscene() {
    const cutscene = document.getElementById('cutscene');
    cutscene.style.display = 'flex';
    cutscene.style.opacity = '1';
    cutscene.classList.remove('fade-out');
    cutscene.style.cursor = 'pointer'; // Make sure cursor shows it's clickable
    cutscene.tabIndex = 0; // Make focusable for keyboard events
    cutscene.focus(); // Focus the cutscene for keyboard events

    // Handle audio based on scenario type
    if (currentScenarioType === "earthquake") {
        const audio1 = document.getElementById('firstRoundCutscene');
        if (audio1) {
            audio1.currentTime = 0;
            audio1.play().catch(e => console.log('Audio play failed:', e));
        }
    } else if (currentScenarioType === "fire") {
        const audio2 = document.getElementById('secondRoundCutscene');
        if (audio2) {
            audio2.currentTime = 0;
            const playPromise = audio2.play();
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    console.log('Fire scenario audio started playing successfully');
                }).catch(e => {
                    console.log('Fire scenario audio play failed:', e);
                });
            }
        }
    }

    function startGameFromCutscene(event) {
        event.preventDefault();
        event.stopPropagation();

        // Add fade-out class for smooth transition
        cutscene.classList.add('fade-out');

        // Hide cutscene and start game after fade animation completes
        setTimeout(() => {
            cutscene.style.display = 'none';
            cutscene.classList.remove('fade-out');

            // Start the game immediately after cutscene fades
            startTimer();
            showScenario(0);
        }, 750); // Match CSS animation duration (0.75s)

        // Remove event listeners
        cutscene.removeEventListener('keydown', startGameFromCutscene);
        cutscene.removeEventListener('click', startGameFromCutscene);

        if (currentScenarioType === "earthquake") {
            document.getElementById('firstRoundCutscene').pause();
            document.getElementById('firstRoundBg').currentTime = 0;
            if (musicOn) document.getElementById('firstRoundBg').play();
        } else if (currentScenarioType === "fire") {
            const audio2 = document.getElementById('secondRoundCutscene');
            if (audio2 && !audio2.paused && audio2.currentTime > 0) {
                audio2.pause();
            }
        }
    }
    cutscene.addEventListener('keydown', startGameFromCutscene);
    cutscene.addEventListener('click', startGameFromCutscene);
}




// --- ANIMATION SYSTEM ---
function createAnimation(selector, intervalTime, loop = true, loopLength = null) {
    const frames = document.querySelectorAll(selector);
    let idx = 0;
    const length = loopLength || frames.length;
    const interval = setInterval(() => {
        frames.forEach((img, i) => img.style.display = (i === idx ? 'block' : 'none'));
        if (idx === length - 1 && !loop) {
            clearInterval(interval);
            return;
        }
        idx = (idx + 1) % length;
    }, intervalTime);
    return interval;
}

// PLAYER ANIMATION
const playerFrames = document.querySelectorAll('#player .player-frame');
let playerAnimInterval = createAnimation('#player .player-frame:not(.defeated)', 200, true);

// ENEMY 1 ANIMATION (EARTHQUAKE)
const enemyFrames = document.querySelectorAll('#enemy-animation .enemy-frame:not(.defeated)');
let enemyAnimInterval = createAnimation('#enemy-animation .enemy-frame:not(.defeated)', 400);

// ENEMY 2 ANIMATION (FIRE)
const enemy2Frames = document.querySelectorAll('#enemy2-animation .enemy2-frame:not(.defeated)');
let enemy2AnimInterval = createAnimation('#enemy2-animation .enemy2-frame:not(.defeated)', 400);

// --- DEFEAT ANIMATIONS ---
let enemy1DefeatedAnimInterval = null;
let enemy2DefeatedAnimInterval = null;
let playerEarthquakeDefeatedInterval = null;
let playerFireDefeatedInterval = null;

function stopPlayerAnimation() {
    clearInterval(playerAnimInterval);
}

function showPlayerDefeatedAnimation() {
    // Stop normal player animation
    clearInterval(playerAnimInterval);

    // Hide all normal player frames
    const normalFrames = document.querySelectorAll('#player .player-frame:not(.defeated)');
    normalFrames.forEach(img => {
        img.style.display = 'none';
    });

    // Determine which defeat animation to show based on scenario type
    if (currentScenarioType === "earthquake") {
        // Earthquake defeat animation (Enemy 1)
        showEarthquakeDefeatedAnimation();
    } else if (currentScenarioType === "fire") {
        // Fire defeat animation (Enemy 2)
        showFireDefeatedAnimation();
    }
}

function showEarthquakeDefeatedAnimation() {
    // Hide fire defeat frames
    document.querySelectorAll('#player .player-frame.defeated.fire').forEach(img => {
        img.style.display = 'none';
    });

    // Show first frame immediately
    const earthquakeFrames = document.querySelectorAll('#player .player-frame.defeated.earthquake');
    if (earthquakeFrames.length > 0) {
        earthquakeFrames[0].style.display = 'block';
        // Animate earthquake defeat frames
        playerEarthquakeDefeatedInterval = createAnimation('#player .player-frame.defeated.earthquake', 400, true);
    }
}

function showFireDefeatedAnimation() {
    // Hide earthquake defeat frames
    document.querySelectorAll('#player .player-frame.defeated.earthquake').forEach(img => {
        img.style.display = 'none';
    });

    // Show first frame immediately
    const fireFrames = document.querySelectorAll('#player .player-frame.defeated.fire');
    if (fireFrames.length > 0) {
        fireFrames[0].style.display = 'block';
        // Animate fire defeat frames
        playerFireDefeatedInterval = createAnimation('#player .player-frame.defeated.fire', 500, true);
    }
}

function showPlayerDefeatedFrame() {
    showPlayerDefeatedAnimation();
}

function stopEnemyAnimation() {
    clearInterval(enemyAnimInterval);
}

function showEnemy1DefeatedFrame() {
    clearInterval(enemyAnimInterval);
    // Hide running frames
    document.querySelectorAll('#enemy-animation .enemy-frame:not(.defeated)').forEach(img => img.style.display = 'none');
    // Animate defeated frames (play once, no loop)
    enemy1DefeatedAnimInterval = createAnimation('#enemy-animation .enemy-frame.defeated', 400, false);
}

function stopEnemy2Animation() {
    clearInterval(enemy2AnimInterval);
}

function showEnemy2DefeatedFrame() {
    clearInterval(enemy2AnimInterval);
    // Hide running frames
    document.querySelectorAll('#enemy2-animation .enemy2-frame:not(.defeated)').forEach(img => img.style.display = 'none');
    // Animate defeated frames (looping)
    enemy2DefeatedAnimInterval = createAnimation('#enemy2-animation .enemy2-frame.defeated', 400, true);
}

// Basic pause functionality for settings
function pauseGame() {
    paused = true;
}

function resumeGame() {
    paused = false;
}

// --- BOOT SEQUENCE ---
window.addEventListener('load', () => {
    // Set scenario type based on which file is loaded
    if (window.location.pathname.includes('3f.html')) {
        currentScenarioType = "fire";
    } else {
        currentScenarioType = "earthquake";
    }

    // Scenario type already set above based on file
    currentScenario = 0;    // Start from first scenario
    playerBarFaded = false; // Reset bar fade flags
    enemyBarFaded = false;
    gameWon = false; // Reset victory flag
    updateHPBars();

    // Set initial enemy display based on scenario type
    if (currentScenarioType === "earthquake") {
        document.getElementById('enemy-animation').style.display = 'block';
        document.getElementById('enemy2-animation').style.display = 'none';
    } else if (currentScenarioType === "fire") {
        document.getElementById('enemy-animation').style.display = 'none';
        document.getElementById('enemy2-animation').style.display = 'block';
    }

    // Show cutscene - game starts when user clicks
    showCutscene();

    // Basic settings button functionality (just go back to main menu)
    const settingsBtn = document.getElementById('settingsBtn');
    if (settingsBtn) {
        settingsBtn.addEventListener('click', () => {
            if (confirm('Return to main menu?')) {
                window.location.href = 'index.html';
            }
        });
    }

    // Add a test function to window for debugging
    window.testShowEndButton = function(label) {
        console.log('Testing showEndButton with label:', label);
        showEndButton(label || 'COMPLETE');
    };
});