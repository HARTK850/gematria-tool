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
    updateDetailsTitle("gematria"); // עדכון כותרת הפירוט בהתאם


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
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.text();
    })
    .then(text => {
        if (!text.trim()) {
            throw new Error("הקובץ ריק");
        }
        complimentsCache[gender] = text;
        findMatchingCompliments(text, totalGematria, name);
    })
    .catch(error => {
        console.error("שגיאה בטעינת המחמאות:", error);
        loading.style.display = "none";
        complimentsResults.innerHTML = `<p style='color: red;'>שגיאה בטעינת המחמאות: ${error.message}</p>`;
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


function addGlobalDetailsButton() {
    const complimentsResults = document.getElementById('complimentsResults');

    const globalButton = document.createElement("button");
    globalButton.id = "globalDetailsButton";
    globalButton.textContent = "פירוט גימטרייה לכל המחמאות";
    globalButton.classList.add("info-button");
    globalButton.style.backgroundColor = "green";
    globalButton.style.display = "block";
    globalButton.style.marginBottom = "10px";

    globalButton.onclick = () => {
        let allDetails = document.querySelectorAll(".gematria-details");
        let allButtons = document.querySelectorAll(".info-button:not(#globalDetailsButton)");

        if (globalButton.textContent === "פירוט גימטרייה לכל המחמאות") {
            allDetails.forEach(detail => detail.style.display = "block");
            allButtons.forEach(button => button.textContent = "סגור פירוט גימטרייה");
            globalButton.textContent = "סגור פירוט גימטרייה לכל המחמאות";
        } else {
            allDetails.forEach(detail => detail.style.display = "none");
            allButtons.forEach(button => button.textContent = "פירוט גימטרייה");
            globalButton.textContent = "פירוט גימטרייה לכל המחמאות";
        }
    };

    complimentsResults.prepend(globalButton);
}



function updateDetailsTitle(mode) {
    const title = document.getElementById("detailsTitle");
    title.textContent = mode === "gematria" ? "פירוט גימטרייה:" : "פירוט קונסטריכון:";
}

function calculateConstruction() {
    const name = document.getElementById('inputName').value.trim();
    const gender = document.getElementById('gender').value;

    if (!name) return;

    updateDetailsTitle("construction");

    const gematriaResults = document.getElementById('gematriaResults');
    const complimentsResults = document.getElementById('complimentsResults');
    const loading = document.getElementById('loading');
    const finished = document.getElementById('finished');

    gematriaResults.innerHTML = "";
    complimentsResults.innerHTML = "";
    loading.style.display = "block";
    finished.style.display = "none";

    name.split('').forEach(char => {
        const p = document.createElement("p");
        p.textContent = char;
        gematriaResults.appendChild(p);
    });

    const nameP = document.createElement("p");
    nameP.innerHTML = `<strong>השם שהוכנס הוא: ${name}</strong>`;
    gematriaResults.appendChild(nameP);

    const countP = document.createElement("p");
    countP.innerHTML = `<strong>מספר האותיות בשם הוא: ${name.length}</strong>`;
    gematriaResults.appendChild(countP);

    const fileToLoad = gender === "male" ? "compliments_male.txt" : "compliments_female.txt";

    if (complimentsCache[gender]) {
        findMatchingComplimentsByLetters(complimentsCache[gender], name);
    } else {
        fetch(fileToLoad)
            .then(response => response.text())
            .then(text => {
                complimentsCache[gender] = text;
                findMatchingComplimentsByLetters(text, name);
            })
            .catch(error => {
                console.error("שגיאה בטעינת המחמאות", error);
                loading.style.display = "none";
                complimentsResults.innerHTML = "<p style='color: red;'>שגיאה בטעינת המחמאות. נסה שוב מאוחר יותר.</p>";
                document.getElementById('complimentsResults').style.textAlign = "right";
            });
    }
}

function findMatchingComplimentsByLetters(text, name) {
    const complimentsResults = document.getElementById('complimentsResults');
    const loading = document.getElementById('loading');
    const finished = document.getElementById('finished');

    let compliments = text.split("\n").map(line => line.trim()).filter(Boolean);
    let letters = new Set(name.split(''));
    let foundLetters = new Set();
    let notFoundLetters = [];

    let groupedCompliments = {};

    letters.forEach(letter => {
        groupedCompliments[letter] = compliments.filter(compliment => compliment.startsWith(letter));
        if (groupedCompliments[letter].length > 0) {
            foundLetters.add(letter);
        } else {
            notFoundLetters.push(letter);
        }
    });

name.split('').forEach(letter => {
    let counter = 0; // ספירה מתחילה מחדש לכל אות

    if (groupedCompliments[letter] && groupedCompliments[letter].length > 0) {
        groupedCompliments[letter].forEach(compliment => {
            addComplimentResult(compliment, name, counter); // שמירה על המספור
            counter++; // העלאת המספר לכל מחמאה
        });
    }
});





    if (notFoundLetters.length > 0) {
        const notFoundP = document.createElement("p");
        notFoundP.style.color = "red";
        notFoundP.innerHTML = `<strong>מצטערים! אבל לא נמצאו מחמאות שמתחילות באותיות הבאות: ${notFoundLetters.join(", ")}</strong>`;
        complimentsResults.insertBefore(notFoundP, complimentsResults.firstChild);
    }

    loading.style.display = "none";
    finished.style.display = "block";
}



function addComplimentResult(complimentText, name, index = null) {
    const complimentsResults = document.getElementById('complimentsResults');

    const div = document.createElement("div");
    div.classList.add("compliment-item");

    // יצירת אלמנט מספר המחמאה
    const numberSpan = document.createElement("span");
    numberSpan.classList.add("compliment-number");
    numberSpan.style.fontSize = "20px"; // הגדלת גודל מספר המחמאה
    numberSpan.style.fontWeight = "bold"; // הפיכת המספר למודגש
    numberSpan.style.marginRight = "10px"; // רווח קטן מימין

    // אם index קיים, הצג את המספר
    if (index !== null) {
        numberSpan.textContent = (index + 1) + ". "; // מספר המחמאה
    }

    // יצירת אלמנט המחמאה
    const textSpan = document.createElement("span");
    textSpan.textContent = complimentText;
    textSpan.style.fontSize = "22px"; // הגדלת גודל הטקסט
    textSpan.style.fontWeight = "bold"; // הפיכת המחמאות למודגשות
    textSpan.style.marginRight = "15px"; // רווח קטן מימין

    highlightFirstLetter(textSpan, name);

    // יצירת אלמנט פירוט הגימטרייה
    const detailsDiv = document.createElement("div");
    detailsDiv.style.display = "none";
    detailsDiv.classList.add("gematria-details");
    detailsDiv.innerHTML = generateGematriaDetails(complimentText);

    // רק אם מדובר ב"חשב גימטרייה", נוסיף את הכפתור
    let button = null;
    if (document.getElementById("detailsTitle").textContent === "פירוט גימטרייה:") {
        button = document.createElement("button");
        button.textContent = "פירוט גימטרייה";
        button.classList.add("info-button");
        button.style.backgroundColor = "green";
        button.style.marginRight = "15px"; // רווח קטן מימין

        button.onclick = () => {
            if (detailsDiv.style.display === "none") {
                detailsDiv.style.display = "block";
                button.textContent = "סגור פירוט גימטרייה";
            } else {
                detailsDiv.style.display = "none";
                button.textContent = "פירוט גימטרייה";
            }
        };
    }

    // הוספת האלמנטים למחמאה בסדר הנכון: מספר → טקסט → כפתור
    div.appendChild(numberSpan);
    div.appendChild(textSpan);
    if (button) div.appendChild(button);
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
