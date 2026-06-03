const loginForm =
document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", function(event) {

        event.preventDefault();

        const username =
        document.getElementById("username").value;

        const password =
        document.getElementById("password").value;

        if (

            username === "prova"
            &&
            password === "prova"

        ) {

            sessionStorage.setItem(
                "aethosAuth",
                "granted"
            );

            window.location.href =
            "../dashboard/workspace.html";

        }

        else {

            alert("ACCESS DENIED");

        }

    });
}
