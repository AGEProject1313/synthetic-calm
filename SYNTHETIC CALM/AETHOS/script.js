document.addEventListener("DOMContentLoaded", () => {
    const enterButton = document.getElementById("enterButton");
    const mobilityButton = document.getElementById("mobilityButton");

    if (typeof setProgress === "function") {
        setProgress("aethos_site_opened");
    }

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
});