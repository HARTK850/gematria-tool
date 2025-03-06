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

    
    // יצירת כפתור מחיקה
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "🗑️";
    deleteButton.classList.add("delete-button");
    deleteButton.onclick = () => div.remove(); 

    // יצירת כפתור העתקה
    const copyButton = document.createElement("button");
    copyButton.textContent = "📋";
    copyButton.classList.add("copy-button");
    copyButton.onclick = () => {
        navigator.clipboard.writeText(complimentText);
        alert("הטקסט הועתק!");
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

document.getElementById("printButton").addEventListener("click", function() {
    document.getElementById("printOptions").style.display = "block";
});

function handlePrint() {
    const choice = document.querySelector('input[name="printChoice"]:checked');
    if (!choice) return alert("בחר אפשרות הדפסה");

    let printableContent = "";
    if (choice.value === "complimentsOnly") {
        printableContent = document.getElementById("complimentsResults").innerHTML;
    } else if (choice.value === "withGematria") {
        document.querySelectorAll(".gematria-details").forEach(div => div.style.display = "block");
        printableContent = document.getElementById("complimentsResults").innerHTML;
    }

    const printWindow = window.open("", "_blank");
    printWindow.document.write("<html><head><title>הדפסה</title></head><body>" + printableContent + "</body></html>");
    printWindow.document.close();
    printWindow.print();
}

document.getElementById("downloadButton").addEventListener("click", function() {
    document.getElementById("downloadOptions").style.display = "block";
    document.getElementById("formatOptions").style.display = "none";
});

function showFormatOptions() {
    const choice = document.querySelector('input[name="downloadChoice"]:checked');
    if (!choice) return alert("בחר אפשרות הורדה");

    document.getElementById("downloadOptions").style.display = "none";
    document.getElementById("formatOptions").style.display = "block";
}

function handleDownload() {
    const contentChoice = document.querySelector('input[name="downloadChoice"]:checked');
    const formatChoice = document.querySelector('input[name="formatChoice"]:checked');
    if (!contentChoice || !formatChoice) return alert("בחרת את כל האפשרויות?");

    let content = "";
    if (contentChoice.value === "complimentsOnly") {
        content = document.getElementById("complimentsResults").innerText;
    } else if (contentChoice.value === "withGematria") {
        document.querySelectorAll(".gematria-details").forEach(div => div.style.display = "block");
        content = document.getElementById("complimentsResults").innerText;
    }

    if (formatChoice.value === "txt") {
        const blob = new Blob([content], { type: "text/plain" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "מחמאות.txt";
        link.click();
    } else if (formatChoice.value === "pdf") {
        const pdfWindow = window.open("", "_blank");
        pdfWindow.document.write("<html><head><title>PDF</title></head><body><pre>" + content + "</pre></body></html>");
        pdfWindow.document.close();
        pdfWindow.print();
    } else if (formatChoice.value === "png") {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const width = 800;
        const height = 400;
        canvas.width = width;
        canvas.height = height;

        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, width, height);
        ctx.fillStyle = "black";
        ctx.font = "20px Arial";
        ctx.fillText(content, 20, 50);

        canvas.toBlob(function(blob) {
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = "מחמאות.png";
            link.click();
        });
    }
}
