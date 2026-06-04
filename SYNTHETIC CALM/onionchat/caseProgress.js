const CASE_PROGRESS_KEY = "kairos_case_progress_v1";

const CASE_PROGRESS = {
    // SYSTEM
    AETHOS_SITE_OPENED: "aethos_site_opened",
    MARCO_AETHOS_SEQUENCE_SENT: "marco_aethos_sequence_sent",
    AETHOS_CREDENTIALS_SENT: "aethos_credentials_sent",
    AETHOS_SUBJECTS_LOADED: "aethos_subjects_loaded",

    // AETHOS PROFILES
    NATHAN_PROFILE_OPENED: "nathan_profile_opened",
    AVA_PROFILE_OPENED: "ava_profile_opened",
    KESSLER_PROFILE_OPENED: "kessler_profile_opened",
    ELIAS_PROFILE_OPENED: "elias_profile_opened",

    // ELIAS TRACK
    ELIAS_MOVEMENT_OPENED: "elias_movement_opened",
    ELIAS_NEAR_L12_FOUND: "elias_near_l12_found",
    NATHAN_LIFECARE_STATUS_OPENED: "nathan_lifecare_status_opened",
    NATHAN_RECORD_FLAGGED_FOUND: "nathan_record_flagged_found",
    NATHAN_RECORD_MODIFIED_FOUND: "nathan_record_modified_found",
    ELIAS_MANUAL_OVERRIDE_FOUND: "elias_manual_override_found",

    // AVA TRACK
    AVA_WORK_COMPLAINT_FOUND: "ava_work_complaint_found",
    NATHAN_KESSLER_EMAIL_FOUND: "nathan_kessler_email_found",
    AVA_NATHAN_RELATIONSHIP_FOUND: "ava_nathan_relationship_found",
    AVA_DISCOVERED_NATHAN_PLAN: "ava_discovered_nathan_plan",

    // KESSLER TRACK
    KESSLER_PROFILE_REVIEWED: "kessler_profile_reviewed",
    KESSLER_RECEIVED_NATHAN_EMAIL: "kessler_received_nathan_email",
    KESSLER_PRIVATE_REACTION_FOUND: "kessler_private_reaction_found",

    // JAVIER TRACK
    JAVIER_CONTACT_OPENED: "javier_contact_opened",
    JAVIER_PAYMENT_LINK_SENT: "javier_payment_link_sent",
    JAVIER_PAYMENT_COMPLETED: "javier_payment_completed",
    JAVIER_RECEIPT_SENT: "javier_receipt_sent",
    JAVIER_ACCESS_GRANTED: "javier_access_granted",
    JAVIER_FIRST_INTEL_RECEIVED: "javier_first_intel_received",

    // GIULIA TRACK
    GIULIA_CONTACT_ADDED: "giulia_contact_added",
    GIULIA_FIRST_MESSAGE_SENT: "giulia_first_message_sent",
    GIULIA_NATHAN_PRIVATE_CONTEXT_FOUND: "giulia_nathan_private_context_found",

    AVA_NATHAN_CROSSCHECK_VIEWED:
    "ava_nathan_crosscheck_viewed",

    KESSLER_NATHAN_CROSSCHECK_VIEWED:
    "kessler_nathan_crosscheck_viewed",

    ELIAS_NATHAN_CROSSCHECK_VIEWED:
    "elias_nathan_crosscheck_viewed",

    AVA_KESSLER_CROSSCHECK_VIEWED:
    "ava_kessler_crosscheck_viewed",


    // BLACK PASS / SOFIA TRACK
    BLACK_PASS_LOG_REVIEWED: "black_pass_log_reviewed",
    NATHAN_NODE_ACCESS_FOUND: "nathan_node_access_found",
    NATHAN_WHITE_PASS_CONFIRMED: "nathan_white_pass_confirmed",
    SM4418_FOUND_IN_BLACK_LOG: "sm4418_found_in_black_log",
    SM4418_LINKED_TO_SOFIA: "sm4418_linked_to_sofia",
    SOFIA_UNLOCKED: "sofia_unlocked",
    SOFIA_ALIBI_FOUND: "sofia_alibi_found",

    // JAVIER OPERATIONS
    JAVIER_OPERATION_MENU_UNLOCKED: "javier_operation_menu_unlocked",
    JAVIER_MIKA_HOLT_INTERROGATE_REQUESTED: "javier_mika_holt_interrogate_requested",
    JAVIER_MIKA_HOLT_INTERROGATE_RECEIVED: "javier_mika_holt_interrogate_received",
    JAVIER_AVA_MERCER_INTERROGATE_REQUESTED: "javier_ava_mercer_interrogate_requested",
    JAVIER_AVA_MERCER_INTERROGATE_RECEIVED: "javier_ava_mercer_interrogate_received",
    JAVIER_DANIEL_KESSLER_INTERROGATE_REQUESTED: "javier_daniel_kessler_interrogate_requested",
    JAVIER_DANIEL_KESSLER_INTERROGATE_RECEIVED: "javier_daniel_kessler_interrogate_received",
    JAVIER_ELIAS_ROWE_INTERROGATE_REQUESTED: "javier_elias_rowe_interrogate_requested",
    JAVIER_ELIAS_ROWE_INTERROGATE_RECEIVED: "javier_elias_rowe_interrogate_received",
    JAVIER_ADRIAN_VEIL_INTERROGATE_REQUESTED: "javier_adrian_veil_interrogate_requested",
    JAVIER_ADRIAN_VEIL_INTERROGATE_RECEIVED: "javier_adrian_veil_interrogate_received",
    JAVIER_SOFIA_MIREL_INTERROGATE_REQUESTED: "javier_sofia_mirel_interrogate_requested",
    JAVIER_SOFIA_MIREL_INTERROGATE_RECEIVED: "javier_sofia_mirel_interrogate_received",
    JAVIER_AVA_MERCER_FOLLOWUP_INTERROGATE_REQUESTED: "javier_ava_mercer_followup_interrogate_requested",
    JAVIER_AVA_MERCER_FOLLOWUP_INTERROGATE_RECEIVED: "javier_ava_mercer_followup_interrogate_received",
    KESSLER_INTERROGATION_UNLOCKED: "kessler_interrogation_unlocked",
    VEIL_INTERROGATION_UNLOCKED: "veil_interrogation_unlocked",
    // MAP / DOCUMENTS
    VEYRA_MAP_OPENED: "veyra_map_opened",
    EIDEN_CINEMA_IDENTIFIED: "eiden_cinema_identified",
    L12_IDENTIFIED: "l12_identified",
    S1_IDENTIFIED: "s1_identified",

    
    MATCHPOINT_PROFILE_MATCHED: "matchpoint_profile_matched",
    S1_INSPECTION_COMPLETED: "s1_inspection_completed",
    SOFIA_BADGE_MESSAGE_SENT: "sofia_badge_message_sent",
    SOFIA_BADGE_CONFIRMED: "sofia_badge_confirmed",
    SOFIA_CONTACT_UNLOCKED: "sofia_contact_unlocked",
    // BEACON / SYNTHETIC CALM
    GIULIA_BEACON_CARD_FOUND: "giulia_beacon_card_found",
    BEACON_SITE_OPENED: "beacon_site_opened",
    BEACON_ARCHIVE_OPENED: "beacon_archive_opened",
    BEACON_GIULIA_PROFILE_OPENED: "beacon_giulia_profile_opened",
    SYNTHETIC_CALM_PAGE_OPENED: "synthetic_calm_page_opened",
    SYNTHETIC_CALM_LOGIN_ATTEMPTED: "synthetic_calm_login_attempted",
    SYNTHETIC_CALM_UNLOCKED: "synthetic_calm_unlocked",
    SYNTHETIC_CALM_DRAFT_REVIEWED: "synthetic_calm_draft_reviewed",

    // FINAL REPORT
    FINAL_REPORT_OPENED: "final_report_opened",
    FINAL_REPORT_LOCKED_VIEWED: "final_report_locked_viewed",
    FINAL_REPORT_UNLOCKED: "final_report_unlocked",
    FINAL_REPORT_RESOLUTION_VALIDATED: "final_report_resolution_validated",
    FINAL_REPORT_SUBMITTED: "final_report_submitted",
    FINAL_REPORT_EVIDENCE_SUBMITTED: "final_report_evidence_submitted",
    CASE_SOLVED: "case_solved",
    FINAL_ACCURACY_RECORDED: "final_accuracy_recorded",


    // CASE PHASES
    MAIN_SUSPECT_ELIAS_ESTABLISHED: "main_suspect_elias_established",
    MAIN_SUSPECT_AVA_ESTABLISHED: "main_suspect_ava_established",
    ELIAS_EXCLUDED: "elias_excluded",
    AVA_EXCLUDED: "ava_excluded"
};

function getCaseProgress() {
    try {
        const raw = localStorage.getItem(CASE_PROGRESS_KEY);
        return raw ? JSON.parse(raw) : {};
    } catch (error) {
        console.warn("Unable to read case progress:", error);
        return {};
    }
}

function saveCaseProgress(progress) {
    localStorage.setItem(
        CASE_PROGRESS_KEY,
        JSON.stringify(progress)
    );
}

function hasProgress(flag) {
    const progress = getCaseProgress();
    return progress[flag] === true;
}

function setProgress(flag) {
    const progress = getCaseProgress();

    if (progress[flag] === true) {
        return;
    }

    progress[flag] = true;
    progress.updatedAt = new Date().toISOString();

    saveCaseProgress(progress);

    window.dispatchEvent(
        new CustomEvent("caseProgressUpdated", {
            detail: { flag }
        })
    );
}

function clearProgress(flag) {
    const progress = getCaseProgress();

    if (!Object.prototype.hasOwnProperty.call(progress, flag)) {
        return;
    }

    delete progress[flag];
    progress.updatedAt = new Date().toISOString();

    saveCaseProgress(progress);
}

function getCaseCounter(counterKey) {
    const progress = getCaseProgress();
    const value = Number(progress[counterKey] || 0);
    return Number.isFinite(value) ? value : 0;
}

function setCaseCounter(counterKey, value) {
    const progress = getCaseProgress();
    progress[counterKey] = Number(value) || 0;
    progress.updatedAt = new Date().toISOString();
    saveCaseProgress(progress);
    return progress[counterKey];
}

function incrementCaseCounter(counterKey) {
    const nextValue = getCaseCounter(counterKey) + 1;
    return setCaseCounter(counterKey, nextValue);
}

window.CASE_PROGRESS = CASE_PROGRESS;
window.getCaseProgress = getCaseProgress;
window.hasProgress = hasProgress;
window.setProgress = setProgress;
window.clearProgress = clearProgress;
window.getCaseCounter = getCaseCounter;
window.setCaseCounter = setCaseCounter;
window.incrementCaseCounter = incrementCaseCounter;
