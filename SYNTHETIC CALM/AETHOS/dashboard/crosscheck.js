/* AETHOS CORRELATION ENGINE */

const correlationDatabase = [

    {
        subjects: ["nathan", "ava"],
        result: [
            ["MATCH FOUND", "2 subjects"],
            ["CONTACT COUNT", "17 verified encounters"],
            ["RELATIONSHIP MODEL", "High personal proximity"],
            ["BIOMETRIC PATTERN", "Repeated synchronized heart-rate elevation"],
            ["CONFIDENCE", "94%"],

            ["LAST CONTACT #1", "14 DEC 2026 — 22:18 / 23:06 — LYRA DISTRICT"],
            ["LAST CONTACT #2", "12 DEC 2026 — 20:41 / 22:13 — NOVA COMMONS"],
            ["LAST CONTACT #3", "11 DEC 2026 — 21:09 / 23:08 — NOVA COMMONS — Sector E-03"]
        ]
    },

    {
        subjects: ["ava", "daniel"],
        result: [
            ["MATCH FOUND", "2 subjects"],
            ["CONTACT COUNT", "326 verified encounters"],
            ["RELATIONSHIP MODEL", "Stable residential association"],
            ["BIOMETRIC PATTERN", "Routine proximity / low anomaly"],
            ["CONFIDENCE", "100%"],

            ["LAST CONTACT #1", "15 DEC 2026 — 07:22 / 07:41 — LYRA DISTRICT"],
            ["LAST CONTACT #2", "14 DEC 2026 — 19:34 / 23:52 — LYRA DISTRICT"],
            ["LAST CONTACT #3", "13 DEC 2026 — 20:11 / 23:18 — LYRA DISTRICT"]
        ]
    },

    {
        subjects: ["nathan", "daniel"],
        result: [
            ["MATCH FOUND", "2 subjects"],
            ["CONTACT COUNT", "6 verified professional interactions"],
            ["RELATIONSHIP MODEL", "Professional / security review"],
            ["BIOMETRIC PATTERN", "No personal proximity detected"],
            ["CONFIDENCE", "87%"],

            ["LAST CONTACT #1", "15 DEC 2026 — 09:30 — SYSTEMS OVERSIGHT BUILDING"],
            ["LAST CONTACT #2", "09 DEC 2026 — 16:12 / 16:31 — AETHOS INTEGRITY MONITORING"],
            ["LAST CONTACT #3", "02 DEC 2026 — 10:04 / 10:22 — ACCESS CONTROL HUB"]
        ]
    },

    {
        subjects: ["nathan", "elias"],
        result: [
            ["NO RECENT LOCATION OVERLAP", "No verified shared zone in final 72 hours"],
            ["CONTACT COUNT", "3 professional encounters in last 90 days"],
            ["RELATIONSHIP MODEL", "Hostile professional association"],
            ["BIOMETRIC PATTERN", "Stress elevation detected during prior contact"],
            ["CONFIDENCE", "Medium"],

            ["RELATED DATA", "Communication records available"]
        ]
    },

    {
        subjects: ["nathan", "ava", "daniel"],
        result: [
            ["MULTI-SUBJECT CORRELATION", "3 subjects"],
            ["PATTERN", "Overlapping personal and professional associations"],
            ["DATE RANGE", "11 DEC 2026 — 15 DEC 2026"],
            ["PRIMARY ZONES", "NOVA COMMONS / LYRA / SYSTEMS OVERSIGHT"],
            ["CONFIDENCE", "High"]
        ]
    }

];

const crossCheckButton = document.getElementById("crossCheckButton");
const crossCheckResult = document.getElementById("crossCheckResult");

function normalizeSubjects(subjects) {
    return [...subjects].sort().join("+");
}

function renderCorrelationRows(data) {
    crossCheckResult.innerHTML = "";

    data.forEach(item => {
        crossCheckResult.innerHTML += `
            <div class="data-row">
                <div class="data-label">${item[0]}</div>
                <div class="data-value">${item[1]}</div>
            </div>
        `;
    });
}

function findCorrelation(selectedSubjects) {
    const selectedKey = normalizeSubjects(selectedSubjects);

    return correlationDatabase.find(entry => {
        return normalizeSubjects(entry.subjects) === selectedKey;
    });
}

function runCorrelationCheck() {
    const selectedSubjects = Array.from(
        document.querySelectorAll(".cross-check-person:checked")
    ).map(input => input.value);

    if (selectedSubjects.length < 2) {
        renderCorrelationRows([
            ["SELECTION REQUIRED", "Select at least two subjects"]
        ]);
        return;
    }

    const correlation = findCorrelation(selectedSubjects);

    if (!correlation) {
        renderCorrelationRows([
            ["NO CORRELATION FOUND", "No verified pattern detected"],
            ["SUBJECTS CHECKED", selectedSubjects.length.toString()]
        ]);
        return;
    }

    renderCorrelationRows(correlation.result);
}

if (crossCheckButton && crossCheckResult) {
    crossCheckButton.addEventListener("click", runCorrelationCheck);
}