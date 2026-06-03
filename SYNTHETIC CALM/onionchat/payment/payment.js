const PAYMENT_RETURN_KEY = "kairos_payment_result_v1";
const PAYMENT_INTENT_KEY = "kairos_payment_intent_v1";
const WALLET_BALANCE_KEY = "kairos_wallet_balance_usd";
const DEFAULT_BALANCE_EUR = 18000;

const params = new URLSearchParams(window.location.search);
const storedIntent = safeJson(localStorage.getItem(PAYMENT_INTENT_KEY));

const intent = {
    paymentId: params.get("paymentId") || storedIntent?.paymentId || createFallbackPaymentId(),
    contactKey: storedIntent?.contactKey || "javier",
    recipient: params.get("to") || storedIntent?.recipient || "Javier Morales",
    recipientAlias: params.get("alias") || storedIntent?.recipientAlias || "J. Morales",
    amountUSD: Number(params.get("usd") || storedIntent?.amountUSD || 200),
    amountARS: params.get("ars") || storedIntent?.amountARS || "200.000 ARS",
    purpose: params.get("purpose") || storedIntent?.purpose || "field_contribution",
    returnUrl: params.get("return") || storedIntent?.returnUrl || "../index.html"
};

const entryFaceCard = document.querySelector("#entryFaceCard");
const confirmFaceCard = document.querySelector("#confirmFaceCard");
const walletCard = document.querySelector("#walletCard");
const receiptCard = document.querySelector("#receiptCard");

const balanceValue = document.querySelector("#balanceValue");
const recipientName = document.querySelector("#recipientName");
const recipientAlias = document.querySelector("#recipientAlias");
const amountARS = document.querySelector("#amountARS");
const amountUSD = document.querySelector("#amountUSD");
const sendTransfer = document.querySelector("#sendTransfer");
const cancelTransfer = document.querySelector("#cancelTransfer");
const returnToChat = document.querySelector("#returnToChat");
const receiptText = document.querySelector("#receiptText");
const receiptId = document.querySelector("#receiptId");
const startEntryScan = document.querySelector("#startEntryScan");
const startConfirmScan = document.querySelector("#startConfirmScan");
const backToWallet = document.querySelector("#backToWallet");
const entryScanStatus = document.querySelector("#entryScanStatus");
const confirmScanStatus = document.querySelector("#confirmScanStatus");
const entryFaceFrame = document.querySelector("#entryFaceFrame");
const confirmFaceFrame = document.querySelector("#confirmFaceFrame");

let balance = Number(localStorage.getItem(WALLET_BALANCE_KEY));

if (!Number.isFinite(balance) || balance < intent.amountUSD) {
    balance = DEFAULT_BALANCE_EUR;
    localStorage.setItem(WALLET_BALANCE_KEY, String(balance));
}

renderPayment();

setTimeout(() => runFaceScan("entry"), 550);

startEntryScan.addEventListener("click", () => runFaceScan("entry"));
sendTransfer.addEventListener("click", openConfirmScan);
startConfirmScan.addEventListener("click", () => runFaceScan("confirm"));
backToWallet.addEventListener("click", showWallet);
cancelTransfer.addEventListener("click", returnToOnionChat);
returnToChat.addEventListener("click", returnToOnionChat);
returnToChat.disabled = true;
returnToChat.textContent = "Preparing receipt...";

function renderPayment() {
    balanceValue.textContent = `${formatEUR(balance)} EUR`;
    recipientName.textContent = intent.recipient;
    recipientAlias.textContent = intent.recipientAlias;
    amountARS.textContent = intent.amountARS;
    amountUSD.textContent = `${formatEUR(intent.amountUSD)} EUR`;

    if (balance < intent.amountUSD) {
        sendTransfer.disabled = true;
        sendTransfer.textContent = "Insufficient funds";
    }
}

function openConfirmScan() {
    if (balance < intent.amountUSD) {
        sendTransfer.disabled = true;
        sendTransfer.textContent = "Insufficient funds";
        return;
    }

    hideAll();
    confirmFaceCard.classList.add("active");
    setTimeout(() => runFaceScan("confirm"), 550);
}

function showWallet() {
    hideAll();
    walletCard.classList.remove("hidden");
}

function runFaceScan(stage) {
    const isEntry = stage === "entry";
    const status = isEntry ? entryScanStatus : confirmScanStatus;
    const frame = isEntry ? entryFaceFrame : confirmFaceFrame;
    const button = isEntry ? startEntryScan : startConfirmScan;

    if (button.disabled) return;

    button.disabled = true;
    button.textContent = "Scanning...";
    frame.classList.add("scanning");
    status.textContent = "Scanning facial geometry...";

    setTimeout(() => {
        status.textContent = "Matching Kairos operator profile...";
    }, randomInt(850, 1450));

    setTimeout(() => {
        status.textContent = "Identity verified";
        frame.classList.remove("scanning");
        frame.classList.add("verified");

        setTimeout(() => {
            if (isEntry) {
                showWallet();
                startEntryScan.textContent = "Verified";
            } else {
                completeTransfer();
                startConfirmScan.textContent = "Verified";
            }
        }, 650);
    }, randomInt(2400, 3600));
}

function completeTransfer() {
    if (balance < intent.amountUSD) {
        showWallet();
        sendTransfer.disabled = true;
        sendTransfer.textContent = "Insufficient funds";
        return;
    }

    hideAll();
    receiptCard.classList.add("active");
    receiptCard.setAttribute("aria-hidden", "false");
    returnToChat.disabled = true;
    returnToChat.textContent = "Preparing receipt...";
    receiptText.textContent = "Processing secure transfer...";
    receiptId.textContent = "Authorization pending";

    setTimeout(() => {
        balance = Math.max(0, balance - intent.amountUSD);
        localStorage.setItem(WALLET_BALANCE_KEY, String(balance));

        const completedAt = new Date().toISOString();
        const paymentResult = {
            paymentId: intent.paymentId,
            contactKey: intent.contactKey,
            status: "paid",
            amountUSD: intent.amountUSD,
            amountARS: intent.amountARS,
            recipient: intent.recipient,
            completedAt,
            autoReceiptSent: true
        };

        receiptText.textContent = `Payment sent to ${intent.recipient}. Generating secure receipt...`;
        receiptId.textContent = `Receipt ${intent.paymentId}`;
        renderAutoReceiptCut(paymentResult);

        setTimeout(() => {
            receiptText.textContent = `Automatic receipt sent to ${intent.recipient}. Remaining wallet balance: ${formatEUR(balance)} EUR.`;
            localStorage.setItem(PAYMENT_RETURN_KEY, JSON.stringify(paymentResult));
            returnToChat.disabled = false;
            returnToChat.textContent = "Return to OnionChat";
        }, randomInt(1400, 2200));
    }, randomInt(1200, 2100));
}

function renderAutoReceiptCut(paymentResult) {
    let autoReceipt = document.querySelector("#autoReceiptCut");

    if (!autoReceipt) {
        autoReceipt = document.createElement("div");
        autoReceipt.id = "autoReceiptCut";
        autoReceipt.className = "auto-receipt-cut";
        receiptCard.insertBefore(autoReceipt, returnToChat);
    }

    autoReceipt.innerHTML = `
        <div class="auto-receipt-card">
            <div class="auto-receipt-eyebrow">Kairos Detectives Wallet</div>
            <div class="auto-receipt-title">Transfer receipt</div>
            <div class="auto-receipt-row"><span>Recipient</span><strong>${escapeHtml(paymentResult.recipient)}</strong></div>
            <div class="auto-receipt-row"><span>Amount</span><strong>${escapeHtml(String(paymentResult.amountARS))}</strong></div>
            <div class="auto-receipt-row"><span>Wallet impact</span><strong>${escapeHtml(String(paymentResult.amountUSD))} EUR</strong></div>
            <div class="auto-receipt-id">${escapeHtml(paymentResult.paymentId)}</div>
            <div class="auto-send-status">Sending receipt to Morales...</div>
        </div>
    `;

    setTimeout(() => {
        const status = autoReceipt.querySelector(".auto-send-status");
        if (status) status.textContent = "Receipt delivered through secure channel.";
    }, 950);
}

function escapeHtml(value) {
    return String(value || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function hideAll() {
    entryFaceCard.classList.remove("active");
    confirmFaceCard.classList.remove("active");
    walletCard.classList.add("hidden");
    receiptCard.classList.remove("active");
}

function returnToOnionChat() {
    window.location.href = intent.returnUrl;
}

function formatEUR(value) {
    return Number(value).toLocaleString("en-US");
}

function safeJson(raw) {
    if (!raw) return null;

    try {
        return JSON.parse(raw);
    } catch (error) {
        return null;
    }
}

function createFallbackPaymentId() {
    return `KD-${Date.now()}-${Math.floor(Math.random() * 9000) + 1000}`;
}

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
