/* AUTH CHECK */

if (sessionStorage.getItem("aethosAuth") !== "granted") {
    window.location.href = "../index.html";
}

/* ELEMENTS */

const subjectName = document.getElementById("subjectName");
const lifecareData = document.getElementById("lifecareData");
const accessData = document.getElementById("accessData");
const mobilityData = document.getElementById("mobilityData");
const buttons = document.querySelectorAll(".subject-btn");

/* DATABASE */

const residents = {

    nathan: {

        name: "Nathan Verra",

        lifecare: [
            ["STATUS", "UPDATING"],
            ["COMPLIANCE STATUS", "UNDER REVIEW"],
            ["BEHAVIORAL INDEX", "ELEVATED RISK"],
            ["MEDICAL NOTES", "Behavioral monitoring recommended"]
        ],

         access: [
            ["11 DEC — 21:11", "NOVA COMMONS — Sector E-03"],
            ["15 DEC — 08:42", "SYSTEMS OVERSIGHT BUILDING"],
            ["15 DEC — 18:00", "LAKE PAVILION"],
            ["15 DEC — 21:37", "LEGACY SERVICE CORRIDOR"],
            ["15 DEC — 22:13", "RESTRICTED INFRASTRUCTURE NODE"],
            ["15 DEC — 22:41", "ACCESS TRACE TERMINATED"]
        ],

         mobility: [
            ["11 DEC — 21:09", "NOVA COMMONS — Sector E-03"],
            ["15 DEC — 07:42", "Departure from LYRA B214"],
            ["15 DEC — 08:42", "Systems Oversight Building"],
            ["15 DEC — 18:00", "Lake Pavilion"],
            ["15 DEC — 21:37", "Legacy Service Corridor"],
            ["15 DEC — 22:41", "SIGNAL LOST"]
        ]

    },

 elias: {

    name: "Elias Rowe",

    lifecare: [
        ["STATUS", "ACTIVE"],
        ["COMPLIANCE STATUS", "Stable"],
        ["BEHAVIORAL INDEX", "Normal"],
        ["MEDICAL NOTES", "No active anomalies"]
    ],

    access: [
        ["13 DEC — 22:44", "LYRA DISTRICT — L10 Residential Corridor"],
        ["13 DEC — 22:51", "LYRA DISTRICT — L11 Residential Corridor"],
        ["13 DEC — 23:03", "LYRA DISTRICT — L12 Residential Module Area"],

        ["14 DEC — 07:18", "LYRA DISTRICT — L10 Residential Corridor"],
        ["14 DEC — 07:26", "LYRA DISTRICT — L11 Residential Corridor"],
        ["14 DEC — 07:34", "LYRA DISTRICT — L12 Residential Module Area"],

        ["14 DEC — 23:16", "LIFECARE SYSTEMS — Clinical Archive Console"],
        ["14 DEC — 23:19", "RESTRICTED MEDICAL ARCHIVE — Manual Review Session"],

        ["15 DEC — 06:52", "LYRA DISTRICT — L10 Residential Corridor"],
        ["15 DEC — 07:01", "LYRA DISTRICT — L11 Residential Corridor"],
        ["15 DEC — 07:09", "LYRA DISTRICT — L12 Residential Module Area"],

        ["15 DEC — 12:41", "Restricted Medical Archive"],
        ["15 DEC — 19:14", "AUREX Administrative Access"]
    ],

    mobility: [
        ["13 DEC — 22:41", "Entry detected — Lyra Residential Cluster"],
        ["13 DEC — 22:44", "L10 Residential Corridor"],
        ["13 DEC — 22:51", "L11 Residential Corridor"],
        ["13 DEC — 23:03", "L12 Residential Module Area"],
        ["13 DEC — 23:11", "Exit detected — Lyra Residential Cluster"],

        ["14 DEC — 07:18", "L10 Residential Corridor"],
        ["14 DEC — 07:26", "L11 Residential Corridor"],
        ["14 DEC — 07:34", "L12 Residential Module Area"],
        ["14 DEC — 07:42", "Route terminated — Lyra East Exit"],

        ["14 DEC — 23:16", "Remote LifeCare archive session opened"],
        ["14 DEC — 23:19", "Manual clinical record review executed"],

        ["15 DEC — 06:52", "L10 Residential Corridor"],
        ["15 DEC — 07:01", "L11 Residential Corridor"],
        ["15 DEC — 07:09", "L12 Residential Module Area"],
        ["15 DEC — 07:17", "Route terminated — Lyra South Axis"]
    ]

},

    ava: {

        name: "Ava Mercer",

        lifecare: [
            ["STATUS", "ACTIVE"],
            ["COMPLIANCE STATUS", "Stable"],
            ["BEHAVIORAL INDEX", "Normal"],
            ["MEDICAL NOTES", "No active anomalies"]
        ],

        access: [
            ["11 DEC — 21:14", "NOVA COMMONS — Sector E-03"],
            ["15 DEC — 06:41", "Transit Operations"],
            ["15 DEC — 14:11", "Logistics Coordination Hub"],
            ["15 DEC — 22:04", "Outbound Transport Sector"]
        ],

        mobility: [
            ["11 DEC — 21:12", "NOVA COMMONS — Sector E-03"],
            ["15 DEC — 06:38", "Operations Route 7"],
            ["15 DEC — 14:08", "Central Transit Axis"],
            ["15 DEC — 22:00", "Cargo Platform"]
        ]

    },

    daniel: {

        name: "Daniel Kessler",

        lifecare: [
            ["STATUS", "ACTIVE"],
            ["COMPLIANCE STATUS", "Stable"],
            ["BEHAVIORAL INDEX", "Suppressed"],
            ["MEDICAL NOTES", "Monitoring frequency increased"]
        ],

        access: [
            ["15 DEC — 07:55", "AETHOS Integrity Monitoring"],
            ["15 DEC — 09:30", "Review Room C-12 — No Show"],
            ["15 DEC — 18:22", "Access Control Hub"],
            ["15 DEC — 22:44", "Legacy Containment Review Access"]
        ],

        mobility: [
            ["15 DEC — 07:51", "Security Transit Route"],
            ["15 DEC — 18:18", "Aurex Control Sector"],
            ["15 DEC — 22:41", "Remote Security Session"],
            ["15 DEC — 22:44", "System Review Access"]
        ]

    }

};

/* CREATE ROWS */

function createRows(data, container) {

    container.innerHTML = "";

    data.forEach(item => {

        container.innerHTML += `

            <div class="data-row">

                <div class="data-label">
                    ${item[0]}
                </div>

                <div class="data-value">
                    ${item[1]}
                </div>

            </div>

        `;

    });

}

/* RENDER */

function renderResident(id) {

    const resident = residents[id];

    if (!resident) {
        return;
    }

    subjectName.innerHTML = resident.name;

    if (
        typeof setProgress === "function"
        &&
        typeof CASE_PROGRESS !== "undefined"
    ) {
        switch (id) {
            case "nathan":
                setProgress(CASE_PROGRESS.NATHAN_PROFILE_OPENED);
                break;

            case "ava":
                setProgress(CASE_PROGRESS.AVA_PROFILE_OPENED);
                break;

            case "elias":
                setProgress(CASE_PROGRESS.ELIAS_PROFILE_OPENED);
                break;

            case "daniel":
                setProgress(CASE_PROGRESS.KESSLER_PROFILE_OPENED);
                break;
        }
    }

    createRows(resident.lifecare, lifecareData);
    createRows(resident.access, accessData);
    createRows(resident.mobility, mobilityData);

}

/* BUTTON EVENTS */

buttons.forEach(button => {

    button.addEventListener("click", () => {

        buttons.forEach(btn => {
            btn.classList.remove("active");
        });

        button.classList.add("active");

        const residentId = button.dataset.resident;

        renderResident(residentId);

    });

});

/* DISTRICT STATUS */

function updateDistrictStatus() {

    const temperature = document.getElementById("temperature");
    const wind = document.getElementById("wind");
    const humidity = document.getElementById("humidity");
    const syncTime = document.getElementById("syncTime");

    if (temperature) {
        temperature.innerHTML = "ACTIVE";
    }

    if (wind) {
        wind.innerHTML = "1,842";
    }

    if (humidity) {
        humidity.innerHTML = "4,216";
    }

    if (syncTime) {
        syncTime.innerHTML = "0";
    }

}

/* INITIALIZE */

updateDistrictStatus();
renderResident("nathan");