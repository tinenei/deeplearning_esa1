// ======================
// Globale Variablen
// ======================
let mobilenet;

const exampleImages = [
    { src: "images/correct1.jpg", correct: true },
    { src: "images/correct2.jpg", correct: true },
    { src: "images/correct3.jpg", correct: true },
    { src: "images/incorrect1.jpg", correct: false },
];


// ======================
// Init
// ======================
window.addEventListener("load", init);

async function init() {
    await loadModel();
    setupUpload();
}


// ======================
// Model
// ======================
async function loadModel() {
    mobilenet = await ml5.imageClassifier("MobileNet");

    console.log("Modell geladen:", mobilenet);

    document.getElementById("loadingScreen").style.display = "none";

    renderExampleImages();
}

async function classify(img) {
    return (await mobilenet.classify(img)).slice(0, 3);
}


// ======================
// Example Images
// ======================
function renderExampleImages() {
    const container = document.getElementById("pairs");

    if (!container) {
        console.error("#pairs fehlt!");
        return;
    }

    container.innerHTML = "";

    exampleImages.forEach(data => {
        const row = createRow();

        const { left, imgFrame, img, label } = createImageCell();
        const { textBox, chartBox } = createResultCell();
        const right = createRightCell(textBox, chartBox);

        row.append(left, right);
        container.appendChild(row);

        // 🔥 WICHTIG: erst Event, dann src
        img.addEventListener("load", async () => {
            const results = await classify(img);

            applyFrameStyle(imgFrame, data.correct);
            applyLabel(label, data.correct);

            showResult(results, textBox, chartBox);
        });

        img.src = data.src;

        imgFrame.appendChild(img);
        left.append(imgFrame, label);
    });
}


// ======================
// Upload Image Row
// ======================
function createUploadRow(imgSrc) {
    const container = document.getElementById("uploadResults");
    if (!container) return console.error("uploadResults container fehlt!");

    container.innerHTML = "";

    const row = createRow();

    const { left, imgFrame, img, label } = createImageCell();
    const { textBox, chartBox } = createResultCell();

    const right = createRightCell(textBox, chartBox);

    img.onload = async () => {
        if (!mobilenet) return showError("Modell noch nicht geladen!");

        const results = await classify(img);

        imgFrame.classList.add("uploaded");

        showResult(results, textBox, chartBox);
        left.appendChild(label);
    };

    img.src = imgSrc;

    imgFrame.append(img);
    left.append(imgFrame);

    row.append(left, right);
    container.appendChild(row);
}


// ======================
// UI Helpers
// ======================
function createRow() {
    const row = document.createElement("div");
    row.className = "row-pair";
    return row;
}

function createImageCell() {
    const left = document.createElement("div");
    left.classList.add("leftCell", "card");

    const imgFrame = document.createElement("div");
    imgFrame.className = "imageFrame";

    const img = document.createElement("img");

    const label = document.createElement("div");
    label.className = "resultLabel";

    return { left, imgFrame, img, label };
}

function createResultCell() {
    const textBox = document.createElement("div");
    textBox.className = "textBox";

    const chartBox = document.createElement("div");
    chartBox.className = "chartBox";

    return { textBox, chartBox };
}

function createRightCell(textBox, chartBox) {
    const right = document.createElement("div");
    right.classList.add("rightCell", "card");

    right.append(textBox, chartBox);
    return right;
}


// ======================
// Styling Helpers
// ======================
function applyFrameStyle(frame, correct) {
    frame.classList.add(correct ? "correct" : "incorrect");
}

function applyLabel(label, correct) {
    label.textContent = correct
        ? "Korrekt klassifiziert"
        : "Nicht korrekt klassifiziert";

    label.classList.add(correct ? "correctText" : "incorrectText");
}


// ======================
// Results
// ======================
function showResult(results, textBox, chartBox) {
    renderText(results, textBox);
    renderChart(results, chartBox);
}

function renderText(results, textBox) {
    textBox.innerHTML = "";

    results.forEach((r, i) => {
        const div = document.createElement("div");
        div.textContent = `${i + 1}: ${r.label} – ${(r.confidence * 100).toFixed(2)}%`;
        textBox.appendChild(div);
    });
}

function renderChart(results, chartBox) {
    chartBox.innerHTML = "";

    const canvas = document.createElement("canvas");
    chartBox.appendChild(canvas);

    new Chart(canvas, {
        type: "bar",
        data: {
            labels: results.map(r => r.label),
            datasets: [{
                label: "Confidence (%)",
                data: results.map(r => r.confidence * 100)
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: { beginAtZero: true, max: 100 }
            },
            plugins: {
                legend: { display: false }
            }
        }
    });
}


// ======================
// Upload Handling
// ======================
function setupUpload() {
    const input = document.getElementById("uploadInput");
    const button = document.getElementById("uploadBtn");
    const dropZone = document.getElementById("dropZone");

    if (!input || !button || !dropZone) {
        console.error("Upload Elemente fehlen");
        return;
    }

    button.onclick = () => input.click();
    dropZone.onclick = () => input.click();

    input.onchange = e => handleFile(e.target.files[0]);

    dropZone.ondragover = e => {
        e.preventDefault();
        dropZone.classList.add("dragover");
    };

    dropZone.ondragleave = () => dropZone.classList.remove("dragover");

    dropZone.ondrop = e => {
        e.preventDefault();
        dropZone.classList.remove("dragover");
        handleFile(e.dataTransfer.files[0]);
    };
}


// ======================
// File Handling
// ======================
function handleFile(file) {
    if (!file) return showError("Keine Datei ausgewählt.");

    if (!["image/jpeg", "image/png"].includes(file.type)) {
        return showError("Falscher Dateityp. Bitte nur JPG oder PNG.");
    }

    const reader = new FileReader();

    reader.onload = e => createUploadRow(e.target.result);

    reader.readAsDataURL(file);
}


// ======================
// Error Handling
// ======================
function showError(message) {
    const box = document.getElementById("errorBox");

    if (box) {
        box.textContent = message;
        box.style.display = "block";
    } else {
        alert(message);
    }
}