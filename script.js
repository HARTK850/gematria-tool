const gematriaMap = {
    'א': 1, 'ב': 2, 'ג': 3, 'ד': 4, 'ה': 5, 'ו': 6, 'ז': 7, 'ח': 8, 'ט': 9,
    'י': 10, 'כ': 20, 'ך': 20, 'ל': 30, 'מ': 40, 'ם': 40, 'נ': 50, 'ן': 50,
    'ס': 60, 'ע': 70, 'פ': 80, 'ף': 80, 'צ': 90, 'ץ': 90, 'ק': 100, 'ר': 200,
    'ש': 300, 'ת': 400
};

// מטמון למחמאות כדי למנוע קריאות חוזרות לשרת
const complimentsCache = { male: null, female: null };

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
    const shareButton = document.getElementById('shareButton');

    gematriaResults.innerHTML = "";
    complimentsResults.innerHTML = "";
    loading.style.display = "block";
    finished.style.display = "none";
    shareButton.style.display = "none";

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

    if (complimentsCache[gender]) {
        findMatchingCompliments(complimentsCache[gender], totalGematria, name);
    } else {
        fetch(fileToLoad)
            .then(response => response.text())
            .then(text => {
                complimentsCache[gender] = text; // שמירת המחמאות בזיכרון
                findMatchingCompliments(text, totalGematria, name);
            })
            .catch(error => {
                console.error("שגיאה בטעינת המחמאות", error);
                loading.style.display = "none";
                complimentsResults.innerHTML = "<p style='color: red;'>שגיאה בטעינת המחמאות. נסה שוב מאוחר יותר.</p>";
            });
    }

    // הצגת כפתור השיתוף
    shareButton.style.display = "block";
}

// יצירת קישור שיתוף והעתקתו ללוח
function copyShareLink() {
    const name = document.getElementById('inputName').value.trim();
    const gender = document.getElementById('gender').value;
    const url = `${window.location.origin}${window.location.pathname}?Name=${encodeURIComponent(name)}&Gender=${gender}`;

    navigator.clipboard.writeText(url).then(() => {
        alert("📋 הקישור הועתק ללוח!");
    }).catch(err => {
        console.error("שגיאה בהעתקת הקישור", err);
    });
}

// טעינת פרמטרים מה-URL
function loadFromUrlParams() {
    const params = new URLSearchParams(window.location.search);
    const name = params.get("Name");
    const gender = params.get("Gender");

    if (name && gender) {
        document.getElementById('inputName').value = name;
        document.getElementById('gender').value = gender;
        calculateGematria();
    }
}

// הפעלת טעינת הפרמטרים בהתחלה
window.onload = loadFromUrlParams;

function addComplimentResult(complimentText, name, index = null) {
    const complimentsResults = document.getElementById('complimentsResults');

    const div = document.createElement("div");
    div.classList.add("compliment-item");

    // יצירת אלמנט מספר המחמאה
    const numberSpan = document.createElement("span");
    numberSpan.classList.add("compliment-number");

    // אם index קיים, הצג את המספר
    if (index !== null) {
        numberSpan.textContent = (index + 1) + ". "; // מחמאה ראשונה תהיה 1, השנייה 2 וכו'
    }

    const textSpan = document.createElement("span");
    textSpan.textContent = complimentText;

    highlightFirstLetter(textSpan, name);

    const detailsDiv = document.createElement("div");
    detailsDiv.style.display = "none";
    detailsDiv.classList.add("gematria-details");
    detailsDiv.innerHTML = generateGematriaDetails(complimentText);


    const button = document.createElement("button");
    button.textContent = "פירוט גימטרייה";
    button.classList.add("info-button");
    button.style.backgroundColor = "green";

    button.onclick = () => {
        if (detailsDiv.style.display === "none") {
            detailsDiv.style.display = "block";
            button.textContent = "סגור פירוט גימטרייה";
        } else {
            detailsDiv.style.display = "none";
            button.textContent = "פירוט גימטרייה";
        }
    };

    // הוספת האלמנטים למחמאה
    div.appendChild(numberSpan); // הוספת המספר לפני הטקסט
    div.appendChild(textSpan);
    div.appendChild(button);
    div.appendChild(detailsDiv);
    complimentsResults.appendChild(div);
}

function reverseWords(phrase) {
    return phrase.split(' ').reverse().join(' ');
}

function findMatchingCompliments(text, targetGematria, name) {
    const complimentsResults = document.getElementById('complimentsResults');
    const loading = document.getElementById('loading');
    const finished = document.getElementById('finished');

    let compliments = text.split("\n").map(line => line.trim()).filter(Boolean);
    let foundCompliments = new Set();
    let sortedCompliments = [];
    let finalCompliments = []; // מערך חדש שיאחד את שתי הבדיקות

    // בדיקה רגילה של מחמאה בודדת
    for (let compliment of compliments) {
        let sum = calculateWordGematria(compliment);
        if (sum === targetGematria && !foundCompliments.has(compliment) && !foundCompliments.has(reverseWords(compliment))) {
            foundCompliments.add(compliment);
            sortedCompliments.push(compliment);
        }
    }

    // קודם נכניס את המחמאות הבודדות
    finalCompliments.push(...sortedCompliments);

    // בדיקה עם חיבור של שתי מחמאות בעזרת "ו"
    for (let i = 0; i < compliments.length; i++) {
        for (let j = i + 1; j < compliments.length; j++) {
            let combinedCompliment = compliments[i] + " ו" + compliments[j];
            let combinedSum = calculateWordGematria(compliments[i]) + calculateWordGematria("ו") + calculateWordGematria(compliments[j]);

            if (combinedSum === targetGematria && !foundCompliments.has(combinedCompliment)) {
                foundCompliments.add(combinedCompliment);
                finalCompliments.push(combinedCompliment); // מוסיפים למחמאות הסופיות
            }
        }
    }

    
    // מיון התוצאות כדי שהתצוגה תהיה מסודרת
    finalCompliments.sort((a, b) => a.localeCompare(b));

    if (finalCompliments.length === 0) {
        complimentsResults.innerHTML = "<p>לא נמצאו מחמאות מתאימות</p>";
    } else {
        finalCompliments.forEach((compliment, index) => {
            addComplimentResult(compliment, name, index);
        });
    }

    loading.style.display = "none";
    finished.style.display = "block";
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
