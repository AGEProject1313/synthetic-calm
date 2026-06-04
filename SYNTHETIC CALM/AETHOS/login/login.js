const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const username = document.getElementById("username").value.trim();
        const password = document.getElementById("password").value.trim();

        if (
            username === "prova"
            &&
            password === "prova"
        ) {
            sessionStorage.setItem(
                "aethosAuth",
                "granted"
            );

            if (
                typeof setProgress === "function"
                &&
                typeof CASE_PROGRESS !== "undefined"
                &&
                CASE_PROGRESS.AETHOS_CREDENTIALS_SENT
            ) {
                setProgress(CASE_PROGRESS.AETHOS_CREDENTIALS_SENT);
            }

            window.location.href =
            "../dashboard/workspace.html";
        }

        else {
            alert("ACCESS DENIED");
        }
    });
}