document.addEventListener("DOMContentLoaded", () => {
    initDriveIndex();
    initDriveLogin();
});

function initDriveIndex() {
    const modal = document.getElementById("modal");
    const modalTitle = document.getElementById("modalTitle");
    const modalContent = document.getElementById("modalContent");
    const closeModal = document.getElementById("closeModal");

    if (!modal || !modalTitle || !modalContent || !closeModal) return;

    const files = {
        audio: {
            title: "recording_15122239.wav",
            content: `<span class="audio-line">[AUDIO RECOVERED — CORRUPTED TAIL]</span>

Nathan Verra:
I’m inside.

There’s nothing here.

Giulia, if you hear this... I think you were wrong.

Wait.

The door just closed.

No. No, no, no.

System? Open the door.

The ventilation stopped.

I can’t—

I can’t breathe.

Please.

Giulia...

<span class="audio-line">[FILE CORRUPTED]</span>`
        },

        notes: {
            title: "notes.txt",
            content: `15 DEC

Giulia sent me this thing again.

She says it's "important".

Looks like one of those old games she keeps talking about.

There must be something hidden inside.

I'll check it when I get back.

— N.V.`
        }
    };

    function openModal(fileKey) {
        const file = files[fileKey];
        if (!file) return;

        modalTitle.textContent = file.title;
        modalContent.innerHTML = file.content;
        modal.classList.remove("hidden");

        if (typeof setProgress === "function") {
            if (fileKey === "audio") setProgress("nathan_death_audio_opened");
            if (fileKey === "notes") setProgress("nathan_drive_notes_opened");
        }
    }

    document.querySelectorAll("[data-file]").forEach(button => {
        button.addEventListener("click", () => openModal(button.dataset.file));
    });

    closeModal.addEventListener("click", () => modal.classList.add("hidden"));

    modal.addEventListener("click", event => {
        if (event.target === modal) modal.classList.add("hidden");
    });

    if (typeof setProgress === "function") {
        setProgress("nathan_drive_opened");
    }
}

function initDriveLogin() {
    const hintBtn = document.getElementById("hintBtn");
    const audioBtn = document.getElementById("audioBtn");
    const buzzerAudio = document.getElementById("buzzerAudio");
    const captchaBtn = document.getElementById("captchaBtn");
    const authenticateBtn = document.getElementById("authenticateBtn");
    const loginStatus = document.getElementById("loginStatus");

    const segment1 = document.getElementById("segment1");
    const segment2 = document.getElementById("segment2");
    const segment3 = document.getElementById("segment3");

    if (!hintBtn || !audioBtn || !captchaBtn || !authenticateBtn) return;

    const PASSWORD_PART_1 = "2060";
    const PASSWORD_PART_2 = "POWER";
    const PASSWORD_PART_3 = "B214";

    function normalize(value) {
        return String(value || "")
            .trim()
            .replace(/\s+/g, "")
            .toUpperCase();
    }

    function setLoginStatus(message, type) {
        if (!loginStatus) return;

        loginStatus.textContent = message || "";
        loginStatus.classList.remove("error", "success");

        if (type) {
            loginStatus.classList.add(type);
        }
    }

    hintBtn.addEventListener("click", () => {
        setLoginStatus("BETWEEN THE CITY'S POWER AND ITS ENERGY LIES THE PROPER DISTANCE", null);
    });

    audioBtn.addEventListener("click", () => {
        setLoginStatus("THE SYSTEM DOES NOT TOLERATE DISORDER", null);

        if (!buzzerAudio) return;

        buzzerAudio.currentTime = 0;

        buzzerAudio.play().catch(() => {
            console.warn("Audio unavailable or blocked.");
        });
    });

captchaBtn.addEventListener("click", () => {
    setLoginStatus("EVERY JOURNEY ENDS AT HOME.", null);
});

    [segment1, segment2, segment3].forEach(input => {
        if (!input) return;

        input.addEventListener("input", () => {
            setLoginStatus("", null);
        });

        input.addEventListener("keydown", event => {
            if (event.key === "Enter") {
                authenticateBtn.click();
            }
        });
    });

    authenticateBtn.addEventListener("click", () => {
        const value1 = normalize(segment1.value);
        const value2 = normalize(segment2.value);
        const value3 = normalize(segment3.value);

        const valid =
            value1 === normalize(PASSWORD_PART_1) &&
            value2 === normalize(PASSWORD_PART_2) &&
            value3 === normalize(PASSWORD_PART_3);

        if (!valid) {
            setLoginStatus("AUTHENTICATION FAILED", "error");
            return;
        }

        setLoginStatus("AUTHENTICATION SUCCESSFUL", "success");

        if (typeof setProgress === "function") {
            setProgress("nathan_drive_login_unlocked");
        }

        setTimeout(() => {
            window.location.href = "index.html";
        }, 900);
    });
}