const reportScreen = document.getElementById("reportScreen");
const incomingScreen = document.getElementById("incomingScreen");
const activeCallScreen = document.getElementById("activeCallScreen");
const endedScreen = document.getElementById("endedScreen");

const sendBtn = document.getElementById("sendBtn");
const sendStatus = document.getElementById("sendStatus");
const countdownEl = document.getElementById("countdown");
const timerEl = document.getElementById("timer");

const audio = new Audio("assets/giulia-final-call.mp3");

let callTimer = null;
let seconds = 0;

function lockViewport() {
  document.addEventListener("touchmove", function (e) {
    e.preventDefault();
  }, { passive: false });

  document.addEventListener("gesturestart", function (e) {
    e.preventDefault();
  });

  document.addEventListener("gesturechange", function (e) {
    e.preventDefault();
  });

  document.addEventListener("gestureend", function (e) {
    e.preventDefault();
  });
}

function showScreen(target) {
  [reportScreen, incomingScreen, activeCallScreen, endedScreen].forEach(screen => {
    screen.classList.remove("active");
  });

  target.classList.add("active");
}

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function startSequence() {
  sendBtn.disabled = true;

  sendStatus.textContent = "Reading final report...";
  await wait(900);

  sendStatus.textContent = "Compiling evidence package...";
  await wait(1100);

  sendStatus.textContent = "Sending to Giulia Verra...";
  await wait(1100);

  sendStatus.textContent = "Delivered.";
  await wait(900);

  showScreen(incomingScreen);
  startIncomingCall();
}

function startIncomingCall() {
  let count = 3;
  countdownEl.textContent = count;

  const interval = setInterval(() => {
    count -= 1;
    countdownEl.textContent = count;

    if (count <= 0) {
      clearInterval(interval);
      startActiveCall();
    }
  }, 1000);
}

function startActiveCall() {
  showScreen(activeCallScreen);

  seconds = 0;
  timerEl.textContent = "00:00";

  callTimer = setInterval(() => {
    seconds += 1;
    timerEl.textContent = `00:${String(seconds).padStart(2, "0")}`;
  }, 1000);

  audio.currentTime = 0;

  audio.play().catch(() => {
    timerEl.textContent = "Tap to enable audio";

    activeCallScreen.addEventListener("click", () => {
      timerEl.textContent = "00:00";
      audio.play();
    }, { once: true });
  });

  audio.onended = endCall;
}

function endCall() {
  clearInterval(callTimer);
  showScreen(endedScreen);
}

sendBtn.addEventListener("click", startSequence);

lockViewport();