const STORAGE_KEY = "onionchat_realistic_v3";

let currentContactKey = null;
let operationBudget = 18000;

const DEFAULT_ACCESS_COST_USD = 200;
const DEFAULT_ACCESS_COST_ARS = "200.000 ARS";
const DEFAULT_WALLET_BALANCE_EUR = 18000;
const PAYMENT_RETURN_KEY = "kairos_payment_result_v1";
const PAYMENT_INTENT_KEY = "kairos_payment_intent_v1";
const JAVIER_OPERATION_DELAY_MS = 180000;
const JAVIER_BUSY_CHECK_MS = 1500;


const homeScreen = document.querySelector("#homeScreen");
const chatScreen = document.querySelector("#chatScreen");
const contactList = document.querySelector("#contactList");
const searchInput = document.querySelector("#searchInput");

const chatMessages = document.querySelector("#chatMessages");
const chatName = document.querySelector("#chatName");
const chatStatus = document.querySelector("#chatStatus");
const chatAvatar = document.querySelector("#chatAvatar");
const openMediaButton = document.querySelector("#openMediaButton");
const mediaModal = document.querySelector("#mediaModal");
const closeMediaModal = document.querySelector("#closeMediaModal");
const mediaList = document.querySelector("#mediaList");
const mediaViewer = document.querySelector("#mediaViewer");


const messageInput = document.querySelector("#messageInput");
const sendButton = document.querySelector("#sendButton");
const backButton = document.querySelector("#backButton");
const attachButton = document.querySelector("#attachButton");
const screenshotInput = document.querySelector("#screenshotInput");

const openAddContactModal = document.querySelector("#openAddContactModal");
const addContactModal = document.querySelector("#addContactModal");
const phoneInput = document.querySelector("#phoneInput");
const cancelAddContact = document.querySelector("#cancelAddContact");
const confirmAddContact = document.querySelector("#confirmAddContact");

const pushContainer = document.querySelector("#pushContainer");

let giuliaTimer = null;
const javierOperationTimers = {};


const CONTACT_RESPONSE_PROFILE = {
    qg: { minDelay: 1600, maxDelay: 5200, typingMin: 900, typingMax: 7000 },
    marco: { minDelay: 2200, maxDelay: 9000, typingMin: 1200, typingMax: 9000 },
    javier: { minDelay: 6500, maxDelay: 21000, typingMin: 1600, typingMax: 17000 },
    giulia: { minDelay: 3500, maxDelay: 16000, typingMin: 1400, typingMax: 12000 },
    default: { minDelay: 1800, maxDelay: 8000, typingMin: 900, typingMax: 8000 }
};

document.addEventListener("DOMContentLoaded", () => {
    loadState();
    syncWalletBalance();
    applyPaymentReturns();
    renderContactList();
    bindEvents();
    scheduleNextGiuliaPeriodicMessage();
    startProgressWatcher();
    startNathanDriveWatcher();
    startJavierPendingOperationWatcher();
});

function bindEvents() {
    if (sendButton) sendButton.addEventListener("click", sendCurrentMessage);

    if (messageInput) {
        messageInput.addEventListener("keydown", event => {
            if (event.key === "Enter") {
                event.preventDefault();
                sendCurrentMessage();
            }
        });
    }

    if (backButton) backButton.addEventListener("click", closeChat);
    if (attachButton) attachButton.addEventListener("click", () => screenshotInput && screenshotInput.click());
    if (screenshotInput) screenshotInput.addEventListener("change", handleScreenshotUpload);
    if (searchInput) searchInput.addEventListener("input", renderContactList);
    if (openAddContactModal) openAddContactModal.addEventListener("click", openContactModal);
    if (openMediaButton) openMediaButton.addEventListener("click", openMediaArchive);
    if (closeMediaModal) closeMediaModal.addEventListener("click", closeMediaArchive);
    if (cancelAddContact) cancelAddContact.addEventListener("click", closeContactModal);
    if (confirmAddContact) confirmAddContact.addEventListener("click", addContactByNumber);

    if (phoneInput) {
        phoneInput.addEventListener("keydown", event => {
            if (event.key === "Enter") {
                event.preventDefault();
                addContactByNumber();
            }
        });
    }

    if (mediaModal) {
        mediaModal.addEventListener("click", event => {
            if (event.target === mediaModal) closeMediaArchive();
        });
    }

    if (addContactModal) {
        addContactModal.addEventListener("click", event => {
            if (event.target === addContactModal) {
                closeContactModal();
            }
        });
    }

    window.addEventListener("focus", () => {
        applyPaymentReturns();
    });

    document.addEventListener("visibilitychange", () => {
        if (!document.hidden) {
            applyPaymentReturns();
        }
    });
}

/* SAVE / LOAD */

function saveState() {
    const state = {
        operationBudget,
        contacts: {}
    };

    Object.keys(contacts).forEach(key => {
        state.contacts[key] = {
            unlocked: contacts[key].unlocked,
            messages: contacts[key].messages,
            accessPaid: !!contacts[key].accessPaid,
            periodicIndex: contacts[key].periodicIndex || 0,
            paymentProofAcknowledged: !!contacts[key].paymentProofAcknowledged,
            pendingOperation: contacts[key].pendingOperation || null
        };
    });

    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function loadState() {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) return;

    try {
        const parsed = JSON.parse(saved);

        if (typeof parsed.operationBudget === "number") {
            operationBudget = parsed.operationBudget;
        }

        if (!parsed.contacts) return;

        Object.keys(contacts).forEach(key => {
            const savedContact = parsed.contacts[key];

            if (!savedContact) return;

            if (typeof savedContact.unlocked === "boolean") {
                contacts[key].unlocked = savedContact.unlocked;
            }

            if (Array.isArray(savedContact.messages)) {
                contacts[key].messages = savedContact.messages.filter(message => message.type !== "typing");
            }

            if (typeof savedContact.accessPaid === "boolean") {
                contacts[key].accessPaid = savedContact.accessPaid;
            }

            if (typeof savedContact.periodicIndex === "number") {
                contacts[key].periodicIndex = savedContact.periodicIndex;
            }

            if (typeof savedContact.paymentProofAcknowledged === "boolean") {
                contacts[key].paymentProofAcknowledged = savedContact.paymentProofAcknowledged;
            }

            if (savedContact.pendingOperation && typeof savedContact.pendingOperation === "object") {
                contacts[key].pendingOperation = savedContact.pendingOperation;
            } else {
                contacts[key].pendingOperation = null;
            }
        });
    } catch (error) {
        console.warn("Unable to load OnionChat save:", error);
    }
}

/* CONTACT LIST */

function renderContactList() {
    if (!contactList) return;

    contactList.innerHTML = "";

    const query = normalizeBasic((searchInput && searchInput.value) || "");

    Object.keys(contacts).forEach(key => {
        const contact = contacts[key];

        if (!contact.unlocked) return;

        const searchable = normalizeBasic(`${contact.name} ${contact.role} ${getContactStatus(contact)}`);

        if (query && !searchable.includes(query)) return;

        const lastMessage = getLastVisibleMessage(contact);

        const item = document.createElement("div");
        item.className = "contact-item";

        item.innerHTML = `
            <div class="contact-avatar">${renderAvatar(contact)}</div>

            <div class="contact-meta">
                <div class="contact-name">${escapeHtml(contact.name)}</div>
                <div class="contact-preview">${escapeHtml(stripHtml(lastMessage))}</div>
            </div>
        `;

        item.addEventListener("click", () => openChat(key));

        contactList.appendChild(item);
    });
}

function getLastVisibleMessage(contact) {
    const visibleMessages = contact.messages.filter(message => message.type !== "typing");

    if (!visibleMessages.length) {
        return "No messages yet";
    }

    return visibleMessages[visibleMessages.length - 1].text || "No messages yet";
}

/* CHAT */

function openChat(key) {
    currentContactKey = key;

    const contact = contacts[key];
    if (!contact) return;

    homeScreen.classList.remove("active");
    chatScreen.classList.add("active");

    chatName.textContent = contact.name;
    chatStatus.textContent = getContactStatus(contact);
    chatAvatar.innerHTML = renderAvatar(contact);

    renderMessages();

    setTimeout(() => {
        messageInput.focus();
    }, 120);
}

function closeChat() {
    currentContactKey = null;

    chatScreen.classList.remove("active");
    homeScreen.classList.add("active");

    renderContactList();
}

function renderMessages() {
    if (!currentContactKey || !chatMessages) return;

    const contact = contacts[currentContactKey];

    chatMessages.innerHTML = "";

    contact.messages.forEach((message, index) => {
        if (message.type === "typing") {
            renderTypingMessage(contact);
            return;
        }

        const bubble = document.createElement("div");

        bubble.className = message.from === "player"
            ? "message sent"
            : "message received";

        if (message.type === "payment") {
            bubble.appendChild(createPaymentCard(message, index));
        } else if (message.type === "action_menu") {
            bubble.appendChild(createActionMenuMessage(message));
        } else if (message.type === "image") {
            bubble.appendChild(createImageMessage(message));
        } else if (message.type === "payment_receipt") {
            bubble.appendChild(createPaymentReceiptMessage(message));
        } else if (message.type === "file") {
            bubble.appendChild(createFileMessage(message));
        } else {
            const text = document.createElement("div");
            text.className = "message-text";
            text.textContent = message.text || "";
            bubble.appendChild(text);
        }

        if (message.translation && message.type !== "payment") {
            const translateButton = document.createElement("button");
            translateButton.className = "translate-btn";
            translateButton.type = "button";
            translateButton.textContent = message.translated ? "ORIGINAL" : "TRANSLATE";

            translateButton.addEventListener("click", () => {
                toggleTranslation(index);
            });

            bubble.appendChild(translateButton);
        }

        const time = document.createElement("div");
        time.className = "message-time";
        time.textContent = message.time || getCurrentTime();

        bubble.appendChild(time);
        chatMessages.appendChild(bubble);
    });

    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function renderTypingMessage(contact) {
    const typing = document.createElement("div");
    typing.className = "typing-message";

    typing.innerHTML = `
        <span>${escapeHtml(contact.name)} is writing</span>
        <span class="typing-dots">
            <span></span>
            <span></span>
            <span></span>
        </span>
    `;

    chatMessages.appendChild(typing);
}

function createPaymentCard(message, index) {
    const amountARS = message.amountARS || DEFAULT_ACCESS_COST_ARS;
    const amountUSD = message.amountUSD || DEFAULT_ACCESS_COST_USD;
    const displayName = message.requestFrom || "Javier Morales";

    const card = document.createElement("div");
    card.className = "payment-card";

    card.innerHTML = `
        <div class="payment-top">
            <div class="payment-logo">Kairos</div>
            <div class="payment-secure">Secure payment link · in-game</div>
        </div>

        <div class="payment-body">
            <div class="payment-label">Recipient</div>
            <div class="payment-name">${escapeHtml(displayName)}</div>

            <div class="payment-amount">${escapeHtml(amountARS)}</div>

            <div class="payment-note">
                Payment link generated by Javier. The amount is already set inside Kairos Detectives operational wallet.
            </div>

            <button
                class="payment-button"
                type="button"
                ${message.paid || message.loading ? "disabled" : ""}
            >
                ${
                    message.loading
                        ? `<span class="payment-loader"></span>Waiting confirmation...`
                        : message.paid
                            ? "Transfer completed"
                            : `Open secure link · ${amountUSD} EUR`
                }
            </button>
        </div>
    `;

    const button = card.querySelector(".payment-button");

    if (button && !message.paid && !message.loading) {
        button.addEventListener("click", () => openPaymentPortal(index));
    }

    return card;
}

/* SEND / REPLY */

function sendCurrentMessage() {
    if (!currentContactKey) return;

    const contactKey = currentContactKey;
    const text = messageInput.value.trim();

    if (!text) return;

    const contact = contacts[contactKey];
    if (!contact) return;

    contact.messages.push({
        from: "player",
        text,
        time: getCurrentTime()
    });

    messageInput.value = "";

    saveState();
    renderMessages();
    renderContactList();

    const delay = realisticReadDelay(contact, text);

    setTimeout(() => {
        handleReply(contactKey, text);
    }, delay);
}

function handleReply(contactKey, playerText) {
    const contact = contacts[contactKey];

    if (!contact) return;

    if (contact.id === "javier") {
        handleJavierReply(contactKey, playerText);
        return;
    }

    if (contact.id === "qg" && isHelpRequest(playerText)) {
        handleQGHelpRequest(contactKey);
        return;
    }

    handleGenericReply(contactKey, playerText);
}

function handleGenericReply(contactKey, playerText) {
    const contact = contacts[contactKey];
    const reply = findTriggerReply(contact, playerText) || randomFallback(contact);

    sendContactMessage(contactKey, normalizeReplyObject(reply));
}

/* JAVIER */

function handleJavierReply(contactKey, playerText) {
    const contact = contacts[contactKey];

    if (isPaymentProofText(playerText, contact)) {
        acknowledgeJavierPaymentProof(contactKey);
        return;
    }

    if (!hasJavierAccess(contact)) {
        handleJavierAccessGate(contactKey);
        return;
    }

    if (isJavierBusy(contact)) {
        sendJavierBusyReply(contactKey);
        return;
    }

    sendJavierActionMenu(contactKey, "main");
}

function hasJavierAccess(contact) {
    return !!contact.paymentProofAcknowledged;
}

function handleJavierAccessGate(contactKey) {
    const contact = contacts[contactKey];

    const paidRequest = contact.messages.some(message => {
        return message.type === "payment" &&
            message.paymentPurpose === "javier_access_fee" &&
            message.paid === true;
    });

    if (paidRequest && !contact.paymentProofAcknowledged) {
        acknowledgeJavierPaymentProof(contactKey);
        return;
    }

    const pendingRequest = contact.messages.some(message => {
        return message.type === "payment" &&
            message.paymentPurpose === "javier_access_fee" &&
            !message.paid;
    });

    if (pendingRequest) {
        sendContactMessage(contactKey, {
            text: "Usen el link que ya les mandé. La confirmación vuelve sola por el canal seguro.",
            translation: "Use the link I already sent. The confirmation comes back automatically through the secure channel."
        });
        return;
    }

    const fee = contact.accessFee || {};

    sendContactMessage(contactKey, {
        text: fee.requestText || "Necesito una colaboración una sola vez. Después hablamos.",
        translation: fee.requestTranslation || "I need a one-time contribution. Then we talk.",
        after: () => {
            sendPaymentRequest(contactKey);
        }
    });
}

function sendPaymentRequest(contactKey) {
    const contact = contacts[contactKey];
    const fee = contact.accessFee || {};

    showTyping(contactKey, realisticTypingDuration("Secure payment link", contact), () => {
        contact.messages.push({
            from: "contact",
            type: "payment",
            paymentPurpose: "javier_access_fee",
            text: "Secure payment link",
            requestFrom: "Javier Morales",
            amountUSD: fee.amountUSD || DEFAULT_ACCESS_COST_USD,
            amountARS: fee.amountARS || DEFAULT_ACCESS_COST_ARS,
            paid: false,
            loading: false,
            time: getCurrentTime()
        });

        saveState();
        refreshAfterReply(contactKey, "Secure payment link");
    });
}

function findJavierIntel(contact, playerText) {
    if (!Array.isArray(contact.intelligenceQuestions)) return null;

    const normalizedPlayer = normalizeQuestion(playerText);

    return contact.intelligenceQuestions.find(item => {
        return item.keywords.some(keyword => {
            const normalizedKeyword = normalizeQuestion(keyword);

            return normalizedPlayer === normalizedKeyword ||
                normalizedPlayer.includes(normalizedKeyword) ||
                normalizedKeyword.includes(normalizedPlayer);
        });
    });
}


function sendJavierActionMenu(contactKey, menuKey = "main") {
    const contact = contacts[contactKey];
    if (!contact || contact.id !== "javier") return;

    // Avoid duplicate menus when the player writes while Javier's post-payment
    // menu is already being delivered or is already the last visible message.
    const visibleMessages = contact.messages.filter(message => message.type !== "typing");
    const lastVisibleMessage = visibleMessages[visibleMessages.length - 1];

    if (
        lastVisibleMessage &&
        lastVisibleMessage.type === "action_menu" &&
        lastVisibleMessage.menuKey === menuKey
    ) {
        return;
    }

    const typingAlreadyQueued = contact.messages.some(message => message.type === "typing");

    if (typingAlreadyQueued) {
        return;
    }

    const menu = getJavierMenu(menuKey);

    showTyping(contactKey, realisticTypingDuration(menu.text, contact), () => {
        const latestVisibleMessages = contact.messages.filter(message => message.type !== "typing");
        const latestVisibleMessage = latestVisibleMessages[latestVisibleMessages.length - 1];

        if (
            latestVisibleMessage &&
            latestVisibleMessage.type === "action_menu" &&
            latestVisibleMessage.menuKey === menuKey
        ) {
            saveState();
            refreshAfterReply(contactKey, menu.text);
            return;
        }

        if (contact.id === "javier" && menuKey === "main" && typeof setProgress === "function") {
            setProgress("javier_operation_menu_unlocked");
        }

        contact.messages.push({
            from: "contact",
            type: "action_menu",
            text: menu.text,
            translation: menu.translation,
            menuKey,
            options: menu.options,
            time: getCurrentTime()
        });

        saveState();
        refreshAfterReply(contactKey, menu.text);
    });
}

function getJavierMenu(menuKey) {
    const menus = {
        main: {
            text: "Bueno. Ahora sí. No voy a responder teorías. Elijan qué quieren que haga.",
            translation: "Fine. Now we can work. I will not answer theories. Choose what you want me to do.",
            options: [
                { label: "INTERROGATE", action: "submenu", target: "interrogate" },
                { label: "INSPECT", action: "submenu", target: "inspect" },
                { label: "REQUEST DOCUMENT", action: "submenu", target: "documents" }
            ]
        },
        interrogate: {
            text: "Elijan a quién quieren que cite. Si puedo moverlo sin hacer ruido, lo llevo a la central.",
            translation: "Choose who you want me to summon. If I can move them quietly, I will bring them to the station.",
            options: [
                {
                    label: "Mika Holt",
                    completedLabel: "Mika Holt ✓",
                    action: "request",
                    requestType: "interrogate",
                    target: "Mika Holt",
                    disabledIfAnyProgress: [
                        "javier_mika_holt_interrogate_requested",
                        "javier_mika_holt_interrogate_received"
                    ]
                },
                {
                    label: "Ava Mercer",
                    completedLabel: "Ava Mercer ✓",
                    action: "request",
                    requestType: "interrogate",
                    target: "Ava Mercer",
                    disabledIfAnyProgress: [
                        "javier_ava_mercer_interrogate_requested",
                        "javier_ava_mercer_interrogate_received"
                    ]
                },
                {
                    label: "Ava Mercer — Follow-up",
                    completedLabel: "Ava Mercer — Follow-up ✓",
                    action: "request",
                    requestType: "interrogate",
                    target: "Ava Mercer",
                    progressBase: "ava_mercer_followup_interrogate",
                    fileLabel: "Follow-up interview recording — Ava Mercer",
                    fileName: "INTERVIEW_AVA_MERCER_FOLLOWUP.mp3",
                    requiresAllProgress: [
                        "javier_ava_mercer_interrogate_received",
                        "ava_nathan_relationship_found"
                    ],
                    disabledIfAnyProgress: [
                        "javier_ava_mercer_followup_interrogate_requested",
                        "javier_ava_mercer_followup_interrogate_received"
                    ]
                },
                {
                    label: "Elias Rowe",
                    completedLabel: "Elias Rowe ✓",
                    action: "request",
                    requestType: "interrogate",
                    target: "Elias Rowe",
                    disabledIfAnyProgress: [
                        "javier_elias_rowe_interrogate_requested",
                        "javier_elias_rowe_interrogate_received"
                    ]
                },
                {
                    label: "Daniel Kessler",
                    action: "request",
                    requestType: "interrogate",
                    target: "Daniel Kessler",
                    requiresProgress: "kessler_interrogation_unlocked",
                    disabledIfAnyProgress: [
                        "javier_daniel_kessler_interrogate_requested",
                        "javier_daniel_kessler_interrogate_received"
                    ]
                },
                {
                    label: "Sofia Mirel",
                    action: "request",
                    requestType: "interrogate",
                    target: "Sofia Mirel",
                    requiresProgress: "sofia_badge_confirmed",
                    disabledIfAnyProgress: [
                        "javier_sofia_mirel_interrogate_requested",
                        "javier_sofia_mirel_interrogate_received"
                    ]
                },
                {
                    label: "Adrian Veil",
                    action: "request",
                    requestType: "interrogate",
                    target: "Adrian Veil",
                    requiresProgress: "veil_interrogation_unlocked",
                    disabledIfAnyProgress: [
                        "javier_adrian_veil_interrogate_requested",
                        "javier_adrian_veil_interrogate_received"
                    ]
                },
                { label: "BACK", action: "submenu", target: "main" }
            ]
        },
        inspect: {
            text: "Elijan la zona.",
            translation: "Choose the district.",
            options: [
                { label: "AUREX", action: "submenu", target: "inspect_aurex" },
                { label: "LYRA", action: "submenu", target: "inspect_lyra" },
                { label: "NOVA COMMONS", action: "submenu", target: "inspect_nova" },
                { label: "EIDEN PARK", action: "submenu", target: "inspect_park" },
                { label: "KEROS", action: "submenu", target: "inspect_keros" },
                { label: "THE SILENCE", action: "submenu", target: "inspect_silence" },
                { label: "BACK", action: "submenu", target: "main" }
            ]
        },
        
        inspect_lyra: {
            text: "Select POI.",
            translation: "Select POI.",
            options: [
                { label: "L1 Primary School", action: "request", requestType: "inspect", target: "L1 Primary School", completedLabel: "✓ L1 Primary School", disabledIfAnyProgress: ["javier_l1_primary_school_inspect_requested", "javier_l1_primary_school_inspect_received", "l1_primary_school_inspection_requested", "l1_primary_school_inspection_received"] },
                { label: "L2 Community Health Center", action: "request", requestType: "inspect", target: "L2 Community Health Center", completedLabel: "✓ L2 Community Health Center", disabledIfAnyProgress: ["javier_l2_community_health_center_inspect_requested", "javier_l2_community_health_center_inspect_received", "l2_community_health_center_inspection_requested", "l2_community_health_center_inspection_received"] },
                { label: "L3 Residential Services Hub", action: "request", requestType: "inspect", target: "L3 Residential Services Hub", completedLabel: "✓ L3 Residential Services Hub", disabledIfAnyProgress: ["javier_l3_residential_services_hub_inspect_requested", "javier_l3_residential_services_hub_inspect_received", "l3_residential_services_hub_inspection_requested", "l3_residential_services_hub_inspection_received"] },
                { label: "L4 Lyra Market", action: "request", requestType: "inspect", target: "L4 Lyra Market", completedLabel: "✓ L4 Lyra Market", disabledIfAnyProgress: ["javier_l4_lyra_market_inspect_requested", "javier_l4_lyra_market_inspect_received", "l4_lyra_market_inspection_requested", "l4_lyra_market_inspection_received"] },
                { label: "L12 Residential Module B214", action: "request", requestType: "inspect", target: "L12 Residential Module B214", completedLabel: "✓ L12 Residential Module B214", disabledIfAnyProgress: ["javier_l12_residential_module_b214_inspect_requested", "javier_l12_residential_module_b214_inspect_received", "l12_residential_module_b214_inspection_requested", "l12_residential_module_b214_inspection_received"] },
                { label: "BACK", action: "submenu", target: "inspect" }
            ]
        },
        inspect_nova: {
            text: "Select POI.",
            translation: "Select POI.",
            options: [
                { label: "N1 Civic Center", action: "request", requestType: "inspect", target: "N1 Civic Center", completedLabel: "✓ N1 Civic Center", disabledIfAnyProgress: ["javier_n1_civic_center_inspect_requested", "javier_n1_civic_center_inspect_received", "n1_civic_center_inspection_requested", "n1_civic_center_inspection_received"] },
                { label: "N2 Food Hall", action: "request", requestType: "inspect", target: "N2 Food Hall", completedLabel: "✓ N2 Food Hall", disabledIfAnyProgress: ["javier_n2_food_hall_inspect_requested", "javier_n2_food_hall_inspect_received", "n2_food_hall_inspection_requested", "n2_food_hall_inspection_received"] },
                { label: "N3 Nova Plaza", action: "request", requestType: "inspect", target: "N3 Nova Plaza", completedLabel: "✓ N3 Nova Plaza", disabledIfAnyProgress: ["javier_n3_nova_plaza_inspect_requested", "javier_n3_nova_plaza_inspect_received", "n3_nova_plaza_inspection_requested", "n3_nova_plaza_inspection_received"] },
                { label: "N4 Coworking Hub", action: "request", requestType: "inspect", target: "N4 Coworking Hub", completedLabel: "✓ N4 Coworking Hub", disabledIfAnyProgress: ["javier_n4_coworking_hub_inspect_requested", "javier_n4_coworking_hub_inspect_received", "n4_coworking_hub_inspection_requested", "n4_coworking_hub_inspection_received"] },
                { label: "N5 Eiden Cinema Sector E-03", action: "request", requestType: "inspect", target: "N5 Eiden Cinema Sector E-03", completedLabel: "✓ N5 Eiden Cinema Sector E-03", disabledIfAnyProgress: ["javier_n5_eiden_cinema_sector_e_03_inspect_requested", "javier_n5_eiden_cinema_sector_e_03_inspect_received", "n5_eiden_cinema_sector_e_03_inspection_requested", "n5_eiden_cinema_sector_e_03_inspection_received"] },
                { label: "N6 Transit Lounge", action: "request", requestType: "inspect", target: "N6 Transit Lounge", completedLabel: "✓ N6 Transit Lounge", disabledIfAnyProgress: ["javier_n6_transit_lounge_inspect_requested", "javier_n6_transit_lounge_inspect_received", "n6_transit_lounge_inspection_requested", "n6_transit_lounge_inspection_received"] },
                { label: "BACK", action: "submenu", target: "inspect" }
            ]
        },
        inspect_park: {
            text: "Select POI.",
            translation: "Select POI.",
            options: [
                { label: "P1 Central Observatory", action: "request", requestType: "inspect", target: "P1 Central Observatory", completedLabel: "✓ P1 Central Observatory", disabledIfAnyProgress: ["javier_p1_central_observatory_inspect_requested", "javier_p1_central_observatory_inspect_received", "p1_central_observatory_inspection_requested", "p1_central_observatory_inspection_received"] },
                { label: "P2 Research Greenhouse", action: "request", requestType: "inspect", target: "P2 Research Greenhouse", completedLabel: "✓ P2 Research Greenhouse", disabledIfAnyProgress: ["javier_p2_research_greenhouse_inspect_requested", "javier_p2_research_greenhouse_inspect_received", "p2_research_greenhouse_inspection_requested", "p2_research_greenhouse_inspection_received"] },
                { label: "P3 Biodiversity Center", action: "request", requestType: "inspect", target: "P3 Biodiversity Center", completedLabel: "✓ P3 Biodiversity Center", disabledIfAnyProgress: ["javier_p3_biodiversity_center_inspect_requested", "javier_p3_biodiversity_center_inspect_received", "p3_biodiversity_center_inspection_requested", "p3_biodiversity_center_inspection_received"] },
                { label: "P4 Central Greenhouse", action: "request", requestType: "inspect", target: "P4 Central Greenhouse", completedLabel: "✓ P4 Central Greenhouse", disabledIfAnyProgress: ["javier_p4_central_greenhouse_inspect_requested", "javier_p4_central_greenhouse_inspect_received", "p4_central_greenhouse_inspection_requested", "p4_central_greenhouse_inspection_received"] },
                { label: "P5 Lake Pavilion", action: "request", requestType: "inspect", target: "P5 Lake Pavilion", completedLabel: "✓ P5 Lake Pavilion", disabledIfAnyProgress: ["javier_p5_lake_pavilion_inspect_requested", "javier_p5_lake_pavilion_inspect_received", "p5_lake_pavilion_inspection_requested", "p5_lake_pavilion_inspection_received"] },
                { label: "BACK", action: "submenu", target: "inspect" }
            ]
        },
        inspect_keros: {
            text: "Select POI.",
            translation: "Select POI.",
            options: [
                { label: "K1 Maintenance Center", action: "request", requestType: "inspect", target: "K1 Maintenance Center", completedLabel: "✓ K1 Maintenance Center", disabledIfAnyProgress: ["javier_k1_maintenance_center_inspect_requested", "javier_k1_maintenance_center_inspect_received", "k1_maintenance_center_inspection_requested", "k1_maintenance_center_inspection_received"] },
                { label: "K2 Energy Control Station", action: "request", requestType: "inspect", target: "K2 Energy Control Station", completedLabel: "✓ K2 Energy Control Station", disabledIfAnyProgress: ["javier_k2_energy_control_station_inspect_requested", "javier_k2_energy_control_station_inspect_received", "k2_energy_control_station_inspection_requested", "k2_energy_control_station_inspection_received"] },
                { label: "K3 Server Farm Alpha", action: "request", requestType: "inspect", target: "K3 Server Farm Alpha", completedLabel: "✓ K3 Server Farm Alpha", disabledIfAnyProgress: ["javier_k3_server_farm_alpha_inspect_requested", "javier_k3_server_farm_alpha_inspect_received", "k3_server_farm_alpha_inspection_requested", "k3_server_farm_alpha_inspection_received"] },
                { label: "K4 Autonomous Mobility Depot", action: "request", requestType: "inspect", target: "K4 Autonomous Mobility Depot", completedLabel: "✓ K4 Autonomous Mobility Depot", disabledIfAnyProgress: ["javier_k4_autonomous_mobility_depot_inspect_requested", "javier_k4_autonomous_mobility_depot_inspect_received", "k4_autonomous_mobility_depot_inspection_requested", "k4_autonomous_mobility_depot_inspection_received"] },
                { label: "K5 Industrial Logistics Hub", action: "request", requestType: "inspect", target: "K5 Industrial Logistics Hub", completedLabel: "✓ K5 Industrial Logistics Hub", disabledIfAnyProgress: ["javier_k5_industrial_logistics_hub_inspect_requested", "javier_k5_industrial_logistics_hub_inspect_received", "k5_industrial_logistics_hub_inspection_requested", "k5_industrial_logistics_hub_inspection_received"] },
                { label: "BACK", action: "submenu", target: "inspect" }
            ]
        },
        inspect_aurex: {
            text: "Select POI.",
            translation: "Select POI.",
            options: [
                { label: "A1 Aethos Monitoring Center", action: "request", requestType: "inspect", target: "A1 Aethos Monitoring Center", completedLabel: "✓ A1 Aethos Monitoring Center", disabledIfAnyProgress: ["javier_a1_aethos_monitoring_center_inspect_requested", "javier_a1_aethos_monitoring_center_inspect_received", "a1_aethos_monitoring_center_inspection_requested", "a1_aethos_monitoring_center_inspection_received"] },
                { label: "A2 Command Nexus", action: "request", requestType: "inspect", target: "A2 Command Nexus", completedLabel: "✓ A2 Command Nexus", disabledIfAnyProgress: ["javier_a2_command_nexus_inspect_requested", "javier_a2_command_nexus_inspect_received", "a2_command_nexus_inspection_requested", "a2_command_nexus_inspection_received"] },
                { label: "A3 Citizen Registry Bureau", action: "request", requestType: "inspect", target: "A3 Citizen Registry Bureau", completedLabel: "✓ A3 Citizen Registry Bureau", disabledIfAnyProgress: ["javier_a3_citizen_registry_bureau_inspect_requested", "javier_a3_citizen_registry_bureau_inspect_received", "a3_citizen_registry_bureau_inspection_requested", "a3_citizen_registry_bureau_inspection_received"] },
                { label: "A4 Data Compliance Authority", action: "request", requestType: "inspect", target: "A4 Data Compliance Authority", completedLabel: "✓ A4 Data Compliance Authority", disabledIfAnyProgress: ["javier_a4_data_compliance_authority_inspect_requested", "javier_a4_data_compliance_authority_inspect_received", "a4_data_compliance_authority_inspection_requested", "a4_data_compliance_authority_inspection_received"] },
                { label: "A5 Public Services Administration", action: "request", requestType: "inspect", target: "A5 Public Services Administration", completedLabel: "✓ A5 Public Services Administration", disabledIfAnyProgress: ["javier_a5_public_services_administration_inspect_requested", "javier_a5_public_services_administration_inspect_received", "a5_public_services_administration_inspection_requested", "a5_public_services_administration_inspection_received"] },
                { label: "BACK", action: "submenu", target: "inspect" }
            ]
        },
        inspect_silence: {
            text: "Select POI.",
            translation: "Select POI.",
            options: [
                { label: "S1 Legacy Infrastructure Node", action: "request", requestType: "inspect", target: "S1 Legacy Infrastructure Node", completedLabel: "✓ S1 Legacy Infrastructure Node", disabledIfAnyProgress: ["javier_s1_legacy_infrastructure_node_inspect_requested", "javier_s1_legacy_infrastructure_node_inspect_received", "s1_legacy_infrastructure_node_inspection_requested", "s1_legacy_infrastructure_node_inspection_received"] },
                { label: "S2 Restricted Transit Tunnel", action: "request", requestType: "inspect", target: "S2 Restricted Transit Tunnel", completedLabel: "✓ S2 Restricted Transit Tunnel", disabledIfAnyProgress: ["javier_s2_restricted_transit_tunnel_inspect_requested", "javier_s2_restricted_transit_tunnel_inspect_received", "s2_restricted_transit_tunnel_inspection_requested", "s2_restricted_transit_tunnel_inspection_received"] },
                { label: "S3 Abandoned Residential Block", action: "request", requestType: "inspect", target: "S3 Abandoned Residential Block", completedLabel: "✓ S3 Abandoned Residential Block", disabledIfAnyProgress: ["javier_s3_abandoned_residential_block_inspect_requested", "javier_s3_abandoned_residential_block_inspect_received", "s3_abandoned_residential_block_inspection_requested", "s3_abandoned_residential_block_inspection_received"] },
                { label: "S4 Decommissioned Data Vault", action: "request", requestType: "inspect", target: "S4 Decommissioned Data Vault", completedLabel: "✓ S4 Decommissioned Data Vault", disabledIfAnyProgress: ["javier_s4_decommissioned_data_vault_inspect_requested", "javier_s4_decommissioned_data_vault_inspect_received", "s4_decommissioned_data_vault_inspection_requested", "s4_decommissioned_data_vault_inspection_received"] },
                { label: "S5 Containment Sector 7", action: "request", requestType: "inspect", target: "S5 Containment Sector 7", completedLabel: "✓ S5 Containment Sector 7", disabledIfAnyProgress: ["javier_s5_containment_sector_7_inspect_requested", "javier_s5_containment_sector_7_inspect_received", "s5_containment_sector_7_inspection_requested", "s5_containment_sector_7_inspection_received"] },
                { label: "BACK", action: "submenu", target: "inspect" }
            ]
        },

        documents: {
            text: "Elijan el tipo de documento. Los access logs no los puedo conseguir por esta vía.",
            translation: "Choose the document type. I cannot obtain access logs through this channel.",
            options: [
                { label: "Citizen Registry", action: "request", requestType: "document", target: "Citizen Registry" },
                { label: "Commercial Transactions", action: "request", requestType: "document", target: "Commercial Transactions" },
                { label: "Security Reports", action: "request", requestType: "document", target: "Security Reports" },
                { label: "Incident Records", action: "request", requestType: "document", target: "Incident Records" },
                { label: "Local Police Notes", action: "request", requestType: "document", target: "Local Police Notes" },
                { label: "BACK", action: "submenu", target: "main" }
            ]
        }
    };

    return menus[menuKey] || menus.main;
}

function getAvailableJavierOptions(options) {
    return options.filter(option => isJavierOptionVisible(option));
}

function isJavierOptionVisible(option) {
    if (!option) return false;

    if (option.requiresProgress) {
        if (typeof hasProgress !== "function" || !hasProgress(option.requiresProgress)) {
            return false;
        }
    }

    if (Array.isArray(option.requiresAllProgress)) {
        if (typeof hasProgress !== "function") return false;

        const allUnlocked = option.requiresAllProgress.every(flag => hasProgress(flag));
        if (!allUnlocked) return false;
    }

    return true;
}

function isJavierOptionDisabled(option) {
    if (!option || !Array.isArray(option.disabledIfAnyProgress)) return false;
    if (typeof hasProgress !== "function") return false;

    return option.disabledIfAnyProgress.some(flag => hasProgress(flag));
}

function getJavierOptionLabel(option) {
    if (isJavierOptionDisabled(option) && option.completedLabel) {
        return option.completedLabel;
    }

    return option.label || "OPTION";
}

function createActionMenuMessage(message) {
    const wrap = document.createElement("div");
    wrap.className = "action-menu-message";

    const text = document.createElement("div");
    text.className = "message-text";
    text.textContent = message.text || "";
    wrap.appendChild(text);

    if (Array.isArray(message.options)) {
        const options = document.createElement("div");
        options.className = "action-options";

        getAvailableJavierOptions(message.options).forEach(option => {
            const button = document.createElement("button");
            const disabled = isJavierOptionDisabled(option);

            button.className = disabled
                ? "action-option-btn disabled"
                : "action-option-btn";

            button.type = "button";
            button.textContent = getJavierOptionLabel(option);
            button.disabled = disabled;

            if (!disabled) {
                button.addEventListener("click", () => handleJavierActionOption(option));
            }

            options.appendChild(button);
        });

        wrap.appendChild(options);
    }

    return wrap;
}

function handleJavierActionOption(option) {
    if (!currentContactKey) return;
    if (!isJavierOptionVisible(option) || isJavierOptionDisabled(option)) return;

    const contact = contacts[currentContactKey];
    if (!contact || contact.id !== "javier") return;

    if (isJavierBusy(contact)) {
        sendJavierBusyReply(currentContactKey);
        return;
    }

    if (option.action === "submenu") {
        contact.messages.push({
            from: "player",
            text: option.label || "Menu",
            time: getCurrentTime()
        });
        saveState();
        renderMessages();
        sendJavierActionMenu(currentContactKey, option.target || "main");
        return;
    }

    if (option.action === "request") {
        const requestText = formatJavierRequestText(option);
        contact.messages.push({
            from: "player",
            text: requestText,
            time: getCurrentTime()
        });
        saveState();
        renderMessages();
        handleJavierOperationalRequest(currentContactKey, option);
    }
}

function formatJavierRequestText(option) {
    const typeLabels = {
        interrogate: "Interrogate",
        inspect: "Inspect",
        document: "Request document"
    };

    const prefix = typeLabels[option.requestType] || "Request";
    return `${prefix}: ${option.target}`;
}

function getJavierOperationProgressBase(option) {
    if (option && option.progressBase) {
        return String(option.progressBase).toLowerCase();
    }

    const type = String(option.requestType || "operation").toLowerCase();
    const target = slugifyFileName(option.target || "unknown").toLowerCase();
    return `${target}_${type}`;
}

function setJavierOperationProgress(option, stage) {
    if (typeof setProgress !== "function") return;
    const base = getJavierOperationProgressBase(option);
    setProgress(`javier_${base}_${stage}`);

    if (option.requestType === "interrogate") {
        setProgress(`${slugifyFileName(option.target || "unknown").toLowerCase()}_interrogation_${stage}`);
    }

    if (option.requestType === "inspect") {
        setProgress(`${slugifyFileName(option.target || "unknown").toLowerCase()}_inspection_${stage}`);
    }

    if (option.requestType === "document") {
        setProgress(`${slugifyFileName(option.target || "unknown").toLowerCase()}_document_${stage}`);
    }
}

function handleJavierOperationalRequest(contactKey, option) {
    const contact = contacts[contactKey];
    if (!contact || contact.id !== "javier") return;

    if (isJavierBusy(contact)) {
        sendJavierBusyReply(contactKey);
        return;
    }

    const reply = buildJavierOperationalReply(option);

    startJavierOperation(contactKey, option);

    sendContactMessage(contactKey, {
        text: reply.text,
        translation: reply.translation
    });
}

function buildJavierOperationalReply(option) {
    const target = option.target || "";

    if (option.requestType === "interrogate") {
        return {
            text: `Está bien. Voy a citar a ${target} en la central. Cuando tenga la grabación del encuentro, se la mando. Hasta entonces no me escriban para otra cosa.`,
            translation: `Fine. I will summon ${target} to the station. When I have the meeting recording, I will send it to you. Until then, do not contact me for anything else.`
        };
    }

    if (option.requestType === "inspect") {
        return {
            text: `Está bien. Voy a revisar ${target}. Si consigo algo útil, se lo mando. Mientras estoy con esto no tomo otra operación.`,
            translation: `Fine. I will inspect ${target}. If I get anything useful, I will send it to you. While I am working on this, I will not take another operation.`
        };
    }

    if (option.requestType === "document") {
        return {
            text: `Está bien. Voy a intentar conseguir: ${target}. Si existe fuera de los sistemas cerrados de Veyra, puede salir. No me pidan otra cosa mientras tanto.`,
            translation: `Fine. I will try to obtain: ${target}. If it exists outside Veyra's closed systems, it may come out. Do not ask me for anything else meanwhile.`
        };
    }

    return {
        text: "Está bien. Me ocupo.",
        translation: "Fine. I will handle it."
    };
}

function startJavierOperation(contactKey, option) {
    const contact = contacts[contactKey];
    if (!contact || contact.id !== "javier") return;

    const operation = {
        id: `javier-${Date.now()}-${Math.floor(Math.random() * 9000) + 1000}`,
        requestType: option.requestType,
        target: option.target,
        progressBase: option.progressBase || null,
        fileLabel: option.fileLabel || null,
        fileName: option.fileName || null,
        startedAt: Date.now(),
        readyAt: Date.now() + JAVIER_OPERATION_DELAY_MS,
        delivered: false
    };

    contact.pendingOperation = operation;
    setJavierOperationProgress(option, "requested");
    saveState();
    scheduleJavierOperationDelivery(contactKey);
}

function isJavierBusy(contact) {
    if (!contact || contact.id !== "javier" || !contact.pendingOperation) return false;

    if (contact.pendingOperation.delivered) return false;

    if (Date.now() >= Number(contact.pendingOperation.readyAt || 0)) {
        return false;
    }

    return true;
}

function sendJavierBusyReply(contactKey) {
    const contact = contacts[contactKey];
    const operation = contact && contact.pendingOperation;
    const target = operation?.target || "the current task";

    sendContactMessage(contactKey, {
        text: `Estoy ocupado con ${target}. Cuando termine, les mando lo que consiga.`,
        translation: `I am busy with ${target}. When I finish, I will send you what I can get.`
    });
}

function startJavierPendingOperationWatcher() {
    Object.keys(contacts).forEach(key => {
        const contact = contacts[key];
        if (contact && contact.id === "javier" && contact.pendingOperation && !contact.pendingOperation.delivered) {
            scheduleJavierOperationDelivery(key);
        }
    });
}

function scheduleJavierOperationDelivery(contactKey) {
    const contact = contacts[contactKey];
    if (!contact || contact.id !== "javier" || !contact.pendingOperation) return;

    const operation = contact.pendingOperation;
    const delay = Math.max(0, Number(operation.readyAt || 0) - Date.now());

    clearTimeout(javierOperationTimers[operation.id]);

    javierOperationTimers[operation.id] = setTimeout(() => {
        deliverJavierOperationResult(contactKey);
    }, Math.max(JAVIER_BUSY_CHECK_MS, delay));
}

function deliverJavierOperationResult(contactKey) {
    const contact = contacts[contactKey];
    if (!contact || contact.id !== "javier" || !contact.pendingOperation) return;

    const operation = contact.pendingOperation;

    if (operation.delivered) return;
    if (Date.now() < Number(operation.readyAt || 0)) {
        scheduleJavierOperationDelivery(contactKey);
        return;
    }

    operation.delivered = true;
    contact.pendingOperation = null;
    setJavierOperationProgress(operation, "received");

    const result = buildJavierOperationResult(operation);

    showTyping(contactKey, realisticTypingDuration(result.text, contact), () => {
        contact.messages.push({
            from: "contact",
            text: result.text,
            translation: result.translation,
            time: getCurrentTime()
        });

        if (result.file) {
            contact.messages.push({
                from: "contact",
                type: "file",
                text: result.file.title,
                fileName: result.file.fileName,
                fileKind: result.file.fileKind,
                filePath: result.file.filePath || null,
                fileContent: result.file.fileContent,
                time: getCurrentTime()
            });
        }

        saveState();
        refreshAfterReply(contactKey, result.text);
        showPushNotification(contact, result.file ? result.file.title : result.text);
        setTimeout(() => sendJavierActionMenu(contactKey, "main"), 900);
    });
}

function getInspectionAsset(target) {
    const key = String(target || "").toLowerCase();
    const inspectionAssets = [
        { match: "l12", fileName: "L12.pdf", filePath: "assets/inspections/L12.pdf" },
        { match: "n5", fileName: "N5.pdf", filePath: "assets/inspections/N5.pdf" },
        { match: "p5", fileName: "P5.pdf", filePath: "assets/inspections/P5.pdf" },
        { match: "s1", fileName: "S1.pdf", filePath: "assets/inspections/S1.pdf" }
    ];

    return inspectionAssets.find(asset => key.includes(asset.match)) || null;
}

function buildJavierOperationResult(operation) {
    const target = operation.target || "Unknown subject";

    if (operation.requestType === "interrogate") {
        return {
            text: `Listo. Ya tengo la grabación de ${target}. Se las dejo acá.`,
            translation: `Done. I have the recording of ${target}. I am leaving it here for you.`,
            file: {
                title: `Interview recording — ${target}`,
                fileName: `INTERVIEW_${slugifyFileName(target)}.mp3`,
                fileKind: "AUDIO",
                fileContent: `POLICE STATION INTERVIEW RECORDING\nSubject: ${target}\nStatus: audio file acquired.\n\n[Placeholder audio asset. Replace this text with the final transcript or link when the interrogation content is written.]`
            }
        };
    }

    if (operation.requestType === "inspect") {
        const asset = getInspectionAsset(target);

        return {
            text: `Revisión terminada. Les mando el informe de ${target}.`,
            translation: `Inspection completed. I am sending you the report for ${target}.`,
            file: asset ? {
                title: `Inspection report — ${target}`,
                fileName: asset.fileName,
                fileKind: "REPORT",
                filePath: asset.filePath,
                fileContent: `Inspection report available: ${asset.fileName}`
            } : {
                title: `Inspection note — ${target}`,
                fileName: `INSPECTION_${slugifyFileName(target)}.txt`,
                fileKind: "REPORT",
                fileContent: `FIELD INSPECTION NOTE\nLocation: ${target}\nStatus: preliminary field note.\n\n[Placeholder report. Replace this text with the final inspection result when the location content is written.]`
            }
        };
    }

    if (operation.requestType === "document") {
        return {
            text: `Conseguido. Les mando el documento: ${target}.`,
            translation: `Obtained. I am sending you the document: ${target}.`,
            file: {
                title: `Document — ${target}`,
                fileName: `DOCUMENT_${slugifyFileName(target)}.pdf`,
                fileKind: "DOCUMENT",
                fileContent: `DOCUMENT REQUEST RESULT\nType: ${target}\nStatus: acquired through local police channel.\n\n[Placeholder document. Replace this text with the final document content or link when ready.]`
            }
        };
    }

    return {
        text: "Listo. Les mando lo que conseguí.",
        translation: "Done. I am sending you what I obtained."
    };
}

function slugifyFileName(value) {
    return String(value || "file")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-zA-Z0-9]+/g, "_")
        .replace(/^_+|_+$/g, "")
        .toUpperCase();
}

function createFileMessage(message) {
    const card = document.createElement("button");
    card.className = "file-card";
    card.type = "button";

    const kind = message.fileKind || "FILE";
    const fileName = message.fileName || message.text || "Attachment";

    card.innerHTML = `
        <div class="file-icon">${escapeHtml(kind.slice(0, 3).toUpperCase())}</div>
        <div class="file-meta">
            <div class="file-title">${escapeHtml(message.text || fileName)}</div>
            <div class="file-name">${escapeHtml(fileName)}</div>
        </div>
    `;

card.addEventListener("click", () => {

    if (message.url) {
        window.location.href = message.url;
        return;
    }

    openFileViewer(message);

});

    return card;
}

function openMediaArchive() {
    if (!currentContactKey || !mediaModal || !mediaList) return;

    const contact = contacts[currentContactKey];
    const files = getContactMedia(contact);

    mediaList.innerHTML = "";
    mediaViewer.innerHTML = "";

    if (!files.length) {
        mediaList.innerHTML = `<div class="media-empty">No multimedia files received in this chat.</div>`;
    } else {
        files.forEach((message, index) => {
            const item = document.createElement("button");
            item.className = "media-item";
            item.type = "button";
            item.innerHTML = `
                <span>${escapeHtml(message.fileKind || message.type || "FILE")}</span>
                <strong>${escapeHtml(message.fileName || message.text || `Attachment ${index + 1}`)}</strong>
            `;
            item.addEventListener("click", () => openFileViewer(message, true));
            mediaList.appendChild(item);
        });
    }

    mediaModal.classList.add("active");
}

function closeMediaArchive() {
    if (mediaModal) mediaModal.classList.remove("active");
}

function getContactMedia(contact) {
    if (!contact || !Array.isArray(contact.messages)) return [];
    return contact.messages.filter(message => message.type === "file" || message.type === "image");
}

function openFileViewer(message, keepModalOpen = false) {
    if (!mediaModal || !mediaViewer) return;

    if (!keepModalOpen) {
        mediaModal.classList.add("active");
        if (mediaList) mediaList.innerHTML = "";
    }

    if (message.type === "image") {
        mediaViewer.innerHTML = `
            <div class="media-view-title">${escapeHtml(message.text || "Image")}</div>
            <img class="media-view-image" src="${escapeHtml(message.imageData || "")}" alt="${escapeHtml(message.text || "Image")}">
        `;
        return;
    }

    const filePath = message.filePath || "";
    const fileName = message.fileName || "";
    const ext = fileName.split(".").pop().toLowerCase();

    if (filePath && ext === "pdf") {
        mediaViewer.innerHTML = `
            <div class="media-view-title">${escapeHtml(message.text || fileName)}</div>
            <iframe src="${filePath}" style="width:100%;height:70vh;border:none;background:white;"></iframe>
        `;
        return;
    }

    if (filePath && ["jpg","jpeg","png","webp"].includes(ext)) {
        mediaViewer.innerHTML = `
            <div class="media-view-title">${escapeHtml(message.text || fileName)}</div>
            <img class="media-view-image" src="${filePath}">
        `;
        return;
    }

    if (filePath && ["mp3","wav","ogg"].includes(ext)) {
        mediaViewer.innerHTML = `
            <div class="media-view-title">${escapeHtml(message.text || fileName)}</div>
            <audio controls style="width:100%;">
                <source src="${filePath}">
            </audio>
        `;
        return;
    }

    mediaViewer.innerHTML = `
        <div class="media-view-title">${escapeHtml(message.text || message.fileName || "Attachment")}</div>
        <div class="media-view-filename">${escapeHtml(message.fileName || "Attachment")}</div>
        <pre class="media-view-content">${escapeHtml(message.fileContent || "File received. Content not available yet.")}</pre>
    `;
}


/* PAYMENT PORTAL */

function openPaymentPortal(index) {
    const contact = contacts[currentContactKey];
    if (!contact) return;

    const message = contact.messages[index];
    if (!message || message.type !== "payment" || message.paid) return;

    const paymentId = message.paymentId || createPaymentId();
    message.paymentId = paymentId;
    message.loading = true;

    const intent = {
        paymentId,
        contactKey: currentContactKey,
        messageIndex: index,
        recipient: message.requestFrom || "Javier Morales",
        recipientAlias: "J. Morales",
        amountUSD: message.amountUSD || DEFAULT_ACCESS_COST_USD,
        amountARS: message.amountARS || DEFAULT_ACCESS_COST_ARS,
        purpose: message.paymentPurpose || "field_contribution",
        note: "Operational cooperation fee",
        createdAt: new Date().toISOString(),
        returnUrl: "../index.html"
    };

    localStorage.setItem(PAYMENT_INTENT_KEY, JSON.stringify(intent));
    localStorage.setItem("kairos_wallet_balance_usd", String(operationBudget || DEFAULT_WALLET_BALANCE_EUR));

    saveState();
    renderMessages();

    const params = new URLSearchParams({
        paymentId: intent.paymentId,
        to: intent.recipient,
        alias: intent.recipientAlias,
        usd: String(intent.amountUSD),
        ars: intent.amountARS,
        purpose: intent.purpose,
        return: "../index.html"
    });

    window.location.href = `payment/index.html?${params.toString()}`;
}

function applyPaymentReturns() {
    const raw = localStorage.getItem(PAYMENT_RETURN_KEY);
    if (!raw) return;

    let result;

    try {
        result = JSON.parse(raw);
    } catch (error) {
        localStorage.removeItem(PAYMENT_RETURN_KEY);
        return;
    }

    if (!result || result.status !== "paid" || !result.paymentId) {
        localStorage.removeItem(PAYMENT_RETURN_KEY);
        return;
    }

    const contactKey = result.contactKey || findContactKeyByPaymentId(result.paymentId);
    const contact = contacts[contactKey];

    if (!contact) {
        localStorage.removeItem(PAYMENT_RETURN_KEY);
        return;
    }

    const message = contact.messages.find(item => {
        return item.type === "payment" && item.paymentId === result.paymentId;
    });

    if (!message || message.paid) {
        localStorage.removeItem(PAYMENT_RETURN_KEY);
        return;
    }

    const costUSD = Number(result.amountUSD || message.amountUSD || DEFAULT_ACCESS_COST_USD);

    message.loading = false;
    message.paid = true;

    if (message.paymentPurpose === "javier_access_fee" && contact.id === "javier") {
        contact.accessPaid = true;
    }

    const walletBalance = Number(localStorage.getItem("kairos_wallet_balance_usd"));

    if (Number.isFinite(walletBalance) && walletBalance >= 0) {
        operationBudget = walletBalance;
    } else {
        operationBudget = Math.max(0, operationBudget - costUSD);
        localStorage.setItem("kairos_wallet_balance_usd", String(operationBudget || DEFAULT_WALLET_BALANCE_EUR));
    }

    localStorage.removeItem(PAYMENT_RETURN_KEY);
    localStorage.removeItem(PAYMENT_INTENT_KEY);

    if (contact.id === "javier") {
        addAutomaticJavierPaymentReceipt(contact, result);
        contact.accessPaid = true;
        contact.paymentProofAcknowledged = true;

        if (typeof setProgress === "function") {
            setProgress("javier_access_granted");
        }
    }

    saveState();
    renderMessages();
    renderContactList();
    showPaymentPopup(true, costUSD);

    if (contact.id === "javier") {
        showPushNotification(contact, "Payment receipt sent automatically to Javier Morales.");
        const fee = contact.accessFee || {};
        setTimeout(() => {
            sendContactMessage(contactKey, {
                text: fee.paidText || "Recibido. Ahora sí podemos trabajar.",
                translation: fee.paidTranslation || "Received. Now we can work.",
                after: () => sendJavierActionMenu(contactKey, "main")
            });
        }, 900);
    }
}

function addAutomaticJavierPaymentReceipt(contact, result) {
    if (!contact || !result || !result.paymentId) return;

    const alreadySent = contact.messages.some(message => {
        return message.type === "payment_receipt" && message.paymentId === result.paymentId;
    });

    if (alreadySent) return;

    contact.messages.push({
        from: "player",
        type: "payment_receipt",
        text: "Automatic payment receipt",
        paymentId: result.paymentId,
        recipient: result.recipient || "Javier Morales",
        amountUSD: result.amountUSD || DEFAULT_ACCESS_COST_USD,
        amountARS: result.amountARS || DEFAULT_ACCESS_COST_ARS,
        completedAt: result.completedAt || new Date().toISOString(),
        time: getCurrentTime()
    });
}

function findContactKeyByPaymentId(paymentId) {
    return Object.keys(contacts).find(key => {
        return contacts[key].messages.some(message => {
            return message.type === "payment" && message.paymentId === paymentId;
        });
    });
}

function syncWalletBalance() {
    const walletBalance = Number(localStorage.getItem("kairos_wallet_balance_usd"));

    if (Number.isFinite(walletBalance) && walletBalance >= 0 && walletBalance !== operationBudget) {
        operationBudget = walletBalance;
    } else {
        localStorage.setItem("kairos_wallet_balance_usd", String(operationBudget || DEFAULT_WALLET_BALANCE_EUR));
    }
}

function createPaymentId() {
    return `KD-${Date.now()}-${Math.floor(Math.random() * 9000) + 1000}`;
}

/* PAYMENT */

function completePayment(index) {
    const contact = contacts[currentContactKey];

    if (!contact) return;

    const message = contact.messages[index];

    if (!message || message.type !== "payment") return;
    if (message.paid || message.loading) return;

    const costUSD = message.amountUSD || DEFAULT_ACCESS_COST_USD;

    if (operationBudget < costUSD) {
        showPaymentPopup(false, costUSD);
        return;
    }

    message.loading = true;

    saveState();
    renderMessages();

    setTimeout(() => {
        operationBudget -= costUSD;

        message.loading = false;
        message.paid = true;

        if (message.paymentPurpose === "javier_access_fee" && contact.id === "javier") {
            contact.accessPaid = true;
        }

        saveState();
        renderMessages();
        renderContactList();

        showPaymentPopup(true, costUSD);

        if (contact.id === "javier") {
            const fee = contact.accessFee || {};
            sendContactMessage(currentContactKey, {
                text: fee.paidText || "Listo. Ahora sí. Pregunten claro.",
                translation: fee.paidTranslation || "Done. Now we can talk. Ask clearly."
            });
        }
    }, randomInt(1500, 2600));
}

function showPaymentPopup(success, costUSD = DEFAULT_ACCESS_COST_USD) {
    const popup = document.createElement("div");

    popup.className = success
        ? "payment-popup success"
        : "payment-popup error";

    popup.innerHTML = success
        ? `
            <strong>Transfer completed</strong>
            <span>Spent: ${costUSD} EUR</span>
            <span>Remaining operation funds: ${operationBudget.toLocaleString("en-US")} EUR</span>
        `
        : `
            <strong>Transfer refused</strong>
            <span>Required: ${costUSD} EUR</span>
            <span>Remaining operation funds: ${operationBudget.toLocaleString("en-US")} EUR</span>
        `;

    document.body.appendChild(popup);

    setTimeout(() => {
        popup.classList.add("hide");
    }, 3500);

    setTimeout(() => {
        popup.remove();
    }, 4000);
}

/* TYPING */

function sendContactMessage(contactKey, reply) {
    const contact = contacts[contactKey];
    if (!contact) return;

    const duration = realisticTypingDuration(reply.text, contact);

    showTyping(contactKey, duration, () => {
        contact.messages.push({
            from: "contact",
            text: reply.text,
            translation: reply.translation,
            time: getCurrentTime()
        });

        saveState();
        refreshAfterReply(contactKey, reply.text);

        if (typeof reply.after === "function") {
            const afterDelay = realisticReadDelay(contact, reply.text);
            setTimeout(reply.after, afterDelay);
        }
    });
}

function showTyping(contactKey, duration, callback) {
    const contact = contacts[contactKey];

    if (!contact) return;

    removeTyping(contact);

    contact.messages.push({
        from: "contact",
        type: "typing",
        text: "",
        time: getCurrentTime()
    });

    saveState();

    if (currentContactKey === contactKey) {
        renderMessages();
    }

    setTimeout(() => {
        removeTyping(contact);

        saveState();

        if (typeof callback === "function") {
            callback();
        }
    }, Math.max(700, duration));
}

function removeTyping(contact) {
    contact.messages = contact.messages.filter(message => message.type !== "typing");
}

function realisticReadDelay(contact, incomingText) {
    const profile = CONTACT_RESPONSE_PROFILE[contact.id] || CONTACT_RESPONSE_PROFILE.default;
    const base = randomInt(profile.minDelay, profile.maxDelay);
    const extra = Math.min(8000, String(incomingText || "").length * 35);

    return base + extra;
}

function realisticTypingDuration(outgoingText, contact) {
    const profile = CONTACT_RESPONSE_PROFILE[contact.id] || CONTACT_RESPONSE_PROFILE.default;
    const words = String(outgoingText || "").trim().split(/\s+/).filter(Boolean).length;
    const chars = String(outgoingText || "").length;

    const duration = 650 + words * randomInt(260, 520) + chars * randomInt(12, 24);

    return clamp(duration, profile.typingMin, profile.typingMax);
}

/* TRANSLATION BUTTON */

function toggleTranslation(index) {
    const contact = contacts[currentContactKey];
    const message = contact.messages[index];

    if (!message || !message.translation) return;

    if (!message.originalText) {
        message.originalText = message.text;
    }

    if (message.translated) {
        message.text = message.originalText;
        message.translated = false;
    } else {
        message.text = message.translation;
        message.translated = true;
    }

    saveState();
    renderMessages();
    renderContactList();
}


function createPaymentReceiptMessage(message) {
    const wrap = document.createElement("div");
    wrap.className = "payment-receipt-message";

    wrap.innerHTML = `
        <div class="receipt-mini-top">Kairos Detectives Wallet</div>
        <div class="receipt-mini-title">Transfer receipt</div>
        <div class="receipt-mini-row"><span>Recipient</span><strong>${escapeHtml(message.recipient || "Javier Morales")}</strong></div>
        <div class="receipt-mini-row"><span>Amount</span><strong>${escapeHtml(message.amountARS || DEFAULT_ACCESS_COST_ARS)}</strong></div>
        <div class="receipt-mini-row"><span>Wallet impact</span><strong>${escapeHtml(String(message.amountUSD || DEFAULT_ACCESS_COST_USD))} EUR</strong></div>
        <div class="receipt-mini-id">${escapeHtml(message.paymentId || "KD-RECEIPT")}</div>
        <div class="receipt-mini-status">Automatically sent through secure channel</div>
    `;

    return wrap;
}

function createImageMessage(message) {
    const wrap = document.createElement("div");
    wrap.className = "image-message";

    const img = document.createElement("img");
    img.src = message.imageData || "";
    img.alt = "Payment receipt screenshot";

    const caption = document.createElement("div");
    caption.className = "image-caption";
    caption.textContent = message.text || "Payment receipt screenshot";

    wrap.appendChild(img);
    wrap.appendChild(caption);

    return wrap;
}


function absorbJavierPaymentResult(contact) {
    if (!contact || contact.id !== "javier") return false;

    const raw = localStorage.getItem(PAYMENT_RETURN_KEY);
    let result = null;

    if (raw) {
        try {
            result = JSON.parse(raw);
        } catch (error) {
            result = null;
        }
    }

    const paymentMessages = contact.messages.filter(message => {
        return message.type === "payment" &&
            message.paymentPurpose === "javier_access_fee";
    });

    if (!paymentMessages.length) return !!contact.accessPaid;

    let targetPayment = null;

    if (result && result.status === "paid") {
        targetPayment = paymentMessages.find(message => {
            return message.paymentId && message.paymentId === result.paymentId;
        });
    }

    if (!targetPayment) {
        targetPayment = [...paymentMessages].reverse().find(message => !message.paid) || paymentMessages[paymentMessages.length - 1];
    }

    if (!targetPayment) return !!contact.accessPaid;

    if (result && result.status === "paid") {
        targetPayment.paymentId = targetPayment.paymentId || result.paymentId;
        targetPayment.loading = false;
        targetPayment.paid = true;
        contact.accessPaid = true;
        localStorage.removeItem(PAYMENT_RETURN_KEY);
        return true;
    }

    if (targetPayment.paid || contact.accessPaid) {
        targetPayment.loading = false;
        targetPayment.paid = true;
        contact.accessPaid = true;
        return true;
    }

    return false;
}

function acceptJavierScreenshotProof(contact) {
    if (!contact || contact.id !== "javier") return false;

    const paymentMessages = contact.messages.filter(message => {
        return message.type === "payment" &&
            message.paymentPurpose === "javier_access_fee";
    });

    if (!paymentMessages.length) return false;

    absorbJavierPaymentResult(contact);

    const lastPayment = paymentMessages[paymentMessages.length - 1];
    lastPayment.loading = false;
    lastPayment.paid = true;
    contact.accessPaid = true;

    return true;
}

function handleScreenshotUpload(event) {
    if (!currentContactKey || !event.target.files || !event.target.files[0]) return;

    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = () => {
        const contact = contacts[currentContactKey];
        if (!contact) return;

        contact.messages.push({
            from: "player",
            type: "image",
            text: "Payment receipt screenshot",
            imageData: reader.result,
            time: getCurrentTime()
        });

        saveState();
        renderMessages();
        renderContactList();

        if (contact.id === "javier") {
            acceptJavierScreenshotProof(contact);
            saveState();
            const delay = realisticReadDelay(contact, "payment receipt screenshot");
            setTimeout(() => acknowledgeJavierPaymentProof(currentContactKey), delay);
        }
    };

    reader.readAsDataURL(file);
    event.target.value = "";
}

function isPaymentProofText(playerText, contact) {
    if (!contact || contact.id !== "javier") return false;
    const normalized = normalizeBasic(playerText);

    return hasPaidJavierRequest(contact) && (
        normalized.includes("screenshot") ||
        normalized.includes("screen") ||
        normalized.includes("ricevuta") ||
        normalized.includes("pagamento") ||
        normalized.includes("pagato") ||
        normalized.includes("receipt") ||
        normalized.includes("transfer completed") ||
        normalized.includes("kd-")
    );
}

function hasPaidJavierRequest(contact) {
    if (!contact || contact.id !== "javier") return false;

    if (contact.accessPaid || contact.paymentProofAcknowledged) return true;

    if (absorbJavierPaymentResult(contact)) {
        saveState();
        return true;
    }

    return contact.messages.some(message => {
        return message.type === "payment" &&
            message.paymentPurpose === "javier_access_fee" &&
            message.paid === true;
    });
}

function acknowledgeJavierPaymentProof(contactKey) {
    const contact = contacts[contactKey];
    if (!contact || contact.id !== "javier") return;

    if (!hasPaidJavierRequest(contact)) {
        sendContactMessage(contactKey, {
            text: "Todavía no veo el pago confirmado por el canal seguro. Usen el link y esperen la confirmación automática.",
            translation: "I still do not see the payment confirmed through the secure channel. Use the link and wait for the automatic confirmation."
        });
        return;
    }

    if (contact.paymentProofAcknowledged) {
        sendJavierActionMenu(contactKey, "main");
        return;
    }

    contact.accessPaid = true;
    contact.paymentProofAcknowledged = true;

    const fee = contact.accessFee || {};

    if (typeof setProgress === "function") {
        setProgress("javier_access_granted");
    }

    sendContactMessage(contactKey, {
        text: fee.paidText || "Recibido. Ahora sí, pregunten claro.",
        translation: fee.paidTranslation || "Received. Now ask clearly.",
        after: () => {
            sendJavierActionMenu(contactKey, "main");
        }
    });
}

/* ADD CONTACT */

function openContactModal() {
    addContactModal.classList.add("active");
    phoneInput.value = "";

    setTimeout(() => {
        phoneInput.focus();
    }, 100);
}

function closeContactModal() {
    addContactModal.classList.remove("active");
    phoneInput.value = "";
}

function addContactByNumber() {
    const rawNumber = phoneInput.value.trim();

    if (!rawNumber) return;

    const normalized = normalizePhone(rawNumber);

    const foundKey = Object.keys(contacts).find(key => {
        return normalizePhone(key) === normalized;
    });

    if (!foundKey) {
        closeContactModal();
        qgReject(rawNumber);
        return;
    }

    contacts[foundKey].unlocked = true;

    saveState();
    renderContactList();
    closeContactModal();

    showPushNotification(
        contacts[foundKey],
        `${contacts[foundKey].name} added`
    );
}

function qgReject(rawNumber) {
    const qg = contacts.qg;

    if (!qg) return;

    const text = `Unknown number rejected: ${rawNumber}. Do not add irrelevant contacts.`;

    showTyping("qg", realisticTypingDuration(text, qg), () => {
        qg.messages.push({
            from: "contact",
            text,
            time: getCurrentTime()
        });

        saveState();
        renderContactList();
        showPushNotification(qg, text);
    });
}

/* TRIGGERS */

function findTriggerReply(contact, text) {
    if (!Array.isArray(contact.triggers)) return null;

    const normalized = normalizeBasic(text);

    const trigger = contact.triggers.find(item => {
        return item.keywords.some(keyword => {
            return normalized.includes(normalizeBasic(keyword));
        });
    });

    return trigger ? trigger.reply : null;
}

function randomFallback(contact) {
    if (!Array.isArray(contact.fallbackReplies) || !contact.fallbackReplies.length) {
        return "No response.";
    }

    const index = Math.floor(Math.random() * contact.fallbackReplies.length);

    return contact.fallbackReplies[index];
}

function normalizeReplyObject(reply) {
    if (reply && typeof reply === "object") {
        return {
            text: reply.text || "No response.",
            translation: reply.translation
        };
    }

    return {
        text: String(reply || "No response.")
    };
}

/* GIULIA PERIODIC */

function scheduleNextGiuliaPeriodicMessage() {
    if (giuliaTimer) {
        clearTimeout(giuliaTimer);
    }

    const nextDelay = randomInt(1000 * 60 * 11, 1000 * 60 * 31);

    giuliaTimer = setTimeout(() => {
        maybeSendGiuliaPeriodicMessage();
        scheduleNextGiuliaPeriodicMessage();
    }, nextDelay);
}

function maybeSendGiuliaPeriodicMessage() {
    const giuliaKey = Object.keys(contacts).find(key => contacts[key].id === "giulia");

    if (!giuliaKey) return;

    const giulia = contacts[giuliaKey];

    if (!giulia.unlocked) return;
    if (!Array.isArray(giulia.periodicMessages)) return;
    if (!giulia.periodicMessages.length) return;

    const hasPlayerMessage = giulia.messages.some(message => message.from === "player");

    if (!hasPlayerMessage) return;

    const index = giulia.periodicIndex || 0;

    if (index >= giulia.periodicMessages.length) return;

    const nextMessage = giulia.periodicMessages[index];
    giulia.periodicIndex = index + 1;

    showTyping(giuliaKey, realisticTypingDuration(nextMessage, giulia), () => {
        giulia.messages.push({
            from: "contact",
            text: nextMessage,
            time: getCurrentTime()
        });

        saveState();
        refreshAfterReply(giuliaKey, nextMessage);
    });
}

/* PUSH / REFRESH */

function refreshAfterReply(contactKey, preview) {
    if (currentContactKey === contactKey) {
        chatStatus.textContent = getContactStatus(contacts[contactKey]);
        renderMessages();
    }

    renderContactList();
    showPushNotification(contacts[contactKey], preview);
}

function showPushNotification(contact, preview) {
    if (!pushContainer || !contact) return;

    const push = document.createElement("div");
    push.className = "push-notification";

    push.innerHTML = `
        <div class="push-avatar">${renderAvatar(contact)}</div>

        <div class="push-content">
            <strong>${escapeHtml(contact.name)}</strong>
            <span>${escapeHtml(stripHtml(preview || ""))}</span>
        </div>
    `;

    pushContainer.appendChild(push);

    playNotificationSound();

    setTimeout(() => {
        push.classList.add("hide");

        setTimeout(() => {
            push.remove();
        }, 250);
    }, 2600);
}

function playNotificationSound() {
    const audio = new Audio("assets/notification.mp3");
    audio.volume = 0.28;
    audio.play().catch(() => {});
}

/* HELPERS */

function renderAvatar(contact) {
    if (contact.photo) {
        return `<img src="${contact.photo}" alt="${escapeHtml(contact.name)}">`;
    }

    return `<span>${escapeHtml(contact.avatar || "?")}</span>`;
}

function getContactStatus(contact) {
    if (!contact) return "";

    if (contact.id === "javier") {
        return hasJavierAccess(contact) ? "encrypted relay active" : "last seen recently";
    }

    if (contact.id === "giulia") {
        return contact.unlocked ? "online" : "offline";
    }

    return contact.status || contact.role || "";
}

function getCurrentTime() {
    return new Date().toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit"
    });
}

function normalizeBasic(text) {
    return String(text)
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim();
}

function normalizeQuestion(text) {
    return String(text)
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[¿?¡!.,;:]/g, "")
        .replace(/\s+/g, " ")
        .trim();
}

function normalizePhone(text) {
    return String(text).replace(/\D/g, "");
}

function stripHtml(text) {
    return String(text).replace(/<[^>]*>/g, "");
}

function escapeHtml(text) {
    return String(text)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}



/* CASE PROGRESS WATCHER */

function startProgressWatcher() {
    checkProgressEvents();

    window.addEventListener("caseProgressUpdated", () => {
        checkProgressEvents();
    });

    setInterval(() => {
        checkProgressEvents();
    }, 2000);
}

function checkProgressEvents() {
    if (
        typeof hasProgress === "function" &&
        hasProgress("aethos_site_opened") &&
        !hasProgress("marco_aethos_sequence_sent")
    ) {
        startMarcoAethosSequence();
    }
}

function startMarcoAethosSequence() {
    if (typeof setProgress === "function") {
        setProgress("marco_aethos_sequence_sent");
    }

    queueMarcoMessages([
        {
            delay: 2000,
            text: "I saw you entered the AETHOS portal."
        },
        {
            delay: 7000,
            text: "That's Veyra's civic control system. You'll need credentials to access most of its functions."
        },
        {
            delay: 12000,
            text: "Give me thirty seconds. I'll take care of it."
        },
        {
            delay: 42000,
            text: "Credentials generated.",
            progress: "aethos_credentials_sent"
        },
        {
            delay: 47000,
            text: "USERNAME: kairos.field\nPASSWORD: VY-0417-AETHOS"
        },
        {
            delay: 53000,
            text: "I also loaded the reference subjects identified so far: Nathan Verra, Ava Mercer, Markus Kessler and Elias Rowe.",
            progress: "aethos_subjects_loaded"
        }
    ]);
}

function queueMarcoMessages(messages) {
    messages.forEach(item => {
        setTimeout(() => {
            sendContactMessage("marco", {
                text: item.text
            });

            if (item.progress && typeof setProgress === "function") {
                setProgress(item.progress);
            }
        }, item.delay);
    });
}

/* QG HELP SYSTEM */

function isHelpRequest(text) {
    const normalized = normalizeBasic(text);

    return normalized === "help" ||
        normalized === "qg help" ||
        normalized === "hq help" ||
        normalized.includes("need help") ||
        normalized.includes("help me");
}

function handleQGHelpRequest(contactKey) {
    const helpCount = incrementQGHelpCount();
    const hint = getQGProgressHint();

    sendContactMessage(contactKey, {
        text: hint
    });

    if (helpCount === 5) {
        setTimeout(() => {
            sendContactMessage(contactKey, {
                text: "I thought you were professionals. Do not abuse Headquarters support."
            });
        }, 4200);
    }

    if (helpCount === 10) {
        setTimeout(() => {
            sendContactMessage(contactKey, {
                text: "You have enough material to reason independently. Stop asking for direction and start connecting motive, access and opportunity."
            });
        }, 4200);
    }
}

function incrementQGHelpCount() {
    if (typeof incrementCaseCounter === "function") {
        return incrementCaseCounter("qg_help_count");
    }

    const key = "qg_help_count";
    const count = Number(localStorage.getItem(key) || "0") + 1;
    localStorage.setItem(key, String(count));
    return count;
}

function getQGProgressHint() {
    if (typeof hasProgress !== "function") {
        return "Start from what can be verified. The system logs are more reliable than personal impressions.";
    }

    if (!hasProgress("aethos_site_opened")) {
        return "Start with AETHOS. You need a structured view of the subjects before chasing theories.";
    }

    if (!hasProgress("aethos_subjects_loaded")) {
        return "Wait for Marco's access package. Credentials and subject profiles matter before anything else.";
    }

    if (!hasProgress("nathan_profile_opened")) {
        return "Open Nathan Verra's profile first. The case starts with who he was inside Veyra.";
    }

    if (!hasProgress("elias_profile_opened")) {
        return "Check Elias Rowe. Motive matters, but motive alone is not proof.";
    }

    if (!hasProgress("elias_near_l12_found")) {
        return "Review Rowe's movement history. Location patterns are more useful than personality.";
    }

    if (!hasProgress("nathan_lifecare_status_opened")) {
        return "If someone can damage Nathan without approaching him directly, look at systems, not corridors.";
    }

    if (!hasProgress("nathan_record_modified_found")) {
        return "A flagged medical status is not enough. Look for proof of who changed it and when.";
    }

    if (!hasProgress("ava_profile_opened")) {
        return "Do not keep the investigation only technical. Personal pressure can be as dangerous as system access.";
    }

    if (!hasProgress("nathan_kessler_email_found")) {
        return "Look for communications involving Kessler. The wording may matter more than the complaint itself.";
    }

    if (!hasProgress("ava_discovered_nathan_plan")) {
        return "If Nathan sent that message, ask yourself who understood his real intention.";
    }

    if (!hasProgress("javier_access_granted")) {
        return "External information may help, but do not treat unofficial sources as clean evidence.";
    }

    return "Review the contradictions. Separate motive from opportunity, and opportunity from proof.";
}

/* DEBUG */

function resetOnionChatSave() {
    localStorage.removeItem(STORAGE_KEY);
    location.reload();
}

function startNathanDriveWatcher() {

    setInterval(() => {

        if (
            hasProgress("javier_sofia_mirel_interrogate_received") &&
            !hasProgress("nathan_drive_sent")
        ) {

            const marco = contacts.marco;

            marco.messages.push({
                from: "contact",
                text: "I found something. After reviewing Nathan's data trail I recovered a partial personal cloud backup. Only a few recent files survived.",
                time: getCurrentTime()
            });

            marco.messages.push({
                from: "contact",
                type: "file",
                fileKind: "DRV",
                text: "Recovered personal cloud archive",
                fileName: "NATHAN_DRIVE",
                url: "../nathan-drive/index.html",
                time: getCurrentTime()
            });

            setProgress("nathan_drive_sent");

            saveState();
            renderContactList();

            showPushNotification(
                "Marco Rinaldi",
                "Recovered personal cloud archive"
            );
        }

    }, 2000);
}