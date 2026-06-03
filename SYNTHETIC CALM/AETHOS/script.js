document.addEventListener("DOMContentLoaded", () => {
    const enterButton = document.getElementById("enterButton");
    const mobilityButton = document.getElementById("mobilityButton");

    if (enterButton) {
        enterButton.addEventListener("click", () => {
            window.location.href = "login/login.html";
        });
    }

    if (mobilityButton) {
        mobilityButton.addEventListener("click", () => {
            window.location.href = "mobility.html";
        });
    }

    if (typeof setProgress === "function") {
        if (typeof CASE_PROGRESS !== "undefined" && CASE_PROGRESS.AETHOS_SITE_OPENED) {
            setProgress(CASE_PROGRESS.AETHOS_SITE_OPENED);
        } else {
            setProgress("aethos_site_opened");
        }
    }
});
