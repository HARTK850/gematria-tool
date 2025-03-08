const gematriaMap = {
    'א': 1, 'ב': 2, 'ג': 3, 'ד': 4, 'ה': 5, 'ו': 6, 'ז': 7, 'ח': 8, 'ט': 9,
    'י': 10, 'כ': 20, 'ך': 20, 'ל': 30, 'מ': 40, 'ם': 40, 'נ': 50, 'ן': 50,
    'ס': 60, 'ע': 70, 'פ': 80, 'ף': 80, 'צ': 90, 'ץ': 90, 'ק': 100, 'ר': 200,
    'ש': 300, 'ת': 400
};


function calculateWordGematria(word) {
    return word.split('').reduce((sum, char) => sum + (gematriaMap[char] || 0), 0);
}

function calculateGematria() {
    const name = document.getElementById('inputName').value.trim();
    const gender = document.getElementById('gender').value;
    if (!name) return;

    const gematriaResults = document.getElementById('gematriaResults');
    const complimentsResults = document.getElementById('complimentsResults');
    const loading = document.getElementById('loading');
    const finished = document.getElementById('finished');

    gematriaResults.innerHTML = "";
    complimentsResults.innerHTML = "";
    loading.style.display = "block";
    finished.style.display = "none";

    let totalGematria = calculateWordGematria(name);
    
    name.split('').forEach(char => {
        if (gematriaMap[char]) {
            const p = document.createElement("p");
            p.textContent = `${char} = ${gematriaMap[char]}`;
            gematriaResults.appendChild(p);
        }
    });

    const totalP = document.createElement("p");
    totalP.innerHTML = `<strong>סך הכל גימטרייה: ${totalGematria}</strong>`;
    gematriaResults.appendChild(totalP);

    const fileToLoad = gender === "male" ? "compliments_male.txt" : "compliments_female.txt";

    fetch(fileToLoad)
        .then(response => response.text())
        .then(text => findMatchingCompliments(text, totalGematria, name))
        .catch(error => {
            console.error("שגיאה בטעינת המחמאות", error);
            loading.style.display = "none";
        });
}

function findMatchingCompliments(text, targetGematria, name) {
    const complimentsResults = document.getElementById('complimentsResults');
    const loading = document.getElementById('loading');
    const finished = document.getElementById('finished');

    let compliments = text.split("\n").map(line => line.trim()).filter(Boolean);
    let foundCompliments = new Set();
    let sortedCompliments = [];

    // בדיקה רגילה של מחמאה בודדת
    for (let compliment of compliments) {
        let sum = calculateWordGematria(compliment);
        if (sum === targetGematria && !foundCompliments.has(compliment) && !foundCompliments.has(reverseWords(compliment))) {
            foundCompliments.add(compliment);
            sortedCompliments.push(compliment);
        }
    }

    // בדיקה עם חיבור של שתי מחמאות בעזרת "ו"
    for (let i = 0; i < compliments.length; i++) {
        for (let j = i + 1; j < compliments.length; j++) {
            let combinedCompliment = compliments[i] + " ו" + compliments[j];
            let combinedSum = calculateWordGematria(compliments[i]) + calculateWordGematria("ו") + calculateWordGematria(compliments[j]);

            if (combinedSum === targetGematria && !foundCompliments.has(combinedCompliment)) {
                foundCompliments.add(combinedCompliment);
                sortedCompliments.push(combinedCompliment);
            }
        }
    }

    sortedCompliments.sort((a, b) => a.localeCompare(b));

    if (sortedCompliments.length === 0) {
        complimentsResults.innerHTML = "<p>לא נמצאו מחמאות מתאימות</p>";
    } else {
        sortedCompliments.forEach(compliment => {
            addComplimentResult(compliment, name);
        });
    }

    loading.style.display = "none";
    finished.style.display = "block";
}


function addComplimentResult(complimentText, name) {
    const complimentsResults = document.getElementById('complimentsResults');

    const div = document.createElement("div");
    div.classList.add("compliment-item");

    const textSpan = document.createElement("span");
    textSpan.textContent = complimentText;
    
    highlightFirstLetter(textSpan, name);

       // יצירת כפתור "פירוט גימטרייה"
    const detailsDiv = document.createElement("div");
    detailsDiv.style.display = "none";
    detailsDiv.classList.add("gematria-details");
    detailsDiv.innerHTML = generateGematriaDetails(complimentText);

    const detailsButton = document.createElement("button");
    detailsButton.textContent = "פירוט גימטרייה";
    detailsButton.classList.add("info-button");
    detailsButton.style.backgroundColor = "green";

    detailsButton.onclick = () => {
        if (detailsDiv.style.display === "none") {
            detailsDiv.style.display = "block";
            detailsButton.textContent = "סגור פירוט גימטרייה";
        } else {
            detailsDiv.style.display = "none";
            detailsButton.textContent = "פירוט גימטרייה";
        }
    };


    // יצירת div נוסף לכפתורים ושינוי המיקום שלהם לצד הנגדי
    const buttonsContainer = document.createElement("div");
    buttonsContainer.classList.add("buttons-container");
    buttonsContainer.appendChild(deleteButton);
    buttonsContainer.appendChild(copyButton);
    
    
    // הוספת האלמנטים למבנה התצוגה
    div.appendChild(textSpan);
    div.appendChild(buttonsContainer); // הצמדת כפתורי מחיקה והעתקה לצד אחד
    div.appendChild(detailsButton); // הצמדת הכפתור הירוק לצד השני
    div.appendChild(detailsDiv);

    complimentsResults.appendChild(div);
}


function generateGematriaDetails(compliment) {
    return compliment.split('').map(char => `${char} = ${gematriaMap[char] || 0}`).join('<br>') +
           `<br><strong>סך הכל גימטרייה: ${calculateWordGematria(compliment)}</strong>`;
}

function highlightFirstLetter(element, name) {
    let firstLetter = element.textContent.charAt(0);
    if (name.includes(firstLetter)) {
        element.innerHTML = `<strong>${firstLetter}</strong>${element.textContent.slice(1)}`;
    }
}

function reverseWords(phrase) {
    return phrase.split(' ').reverse().join(' ');
}


document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("printButton").addEventListener("click", openPrintDialog);
    document.getElementById("downloadButton").addEventListener("click", openDownloadDialog);
});

function openPrintDialog() {
    let dialog = createDialog("אפשרויות הדפסה", [
        { text: "הדפסת המחמאות בלבד", id: "printComplimentsOnly" },



        { text: "הדפסת המחמאות עם פירוט הגימטרייה", id: "printWithGematria" }
    ], handlePrintSelection);
}

function handlePrintSelection(selectedOption) {
    if (selectedOption === "printComplimentsOnly") {
        printSection("complimentsResults");
    } else if (selectedOption === "printWithGematria") {
        document.getElementById("gematriaResults").style.display = "block"; // אם סגור - פותח אותו
        printSection(["complimentsResults", "gematriaResults"]);
    }
}

function printSection(sectionIds) {
    let content = "";
    if (Array.isArray(sectionIds)) {
        sectionIds.forEach(id => {
            content += document.getElementById(id).outerHTML;
        });
    } else {
        content = document.getElementById(sectionIds).outerHTML;
    }
    
    let printWindow = window.open("", "", "width=800,height=600");
    printWindow.document.write(`<html><head><title>הדפסה</title></head><body>${content}</body></html>`);
    printWindow.document.close();
    printWindow.print();
}

function openDownloadDialog() {
    let firstDialog = createDialog("אפשרויות הורדה", [
        { text: "הורדת המחמאות בלבד", id: "downloadComplimentsOnly" },


        
        { text: "הורדת המחמאות עם פירוט הגימטרייה", id: "downloadWithGematria" }
    ], function (selectedOption) {
        openFormatDialog(selectedOption);
    });
}

function openFormatDialog(selectedOption) {
    let formatDialog = createDialog("בחר פורמט", [
        { text: "PDF", id: "pdf" },
        { text: "TXT", id: "txt" },
        { text: "PNG", id: "png" }
    ], function (selectedFormat) {
        handleDownload(selectedOption, selectedFormat);
    });
}

function handleDownload(contentOption, format) {
    let content = "";
    if (contentOption === "downloadComplimentsOnly") {
        content = document.getElementById("complimentsResults").innerText;
    } else if (contentOption === "downloadWithGematria") {
        content = document.getElementById("complimentsResults").innerText + "\n\n" + document.getElementById("gematriaResults").innerText;
    }

    if (format === "txt") {
        downloadAsText(content);
    } else if (format === "pdf") {
        downloadAsPDF(content);
    } else if (format === "png") {
        downloadAsImage(content);
    }
}

function downloadAsText(content) {
    let blob = new Blob([content], { type: "text/plain" });
    let link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "מחמאות.txt";
    link.click();
}

function downloadAsPDF(content) {
    let doc = new jsPDF();
    doc.text(content, 10, 10);
    doc.save("מחמאות.pdf");
}

function downloadAsImage(content) {
    let element = document.createElement("div");
    element.innerHTML = content;
    document.body.appendChild(element);
    
    html2canvas(element).then(canvas => {
        let link = document.createElement("a");
        link.href = canvas.toDataURL("image/png");
        link.download = "מחמאות.png";
        link.click();
        document.body.removeChild(element);
    });
}

function createDialog(title, options, callback) {
    let dialog = document.createElement("div");
    dialog.style.position = "fixed";
    dialog.style.top = "50%";
    dialog.style.left = "50%";
    dialog.style.transform = "translate(-50%, -50%)";
    dialog.style.padding = "20px";
    dialog.style.border = "1px solid #ccc";
    dialog.style.backgroundColor = "#fff";
    dialog.style.zIndex = "1000";
    dialog.style.borderRadius = "10px";

    let titleElem = document.createElement("h3");
    titleElem.innerText = title;
    dialog.appendChild(titleElem);

    let optionsContainer = document.createElement("div");
    options.forEach(option => {
        let label = document.createElement("label");
        let checkbox = document.createElement("input");
        checkbox.type = "radio";
        checkbox.name = "dialogSelection";
        checkbox.value = option.id;
        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(" " + option.text));
        optionsContainer.appendChild(label);
        optionsContainer.appendChild(document.createElement("br"));
    });
    dialog.appendChild(optionsContainer);

    let confirmButton = document.createElement("button");
    confirmButton.innerText = "אישור";
    confirmButton.onclick = function () {
        let selectedOption = document.querySelector("input[name='dialogSelection']:checked");
        if (selectedOption) {
            document.body.removeChild(dialog);
            callback(selectedOption.value);
        }
    };
    dialog.appendChild(confirmButton);

    document.body.appendChild(dialog);


    function hideSaveButtons() {
    document.getElementById("saveOptions").style.display = "none";
}

function showSaveButtons() {
    document.getElementById("saveOptions").style.display = "block";
}

function printSection(sectionIds) {
    hideSaveButtons();
    setTimeout(() => {
        let content = "";
        if (Array.isArray(sectionIds)) {
            sectionIds.forEach(id => {
                content += document.getElementById(id).outerHTML;
            });
        } else {
            content = document.getElementById(sectionIds).outerHTML;
        }

        let printWindow = window.open("", "", "width=800,height=600");
        printWindow.document.write(`<html><head><title>הדפסה</title></head><body>${content}</body></html>`);
        printWindow.document.close();
        printWindow.print();

        showSaveButtons();
    }, 100);
}

function downloadAsPDF(content) {
    hideSaveButtons();
    setTimeout(() => {
        let doc = new jsPDF();
        doc.text(content, 10, 10);
        doc.save("מחמאות.pdf");
        showSaveButtons();
    }, 100);
}

function downloadAsImage(content) {
    hideSaveButtons();
    setTimeout(() => {
        let element = document.createElement("div");
        element.innerHTML = content;
        document.body.appendChild(element);

        html2canvas(element).then(canvas => {
            let link = document.createElement("a");
            link.href = canvas.toDataURL("image/png");
            link.download = "מחמאות.png";
            link.click();
            document.body.removeChild(element);
            showSaveButtons();
        });
    }, 100);
}
}
