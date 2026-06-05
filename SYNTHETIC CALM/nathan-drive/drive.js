const modal = document.getElementById("modal");
const modalTitle = document.getElementById("modalTitle");
const modalContent = document.getElementById("modalContent");
const closeModal = document.getElementById("closeModal");

const files = {
    audio: {
        title: "death_recording.wav",
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
