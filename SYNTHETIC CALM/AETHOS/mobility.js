const POIS = [
    // AUREX
    { id: "A1", district: "Aurex", name: "AETHOS Monitoring Center", access: "BLUE", x: -260, y: 120 },
    { id: "A2", district: "Aurex", name: "Command Nexus", access: "BLUE", x: 0, y: 0 },
    { id: "A3", district: "Aurex", name: "Citizen Registry Bureau", access: "PUBLIC", x: 280, y: 360 },
    { id: "A4", district: "Aurex", name: "Data Compliance Authority", access: "BLUE", x: 320, y: -260 },
    { id: "A5", district: "Aurex", name: "Public Services Administration", access: "PUBLIC", x: -420, y: -80 },

    // LYRA
    { id: "L1", district: "Lyra", name: "Primary School", access: "PUBLIC", x: -1320, y: -920 },
    { id: "L2", district: "Lyra", name: "Community Health Center", access: "PUBLIC", x: -1500, y: -260 },
    { id: "L3", district: "Lyra", name: "Residential Services Hub", access: "PUBLIC", x: -760, y: -230 },
    { id: "L4", district: "Lyra", name: "Lyra Market", access: "PUBLIC", x: -650, y: -610 },
    { id: "L12", district: "Lyra", name: "Residential Module B214", access: "BLUE", x: -860, y: -1180 },

    // NOVA COMMONS
    { id: "N1", district: "Nova Commons", name: "Civic Center", access: "PUBLIC", x: -1600, y: 560 },
    { id: "N2", district: "Nova Commons", name: "Food Hall", access: "PUBLIC", x: -1050, y: 850 },
    { id: "N3", district: "Nova Commons", name: "Nova Plaza", access: "PUBLIC", x: -1000, y: 480 },
    { id: "N4", district: "Nova Commons", name: "Coworking Hub", access: "BLUE", x: -700, y: 250 },
    { id: "N5", district: "Nova Commons", name: "Eiden Cinema Sector E-03", access: "PUBLIC", x: -320, y: 690 },
    { id: "N6", district: "Nova Commons", name: "Transit Lounge", access: "PUBLIC", x: -1080, y: 60 },

    // EIDEN PARK
    { id: "P1", district: "Eiden Park", name: "Central Observatory", access: "BLUE", x: 1580, y: -760 },
    { id: "P2", district: "Eiden Park", name: "Research Greenhouse", access: "BLUE", x: 1760, y: -360 },
    { id: "P3", district: "Eiden Park", name: "Biodiversity Center", access: "PUBLIC", x: 1260, y: -940 },
    { id: "P4", district: "Eiden Park", name: "Central Greenhouse", access: "PUBLIC", x: 1420, y: -1240 },
    { id: "P5", district: "Eiden Park", name: "Lake Pavilion / MatchPoint Courts", access: "PUBLIC", x: 950, y: -900 },

    // KEROS
    { id: "K1", district: "Keros", name: "Maintenance Center", access: "BLUE", x: 760, y: 610 },
    { id: "K2", district: "Keros", name: "Energy Control Station", access: "BLUE", x: 1330, y: 1220 },
    { id: "K3", district: "Keros", name: "Server Farm Alpha", access: "RESTRICTED", x: 830, y: 1120 },
    { id: "K4", district: "Keros", name: "Autonomous Mobility Depot", access: "BLUE", x: 1840, y: 640 },
    { id: "K5", district: "Keros", name: "Industrial Logistics Hub", access: "BLUE", x: 860, y: 120 },

    // THE SILENCE
    { id: "S1", district: "The Silence", name: "Legacy Infrastructure Node", access: "BLACK", x: 700, y: 2050 },
    { id: "S2", district: "The Silence", name: "Restricted Transit Tunnel", access: "BLACK", x: -120, y: 1120 },
    { id: "S3", district: "The Silence", name: "Abandoned Residential Block", access: "BLACK", x: 220, y: 950 },
    { id: "S4", district: "The Silence", name: "Decommissioned Data Vault", access: "BLACK", x: 520, y: 1700 },
    { id: "S5", district: "The Silence", name: "Containment Sector 7", access: "BLACK", x: 220, y: 1580 }
];

const WALKING_METERS_PER_MINUTE = 75;
const TRANSIT_METERS_PER_MINUTE = 260;
const ROAD_FACTOR = 1.10;

const originSelect = document.getElementById("originSelect");
const destinationSelect = document.getElementById("destinationSelect");
const calculateButton = document.getElementById("calculateButton");
const resultPanel = document.getElementById("resultPanel");
const resultOrigin = document.getElementById("resultOrigin");
const resultDestination = document.getElementById("resultDestination");
const resultDistance = document.getElementById("resultDistance");
const resultWalking = document.getElementById("resultWalking");
const resultTransit = document.getElementById("resultTransit");
const resultAccess = document.getElementById("resultAccess");
const routeNotice = document.getElementById("routeNotice");
const poiDirectory = document.getElementById("poiDirectory");
const backButton = document.getElementById("backButton");

function byDistrict() {
    return POIS.reduce((groups, poi) => {
        if (!groups[poi.district]) groups[poi.district] = [];
        groups[poi.district].push(poi);
        return groups;
    }, {});
}

function populateSelect(select) {
    const groups = byDistrict();

    Object.keys(groups).forEach(district => {
        const optgroup = document.createElement("optgroup");
        optgroup.label = district.toUpperCase();

        groups[district].forEach(poi => {
            const option = document.createElement("option");
            option.value = poi.id;
            option.textContent = `${poi.id} — ${poi.name}`;
            optgroup.appendChild(option);
        });

        select.appendChild(optgroup);
    });
}

function renderDirectory() {
    const groups = byDistrict();
    poiDirectory.innerHTML = "";

    Object.keys(groups).forEach(district => {
        const districtBlock = document.createElement("div");
        districtBlock.className = "directory-district";
        districtBlock.innerHTML = `<h3>${district}</h3>`;

        groups[district].forEach(poi => {
            const row = document.createElement("div");
            row.className = "directory-row";
            row.innerHTML = `
                <span>${poi.id}</span>
                <strong>${poi.name}</strong>
                <em>${poi.access}</em>
            `;
            districtBlock.appendChild(row);
        });

        poiDirectory.appendChild(districtBlock);
    });
}

function getPoi(id) {
    return POIS.find(poi => poi.id === id);
}

function routeDistance(origin, destination) {
    if (origin.id === destination.id) return 0;

    const dx = destination.x - origin.x;
    const dy = destination.y - origin.y;
    const straight = Math.sqrt(dx * dx + dy * dy);

    let factor = ROAD_FACTOR;

    if (origin.district === "The Silence" || destination.district === "The Silence") {
        factor += 0.10;
    }

    if (origin.district !== destination.district) {
        factor += 0.04;
    }

    return Math.round((straight * factor) / 10) * 10;
}

function formatMinutes(minutes) {
    if (minutes < 1) return "< 1 min";
    return `${Math.ceil(minutes)} min`;
}

function accessStatus(origin, destination) {
    const accesses = [origin.access, destination.access];

    if (accesses.includes("BLACK")) {
        return "BLACK AUTHORIZATION REQUIRED";
    }

    if (accesses.includes("RESTRICTED")) {
        return "RESTRICTED CLEARANCE REQUIRED";
    }

    if (accesses.includes("BLUE")) {
        return "AUTHORIZED ACCESS REQUIRED";
    }

    return "PUBLIC ROUTE";
}

function buildNotice(origin, destination) {
    const notices = [];

    if (origin.district === "The Silence" || destination.district === "The Silence") {
        notices.push("Restricted Area Notice: autonomous transit terminates at the external perimeter checkpoint. Internal movement requires valid BLACK authorization.");
    }

    if (origin.access === "BLACK" || destination.access === "BLACK") {
        notices.push("No public route available beyond authorized perimeter gates.");
    }

    if (origin.id === destination.id) {
        notices.push("Origin and destination are identical.");
    }

    return notices.join(" ");
}

function calculateRoute() {
    const origin = getPoi(originSelect.value);
    const destination = getPoi(destinationSelect.value);

    if (typeof setProgress === "function") {

    if (
        origin.id === "N2"
        &&
        destination.id === "S1"
    ) {
        setProgress("foodhall_to_lin_route_checked");
    }

    if (
        origin.id === "S1"
        &&
        destination.id === "N2"
    ) {
        setProgress("lin_to_foodhall_route_checked");
    }

    if (
        origin.id === "P5"
        &&
        destination.id === "N5"
    ) {
        setProgress("matchpoint_to_cinema_route_checked");
    }

    if (
        origin.id === "L12"
        &&
        destination.id === "S1"
    ) {
        setProgress("nathan_home_to_lin_route_checked");
    }
}

    if (!origin || !destination) return;

    const meters = routeDistance(origin, destination);
    const walking = meters / WALKING_METERS_PER_MINUTE;
    const transit = meters / TRANSIT_METERS_PER_MINUTE;

    resultOrigin.textContent = `${origin.id} — ${origin.name}`;
    resultDestination.textContent = `${destination.id} — ${destination.name}`;
    resultDistance.textContent = `${meters.toLocaleString("en-US")} m`;
    resultWalking.textContent = formatMinutes(walking);
    resultTransit.textContent = formatMinutes(transit);
    resultAccess.textContent = accessStatus(origin, destination);
    routeNotice.textContent = buildNotice(origin, destination);

    resultPanel.classList.remove("hidden");

    if (typeof setProgress === "function") {
        setProgress("aethos_mobility_route_calculated");
    }
}

document.addEventListener("DOMContentLoaded", () => {
    populateSelect(originSelect);
    populateSelect(destinationSelect);
    renderDirectory();

    originSelect.value = "N2";
    destinationSelect.value = "S1";

    calculateButton.addEventListener("click", calculateRoute);

    if (backButton) {
        backButton.addEventListener("click", () => {
            window.location.href = "index.html";
        });
    }

    if (typeof setProgress === "function") {
        setProgress("aethos_mobility_grid_opened");
    }
});
