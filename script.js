// حفظ البيانات في LocalStorage
const saveToLocalStorage = () => {
    const parties = [];
    document.querySelectorAll(".party").forEach(partyDiv => {
        const partyData = {
            text: partyDiv.querySelector("span").textContent,
            completed: partyDiv.querySelector(".complete").disabled,
            completedText: partyDiv.querySelector(".complete").textContent,
            undoDisabled: partyDiv.querySelector(".undo").disabled
        };
        parties.push(partyData);
    });
    localStorage.setItem("parties", JSON.stringify(parties));
};

// استعادة البيانات من LocalStorage
const loadFromLocalStorage = () => {
    const parties = JSON.parse(localStorage.getItem("parties"));
    if (parties) {
        parties.forEach(party => {
            const partyDiv = document.createElement("div");
            partyDiv.className = "party";

            const partyName = document.createElement("span");
            partyName.textContent = party.text;
            partyDiv.appendChild(partyName);

            const actionsDiv = document.createElement("div");
            actionsDiv.className = "actions";

            const completeButton = document.createElement("button");
            completeButton.textContent = party.completed ? party.completedText : "إنهاء";
            completeButton.className = "complete";
            completeButton.disabled = party.completed;
            completeButton.addEventListener("click", () => {
                if (confirm("هل أنت متأكد من إنهاء هذا الحزب؟")) {
                    const now = new Date();
                    const timeString = now.toLocaleString("ar-EG");
                    completeButton.textContent = `تم الانتهاء (${timeString})`;
                    completeButton.disabled = true;
                    undoButton.disabled = false;
                    saveToLocalStorage();
                }
            });

            const undoButton = document.createElement("button");
            undoButton.textContent = "تراجع";
            undoButton.className = "undo";
            undoButton.disabled = party.undoDisabled;
            undoButton.addEventListener("click", () => {
                completeButton.textContent = "إنهاء";
                completeButton.disabled = false;
                undoButton.disabled = true;
                saveToLocalStorage();
            });

            actionsDiv.appendChild(completeButton);
            actionsDiv.appendChild(undoButton);
            partyDiv.appendChild(actionsDiv);
            document.getElementById("parties-list").appendChild(partyDiv);
        });
    }
};

// توليد الأحزاب الجديدة
document.getElementById("generate").addEventListener("click", () => {
    const from = parseInt(document.getElementById("from").value);
    const to = parseInt(document.getElementById("to").value);
    const firstDay = document.getElementById("first-day").value;
    const days =  ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];

    if (isNaN(from) || isNaN(to) || from < 1 || to > 60 || from > to) {
        alert("يرجى إدخال قيم صحيحة!");
        return;
    }

    const list = document.getElementById("parties-list");
    list.innerHTML = ""; // مسح القائمة القديمة

    let currentDayIndex = days.indexOf(firstDay);

    for (let i = from; i <= to; i++) {
        const partyDiv = document.createElement("div");
        partyDiv.className = "party";

        const partyName = document.createElement("span");
        partyName.textContent = `حزب ${i} - ${days[currentDayIndex]}`;
        partyDiv.appendChild(partyName);

        const actionsDiv = document.createElement("div");
        actionsDiv.className = "actions";

        const completeButton = document.createElement("button");
        completeButton.textContent = "إنهاء";
        completeButton.className = "complete";
        completeButton.addEventListener("click", () => {
            if (confirm("هل أنت متأكد من إنهاء هذا الحزب؟")) {
                const now = new Date();
                const timeString = now.toLocaleString("ar-EG");
                completeButton.textContent = `تم الانتهاء (${timeString})`;
                completeButton.disabled = true;
                undoButton.disabled = false;
                saveToLocalStorage();
            }
        });

        const undoButton = document.createElement("button");
        undoButton.textContent = "تراجع";
        undoButton.className = "undo";
        undoButton.disabled = true;
        undoButton.addEventListener("click", () => {
            completeButton.textContent = "إنهاء";
            completeButton.disabled = false;
            undoButton.disabled = true;
            saveToLocalStorage();
        });

        actionsDiv.appendChild(completeButton);
        actionsDiv.appendChild(undoButton);
        partyDiv.appendChild(actionsDiv);
        list.appendChild(partyDiv);

        currentDayIndex = (currentDayIndex + 1) % days.length;
    }
    saveToLocalStorage();
});

// تهيئة الصفحة
document.getElementById("reset").addEventListener("click", () => {
    if (confirm("هل تريد إعادة تعيين الصفحة؟")) {
        localStorage.clear();
        location.reload();
    }
});

// تحميل البيانات عند فتح الصفحة
window.onload = loadFromLocalStorage;
