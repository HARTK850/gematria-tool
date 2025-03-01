const gematriaMap = {
    'א': 1, 'ב': 2, 'ג': 3, 'ד': 4, 'ה': 5, 'ו': 6, 'ז': 7, 'ח': 8, 'ט': 9,
    'י': 10, 'כ': 20, 'ל': 30, 'מ': 40, 'נ': 50, 'ס': 60, 'ע': 70, 'פ': 80, 'צ': 90,
    'ק': 100, 'ר': 200, 'ש': 300, 'ת': 400
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

    let totalGematria = name.split('').reduce((sum, char) => sum + (gematriaMap[char] || 0), 0);
    
    // הצגת פירוט חישוב הגימטריה
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
        .then(text => findMatchingCompliments(text, totalGematria))
        .catch(error => {
            console.error("שגיאה בטעינת המחמאות", error);
            loading.style.display = "none";
        });
}

function findMatchingCompliments(text, targetGematria) {
    const complimentsResults = document.getElementById('complimentsResults');
    const loading = document.getElementById('loading');
    const finished = document.getElementById('finished');

    let compliments = text.split("\n").map(line => line.trim()).filter(Boolean);
    let found = 0;

    for (let i = 0; i < compliments.length; i++) {
        let compliment1 = compliments[i];
        let sum1 = calculateWordGematria(compliment1);

        // הצגת מחמאה יחידה אם היא מתאימה
        if (sum1 === targetGematria) {
            addComplimentResult(compliment1, sum1);
            found++;
        }

        for (let j = i + 1; j < compliments.length; j++) {
            let compliment2 = compliments[j];
            let sum2 = sum1 + calculateWordGematria("ו") + calculateWordGematria(compliment2);

            // הצגת שילוב מחמאות עם "ו" - אך ללא הוספת "ו" למחמאה האחרונה
            if (sum2 === targetGematria) {
                addComplimentResult(compliment1 + " ו" + compliment2, sum2);
                found++;
            }
        }
    }

    if (found === 0) {
        complimentsResults.innerHTML = "<p>לא נמצאו מחמאות מתאימות</p>";
    }

    loading.style.display = "none";
    finished.style.display = "block";
}

function addComplimentResult(complimentText, gematriaValue) {
    const complimentsResults = document.getElementById('complimentsResults');

    const div = document.createElement("div");
    div.classList.add("compliment-item");

    const textSpan = document.createElement("span");
    textSpan.textContent = complimentText;

    const button = document.createElement("button");
    button.textContent = "פירוט גימטרייה";
    button.classList.add("info-button");
    button.onclick = () => showGematriaDetails(complimentText);

    div.appendChild(textSpan);
    div.appendChild(button);
    complimentsResults.appendChild(div);
}

function showGematriaDetails(complimentText) {
    alert(`פירוט גימטרייה ל"${complimentText}": ${calculateWordGematria(complimentText)}`);
}

function הצגת_פירוט(מזהה) {
    let פירוט = document.getElementById("פירוט_" + מזהה);
    if (פירוט) {
        פירוט.style.display = (פירוט.style.display === "none") ? "block" : "none";
    }
}
