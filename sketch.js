

//Globale Variablen
let mobilenet;

const exampleImages = [
    { src: "images/correct1.jpg", correct: true },
    { src: "images/correct2.jpg", correct: true },
    { src: "images/correct3.jpg", correct: true },
    { src: "images/incorrect1.jpg", correct: false },
];


//Event-Listener
window.addEventListener("load", async () => {
    await loadModel();
    setupUpload();
});

//Modell laden
async function loadModel() {
    mobilenet = await ml5.imageClassifier("MobileNet");
    console.log("Modell geladen:", mobilenet);
    console.log("TYPE:", typeof mobilenet);
    console.log("MODEL:", mobilenet);
    document.getElementById("loadingScreen").style.display = "none";
    renderExampleImages();
}

function renderExampleImages() {
    const container = document.getElementById("pairs");

    exampleImages.forEach((imgObj) => {

        const row = document.createElement("div");
        row.className = "row-pair";

        // LEFT
        const left = document.createElement("div");
        left.className = "leftCell";

        const img = document.createElement("img");
        img.src = imgObj.src;

        const label = document.createElement("div");
        label.className = "resultLabel";
        //  img.correct = imgObj.correct;

        left.appendChild(img);

        // RIGHT
        const right = document.createElement("div");
        right.className = "rightCell";

        const textBox = document.createElement("div");
        textBox.className = "textBox";

        const chartBox = document.createElement("div");
        chartBox.className = "chartBox";

        right.appendChild(textBox);
        right.appendChild(chartBox);

        row.appendChild(left);
        row.appendChild(right);

        container.appendChild(row);

        img.onload = async () => {
            const results = await classifyImage(img);
            if (imgObj.correct) {
                img.classList.add("correct");
                label.textContent = "Korrekt klassifiziert";
                label.classList.add("correctText");
            } else {
                img.classList.add("incorrect");
                label.textContent = "Nicht korrekt klassifiziert";
                label.classList.add("incorrectText");
            }
            left.appendChild(label);

            showResult(results, textBox, chartBox);
        };
    });
}
//Bilder klassifizieren
async function classifyImage(imgElement) {
    const results = await mobilenet.classify(imgElement);
    return results.slice(0, 3);
}

//ergebnis anzeigen
function showResult(results, textBox, chartBox) {

    // TEXT
    textBox.innerHTML = "";

    results.forEach((r, i) => {
        const div = document.createElement("div");
        const percent = (r.confidence * 100).toFixed(2);
        div.textContent = `${i + 1}: ${r.label} – ${percent}%`;
        textBox.appendChild(div);
    });

    // CHART
    chartBox.innerHTML = "";
    const canvas = document.createElement("canvas");
    chartBox.appendChild(canvas);

    const labels = results.map(r => r.label);
    const data = results.map(r => r.confidence * 100);

    new Chart(canvas, {
        type: "bar",
        data: {
            labels,
            datasets: [{
                label: "Confidence (%)",
                data
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });

}

function setupUpload() {
    const input = document.getElementById("uploadInput");

    if (!input) {
        console.error("uploadInput nicht gefunden");
        return;
    }
    input.addEventListener("change", (event) => {
        const file = event.target.files[0];
        console.log("upload");
        if (!file) {
            showError("Keine Datei ausgewählt.");
            return;
        }

        if (!['image/jpeg', 'image/png'].includes(file.type)) {
            showError("Falscher Dateityp. Bitte nur JPG, PNG, WEBP oder GIF hochladen.");
            return;
        }

        const reader = new FileReader();
        console.log("Upload läuft");
        reader.onload = function (e) {
            createUploadRow(e.target.result);
        };
        console.log(file)
        reader.readAsDataURL(file);
    });
}

function createUploadRow(imgSrc) {
    const container = document.getElementById("uploadResults");
    container.innerHTML = "";
    if (!container) {
        console.error("pairs container fehlt!");
        return;
    }

    const row = document.createElement("div");
    row.className = "row-pair";

    // LEFT
    const left = document.createElement("div");
    left.className = "leftCell";

    const img = document.createElement("img");

    img.onload = async () => {
        if (!mobilenet) {
            console.error("Modell noch nicht geladen!");
            return;
        }

        console.log("Starte Klassifikation...");

        const results = await classifyImage(img);

        console.log("Ergebnisse:", results);

        img.style.border = "4px solid #2196F3";

        showResult(results, textBox, chartBox);
    };

    img.src = imgSrc;

    left.appendChild(img);

    // RIGHT
    const right = document.createElement("div");
    right.className = "rightCell";

    const textBox = document.createElement("div");
    textBox.className = "textBox";

    const chartBox = document.createElement("div");
    chartBox.className = "chartBox";

    right.appendChild(textBox);
    right.appendChild(chartBox);

    row.appendChild(left);
    row.appendChild(right);

    container.appendChild(row);
}

function showError(message) {
    console.error(message);

    const errorBox = document.getElementById("errorBox");
    if (errorBox) {
        errorBox.textContent = message;
        errorBox.style.display = "block";
    } else {
        alert(message); // Fallback
    }
}