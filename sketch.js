// ======================
// Konfiguration
// ======================
const exampleImages = [
    { src: "images/correct1.jpg", correct: true },
    { src: "images/correct2.jpg", correct: true },
    { src: "images/correct3.jpg", correct: true },
    { src: "images/incorrect1.jpg", correct: false },
    { src: "images/incorrect2.jpg", correct: false },
    { src: "images/incorrect3.jpg", correct: false },
];

const chartColors = ["#4CAF50", "#FF9800", "#F44336"];

let classifier;


// ======================
// Start
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
    classifier = await ml5.imageClassifier("MobileNet");

    document.getElementById("loadingScreen").style.display = "none";

    renderExampleImages();
}

async function classifyImage(img) {
    const results = await classifier.classify(img);
    return results.slice(0, 3);
}


// ======================
// Beispielbilder
// ======================
function renderExampleImages() {
    const container = document.getElementById("pairs");
    if (!container) return console.error("pairs fehlt");

    container.innerHTML = "";

    exampleImages.forEach(data => {
        const row = createRow();

        const { left, frame, img, label } = createImageCell();
        const { textBox, chartBox } = createResultCell();
        const right = createRightCell(textBox, chartBox);

        row.append(left, right);
        container.appendChild(row);

        img.onload = async () => {
            const results = await classifyImage(img);

            setFrameState(frame, data.correct);
            setLabel(label, data.correct);
            renderResult(results, textBox, chartBox);
        };

        img.src = data.src;

        frame.appendChild(img);
        left.append(frame, label);
    });
}


// ======================
// Upload
// ======================
function createUploadRow(src) {
    const container = document.getElementById("uploadResults");
    if (!container) return console.error("uploadResults fehlt");

    container.innerHTML = "";

    const row = createRow();
    const { left, frame, img, label } = createImageCell();
    const { textBox, chartBox } = createResultCell();
    const right = createRightCell(textBox, chartBox);

    img.onload = async () => {
        if (!classifier) return showError("Modell nicht geladen");

        const results = await classifyImage(img);

        frame.classList.add("uploaded");

        renderResult(results, textBox, chartBox);
        left.appendChild(label);
    };

    img.src = src;

    frame.appendChild(img);
    left.append(frame);

    row.append(left, right);
    container.appendChild(row);
}


// ======================
// UI Builder
// ======================
function createRow() {
    const el = document.createElement("div");
    el.className = "row-pair";
    return el;
}

function createImageCell() {
    const left = document.createElement("div");
    left.classList.add("leftCell");

    const frame = document.createElement("div");
    frame.className = "imageFrame";

    const img = document.createElement("img");

    const label = document.createElement("div");
    label.className = "resultLabel";

    return { left, frame, img, label };
}

function createResultCell() {
    return {
        textBox: document.createElement("div"),
        chartBox: document.createElement("div")
    };
}

function createRightCell(textBox, chartBox) {
    const right = document.createElement("div");
    right.classList.add("rightCell");

    textBox.className = "textBox";
    chartBox.className = "chartBox";

    right.append(textBox, chartBox);
    return right;
}


// ======================
// Styling
// ======================
function setFrameState(frame, correct) {
    frame.classList.add(correct ? "correct" : "incorrect");
}

function setLabel(label, correct) {
    label.textContent = correct
        ? "Korrekt klassifiziert"
        : "Nicht korrekt klassifiziert";

    label.classList.add(correct ? "correctText" : "incorrectText");
}


// ======================
// Results
// ======================
function renderResult(results, textBox, chartBox) {
    renderText(results, textBox);
    renderChart(results, chartBox);
}

function renderText(results, box) {
    box.innerHTML = "";

    results.forEach((r, i) => {
//        const name = r.label.split(",")[0];
        const name = r.label;
        const confidence = (r.confidence * 100).toFixed(1);

        const div = document.createElement("div");
        div.className = "resultItem";

/*        div.innerHTML = `
            <strong>${i + 1}. ${name}</strong>
            <strong>${confidence}%</strong>
        `;

*/
        div.innerHTML = `
            ${i + 1}. ${name}
            <strong>Confidence: ${confidence}%</strong>
        `;
        box.appendChild(div);
    });
}

function renderChart(results, box) {
    box.innerHTML = "";

    const canvas = document.createElement("canvas");
    box.appendChild(canvas);

    new Chart(canvas, {
        type: "bar",
        data: {
            labels: results.map(r => r.label.split(",")[0]),
            datasets: [{
                data: results.map(r => r.confidence * 100),
                backgroundColor: chartColors,
                borderRadius: 6,
                barPercentage: 0.6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                title: {
                    display: true,
                    text: "Klassifikation",
                    align: "start",
                    font: { size: 14 }
                }
            },
            scales: {
                x: {
                    ticks: { font: { size: 11 }, color: "#555" },
                    grid: { display: false }
                },
                y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        font: { size: 11 },
                        callback: v => v + "%"
                    }
                }
            }
        }
    });
}


// ======================
// Upload Handling
// ======================
function setupUpload() {
    const input = document.getElementById("uploadInput");
    const btn = document.getElementById("uploadBtn");
    const drop = document.getElementById("dropZone");

    if (!input || !btn || !drop) return;

    btn.onclick = () => input.click();
    drop.onclick = () => input.click();

    input.onchange = e => handleFile(e.target.files[0]);

    drop.ondragover = e => {
        e.preventDefault();
        drop.classList.add("dragover");
    };

    drop.ondragleave = () => drop.classList.remove("dragover");

    drop.ondrop = e => {
        e.preventDefault();
        drop.classList.remove("dragover");
        handleFile(e.dataTransfer.files[0]);
    };
}


// ======================
// File Handling
// ======================
function handleFile(file) {
    clearError();
    if (!file) return showError("Keine Datei");

    if (!["image/jpeg", "image/png", "image/webp", "image/gif"].includes(file.type)) {
        return showError("Nur jpg, png, webp und gif erlaubt");
    }

    const reader = new FileReader();
    reader.onload = e => createUploadRow(e.target.result);
    reader.readAsDataURL(file);
}


// ======================
// Error-Handling
// ======================
function showError(msg) {
    const box = document.getElementById("errorBox");

    if (!box) return alert(msg);

    box.textContent = msg;
    box.style.display = "block";
}

function clearError() {
    const box = document.getElementById("errorBox");
    if (!box) return;

    box.textContent = "";
    box.style.display = "none";
}