const CORRECT_RESOLUTION = {
  culprit: "giulia",
  motive: "expose",
  method: "lin"
};

const evidence = [
  { id: "synthetic-calm-draft", title: "Synthetic Calm Draft", description: "Giulia knew before public discovery.", correct: true },
  { id: "nathan-final-audio", title: "Nathan Recovered Audio", description: "Confirms risk around restricted records.", correct: true },
  { id: "lin-access-2112", title: "LIN Access Log · 21:12", description: "Places Nathan inside the LIN.", correct: true },
  { id: "sm4418-black-pass", title: "SM-4418 / Black Pass", description: "Explains restricted access chain.", correct: true },
  { id: "sofia-mirel-interview", title: "Sofia Mirel Interview", description: "Clarifies the black pass issue.", correct: true },
  { id: "l12-inspection", title: "Nathan Apartment Inspection", description: "Shows outside-channel investigation.", correct: true },
  { id: "beacon-history", title: "Giulia's Beacon Archive", description: "Shows obsession with Veyra/Veil.", correct: true },
  { id: "ghost-teams", title: "Ghost Teams / Cleanup", description: "Explains scene control.", correct: true },
  { id: "aethos-filtered-records", title: "Filtered Aethos Records", description: "Shows controlled visibility.", correct: true },
  { id: "matchpoint-sofia", title: "MatchPoint Conversation", description: "Reconstructs access path.", correct: true },

  { id: "elias-threats", title: "Elias Threat Messages", description: "False lead.", correct: false },
  { id: "ava-relationship", title: "Ava / Nathan Relationship", description: "Background only.", correct: false },
  { id: "kessler-jealousy", title: "Kessler Jealousy Hypothesis", description: "False lead.", correct: false },
  { id: "food-hall-alibi", title: "Food Hall Alibi", description: "Useful for Sofia only.", correct: false },
  { id: "veil-public-speech", title: "Adrian Veil Public Speech", description: "Context, not proof.", correct: false }
];

function markProgress(flag) {
  if (
    window.setProgress &&
    window.CASE_PROGRESS &&
    CASE_PROGRESS[flag]
  ) {
    setProgress(CASE_PROGRESS[flag]);
  }
}

function hasCaseFlag(flag) {
  if (
    window.hasProgress &&
    window.CASE_PROGRESS &&
    CASE_PROGRESS[flag]
  ) {
    return hasProgress(CASE_PROGRESS[flag]);
  }

  return false;
}

function initAccess() {
  const lockedScreen = document.querySelector("#locked-screen");
  const reportScreen = document.querySelector("#report-screen");

  markProgress("FINAL_REPORT_OPENED");

  const unlocked = hasCaseFlag("SYNTHETIC_CALM_UNLOCKED");

  if (unlocked) {
    markProgress("FINAL_REPORT_UNLOCKED");

    lockedScreen.classList.add("hidden");
    reportScreen.classList.remove("hidden");
  } else {
    markProgress("FINAL_REPORT_LOCKED_VIEWED");

    lockedScreen.classList.remove("hidden");
    reportScreen.classList.add("hidden");
  }
}

function renderEvidence() {
  const evidenceList = document.querySelector("#evidence-list");

  evidenceList.innerHTML = evidence.map(item => `
    <label class="evidence-item">
      <input type="checkbox" value="${item.id}">
      <span>
        <strong>${item.title}</strong>
        <span>${item.description}</span>
      </span>
    </label>
  `).join("");
}

function validateResolution() {
  const culprit = document.querySelector("#culprit").value;
  const motive = document.querySelector("#motive").value;
  const method = document.querySelector("#method").value;
  const feedback = document.querySelector("#resolution-feedback");
  const phaseTwo = document.querySelector("#phase-two");

  if (!culprit || !motive || !method) {
    feedback.className = "feedback bad";
    feedback.textContent = "Report incomplete. Select all three resolution fields.";
    return;
  }

  const solved =
    culprit === CORRECT_RESOLUTION.culprit &&
    motive === CORRECT_RESOLUTION.motive &&
    method === CORRECT_RESOLUTION.method;

  if (solved) {
    markProgress("FINAL_REPORT_RESOLUTION_VALIDATED");
    markProgress("CASE_SOLVED");

    feedback.className = "feedback ok";
    feedback.textContent = "CASE SOLVED. Resolution accepted. Evidence matrix unlocked.";

    phaseTwo.classList.remove("hidden");
    phaseTwo.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  } else {
    feedback.className = "feedback bad";
    feedback.textContent = "CASE NOT SOLVED. Resolution rejected.";

    phaseTwo.classList.add("hidden");
  }
}

function calculateAccuracy() {
  const correctEvidence = evidence.filter(item => item.correct);
  const selectedIds = [
    ...document.querySelectorAll("#evidence-list input:checked")
  ].map(input => input.value);

  const selectedCorrect = correctEvidence.filter(item =>
    selectedIds.includes(item.id)
  );

  const score = Math.round(
    (selectedCorrect.length / correctEvidence.length) * 100
  );

  return {
    score,
    selectedIds
  };
}

function submitReport() {
  const processingScreen = document.querySelector("#processing-screen");
  const phaseOne = document.querySelector("#phase-one");
  const phaseTwo = document.querySelector("#phase-two");
  const resultScreen = document.querySelector("#result-screen");
  const progressBar = document.querySelector("#progress-bar");

  markProgress("FINAL_REPORT_EVIDENCE_SUBMITTED");
  markProgress("FINAL_REPORT_SUBMITTED");

  phaseOne.classList.add("hidden");
  phaseTwo.classList.add("hidden");
  processingScreen.classList.remove("hidden");

  processingScreen.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });

  let progress = 0;

  const timer = setInterval(() => {
    progress += 8;
    progressBar.style.width = `${Math.min(progress, 100)}%`;

    if (progress >= 100) {
      clearInterval(timer);

      const report = calculateAccuracy();

      showResult(report);

      processingScreen.classList.add("hidden");
      resultScreen.classList.remove("hidden");

      resultScreen.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }
  }, 140);
}

function showResult(report) {
  markProgress("FINAL_ACCURACY_RECORDED");

  const progress = getCaseProgress();
  progress.final_accuracy = report.score;
  progress.updatedAt = new Date().toISOString();
  localStorage.setItem("kairos_case_progress_v1", JSON.stringify(progress));

  document.querySelector("#accuracy-score").textContent = `${report.score}%`;

  const selected = new Set(report.selectedIds);

  document.querySelector("#evidence-breakdown").innerHTML =
    "<h3>Evidence Accuracy Breakdown</h3>" +
    evidence.map(item => {
      const contributes = item.correct && selected.has(item.id);
      const className = contributes ? "good" : "zero";
      const selectedLabel = selected.has(item.id)
        ? "SELECTED"
        : "NOT SELECTED";

      return `
        <div class="breakdown-row ${className}">
          <span>${item.title} · ${selectedLabel}</span>
          <strong>${contributes ? "+ accuracy" : "0%"}</strong>
        </div>
      `;
    }).join("");
}

document.addEventListener("DOMContentLoaded", () => {
  initAccess();
  renderEvidence();

  document
    .querySelector("#validate-resolution")
    ?.addEventListener("click", validateResolution);

  document
    .querySelector("#submit-report")
    ?.addEventListener("click", submitReport);
});