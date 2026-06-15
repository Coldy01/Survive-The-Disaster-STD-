// ==========================================
// GAME LOGIC FOR "SEARCH FOR RESEARCH"
// ==========================================

// ==========================================
// GLOBAL VARIABLES
// ==========================================

// Player and character variables
const player = {
  name: "Unnamed Student",
  character: null,
  direction: "down",
  walkFrame: 1,
  walking: false,
  walkInterval: null,
  y: 300,
  x: 260,
  width: 80,
  height: 80,
  instantDialogue: false,
  inIntro: false,
  equipped: null,
  inCleaning: false
};

let isLoading = false;

// Quest variables
const quest = {
  questsDone: 0,
  papersCollected: 0,
  cleaningQuestAccepted: false,
  cleaningQuestDone: false,
  broomPicked: false,
  quizQuestAccepted: false,
  quizQuestDone: false,
  map2Unlocked: false
};

// Quiz variables
const quiz = {
  started: false,
  currentQuestionIndex: 0,
  failedAttempts: 0
};

// Quiz questions
const quizQuestions = [
  {
    question: "What is the first step in conducting research?",
    options: ["[1] Define the problem", "[2] Collect data", "[3] Write conclusion"],
    correct: 1
  },
  {
    question: "What does 'hypothesis' mean in research?",
    options: ["[1] A proven fact", "[2] An educated guess", "[3] A final report"],
    correct: 2
  },
  {
    question: "Which of these is a primary source?",
    options: ["[1] Textbook summary", "[2] Encyclopedia article", "[3] Original document"],
    correct: 3
  }
];

// Game state
const game = {
   currentMap: 1,
   keys: {},
   gameLoopId: null,
   moveSpeed: 1.0,
   directionKeyCount: 0
};

// Save system variable
const save = {
  exitAfterSave: false
};

let inMenu = true;

// ==========================================
// DOM ELEMENTS
// ==========================================

const character = document.getElementById("character");
const achievementBadge = document.getElementById("achievementBadge");
const gameArea = document.getElementById("gameArea");
const wall1 = document.getElementById("wall");
const wall2 = document.getElementById("wallMap2");
const progressBoard = document.getElementById("progressBoard");
const progressText = document.getElementById("progressText");
const progressOverlay = document.getElementById("progressOverlay");
const closeProgressBtn = document.getElementById("closeProgressBtn");
const questComplete = document.getElementById("questComplete");
const noQuest = document.getElementById("noQuest");
const nameFormOverlay = document.getElementById("nameFormOverlay");
const playerNameInput = document.getElementById("playerNameInput");
const submitNameBtn = document.getElementById("submitNameBtn");
const characterOptions = document.querySelectorAll(".characterOption");
const characterSelectScreen = document.getElementById("characterSelectScreen");
const nameInputScreen = document.getElementById("nameInputScreen");
const nextBtn = document.getElementById("nextBtn");
const backBtn = document.getElementById("backBtn");
const gameButtons = document.getElementById("gameButtons");
const saveBtn = document.getElementById("saveBtn");
const exitBtn = document.getElementById("exitBtn");
const exitConfirmOverlay = document.getElementById("exitConfirmOverlay");
const saveAndExitBtn = document.getElementById("saveAndExitBtn");
const exitNoSaveBtn = document.getElementById("exitNoSaveBtn");
const cancelExitBtn = document.getElementById("cancelExitBtn");
const characterPreview = document.getElementById("characterPreview");
const rewardPopup = document.getElementById("rewardPopup");
const rewardBtn = document.getElementById("rewardBtn");
const introOverlay = document.getElementById("introOverlay");
const introText = document.getElementById("introText");
const introHint = document.getElementById("introHint");
const warmOverlay = document.getElementById("warmOverlay");
const gameboyOverlay = document.getElementById("gameboyOverlay");
const mainMenu = document.getElementById("mainMenu");
const charBackBtn = document.getElementById("charBackBtn");
const newGameBtn = document.getElementById("newGameBtn");
const loadBtn = document.getElementById("loadBtn");
const closeLoadBtn = document.getElementById("closeLoadBtn");
const loadGameOverlay = document.getElementById("loadGameOverlay");
const loadGamePanel = document.getElementById("loadGamePanel");
const saveSlots = document.getElementById("saveSlots");
const gameControls = document.getElementById("gameControls");

// Audio elements
const rewardAudio = document.getElementById("rewardAudio");
const achievementAudio = document.getElementById("achievementAudio");
const buttonAudio = document.getElementById("buttonAudio");
const settingsButtonAudio = document.getElementById("settingsButtonAudio");
const galleryButtonAudio = document.getElementById("galleryButtonAudio");
const dialogueBeep = document.getElementById("dialogueBeep");
const selectionAudio = document.getElementById("selectionAudio");
settingsButtonAudio.volume = 1;
galleryButtonAudio.volume = 1;
dialogueBeep.volume = 1;
selectionAudio.volume = 1;
achievementAudio.volume = 1;
const masterVolumeSlider = document.getElementById("masterVolume");
const musicVolumeSlider = document.getElementById("musicVolume");
const buttonVolumeSlider = document.getElementById("buttonVolume");
const customVolumeText = document.getElementById("customVolumeText");
const movementSpeedInput = document.getElementById("movementSpeed");
let isCustomVolume = false;
const startAudio = document.getElementById("startAudio");
const introAudio = document.getElementById("introAudio");
const tutmusic = document.getElementById("tutmusic");
// Keydowns
document.addEventListener("keydown", unlockAudioContext);
document.addEventListener("click", unlockAudioContext);

// ==========================================
// MUSIC TRANSITION UTILITY
// ==========================================
let audioContextUnlocked = false;

function unlockAudioContext() {
  if (audioContextUnlocked) return;

  audioContextUnlocked = true;

  if (inMenu && startAudio.paused) {
    startAudio.play().catch(() => {
    });
  }
}

function switchMusic(fromAudio, toAudio) {
  let fadeOut = setInterval(() => {
    if (fromAudio.volume > 0.05) {
      fromAudio.volume -= 0.05;
    } else {
      clearInterval(fadeOut);
      fromAudio.pause();
      fromAudio.currentTime = 0;
      toAudio.volume = 0;
      toAudio.play().catch(() => {});
      let fadeIn = setInterval(() => {
        if (toAudio.volume < 1) {
          toAudio.volume += 0.05;
        } else {
          clearInterval(fadeIn);
        }
      }, 100);
    }
  }, 100);
}

// ==========================================
// SPRITE HELPERS
// ==========================================

function getCharPrefix() {
  switch (player.character) {
    case "girl":
      return "imgs/sarah/Girl";
    case "boy":
      return "imgs/Michael/Boy";
    case "Gallie":
      return "imgs/Gallie/Gallie";
    case "Billie":
      return "imgs/Billie/Billie";
    case "Lacs":
      return "imgs/Lacs/Lacs";
    default:
      return "imgs/sarah/Girl";
  }
}

function getWalkSprite(direction, frame) {
   const p = getCharPrefix();
   switch (direction) {
     case "up":    return `${p}backwalk-${frame}.png`;
     case "down":  return `${p}frontwalk-${frame}.png`;
     case "left":  return `${p}leftwalk-${frame}.png`;
     case "right": return `${p}rightwalk-${frame}.png`;
   }
 }

function getIdleSprite(direction) {
  const p = getCharPrefix();
  switch (direction) {
    case "up":    return `${p}backwalk-idle.png`;
    case "down":  return `${p}frontwalk-idle.png`;
    case "left":  return `${p}leftwalk-idle.png`;
    case "right": return `${p}rightwalk-idle.png`;
  }
}

function getCleanSprite() {
  const p = getCharPrefix();
  return `${p}clean.png`;
}

// ==========================================
// LOADING SCREEN SYSTEM
// ==========================================

function showLoading(duration = 1500, callback = null) {
  const loader = document.getElementById("loadingScreen");
  if (!loader) return;

  isLoading = true;

  // Randomize loading background image
  const images = ["imgs/loading screen.png", "imgs/Upon the quest!.png", "imgs/New game.png"];
  const randomImage = images[Math.floor(Math.random() * images.length)];
  document.getElementById("loadingBackground").style.backgroundImage = `url("${randomImage}")`;

  loader.style.display = "flex";
  loader.classList.remove("fade-out");
  loader.style.opacity = "1";

  setTimeout(() => {
    loader.classList.add("fade-out");
    loader.addEventListener("transitionend", function handleFade() {
      loader.style.display = "none";
      loader.classList.remove("fade-out");
      loader.removeEventListener("transitionend", handleFade);
      if (callback && typeof callback === "function") {
        callback();
      }
      isLoading = false;
    });
  }, duration);
}

function hideLoading() {
  const loading = document.getElementById("loadingScreen");
  loading.style.opacity = 0;
  setTimeout(() => {
    loading.style.display = "none";
  }, 800);
  isLoading = false;
}

// ==========================================
// CHARACTER LOADING SCREEN SYSTEM
// ==========================================

function showCharacterLoadingScreen(duration = 2000) {
  const characterLoader = document.getElementById("characterLoadingScreen");
  if (!characterLoader) return;

  // Show the loading screen
  characterLoader.style.display = "flex";
  
  // Fade in
  setTimeout(() => {
    characterLoader.classList.add("fade-in");
  }, 50);

  // After duration, fade out and show name input
  setTimeout(() => {
    characterLoader.classList.remove("fade-in");
    characterLoader.classList.add("fade-out");
    
    // After fade out completes, hide loading and show name input
    setTimeout(() => {
      characterLoader.style.display = "none";
      characterLoader.classList.remove("fade-out");
      
      // Show name input screen
      const nameInputScreen = document.getElementById("nameInputScreen");
      nameInputScreen.style.display = "block";
      nameInputScreen.classList.add("fade-in");
    }, 500);
  }, duration);
}

function hideCharacterLoadingScreen() {
  const characterLoader = document.getElementById("characterLoadingScreen");
  if (!characterLoader) return;
  
  characterLoader.classList.remove("fade-in");
  characterLoader.classList.add("fade-out");
  
  setTimeout(() => {
    characterLoader.style.display = "none";
    characterLoader.classList.remove("fade-out");
  }, 500);
}

// ==========================================
// HELP OVERLAY
// ==========================================

const helpOverlay = document.getElementById("helpOverlay");
const closeHelp = document.getElementById("closeHelp");
const helpBtn = document.getElementById("helpBtn");

if (helpBtn && helpOverlay && closeHelp) {
  helpBtn.addEventListener("click", () => {
    helpOverlay.style.display = "flex";
  });

  closeHelp.addEventListener("click", () => {
    helpOverlay.style.display = "none";
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && helpOverlay.style.display === "flex") {
      helpOverlay.style.display = "none";
    }
  });
}

// Wise link for secret badge
const wiseLink = document.querySelector('#helpPanel a[href="Archived/fart.html"]');
if (wiseLink) {
  wiseLink.addEventListener('click', (e) => {
    if (!achievements.secretBadge) {
      e.preventDefault();
      achievements.secretBadge = true;
      localStorage.setItem('achievements', JSON.stringify(achievements));
      showAchievement("Such wise website!", "imgs/secret badge.png");
    }
    // If badge already obtained, allow normal link behavior (redirect)
  });
}

// ==========================================
// BADGES OVERLAY
// ==========================================

const badgesOverlay = document.getElementById("badgesOverlay");
const closeBadges = document.getElementById("closeBadges");
const badgeBtn = document.getElementById("badgeBtn");
const badgesContent = document.getElementById("badgesContent");

const badgeDescriptionOverlay = document.getElementById("badgeDescriptionOverlay");
const closeBadgeDescription = document.getElementById("closeBadgeDescription");
const badgeDescriptionContent = document.getElementById("badgeDescriptionContent");

function populateBadges() {
  badgesContent.innerHTML = '';
  badges.forEach(badge => {
    const badgeItem = document.createElement('div');
    badgeItem.className = 'badge-item';
    if (!achievements[badge.id]) {
      badgeItem.classList.add('locked');
    }
    badgeItem.innerHTML = `
      <img class="badge-icon" src="${badge.icon}" alt="${badge.title}">
      <div class="badge-title">${achievements[badge.id] ? badge.title : '???'}</div>
    `;
    if (achievements[badge.id]) {
      badgeItem.addEventListener('click', () => showBadgeDescription(badge));
    }
    badgesContent.appendChild(badgeItem);
  });
}

function getTierColor(tier) {
  switch (tier) {
    case 'Common': return '#c0c0c0'; // Silver
    case 'Gold': return '#ffd700'; // Gold
    case 'Emerald': return '#50c878'; // Emerald
    case 'Platinum': return '#c2f8ffff'; // Platinum
    default: return '#fff';
  }
}

function showBadgeDescription(badge) {
  badgeDescriptionContent.innerHTML = `
    <img src="${badge.icon}" alt="${badge.title}">
    <h2 style="color: #fff;">${badge.title}</h2>
    <h3 style="color: ${getTierColor(badge.tier)};">[${badge.tier}]</h3>
    <p>${badge.description}</p>
  `;
  badgeDescriptionOverlay.style.display = "flex";
}

if (badgeBtn && badgesOverlay && closeBadges) {
  badgeBtn.addEventListener("click", () => {
    populateBadges();
    badgesOverlay.style.display = "flex";
  });

  closeBadges.addEventListener("click", () => {
    badgesOverlay.style.display = "none";
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && badgesOverlay.style.display === "flex") {
      badgesOverlay.style.display = "none";
    }
  });
}

if (closeBadgeDescription && badgeDescriptionOverlay) {
  closeBadgeDescription.addEventListener("click", () => {
    badgeDescriptionOverlay.style.display = "none";
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && badgeDescriptionOverlay.style.display === "flex") {
      badgeDescriptionOverlay.style.display = "none";
    }
  });
}

// ==========================================
// INTRO SYSTEM
// ==========================================
const instantToggleBtn = document.getElementById("instantTextToggleBtn");

const dialogue = {
  introQueue: [],
  introCurrent: "",
  introIndex: 0,
  introTyping: null,

  startIntro: function () {
    player.inIntro = true;
    introOverlay.style.display = "flex";
    introOverlay.style.zIndex = "15000";

    mainMenu.style.display = "none";
    gameArea.style.display = "none";
    nameFormOverlay.style.display = "none";

    if (tutmusic) tutmusic.pause();
    if (introAudio) {
      introAudio.currentTime = 0;
      introAudio.volume = musicVolumeSlider.value;
      introAudio.play().catch(() => {});
    }

    this.introQueue = [
      `Hello, ${player.name}!`,
      "I see you're a student in STI who is having tough times in Research.",
      "Worry not! It is I! The wise and intelligent bunny will guide you on your journey.",
      `Now, I'll see you when you find me and I'll try my best to share my wise answers.`,
      "But before all of that!",
      "I'll show you some of the controls!",
      "W, A, S, and D are the default controls!",
      "But! There are additional controls! That is the arrow keys!",
      "Now, to interact, to pick up, or continue a dialogue, just press E!",
      "That's all I could say to you,",
      `Aim high, ${player.name}!`
    ];

    this.playNextIntroLine();
  },

  playNextIntroLine: function () {
    // If no more lines, fade out and start game
    if (this.introQueue.length === 0) {
      introOverlay.classList.add("fade-out");

      if (introAudio && tutmusic) {
        switchMusic(introAudio, tutmusic);
      }

      setTimeout(() => {
        introOverlay.style.display = "none";
        introOverlay.classList.remove("fade-out");
        player.inIntro = false;
        gameArea.style.display = "block";
        startMainGame();

        showTutorial();
      }, 500);

      return;
    }

    // Clear any existing typing interval
    if (this.introTyping) {
      clearInterval(this.introTyping);
      this.introTyping = null;
    }

    this.introCurrent = this.introQueue.shift();
    this.introIndex = 0;
    introText.textContent = "";
    introHint.style.display = "none";

    // Typewriter effect
    this.introTyping = setInterval(() => {
      if (this.introIndex < this.introCurrent.length) {
        introText.textContent += this.introCurrent.charAt(this.introIndex);

        if (dialogueBeep) {
          dialogueBeep.currentTime = 0;
          dialogueBeep.play().catch(() => {});
        }

        this.introIndex++;
      } else {
        clearInterval(this.introTyping);
        this.introTyping = null;
        introHint.style.display = "block"; // show hint after line finishes
      }
    }, 85);
  }
};

// ==========================================
// INTRO CONTROLS
// ==========================================
document.addEventListener("keydown", function (event) {
  const key = event.key.toLowerCase();

  if (player.inIntro && (key === "e" || key === "enter")) {
    // If still typing, skip to end of line
    if (dialogue.introTyping) {
      clearInterval(dialogue.introTyping);
      dialogue.introTyping = null;
      introText.textContent = dialogue.introCurrent;
      introHint.style.display = "block";
    } else {
      // Otherwise, go to next line
      dialogue.playNextIntroLine();
    }
  }
});

// ==========================================
// TUTORIAL OVERLAY
// ==========================================
function showTutorial() {
  const tutorial = document.getElementById("tutorialOverlay");
  if (!tutorial) return;

  setTimeout(() => {
    tutorial.style.display = "flex";
    requestAnimationFrame(() => {
      tutorial.classList.add("show");
    });

    setTimeout(() => {
      tutorial.classList.remove("show");
      tutorial.classList.add("hide");

      setTimeout(() => {
        tutorial.style.display = "none";
        tutorial.classList.remove("hide");
        startMaamJuneDialogue("Maam June", "imgs/Npcs/maam june.png", [
          "Hello, student!",
          "I am Maam June, your personal computer tutor! I'll be guiding you from here on this tutorial.",
          "Now, i think you've already known the movement controls right?",
          "W, A, S, D, and the arrow keys? If you're already familiar with them, great job!",
          "Next, the mechanics of the game!",
          "What do you do is do quest and objectives in order to finish the papers!",
          "If you reach three papers after completing 15 to 20 quests in the main gameplay, you are now ready for the defense!",
          "But how do you get quests and objectives?",
          "In order to obtain quests and objectives, you need to find a specific npc which can be found anywhere!",
          "Remember, quests and objectives can get difficult as you go further in quests!",
          "Now, to obtain a quest, you must find the npc i set for you somewhere on this map! I'll talk to you again as you obtain your first quest!",
          "See ya!",
        ], () => spawnNewNPC());

      }, 1000);
    }, 3000);
  }, 1000);
}

function showEndDemoOverlay() {
 const overlay = document.getElementById("endDemoOverlay");
 if (!overlay) return;

 overlay.style.display = "flex";
}


// =============================
// Maam June Dialogue System
// =============================
const maamJuneDialogue = document.getElementById("maamJuneDialogue");
const maamJuneNameEl = document.getElementById("maamJuneName");
const maamJuneTextEl = document.getElementById("maamJuneText");
const maamJuneSpriteEl = document.getElementById("maamJuneSprite");
const instantBtn = document.getElementById("instantTextToggleBtn");

const newNPCDialogue = document.getElementById("newNPCDialogue");
const newNPCNameEl = document.getElementById("newNPCName");
const newNPCTextEl = document.getElementById("newNPCText");
const newNPCSpriteEl = document.getElementById("newNPCSprite");
const newNPCHint = document.getElementById("newNPCHint");

const quizDialogue = document.getElementById("quizDialogue");
const quizNameEl = document.getElementById("quizName");
const quizTextEl = document.getElementById("quizText");
const quizSpriteEl = document.getElementById("quizSprite");
const quizHint = document.getElementById("quizHint");
const quizChoices = document.getElementById("quizChoices");
const quizChoiceBtns = document.querySelectorAll(".quizChoiceBtn");

let maamJuneQueue = [];
let maamJuneIndex = 0;
let maamJuneTyping = false;
let maamJuneIntervalId = null;

let newNPCQueue = [];
let newNPCIndex = 0;
let newNPCTyping = false;
let newNPCIntervalId = null;

let quizState = "intro"; // "intro", "question", "done"
let quizIndex = 0;
let quizTyping = false;
let quizIntervalId = null;
let quizHighlighted = null; // 1, 2, 3 or null

function startMaamJuneDialogue(name, sprite, lines, callback = null) {
  maamJuneNameEl.textContent = name;
  maamJuneSpriteEl.src = sprite;
  maamJuneQueue = Array.isArray(lines) ? lines.slice() : [String(lines)];
  maamJuneIndex = 0;
  maamJuneDialogue.style.display = "block";
  setTimeout(() => {
    maamJuneDialogue.style.opacity = "1";
    maamJuneDialogue.style.visibility = "visible";
  }, 10);
  showNextMaamJuneLine();
  maamJuneDialogue.callback = callback;
}

function showNextMaamJuneLine() {

  if (maamJuneIndex >= maamJuneQueue.length) {
    closeMaamJuneDialogue();
    return;
  }


  const text = maamJuneQueue[maamJuneIndex++];
  typeWriterMaamJune(text);
}

function typeWriterMaamJune(text) {

  if (maamJuneIntervalId) {
    clearInterval(maamJuneIntervalId);
    maamJuneIntervalId = null;
  }

  maamJuneTextEl.textContent = "";
  let i = 0;

  if (instantTextToggleBtn.dataset.state === "on") {
    maamJuneTextEl.textContent = text;
    maamJuneTyping = false;
    return;
  }

  maamJuneTyping = true;
  maamJuneIntervalId = setInterval(() => {
    maamJuneTextEl.textContent += text.charAt(i);
    i++;
    if (i >= text.length) {
      clearInterval(maamJuneIntervalId);
      maamJuneIntervalId = null;
      maamJuneTyping = false;
    }
  }, 30);
}

function finishCurrentMaamJuneLineInstantly() {
  if (maamJuneIntervalId) {
    clearInterval(maamJuneIntervalId);
    maamJuneIntervalId = null;
  }
  if (maamJuneIndex > 0) {
    maamJuneTextEl.textContent = maamJuneQueue[maamJuneIndex - 1];
  }
  maamJuneTyping = false;
}

function closeMaamJuneDialogue() {
  if (maamJuneIntervalId) {
    clearInterval(maamJuneIntervalId);
    maamJuneIntervalId = null;
  }
  maamJuneDialogue.style.opacity = "0";
  maamJuneDialogue.style.visibility = "hidden";
  setTimeout(() => {
    maamJuneDialogue.style.display = "none";
    if (maamJuneDialogue.callback) {
      maamJuneDialogue.callback();
      maamJuneDialogue.callback = null;
    }
  }, 500);
  maamJuneTyping = false;
  maamJuneQueue = [];
  maamJuneIndex = 0;
}

document.addEventListener("keydown", (e) => {
  if (e.key.toLowerCase() !== "e") return;
  if (maamJuneDialogue.style.opacity !== "1") return;

  if (maamJuneTyping) {
    finishCurrentMaamJuneLineInstantly();
  } else {

    showNextMaamJuneLine();
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key.toLowerCase() !== "e") return;
  if (!newNPCDialogue || newNPCDialogue.style.opacity !== "1") return;

  if (newNPCTyping) {
    finishCurrentNewNPCLineInstantly();
  } else {
    showNextNewNPCLine();
  }
});

document.addEventListener("keydown", (e) => {
  if (quizDialogue.style.opacity !== "1") return;

  if (quizState === "intro" && e.key.toLowerCase() === "e") {
    if (quizTyping) {
      finishCurrentQuizLineInstantly();
    } else {
      quizState = "question";
      showNextQuizQuestion();
    }
  } else if (quizState === "done" && e.key.toLowerCase() === "e") {
    if (quizTyping) {
      finishCurrentQuizLineInstantly();
    } else {
      closeQuizDialogue();
    }
  } else if (quizState === "question" && ["1", "2", "3"].includes(e.key)) {
    if (quizTyping) return; // Don't allow choices while typing
    const choice = parseInt(e.key);
    if (quizHighlighted === choice) {
      // Confirm selection
      const q = quizQuestions[quizIndex];
      if (choice === q.correct) {
        quizIndex++;
        showNextQuizQuestion();
      } else {
        // Wrong answer, restart quiz
        quiz.failedAttempts++;
        if (quiz.failedAttempts >= 10 && !achievements.angerBadge) {
          achievements.angerBadge = true;
          localStorage.setItem('achievements', JSON.stringify(achievements));
          showAchievement("Anger Management", "imgs/anger badge.png");
        }
        quizIndex = 0;
        quizChoices.style.display = "none";
        typeWriterQuiz("Wrong answer! Try again.\n\n" + quizQuestions[0].question);
        // Set buttons for first question
        const q0 = quizQuestions[0];
        quizChoiceBtns.forEach((btn, i) => {
          btn.textContent = q0.options[i];
        });
        quizChoices.style.display = "flex";
      }
      quizHighlighted = null;
      updateChoiceHighlights();
    } else {
      // Highlight selection
      quizHighlighted = choice;
      updateChoiceHighlights();
    }
  }
});

instantTextToggleBtn.addEventListener("click", () => {
  if (instantTextToggleBtn.dataset.state === "on") {
    if (maamJuneTyping) {
      finishCurrentMaamJuneLineInstantly();
    }
    if (newNPCTyping) {
      finishCurrentNewNPCLineInstantly();
    }
    if (quizTyping) {
      finishCurrentQuizLineInstantly();
    }
  }
});

// =============================
// New NPC System
// =============================

function spawnNewNPC() {
  const npc = document.getElementById("newNPC");
  npc.style.display = "block";
  npc.style.opacity = "0";

  // Fade in
  setTimeout(() => {
    npc.style.transition = "opacity 1s";
    npc.style.opacity = "1";
  }, 10);
}


function startNewNPCDialogue() {
  newNPCNameEl.textContent = "NPC";
  newNPCSpriteEl.src = "imgs/Npcs/npc.png";
  if (!quest.cleaningQuestAccepted) {
    newNPCQueue = [
      "Beep boop beep beep...",
      "Loading...",
      "Setting up dialogue for student...",
      "Done!",
      "Hi there, student! I am a bot for this tutorial!",
      "Setting up quest for student...",
      "Please wait..."
    ];
  } else if (quest.cleaningQuestAccepted && !quest.cleaningQuestDone) {
    newNPCQueue = [
      "ERROR!",
      "The quest isn't fully perfomed..."
    ];
  } else {
    newNPCQueue = [
      "Well done! You've completed the quest.",
      "Your progress has been updated."
    ];
  }
  newNPCIndex = 0;
  newNPCDialogue.style.display = "block";
  setTimeout(() => {
    newNPCDialogue.style.opacity = "1";
    newNPCDialogue.style.visibility = "visible";
  }, 10);
  showNextNewNPCLine();
}

function showNextNewNPCLine() {
   if (newNPCIndex >= newNPCQueue.length) {
     closeNewNPCDialogue();
     return;
   }

   const text = newNPCQueue[newNPCIndex++];
   newNPCHint.style.display = "none";
   typeWriterNewNPC(text);
 }

function typeWriterNewNPC(text) {
   if (newNPCIntervalId) {
     clearInterval(newNPCIntervalId);
     newNPCIntervalId = null;
   }

   newNPCTextEl.textContent = "";
   let i = 0;

   if (instantTextToggleBtn.dataset.state === "on") {
     newNPCTextEl.textContent = text;
     newNPCTyping = false;
     newNPCHint.style.display = "block";
     return;
   }

   newNPCTyping = true;
   newNPCIntervalId = setInterval(() => {
     newNPCTextEl.textContent += text.charAt(i);
     i++;
     if (i >= text.length) {
       clearInterval(newNPCIntervalId);
       newNPCIntervalId = null;
       newNPCTyping = false;
       newNPCHint.style.display = "block";
     }
   }, 30);
 }

function finishCurrentNewNPCLineInstantly() {
   if (newNPCIntervalId) {
     clearInterval(newNPCIntervalId);
     newNPCIntervalId = null;
   }
   if (newNPCIndex > 0) {
     newNPCTextEl.textContent = newNPCQueue[newNPCIndex - 1];
   }
   newNPCTyping = false;
   newNPCHint.style.display = "block";
 }

function closeNewNPCDialogue() {
    if (newNPCIntervalId) {
      clearInterval(newNPCIntervalId);
      newNPCIntervalId = null;
    }
    newNPCDialogue.style.opacity = "0";
    newNPCDialogue.style.visibility = "hidden";
    setTimeout(() => {
      newNPCDialogue.style.display = "none";
      // On close, if quest not accepted, accept it
      if (!quest.cleaningQuestAccepted) {
        quest.cleaningQuestAccepted = true;
        spawnBroomAndMess();
        updateQuestBox();
      } else if (quest.cleaningQuestDone) {
        quest.questsDone = 1;
        updateQuestBox();
      }
    }, 500);
    newNPCTyping = false;
    newNPCQueue = [];
    newNPCIndex = 0;
  }

// =============================
// Quiz NPC System
// =============================

function startQuizDialogue() {
  quizNameEl.textContent = "Quiz NPC";
  quizSpriteEl.src = "imgs/Npcs/npc.png";
  quizDialogue.style.display = "block";
  setTimeout(() => {
    quizDialogue.style.opacity = "1";
    quizDialogue.style.visibility = "visible";
  }, 10);
  showQuizContent();
}

function showQuizContent() {
  quizChoices.style.display = "none";
  quizHighlighted = null;
  updateChoiceHighlights();
  if (!quest.quizQuestAccepted) {
    quizState = "intro";
    typeWriterQuiz("Hello! I have a quiz for you. Answer all questions correctly to complete the quest.\n\nPress E to start.");
    quizHint.textContent = "(Press E to continue)";
  } else if (quest.quizQuestDone) {
    quizState = "done";
    typeWriterQuiz("Congratulations! You have completed the quiz quest.");
    quizHint.textContent = "(Press E to close)";
  } else {
    quizState = "question";
    showNextQuizQuestion();
  }
}

function showNextQuizQuestion() {
  if (quizIndex >= quizQuestions.length) {
    quest.quizQuestDone = true;
    updateQuestBox();
    quizChoices.style.display = "none";
    quizState = "done";
    typeWriterQuiz("Well done! You answered all questions correctly.\n\nQuest completed!");
    quizHint.textContent = "(Press E to close)";
    setTimeout(() => {
      fadeOutQuizNPC();
      startMaamJuneDialogue("Maam June", "imgs/Npcs/maam june.png", [
        "Congratulations on completing your second quest!",
        "You have successfully answered all the quiz questions correctly.",
        "I don't doubt that it took alot attempts...",
        "Anyways! You have answered all the quiz questions correctly though!",
        "I hope this tutorial has taught so many things!",
        "Even though it's all simple...",
        "Hey! Atleast you have learned something than learning nothing right? haha!",
        "I wish you to have great day out there, student!",
        "See ya!"
      ], () => {
      unlockTutorialAchievement();
      });
    }, 2000); 
    return;
  }
  const q = quizQuestions[quizIndex];
  typeWriterQuiz(q.question);
  quizChoiceBtns.forEach((btn, i) => {
    btn.textContent = q.options[i];
  });
  quizChoices.style.display = "flex";
  quizHint.textContent = "(Press 1, 2, or 3 to highlight, press again to confirm)";
}

function closeQuizDialogue() {
  if (quizIntervalId) {
    clearInterval(quizIntervalId);
    quizIntervalId = null;
  }
  quizDialogue.style.opacity = "0";
  quizDialogue.style.visibility = "hidden";
  setTimeout(() => {
    quizDialogue.style.display = "none";
    if (!quest.quizQuestAccepted) {
      quest.quizQuestAccepted = true;
      updateQuestBox();
    }
  }, 500);
  quizTyping = false;
  quizState = "intro";
  quizIndex = 0;
  quizHighlighted = null;
}

function typeWriterQuiz(text) {
  if (quizIntervalId) {
    clearInterval(quizIntervalId);
    quizIntervalId = null;
  }

  quizTextEl.textContent = "";
  let i = 0;

  if (instantTextToggleBtn.dataset.state === "on") {
    quizTextEl.textContent = text;
    quizTyping = false;
    return;
  }

  quizTyping = true;
  quizIntervalId = setInterval(() => {
    quizTextEl.textContent += text.charAt(i);
    i++;
    if (i >= text.length) {
      clearInterval(quizIntervalId);
      quizIntervalId = null;
      quizTyping = false;
    }
  }, 30);
}

function finishCurrentQuizLineInstantly() {
  if (quizIntervalId) {
    clearInterval(quizIntervalId);
    quizIntervalId = null;
  }
  // Set the full text based on current state
  if (quizState === "intro") {
    quizTextEl.textContent = "Hello! I have a quiz for you. Answer all questions correctly to complete the quest.\n\nPress E to start.";
  } else if (quizState === "question") {
    const q = quizQuestions[quizIndex];
    quizTextEl.textContent = q.question;
  } else if (quizState === "done") {
    quizTextEl.textContent = "Congratulations! You have completed the quiz quest.";
  }
  quizTyping = false;
}

function updateChoiceHighlights() {
  quizChoiceBtns.forEach((btn, i) => {
    const choiceNum = i + 1;
    if (quizHighlighted === choiceNum) {
      btn.classList.add("highlighted");
    } else {
      btn.classList.remove("highlighted");
    }
  });
}

function fadeOutQuizNPC() {
  const npc = document.getElementById("quizNPC");
  const hint = document.getElementById("quizNPCHint");
  if (npc) {
    npc.style.transition = "opacity 1s";
    npc.style.opacity = "0";
    hint.style.display = "none";
    setTimeout(() => {
      npc.style.display = "none";
    }, 1000);
  }
}

function spawnBroomAndMess() {
  document.getElementById("broom").style.display = "block";
  document.getElementById("mess").style.display = "block";
}

function updateQuestBox() {
  const questContent = document.getElementById("questContent");
  if (!questContent) return; // Prevent error if element doesn't exist yet

  let content = "";
  if (quest.cleaningQuestAccepted && !quest.cleaningQuestDone) {
    content += "<p>Clean the mess with the broom.</p>";
  }
  if (quest.quizQuestAccepted && !quest.quizQuestDone) {
    content += "<p>Answer the quiz questions from the Quiz NPC.</p>";
  }
  if (quest.cleaningQuestDone && quest.quizQuestDone) {
    content += "<p>All quests completed!</p>";
  }
  if (!content) {
    content = '<div id="noQuest">No Quests Are Available.</div>';
  }
  questContent.innerHTML = content;
}

function pickUpBroom() {
  if (quest.broomPicked) return;
  quest.broomPicked = true;
  player.equipped = "broom";
  const broom = document.getElementById("broom");
  const hint = document.getElementById("broomHint");
  if (broom) {
    broom.style.display = "none";
    hint.style.display = "none";
  }
  // Maybe show equipped message or something
}

function cleanMess() {
  if (quest.cleaningQuestDone || player.inCleaning) return;
  player.inCleaning = true;
  character.src = getCleanSprite();
  // Hide hint
  const hint = document.getElementById("messHint");
  hint.style.display = "none";

  setTimeout(() => {
    player.inCleaning = false;
    quest.cleaningQuestDone = true;
    const mess = document.getElementById("mess");
    if (mess) {
      mess.style.display = "none";
    }
    character.src = getIdleSprite(player.direction);
    updateQuestBox();
  }, 2000);
}

// ==========================================
// CHARACTER SELECTION AND NAME INPUT
// ==========================================

characterOptions.forEach(option => {
  option.addEventListener("click", () => {
    characterOptions.forEach(o => o.classList.remove("selected"));
    option.classList.add("selected");
    player.character = option.dataset.character;
    nextBtn.style.display = "inline-flex";
  });
});

nextBtn.addEventListener("click", () => {
  if (!player.character) {
    alert("Please select a character first!");
    return;
  }

  // Play selection sound
  if (selectionAudio) {
    selectionAudio.currentTime = 0;
    selectionAudio.play().catch(() => {});
  }

  // Change the selected character's sprite and add bounce effect
  const selectedOption = document.querySelector(".characterOption.selected");
  if (selectedOption) {
    switch (player.character) {
      case "girl":
        selectedOption.src = "imgs/sarah/Girliconselected.png";
        break;
      case "boy":
        selectedOption.src = "imgs/Michael/boyiconselected.png";
        break;
      case "Gallie":
        selectedOption.src = "imgs/Gallie/crossdress1selected.png";
        break;
      case "Billie":
        selectedOption.src = "imgs/Billie/crossdress2selected.png";
        break;
      case "Lacs":
        selectedOption.src = "imgs/Lacs/lacsiconselected.png";
        break;
    }

    selectedOption.classList.add("bounce");
  }

  switch (player.character) {
    case "girl":
      characterPreview.src = "imgs/sarah/girlicon.png";
      player.name = "Sarah";
      break;
    case "boy":
      characterPreview.src = "imgs/Michael/boyicon.png";
      player.name = "Michael";
      break;
    case "Gallie":
      characterPreview.src = "imgs/Gallie/crossdress1.png";
      player.name = "Gallie";
      break;
    case "Billie":
      characterPreview.src = "imgs/Billie/crossdress2.png";
      player.name = "Billie";
      break;
    case "Lacs":
      characterPreview.src = "imgs/Lacs/lacsicon.png";
      player.name = "Lacs";
      break;
  }

  playerNameInput.value = player.name;

  // Delay before starting fade out
  setTimeout(() => {
    characterSelectScreen.classList.add("fade-out");

    // After fade out completes, show loading screen
    setTimeout(() => {
      characterSelectScreen.style.display = "none";
      showCharacterLoadingScreen();
    }, 1000);
  }, 900);
});

backBtn.addEventListener("click", () => {
  nameInputScreen.style.display = "none";
  nameInputScreen.classList.remove("fade-in");
  characterSelectScreen.style.display = "block";
  characterSelectScreen.classList.remove("fade-out");
  characterSelectScreen.classList.remove("fade-in"); // Remove fade effect

  characterOptions.forEach(option => {
    option.classList.remove("selected");
    option.classList.remove("bounce");
    switch (option.dataset.character) {
      case "boy":
        option.src = "imgs/Michael/boyicon.png";
        break;
      case "Gallie":
        option.src = "imgs/Gallie/crossdress1.png";
        break;
      case "girl":
        option.src = "imgs/sarah/girlicon.png";
        break;
      case "Billie":
        option.src = "imgs/Billie/crossdress2.png";
        break;
      case "Lacs":
        option.src = "imgs/Lacs/lacsicon.png";
        break;
    }
  });
  nextBtn.style.display = "none";
  player.character = null;
  player.name = "Unnamed Student"; // Reset name
  playerNameInput.value = player.name; // Reset input field
  characterPreview.src = ""; // Reset character preview
});
submitNameBtn.addEventListener("click", () => {
  const inputVal = playerNameInput.value.trim();
  if (inputVal.length > 0) player.name = inputVal;
  character.src = getIdleSprite("down");
  mainMenu.style.display = "none";
  nameFormOverlay.style.display = "none";
  gameArea.style.display = "none";
  showLoading();
  setTimeout(() => {
    hideLoading();
    dialogue.startIntro();
    inMenu = false;
    startAudio.pause();
    startAudio.currentTime = 0;
    introOverlay.style.display = "flex";
    introOverlay.style.zIndex = "15000";
    introAudio.play().catch(() => {});
  }, 1500);

  saveBtn.style.display = "block";
});

charBackBtn.addEventListener("click", () => {
  characterSelectScreen.style.display = "none";
  nameFormOverlay.style.display = "none";
  mainMenu.style.display = "flex";
});

newGameBtn.addEventListener("click", () => {
  // Reset player data for new game
  player.character = null;
  player.name = "Unnamed Student";
  playerNameInput.value = player.name;
  characterPreview.src = "";

  // Reset achievements for new game
  achievements.tutorialCompleted = false;
  localStorage.setItem('achievements', JSON.stringify(achievements));

  mainMenu.style.display = "none";
  nameFormOverlay.style.display = "flex";
  characterSelectScreen.style.display = "block";
  nameInputScreen.style.display = "none";
});


// ==========================================
// SETTINGS SYSTEM
// ==========================================

  const settingsOverlay = document.getElementById("settingsOverlay");
  const settingsButton = document.getElementById("settingsButton");
  const mainMenuSettingsBtn = document.getElementById("mainMenuSettingsBtn");
  const closeSettings = document.getElementById("closeSettings");
  const settingsAudio = document.getElementById("settingsButtonAudio");
document.getElementById("settingsButton" || "mainMenuSettingsBtn").addEventListener("click", () => {
  settingsAudio.currentTime = 0;
  settingsAudio.play();
  document.getElementById("settingsOverlay").style.display = "flex";
});

  function openSettings() {
    settingsOverlay.style.display = "block";
  }
  function closeSettingsOverlay() {
    settingsOverlay.style.display = "none";
  }

  settingsButton.addEventListener("click", openSettings);
  mainMenuSettingsBtn.addEventListener("click", openSettings);
  closeSettings.addEventListener("click", closeSettingsOverlay);

document.querySelectorAll(".toggleBtn").forEach(btn => {
  btn.addEventListener("click", () => {
    const newState = btn.dataset.state === "off" ? "on" : "off";
    btn.dataset.state = newState;
    btn.textContent = newState.toUpperCase();
    if (btn.id === "instantTextToggleBtn") {
      player.instantDialogue = (newState === "on");
      localStorage.setItem("instantDialogue", newState);
      if (player.inIntro && newState === "on" && dialogue.introTyping) {
        clearInterval(dialogue.introTyping);
        dialogue.introTyping = null;
        introText.textContent = dialogue.introCurrent;
        introHint.style.display = "block";
      }
    }
  });
});

const filters = ["[❌] None", "[🍂] Warm Colors", "[👾] Retro Boy"];
let currentFilterIndex = 0;

const filterDisplay = document.getElementById("filterDisplay");
const prevFilterBtn = document.getElementById("prevFilterBtn");
const nextFilterBtn = document.getElementById("nextFilterBtn");

function applyFilter(filter) {
  document.body.classList.remove("warmMode", "gameboyMode");
  document.getElementById("warmOverlay").style.display = "none";
  document.getElementById("gameboyOverlay").style.display = "none";

  if (filter === "[🍂] Warm Colors") {
    document.body.classList.add("warmMode");
    document.getElementById("warmOverlay").style.display = "block";
  } else if (filter === "[👾] Retro Boy") {
    document.body.classList.add("gameboyMode");
    document.getElementById("gameboyOverlay").style.display = "block";
  }
}

function updateFilterDisplay() {
  filterDisplay.textContent = filters[currentFilterIndex];
  applyFilter(filters[currentFilterIndex]);
  localStorage.setItem("currentFilterIndex", currentFilterIndex);
}

prevFilterBtn.addEventListener("click", () => {
  currentFilterIndex = (currentFilterIndex - 1 + filters.length) % filters.length;
  updateFilterDisplay();
});

nextFilterBtn.addEventListener("click", () => {
  currentFilterIndex = (currentFilterIndex + 1) % filters.length;
  updateFilterDisplay();
});

updateFilterDisplay();

// ==========================================
// COLLISION DETECTION
// ==========================================

function isColliding(rect1, rect2) {
  return !(rect1.right < rect2.left || rect1.left > rect2.right || rect1.bottom < rect2.top || rect1.top > rect2.bottom);
}

function checkWallCollision() {
  const wall = (game.currentMap === 1) ? wall1 : wall2;
  if (!wall) return;

  const charRect = character.getBoundingClientRect();
  const wallRect = wall.getBoundingClientRect();

  if (isColliding(charRect, wallRect)) {
    if (player.direction === "down") {
      player.y = wall.offsetTop - player.height;
    } else if (player.direction === "up") {
      player.y = wall.offsetTop + wall.offsetHeight;
    }
    character.style.top = player.y + "px";
  }
}

function checkProgressBoardCollision() {
  if (game.currentMap !== 2) return; // Only available in Map 2
  const charRect = character.getBoundingClientRect();
  const boardRect = progressBoard.getBoundingClientRect();
  if (isColliding(charRect, boardRect)) {
    const hint = progressBoard.querySelector(".interactHint");
    hint.style.display = "block";
    hint.style.top = (progressBoard.offsetTop - 30) + "px";
    hint.style.left = progressBoard.offsetLeft + "px";
  } else {
    progressBoard.querySelector(".interactHint").style.display = "none";
  }
}

function checkNewNPCCCollision() {
  const npc = document.getElementById("newNPC");
  if (!npc || npc.style.display === "none") return;
  const charRect = character.getBoundingClientRect();
  const npcRect = npc.getBoundingClientRect();
  const hint = document.getElementById("newNPCHint");
  if (isColliding(charRect, npcRect)) {
    hint.style.display = "block";
  } else {
    hint.style.display = "none";
  }
}

function checkBroomCollision() {
  const broom = document.getElementById("broom");
  if (!broom || broom.style.display === "none" || quest.broomPicked) return;
  const charRect = character.getBoundingClientRect();
  const broomRect = broom.getBoundingClientRect();
  const hint = document.getElementById("broomHint");
  if (isColliding(charRect, broomRect)) {
    hint.style.display = "block";
  } else {
    hint.style.display = "none";
  }
}

function checkMessCollision() {
  const mess = document.getElementById("mess");
  if (!mess || mess.style.display === "none" || quest.cleaningQuestDone) return;
  const charRect = character.getBoundingClientRect();
  const messRect = mess.getBoundingClientRect();
  const hint = document.getElementById("messHint");
  if (isColliding(charRect, messRect)) {
    hint.style.display = "block";
  } else {
    hint.style.display = "none";
  }
}

function checkQuizNPCCCollision() {
  const npc = document.getElementById("quizNPC");
  if (!npc || npc.style.display === "none" || quest.quizQuestDone) return;
  const charRect = character.getBoundingClientRect();
  const npcRect = npc.getBoundingClientRect();
  const hint = document.getElementById("quizNPCHint");
  if (isColliding(charRect, npcRect)) {
    hint.style.display = "block";
  } else {
    hint.style.display = "none";
  }
}

// ==========================================
// SHOW PROGRESS OVERLAY
// ==========================================
function showProgressOverlay() {
  progressText.innerHTML = `
    <p>Quests Completed: ${quest.questsDone} / 15</p>
    <p>Papers Collected: ${quest.papersCollected} / 3</p>
  `;
  progressOverlay.style.display = "flex";
}

function hideProgressOverlay() {
  progressOverlay.style.display = "none";
}

closeProgressBtn.addEventListener("click", () => {
  hideProgressOverlay();
});

// ==========================================
// MAP / BORDER HANDLING
// ==========================================

function handleBoundaries() {
  const gameWidth = gameArea.offsetWidth;
  const gameHeight = gameArea.offsetHeight;

  if (player.y < 0) player.y = 0;
  if (player.y > gameHeight - player.height) player.y = gameHeight - player.height;

  // Map 1 → Map 2 teleport (left edge)
  if (game.currentMap === 1 && player.x < 10) {
    if (quest.map2Unlocked) {
      switchToMap2();
    }
    return;
  }

  // Map 2 → Map 1 teleport (right edge)
  if (game.currentMap === 2 && player.x > gameWidth - player.width - 10) {
    switchToMap1();
    return;
  }

  // Clamp inside map horizontally
  if (player.x < 0) player.x = 0;
  if (player.x > gameWidth - player.width) player.x = gameWidth - player.width;
}

// ==========================================
// GAME LOOP
// ==========================================

function startGameLoop() {
  if (!game.gameLoopId) {
    gameLoop();
  }
}

function gameLoop() {
  if (inMenu) return; // Prevent movement when in main menu
  game.gameLoopId = requestAnimationFrame(gameLoop);
  let moved = false;
  let newDirection = player.direction;

  if (!player.inCleaning && game.directionKeyCount === 1) {
    // Detect movement keys
    if (game.keys['w'] || game.keys['arrowup']) {
      newDirection = 'up';
      moved = true;
    } else if (game.keys['s'] || game.keys['arrowdown']) {
      newDirection = 'down';
      moved = true;
    } else if (game.keys['a'] || game.keys['arrowleft']) {
      newDirection = 'left';
      moved = true;
    } else if (game.keys['d'] || game.keys['arrowright']) {
      newDirection = 'right';
      moved = true;
    }
  }

  if (moved) {
    player.direction = newDirection;
    checkWallCollision();

    // Apply movement
    if (game.keys['w'] || game.keys['arrowup']) player.y -= game.moveSpeed;
    if (game.keys['s'] || game.keys['arrowdown']) player.y += game.moveSpeed;
    if (game.keys['a'] || game.keys['arrowleft']) player.x -= game.moveSpeed;
    if (game.keys['d'] || game.keys['arrowright']) player.x += game.moveSpeed;

    startWalking(player.direction); // <-- animate walking
    handleBoundaries();
    clampPosition();

    // Update character DOM
    character.style.top = player.y + "px";
    character.style.left = player.x + "px";

    checkProgressBoardCollision();
    checkNewNPCCCollision();
    checkBroomCollision();
    checkMessCollision();
    checkQuizNPCCCollision();
  } else {
    if (!player.inCleaning) {
      stopWalking(); // <-- reset to standing frame
    }
  }
}

function stopGameLoop() {
  if (game.gameLoopId) {
    cancelAnimationFrame(game.gameLoopId);
    game.gameLoopId = null;
  }
}

function clampPosition() {
  const maxX = gameArea.clientWidth - player.width;
  const maxY = gameArea.clientHeight - player.height;
  if (player.x < 0) player.x = 0;
  if (player.y < 0) player.y = 0;
  if (player.x > maxX) player.x = maxX;
  if (player.y > maxY) player.y = maxY;
}

// ==========================================
// WALKING ANIMATION
// ==========================================

function startWalking(direction) {
  if (!player.walkInterval) {
    player.walkInterval = setInterval(() => {
      player.walkFrame = (player.walkFrame % 2) + 1; // cycle frames 1-2 for walking
      const spritePath = getWalkSprite(direction, player.walkFrame);
      character.src = spritePath;
    }, 255); 
  }
}

function stopWalking() {
  if (player.walkInterval) {
    clearInterval(player.walkInterval);
    player.walkInterval = null;
  }
  player.walkFrame = 1;
  const idleSprite = getIdleSprite(player.direction);
  character.src = idleSprite;
}

// ==========================================
// MAP SWITCH FUNCTIONS
// ==========================================
function switchToMap2() {
  showLoading(800);
  setTimeout(() => {
    game.currentMap = 2;
    gameArea.style.backgroundImage = "url('imgs/mapsandsolidobjects/Officefloor.png')";
    wall1.style.display = "none";
    wall2.style.display = "block";
    progressBoard.style.display = "block";
    document.getElementById("quizNPC").style.display = "block";
    player.x = gameArea.offsetWidth - player.width - 10;
    updateCharacter();

    hideLoading();
  }, 800);
}

function switchToMap1() {
  showLoading(800);
  setTimeout(() => {
    game.currentMap = 1;
    gameArea.style.backgroundImage = "url('imgs/mapsandsolidobjects/demomap.png')";
    wall1.style.display = "block";
    wall2.style.display = "none";
    progressBoard.style.display = "none";
    player.x = 10;
    updateCharacter();
    hideLoading();
  }, 800);
}

function updateCharacter() {
  const idleSprite = getIdleSprite(player.direction);
  character.src = idleSprite;

  // Add error handling for missing sprites
  character.onerror = function() {
    console.warn(`Sprite not found: ${idleSprite}, using default sprite`);
    // Fallback to default character sprite
    this.src = "imgs/sarah/Girlfrontwalk-idle.png";
  };

  character.style.left = player.x + "px";
  character.style.top = player.y + "px";
}

// ==========================================
// AUDIO SYSTEM
// ==========================================

function playButtonSound() {
  buttonAudio.currentTime = 0;
  buttonAudio.play().catch(() => {
    // Audio play blocked by browser
  });
}

function setMusicVolume(val, fromMaster = false) {
  tutmusic.volume = val;
  introAudio.volume = val;
  rewardAudio.volume = val;
  startAudio.volume = val;

  if (!fromMaster) {
    checkCustomVolume();
  }
}

function playBackgroundMusic() {
  if (tutmusic && tutmusic.paused && !inMenu) {
    // Resume from current position instead of resetting to 0
    tutmusic.volume = musicVolumeSlider ? musicVolumeSlider.value : 1;
    tutmusic.play().catch(() => {
      // Audio play failed, but that's okay
    });
  }
}

function stopBackgroundMusic() {
  if (tutmusic) {
    tutmusic.pause();
    tutmusic.currentTime = 0;
  }
}

function setButtonVolume(val, fromMaster = false) {
  buttonAudio.volume = val;
  settingsButtonAudio.volume = val;
  galleryButtonAudio.volume = val;

  if (!fromMaster) {
    checkCustomVolume();
  }
}

function checkCustomVolume() {
  const masterVal = parseFloat(masterVolumeSlider.value);
  const musicVal = parseFloat(musicVolumeSlider.value);
  const buttonVal = parseFloat(buttonVolumeSlider.value);

  isCustomVolume = (musicVal !== masterVal || buttonVal !== masterVal);
  customVolumeText.style.display = isCustomVolume ? "inline" : "none";
}

function setMasterVolume(val) {
  setMusicVolume(val, true);
  setButtonVolume(val, true);
  // Also set sound effects volumes
  rewardAudio.volume = val;
  achievementAudio.volume = val;
  dialogueBeep.volume = val;
  selectionAudio.volume = val;
  musicVolumeSlider.value = val;
  buttonVolumeSlider.value = val;
  updateSliderColor(musicVolumeSlider);
  updateSliderColor(buttonVolumeSlider);
  isCustomVolume = false;
  customVolumeText.style.display = "none";
  localStorage.setItem("masterVolume", val);
}

function setMovementSpeed(val) {
  // Clamp value between 0.95 and 1.25
  val = Math.max(0.95, Math.min(1.25, val));
  game.moveSpeed = val;
  movementSpeedInput.value = val;
  localStorage.setItem("movementSpeed", val);
}

function updateSliderColor(slider) {
  const val = slider.value;
  const percent = (val - slider.min) / (slider.max - slider.min) * 100;
  slider.style.background = `linear-gradient(to right, rgb(48, 103, 180) ${percent}%, #14151b ${percent}%)`;
}

// ==========================================
// SAVE & LOAD SYSTEM
// ==========================================

function getGameState() {
  return {
    playerName: player.name,
    selectedCharacter: player.character,
    x: player.x,
    y: player.y,
    currentDirection: player.direction,
    equipped: player.equipped,
    inCleaning: player.inCleaning,
    questStarted: quest.started,
    questFinished: quest.finished,
    rewardClaimed: quest.rewardClaimed,
    questAccepted: quest.accepted,
    currentMap: game.currentMap,
    anneQuestStarted: quest.anneStarted,
    anneQuestFinished: quest.anneFinished,
    anneRewardClaimed: quest.anneRewardClaimed,
    questsDone: quest.questsDone,
    papersCollected: quest.papersCollected,
    cleaningQuestAccepted: quest.cleaningQuestAccepted,
    cleaningQuestDone: quest.cleaningQuestDone,
    broomPicked: quest.broomPicked,
    quizStarted: quiz.started,
    currentQuestionIndex: quiz.currentQuestionIndex,
    quizFailedAttempts: quiz.failedAttempts,
    quizQuestAccepted: quest.quizQuestAccepted,
    quizQuestDone: quest.quizQuestDone,
    map2Unlocked: quest.map2Unlocked
  };
}

function setGameState(state) {
  player.name = state.playerName;
  player.character = state.selectedCharacter;
  player.x = state.x;
  player.y = state.y;
  player.direction = state.currentDirection;
  player.equipped = state.equipped || null;
  player.inCleaning = state.inCleaning || false;
  quest.started = state.questStarted;
  quest.finished = state.questFinished;
  quest.rewardClaimed = state.rewardClaimed;
  quest.accepted = state.questAccepted;
  game.currentMap = state.currentMap ?? 1;
  quest.anneStarted = state.anneQuestStarted;
  quest.anneFinished = state.anneQuestFinished;
  quest.anneRewardClaimed = state.anneRewardClaimed;
  quest.questsDone = state.questsDone;
  quest.papersCollected = state.papersCollected;
  quest.cleaningQuestAccepted = state.cleaningQuestAccepted || false;
  quest.cleaningQuestDone = state.cleaningQuestDone || false;
  quest.broomPicked = state.broomPicked || false;
  quiz.started = state.quizStarted || false;
  quiz.currentQuestionIndex = state.currentQuestionIndex || 0;
  quiz.failedAttempts = state.quizFailedAttempts || 0;
  quest.quizQuestAccepted = state.quizQuestAccepted || false;
  quest.quizQuestDone = state.quizQuestDone || false;
  quest.map2Unlocked = state.map2Unlocked || false;

  if (player.inCleaning) {
    character.src = getCleanSprite();
  } else {
    character.src = getIdleSprite(player.direction);
  }
  character.style.left = player.x + "px";
  character.style.top = player.y + "px";

  // Restore game state
  if (quest.cleaningQuestAccepted) {
    spawnBroomAndMess();
    updateQuestBox();
  }
  if (quest.broomPicked) {
    const broom = document.getElementById("broom");
    const hint = document.getElementById("broomHint");
    if (broom) {
      broom.style.display = "none";
      hint.style.display = "none";
    }
  }
  if (quest.cleaningQuestDone) {
    const mess = document.getElementById("mess");
    const hint = document.getElementById("messHint");
    if (mess) {
      mess.style.display = "none";
      hint.style.display = "none";
    }
  }
}

function saveGame(index) {
  let saves = JSON.parse(localStorage.getItem("saves") || "[]");

  if (typeof index === "number") {
    const name = saves[index]?.name || `Save ${index + 1}`;
    saves[index] = { name, data: getGameState() };
  } else {
    if (saves.length >= 5) {
      alert("Save slot limit reached (5). Please remove a slot first.");
      return;
    }
    const name = `Save ${saves.length + 1}`;
    saves.push({ name, data: getGameState() });
  }

  localStorage.setItem("saves", JSON.stringify(saves));
  renderSlots();

  if (save.exitAfterSave) {
    save.exitAfterSave = false;
    loadGameOverlay.style.display = "none";
    gameArea.style.display = "none";
    mainMenu.style.display = "flex";
  }
}

function loadGame(slotIndex) {
  const saves = JSON.parse(localStorage.getItem("saves") || "[]");
  const slot = saves[slotIndex];
  if (!slot || !slot.data) {
    alert("This slot is empty. Please save a game first!");
    return;
  }
  setGameState(slot.data);
  loadGameOverlay.style.display = "none";
  mainMenu.style.display = "none";
  nameFormOverlay.style.display = "none";
  saveBtn.style.display = "block";
}

function removeSlot(index) {
  let saves = JSON.parse(localStorage.getItem("saves") || "[]");
  if (!saves[index]) return;
  if (!confirm("Delete this save? This action cannot be undone.")) return;

  saves.splice(index, 1);
  for (let i = 0; i < saves.length; i++) {
    if (!saves[i].name || saves[i].name.startsWith("Save ")) {
      saves[i].name = saves[i].name || `Save ${i + 1}`;
    }
  }

  localStorage.setItem("saves", JSON.stringify(saves));
  renderSlots();
}

function renderSlots() {
  const slotsDiv = saveSlots;
  slotsDiv.innerHTML = "";
  let saves = JSON.parse(localStorage.getItem("saves") || "[]");

  if (saves.length === 0) {
    const p = document.createElement("p");
    p.textContent = "No saves yet. Click Create to create a new progress.";
    slotsDiv.appendChild(p);
  }

  saves.forEach((slot, i) => {
    const div = document.createElement("div");
    div.className = "saveSlot";
    const input = document.createElement("input");
    input.type = "text";
    input.value = slot.name || `Save ${i + 1}`;
    input.addEventListener("change", () => renameSlot(i, input.value));
    div.appendChild(input);
    const loadBtn = document.createElement("button");
    if (!slot.data) {
      loadBtn.textContent = "Empty";
      loadBtn.disabled = true;
    } else {
      loadBtn.textContent = "Load";
      loadBtn.addEventListener("click", () => loadGame(i));
    }
    div.appendChild(loadBtn);
    const updateBtn = document.createElement("button");
    updateBtn.textContent = "Update";
    updateBtn.addEventListener("click", () => saveGame(i));
    div.appendChild(updateBtn);

    const removeBtn = document.createElement("button");
    removeBtn.textContent = "Remove";
    removeBtn.style.color = "red";
    removeBtn.addEventListener("click", () => removeSlot(i));
    div.appendChild(removeBtn);

    slotsDiv.appendChild(div);
  });
  if (saves.length < 5) {
    const newDiv = document.createElement("div");
    newDiv.className = "saveSlot newSave";

    const createBtn = document.createElement("button");
    createBtn.textContent = "Create New Save";
    createBtn.addEventListener("click", () => saveGame());
    newDiv.appendChild(createBtn);

    slotsDiv.appendChild(newDiv);
  }

  localStorage.setItem("saves", JSON.stringify(saves));
}

function renameSlot(i, newName) {
  let saves = JSON.parse(localStorage.getItem("saves") || "[]");
  if (saves[i]) {
    saves[i].name = newName;
    localStorage.setItem("saves", JSON.stringify(saves));
    renderSlots();
  }
}

// ==========================================
// EXIT GAME SYSTEM
// ==========================================

function startMainGame() {
  // Ensure intro is hidden
  introOverlay.style.display = "none";
  nameFormOverlay.style.display = "none";

  // Show game elements
  gameArea.style.display = "block";

  // Hide main menu
  mainMenu.style.display = "none";

  // Start game loop if not already running
  if (!game.gameLoopId) {
    startGameLoop();
  }
}

// ==========================================
// EVENT LISTENERS
// ==========================================

document.addEventListener("DOMContentLoaded", () => {
  // Load instant dialogue setting
  const savedInstant = localStorage.getItem("instantDialogue");
  if (savedInstant && instantToggleBtn) {
    instantToggleBtn.dataset.state = savedInstant;
    instantToggleBtn.textContent = savedInstant.toUpperCase();
    player.instantDialogue = (savedInstant === "on");
  }

  // Load filter setting
  const savedFilter = localStorage.getItem("currentFilterIndex");
  if (savedFilter !== null) {
    currentFilterIndex = parseInt(savedFilter);
    updateFilterDisplay();
  }

  // Load volume settings
  const savedMasterVolume = localStorage.getItem("masterVolume");
  if (savedMasterVolume !== null) {
    masterVolumeSlider.value = savedMasterVolume;
    setMasterVolume(savedMasterVolume);
    updateSliderColor(masterVolumeSlider);
  }

  const savedMusicVolume = localStorage.getItem("musicVolume");
  if (savedMusicVolume !== null) {
    musicVolumeSlider.value = savedMusicVolume;
    setMusicVolume(savedMusicVolume);
    updateSliderColor(musicVolumeSlider);
  }

  const savedButtonVolume = localStorage.getItem("buttonVolume");
  if (savedButtonVolume !== null) {
    buttonVolumeSlider.value = savedButtonVolume;
    setButtonVolume(savedButtonVolume);
    updateSliderColor(buttonVolumeSlider);
  }

  const savedMovementSpeed = localStorage.getItem("movementSpeed");
  if (savedMovementSpeed !== null) {
    setMovementSpeed(parseFloat(savedMovementSpeed));
  }

  renderSlots();
});

// Main menu buttons
loadBtn.addEventListener("click", () => {
  loadGameOverlay.style.display = "flex";
  renderSlots();
});

closeLoadBtn.addEventListener("click", () => {
  loadGameOverlay.style.display = "none";
});

rewardBtn.addEventListener("click", () => {
  rewardPopup.style.display = "none";
  rewardAudio.pause();
  rewardAudio.currentTime = 0;
  quest.rewardClaimed = true;
  playBackgroundMusic();
});

exitBtn.addEventListener("click", () => {
  mainMenu.style.display = "flex";
  gameArea.style.display = "none";

  // Reset audio to menu
  stopBackgroundMusic();
  stopGameLoop(); // Stop game loop when exiting to menu
  gameControls.style.display = "none"; // Hide game controls when exiting
  inMenu = true;
  startAudio.play().catch(() => {});
});

saveAndExitBtn.addEventListener("click", () => {
  exitConfirmOverlay.style.display = "none";
  loadGameOverlay.style.display = "flex";
  renderSlots();
  save.exitAfterSave = true;

  const saveSlotsDiv = saveSlots;
  saveSlotsDiv.querySelectorAll("button").forEach(btn => {
    if (btn.textContent === "Update") {
      btn.addEventListener("click", () => {
        loadGameOverlay.style.display = "none";
        gameArea.style.display = "none";
        mainMenu.style.display = "flex";
      }, { once: true });
    }
  });
});

exitNoSaveBtn.addEventListener("click", () => {
  exitConfirmOverlay.style.display = "none";
  gameArea.style.display = "none";
  mainMenu.style.display = "flex";
});

cancelExitBtn.addEventListener("click", () => {
  exitConfirmOverlay.style.display = "none";
});

// Save button
saveBtn.addEventListener("click", () => {
  loadGameOverlay.style.display = "flex";
  renderSlots();
});

// Game badges button
const gameBadgeBtn = document.getElementById("gameBadgeBtn");
if (gameBadgeBtn) {
  gameBadgeBtn.addEventListener("click", () => {
    populateBadges();
    badgesOverlay.style.display = "flex";
  });
}

// Quest pop-up toggle
const questBox = document.getElementById("questBox");

function toggleQuestDropdown() {
  questBox.style.display = questBox.style.display === "flex" ? "none" : "flex";
}

// Button sounds
document.querySelectorAll("button").forEach(btn => {
  btn.addEventListener("click", (e) => {
    if (e.target.id === "mainMenuSettingsBtn" || e.target.id === "settingsButton" || e.target.id === "galleryBtn") return;
    playButtonSound();
  });
});
document.querySelectorAll(".characterOption").forEach(option => {
  option.addEventListener("click", playButtonSound);
});

// Volume sliders
setMusicVolume(musicVolumeSlider.value);
setButtonVolume(buttonVolumeSlider.value);
masterVolumeSlider.addEventListener("input", (e) => {
  setMasterVolume(e.target.value);
  updateSliderColor(masterVolumeSlider);
  // If background music is supposed to be playing but is paused, restart it
  if (!inMenu && tutmusic && tutmusic.paused) {
    playBackgroundMusic();
  }
});
musicVolumeSlider.addEventListener("input", (e) => {
  setMusicVolume(e.target.value);
  localStorage.setItem("musicVolume", e.target.value);
  // If background music is supposed to be playing but is paused, restart it
  if (!inMenu && tutmusic && tutmusic.paused) {
    playBackgroundMusic();
  }
});
buttonVolumeSlider.addEventListener("input", (e) => {
  setButtonVolume(e.target.value);
  localStorage.setItem("buttonVolume", e.target.value);
});

[masterVolumeSlider, musicVolumeSlider, buttonVolumeSlider].forEach(slider => {
  updateSliderColor(slider);
  slider.addEventListener("input", () => updateSliderColor(slider));
});

movementSpeedInput.addEventListener("input", (e) => {
  setMovementSpeed(parseFloat(e.target.value));
});


// ==========================================
// PLAYER INPUT (Movement + Interactions)
// ==========================================

document.addEventListener("keydown", (event) => {
  const key = event.key.toLowerCase();
  if (isLoading) return;
  if (player.inIntro) {
    if (key === "e" || key === "enter") {
      if (dialogue.introTyping) {
        clearInterval(dialogue.introTyping);
        dialogue.introTyping = null;
        introText.textContent = dialogue.introCurrent;
        dialogue.introIndex = dialogue.introCurrent.length;
        introHint.style.display = "block";
      } else {
        dialogue.playNextIntroLine();
      }
    }
    return;
  }

  // --- QUEST TOGGLE ---
  if (key === "tab" && !inMenu) {
    event.preventDefault();
    toggleQuestDropdown();
    return;
  }

  // --- GAME CONTROLS TOGGLE ---
  if (key === "escape") {
    event.preventDefault();
    if (!inMenu) {
      const isVisible = gameControls.style.display !== "none";
      gameControls.style.display = isVisible ? "none" : "flex";
      if (isVisible) {
        gameArea.classList.remove("blurred");
      } else {
        gameArea.classList.add("blurred");
      }
    }
    return;
  }

  // --- MOVEMENT KEYS ---
  if (['w','a','s','d','arrowup','arrowdown','arrowleft','arrowright'].includes(key)) {
    event.preventDefault();
    if (!game.keys[key]) {
      game.directionKeyCount++;
    }
    game.keys[key] = true;
    if (!game.gameLoopId) {
      startGameLoop();
    }
  }

  // --- INTERACT KEYS ---
  if (key === "e" || key === "enter") {
    if (progressBoard.querySelector(".interactHint").style.display === "block") {
      showProgressOverlay();
    }

    const npcHint = document.getElementById("newNPCHint");
    if (npcHint && npcHint.style.display === "block" && newNPCDialogue.style.display === "none") {
      if (quest.cleaningQuestDone) {
        startMaamJuneDialogue("Maam June", "imgs/Npcs/maam june.png", [
         "Great job on finishing your first quest!",
         "That's what you call objective.",
         "Now... there's another kind of quest that is the quiz type!",
         "That's where you answer questions of the npcs that have this kind of mechanic.",
         "In order to obtain this kind of quest, you need to find a specific npc that has this mechanic!",
         "This kind of quests can be found amongst professors that are located on the rooms in the main game.",
         "Remember, quests and objectives can get difficult as you go further in quests!",
         "Now, to obtain a quest, you must find the npc i set for you on the left side of the map! I'll talk to you again as you obtain your second quest!",
         "See ya!"
       ], () => { quest.map2Unlocked = true; });
        const npc = document.getElementById("newNPC");
        if (npc) {
          npc.style.opacity = "0";
          npcHint.style.display = "none";
          setTimeout(() => {
            npc.style.display = "none";
          }, 1000);
        }
      } else {
        startNewNPCDialogue();
      }
    }

    // Check for broom pickup
    const broomHint = document.getElementById("broomHint");
    if (broomHint && broomHint.style.display === "block") {
      pickUpBroom();
    }

    // Check for mess cleaning
    const messHint = document.getElementById("messHint");
    if (messHint && messHint.style.display === "block" && player.equipped === "broom") {
      cleanMess();
    }

    // Check for quiz NPC interaction
    const quizNPCHint = document.getElementById("quizNPCHint");
    if (quizNPCHint && quizNPCHint.style.display === "block" && quizDialogue.style.display === "none" && !quest.quizQuestDone) {
      startQuizDialogue();
    }

    // No flower collection logic needed
  }
});

document.addEventListener("keyup", (event) => {
  const key = event.key.toLowerCase();

  if (['w','a','s','d','arrowup','arrowdown','arrowleft','arrowright'].includes(key)) {
    if (game.keys[key]) {
      game.directionKeyCount--;
    }
    game.keys[key] = false;

    if (game.directionKeyCount === 0) {
      stopGameLoop();
      stopWalking();
    }
  }
});

// =============================
// ONE-TIME CLEANUP OF OLD SAVES
// =============================

for (let i = 0; i < 20; i++) {
  localStorage.removeItem("saveSlot" + i);
}

let oldSaves = JSON.parse(localStorage.getItem("saves") || "[]");
oldSaves = oldSaves.filter(slot => slot && slot.data);
localStorage.setItem("saves", JSON.stringify(oldSaves));

// =============================
// GALLERY FEATURE
// =============================
document.addEventListener("DOMContentLoaded", () => {
  const galleryOverlay = document.getElementById("galleryOverlay");
  const galleryBtn = document.getElementById("galleryBtn");
  const closeGallery = document.getElementById("closeGallery");
  const galleryImage = document.getElementById("galleryImage");
  const galleryCaption = document.getElementById("galleryCaption");
  const prevImg = document.getElementById("prevImg");
  const nextImg = document.getElementById("nextImg");

  // Images and captions
  const galleryItems = [
    { src: "imgs/loading screen.png", caption: "Quest for Research Sarah Art by Roque" },
    { src: "imgs/upon the quest!.png", caption: "Upon the Quest! Art by Roque" },
    { src: "imgs/New game.png", caption: "Sarah Art by Roque" },
    { src: "imgs/Sti Background.png", caption: "STI Building by Roque" },
    { src: "imgs/charasheet.png", caption: "Player character sheet by Roque" },
    { src: "imgs/NPCS.png", caption: "NPCs sheet by Roque" },
    { src: "imgs/npcs2.png", caption: "NPCs sheet by Roque" },
    { src: "imgs/sheet.png", caption: "Old player character sheet by Roque" },
    { src: "imgs/sheet2.png", caption: "Old player character sheet by Roque" },
    { src: "imgs/maam lucy.png", caption: "Scrapped Ma'am Lucy by Roque" },
    { src: "imgs/qplaceholder.png", caption: "Very first npc (Placeholder) by Roque" },
    { src: "imgs/favicon.png", caption: "Favicon by Roque" },
    { src: "imgs/nothing like yall.png", caption: "I'm nothing like yall" },
  ];

  let currentIndex = 0;

  function showImage(index) {
    if (index < 0) index = galleryItems.length - 1;
    if (index >= galleryItems.length) index = 0;
    currentIndex = index;
    galleryImage.src = galleryItems[currentIndex].src;
    galleryCaption.textContent = galleryItems[currentIndex].caption;
  }

  // Open gallery
  galleryBtn.addEventListener("click", (e) => {
    galleryButtonAudio.currentTime = 0;
    galleryButtonAudio.play().catch(() => {});
    galleryOverlay.style.display = "flex";
    showImage(currentIndex);
    e.stopPropagation();

    // Unlock gallery badge
    if (!achievements.galleryVisited) {
      achievements.galleryVisited = true;
      localStorage.setItem('achievements', JSON.stringify(achievements));
      showAchievement("Art Enthusiast", "imgs/gallery badge.png");
    }
  });

  // Close gallery
  closeGallery.addEventListener("click", () => {
    galleryOverlay.style.display = "none";
  });

  // Navigation buttons
  prevImg.addEventListener("click", () => {
    showImage(currentIndex - 1);
  });
  nextImg.addEventListener("click", () => {
    showImage(currentIndex + 1);
  });

  // Keyboard controls
  document.addEventListener("keydown", (e) => {
    if (galleryOverlay.style.display === "flex") {
      if (e.key.toLowerCase() === "q" || e.key === "ArrowLeft") {
        showImage(currentIndex - 1);
      } else if (e.key.toLowerCase() === "e" || e.key === "ArrowRight") {
        showImage(currentIndex + 1);
      } else if (e.key === "Escape") {
        galleryOverlay.style.display = "none";
      }
      e.stopPropagation();
    }
  });
});

// =============================
// CRT EFFECT
// =============================

document.getElementById("mainMenuSettingsBtn").addEventListener("click", () => {
  document.getElementById("crtOverlay").style.display =
    document.getElementById("crtOverlay").style.display === "none" ? "block" : "none";
});

// =============================
// MAIN MENU SETTINGS BUTTON
// =============================

mainMenuSettingsBtn.addEventListener("click", () => {
  settingsOverlay.style.display = "flex";
});

// End demo overlay button
const backToMenuBtn = document.getElementById("backToMenuBtn");
if (backToMenuBtn) {
  backToMenuBtn.addEventListener("click", () => {
    // Hide overlay
    const overlay = document.getElementById("endDemoOverlay");
    overlay.style.display = "none";

    // Reset character selection
    player.character = null;
    player.name = "Unnamed Student";
    playerNameInput.value = player.name;
    characterPreview.src = "";

    // Reset game state
    quest.questsDone = 0;
    quest.papersCollected = 0;
    quest.cleaningQuestAccepted = false;
    quest.cleaningQuestDone = false;
    quest.broomPicked = false;
    quest.quizQuestAccepted = false;
    quest.quizQuestDone = false;
    quest.map2Unlocked = false;
    quiz.started = false;
    quiz.currentQuestionIndex = 0;
    quiz.failedAttempts = 0;
    game.currentMap = 1;

    // Reset achievements for new game
    achievements.tutorialCompleted = false;
    localStorage.setItem('achievements', JSON.stringify(achievements));

    // Go to main menu
    mainMenu.style.display = "flex";
    gameArea.style.display = "none";
    nameFormOverlay.style.display = "none";

    // Reset audio to menu
    stopBackgroundMusic();
    stopGameLoop();
    gameControls.style.display = "none";
    inMenu = true;
    startAudio.play().catch(() => {});
  });
}

// =============================
// FILTERS SYSTEM
// =============================

function clearFilters() {
  document.body.classList.remove("warmMode", "gameboyMode");
  warmOverlay.style.display = "none";
  gameboyOverlay.style.display = "none";
  localStorage.setItem("warmMode", "off");
  localStorage.setItem("gameboyMode", "off");
}

// ==========================================
// ACHIEVEMENT SYSTEM
// ==========================================

const achievements = {
  tutorialCompleted: false,
  secretBadge: false,
  galleryVisited: false,
  demoTester: false,
  angerBadge: false
};

const badges = [
  {
    id: 'allbadgesCompletion',
    title: 'Exellence',
    description: 'Collected all of the existing badge in the index!',
    icon: 'imgs/Exellence badge.png',
    tier: 'Platinum'
  },
  {
    id: 'fullquestCompletion',
    title: 'Determined',
    description: 'Completed all of the quest including the extra quests!',
    icon: 'imgs/full quest badge.png',
    tier: 'Platinum'
  },
  {
    id: 'secretBadge',
    title: 'Such wise website!',
    description: 'Found the wise link!',
    icon: 'imgs/secret badge.png',
    tier: 'Platinum'
  },
  {
    id: 'galleryVisited',
    title: 'Art Enthusiast',
    description: 'Visited the gallery!',
    icon: 'imgs/gallery badge.png',
    tier: 'Gold'
  },
  {
    id: 'demoTester',
    title: 'Demo Tester!',
    description: 'Only obtainable during demo testing!',
    icon: 'imgs/demo badge.png',
    tier: 'Gold'
  },
  {
    id: 'tutorialCompleted',
    title: 'Tutorial',
    description: 'Completed the tutorial!',
    icon: 'imgs/badge.png',
    tier: 'Gold'
  },
  {
    id: 'chapteroneComplete',
    title: 'Chapter 1',
    description: 'Completed the first 5 quests!',
    icon: 'imgs/chapter 1 badge.png',
    tier: 'Gold'
  },
  {
    id: 'chaptertwoComplete',
    title: 'Chapter 2',
    description: 'Completed the 10 quests!',
    icon: 'imgs/chapter 2 badge.png',
    tier: 'Gold'
  },
  {
    id: 'chapterthreeComplete',
    title: 'Chapter 3',
    description: 'Completed the 15 quests!',
    icon: 'imgs/chapter 3 badge.png',
    tier: 'Gold'
  },
  {
    id: 'defendedDone',
    title: 'Defended!',
    description: 'Successfully defended your research!',
    icon: 'imgs/defended badge.png',
    tier: 'Gold'
  },
  {
    id: 'noFails',
    title: 'Perfect!',
    description: 'No fails or retries on the quiz quests!',
    icon: 'imgs/S badge.png',
    tier: 'Emerald'
  },
  {
    id: 'angerBadge',
    title: 'Anger Management...',
    description: 'What were you doing...',
    icon: 'imgs/anger badge.png',
    tier: 'Common'
  },
];

function showAchievement(title, iconSrc = "imgs/badge.png") {
  if (!achievementBadge) return;

  // Update achievement content
  const achievementIcon = achievementBadge.querySelector('.achievement-icon');
  const achievementTitle = achievementBadge.querySelector('.achievement-title');

  if (achievementIcon) achievementIcon.src = iconSrc;
  if (achievementTitle) achievementTitle.textContent = title;

  // Show the achievement badge
  achievementBadge.classList.remove('hide');
  achievementBadge.classList.add('show');

  // Play achievement sound if available
  if (achievementAudio) {
    achievementAudio.currentTime = 0;
    achievementAudio.volume = musicVolumeSlider ? musicVolumeSlider.value * 0.7 : 0.7;
    achievementAudio.play().catch(() => {});
  }

  // Auto-hide after 5 seconds
  setTimeout(() => {
    hideAchievement();
  }, 5000);
}

function hideAchievement() {
  if (!achievementBadge) return;

  achievementBadge.classList.remove('show');
  achievementBadge.classList.add('hide');

  // Stop achievement audio
  if (achievementAudio) {
    achievementAudio.pause();
    achievementAudio.currentTime = 0;
  }
}

function unlockTutorialAchievement() {
  if (achievements.tutorialCompleted) return; // Already unlocked

  achievements.tutorialCompleted = true;
  localStorage.setItem('achievements', JSON.stringify(achievements));

  // Show achievement after a short delay
  setTimeout(() => {
    showAchievement("Tutorial!");
  }, 1000);

  // Show end demo overlay after achievement
  setTimeout(() => {
    showEndDemoOverlay();
  }, 6000);
}

// Load achievements from localStorage
function loadAchievements() {
  const saved = localStorage.getItem('achievements');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      Object.assign(achievements, parsed);
    } catch (e) {
      console.warn('Failed to load achievements:', e);
    }
  }
}

// Initialize achievements on page load
document.addEventListener('DOMContentLoaded', () => {
  loadAchievements();

  // Unlock demo tester badge on first load
  if (!achievements.demoTester) {
    achievements.demoTester = true;
    localStorage.setItem('achievements', JSON.stringify(achievements));
    // Don't show achievement popup for this one, as it's automatic
  }
});

