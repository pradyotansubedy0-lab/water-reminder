// ==========================================
// 💧 HYDROLIFE - COMPLETE JAVASCRIPT
// ==========================================


// ---------- SETTINGS ----------

const maxGlasses = 8;

const waterTimes = [
    "7:00 AM",
    "9:00 AM",
    "11:00 AM",
    "1:00 PM",
    "3:00 PM",
    "5:00 PM",
    "7:00 PM",
    "9:00 PM"
];


// ---------- GET TODAY'S DATE ----------

function getTodayKey() {

    const today = new Date();

    return today.getFullYear() +
        "-" +
        String(today.getMonth() + 1).padStart(2, "0") +
        "-" +
        String(today.getDate()).padStart(2, "0");
}


const todayKey = getTodayKey();


// ---------- LOAD SAVED DATA ----------

let savedData = JSON.parse(
    localStorage.getItem("hydroLifeData")
);


// If there is no saved data, create new data

if (!savedData || savedData.date !== todayKey) {

    savedData = {

        date: todayKey,

        glasses: 0,

        checked: [
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false
        ]

    };

    saveData();
}


// ---------- SAVE DATA ----------

function saveData() {

    localStorage.setItem(
        "hydroLifeData",
        JSON.stringify(savedData)
    );
}


// ==========================================
// UPDATE EVERYTHING
// ==========================================

function updateEverything() {

    const glasses = savedData.glasses;


    // ---------- WATER NUMBER ----------

    document.getElementById("glasses").textContent = glasses;


    // ---------- STAT GLASSES ----------

    document.getElementById("stat-glasses").textContent =
        glasses;


    // ---------- REMAINING ----------

    const remaining =
        Math.max(maxGlasses - glasses, 0);

    document.getElementById("remaining-glasses").textContent =
        remaining;


    // ---------- PROGRESS ----------

    const percentage =
        Math.min((glasses / maxGlasses) * 100, 100);


    document.getElementById("progress-bar").style.width =
        percentage + "%";


    document.getElementById("progress-percent").textContent =
        Math.round(percentage) + "%";


    // ---------- MESSAGE ----------

    const message =
        document.getElementById("water-message");


    if (glasses === 0) {

        message.textContent =
            "Let's start your hydration journey! 💧";

    } else if (glasses < 3) {

        message.textContent =
            "Nice start! Keep going 💙";

    } else if (glasses < 5) {

        message.textContent =
            "You're doing great! Keep drinking 💦";

    } else if (glasses < 8) {

        message.textContent =
            "Almost there! Don't stop now 🔥";

    } else {

        message.textContent =
            "🎉 Amazing! Daily goal completed!";
    }


    // ---------- MOTIVATION ----------

    updateMotivation();


    // ---------- CHECKBOXES ----------

    updateCheckboxes();


    // ---------- COMPLETED CLASS ----------

    updateScheduleStyle();


    // ---------- STREAK ----------

    updateStreak();
}


// ==========================================
// UPDATE CHECKBOXES
// ==========================================

function updateCheckboxes() {

    const checkboxes =
        document.querySelectorAll(".water-check");


    checkboxes.forEach(function(checkbox) {

        const index =
            Number(checkbox.dataset.index);


        checkbox.checked =
            savedData.checked[index];

    });
}


// ==========================================
// SCHEDULE STYLE
// ==========================================

function updateScheduleStyle() {

    const items =
        document.querySelectorAll(".schedule-item");


    items.forEach(function(item, index) {

        if (savedData.checked[index]) {

            item.classList.add("completed");

        } else {

            item.classList.remove("completed");

        }

    });
}


// ==========================================
// CHECKBOX EVENT
// ==========================================

document
    .querySelectorAll(".water-check")
    .forEach(function(checkbox) {


        checkbox.addEventListener(
            "change",
            function() {


                const index =
                    Number(this.dataset.index);


                // If checking for first time

                if (
                    this.checked &&
                    !savedData.checked[index]
                ) {

                    savedData.checked[index] = true;

                    savedData.glasses =
                        Math.min(
                            savedData.glasses + 1,
                            maxGlasses
                        );


                    saveData();

                    updateEverything();


                    // Small celebration

                    celebrate();


                }


                // If user unchecks

                else if (
                    !this.checked &&
                    savedData.checked[index]
                ) {

                    savedData.checked[index] = false;

                    savedData.glasses =
                        Math.max(
                            savedData.glasses - 1,
                            0
                        );


                    saveData();

                    updateEverything();

                }

            }
        );

    });


// ==========================================
// DRINK WATER BUTTON
// ==========================================

function drinkWater() {


    if (savedData.glasses >= maxGlasses) {

        alert(
            "🎉 You already completed today's goal!\n\n" +
            "Amazing work! 💧🔥"
        );

        return;
    }


    savedData.glasses++;

    saveData();

    updateEverything();

    celebrate();

}


// ==========================================
// CELEBRATION
// ==========================================

function celebrate() {

    const card =
        document.querySelector(".water-card");


    card.classList.remove("celebrate");


    // Restart animation

    void card.offsetWidth;


    card.classList.add("celebrate");


    setTimeout(function() {

        card.classList.remove("celebrate");

    }, 700);


    // Daily goal celebration

    if (savedData.glasses === maxGlasses) {

        setTimeout(function() {

            alert(
                "🏆 DAILY GOAL COMPLETE! 🏆\n\n" +
                "You drank all 8 glasses today! 💧\n\n" +
                "Keep it up! 🔥"
            );

        }, 500);

    }

}


// ==========================================
// RESET DAY
// ==========================================

function resetWater() {


    const confirmReset =
        confirm(
            "Are you sure you want to reset today's water progress?"
        );


    if (!confirmReset) {

        return;

    }


    savedData.glasses = 0;


    savedData.checked = [
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false
    ];


    saveData();

    updateEverything();

}


// ==========================================
// MOTIVATION
// ==========================================

function updateMotivation() {

    const motivation =
        document.getElementById("motivation-text");


    const glasses =
        savedData.glasses;


    if (glasses === 0) {

        motivation.textContent =
            "Your body deserves enough water.";

    } else if (glasses < 3) {

        motivation.textContent =
            "Every glass is a step toward a healthier you.";

    } else if (glasses < 5) {

        motivation.textContent =
            "You're building a great hydration habit!";

    } else if (glasses < 8) {

        motivation.textContent =
            "You're almost at your daily goal! 🔥";

    } else {

        motivation.textContent =
            "You did it! Your hydration goal is complete! 🏆";

    }

}


// ==========================================
// STREAK
// ==========================================

function updateStreak() {

    let streak =
        Number(
            localStorage.getItem("hydroLifeStreak")
        ) || 0;


    document.getElementById("streak").textContent =
        streak;

}


// ==========================================
// TODAY'S DATE
// ==========================================

function showTodayDate() {

    const today =
        new Date();


    const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
    };


    document.getElementById("today-date")
        .textContent =
        today.toLocaleDateString(
            "en-US",
            options
        );

}


showTodayDate();


// ==========================================
// TIME CONVERSION
// ==========================================

function convertToMinutes(timeString) {

    const parts =
        timeString.split(" ");


    const time =
        parts[0];

    const period =
        parts[1];


    let [hours, minutes] =
        time.split(":").map(Number);


    if (period === "PM" && hours !== 12) {

        hours += 12;

    }


    if (period === "AM" && hours === 12) {

        hours = 0;

    }


    return hours * 60 + minutes;

}


// ==========================================
// CURRENT TIME
// ==========================================

function getCurrentMinutes() {

    const now =
        new Date();


    return (
        now.getHours() * 60 +
        now.getMinutes()
    );

}


// ==========================================
// REMINDER SYSTEM
// ==========================================

let lastReminderIndex = -1;


function checkWaterReminder() {

    const currentMinutes =
        getCurrentMinutes();


    for (
        let i = 0;
        i < waterTimes.length;
        i++
    ) {


        const scheduledMinutes =
            convertToMinutes(
                waterTimes[i]
            );


        // If scheduled time has passed

        if (
            currentMinutes >= scheduledMinutes &&
            !savedData.checked[i]
        ) {


            // Avoid showing same reminder repeatedly

            if (
                lastReminderIndex !== i
            ) {

                lastReminderIndex = i;


                showScheduleReminder(
                    waterTimes[i]
                );

            }


            break;

        }

    }

}


// ==========================================
// REMINDER POPUP
// ==========================================

function showScheduleReminder(time) {

    const reminderText =
        document.getElementById(
            "reminder-text"
        );


    reminderText.textContent =
        "⚠️ You haven't checked off your " +
        time +
        " water yet. Time to hydrate! 💧";


    // Browser alert

    alert(
        "💧 WATER REMINDER!\n\n" +
        "You haven't checked off your " +
        time +
        " water yet.\n\n" +
        "Drink water and tick ✅ Done!"
    );

}


// ==========================================
// MANUAL REMINDER
// ==========================================

function showReminder() {

    let nextWater = null;


    const currentMinutes =
        getCurrentMinutes();


    for (
        let i = 0;
        i < waterTimes.length;
        i++
    ) {

        if (
            !savedData.checked[i] &&
            convertToMinutes(waterTimes[i])
                >= currentMinutes
        ) {

            nextWater =
                waterTimes[i];

            break;

        }

    }


    if (nextWater) {

        alert(
            "💧 NEXT WATER REMINDER\n\n" +
            "Your next scheduled water is at " +
            nextWater +
            "."
        );

    } else {

        alert(
            "💧 Don't forget your water!\n\n" +
            "Check your schedule and stay hydrated. 💙"
        );

    }

}


// ==========================================
// RUN REMINDER EVERY 30 SECONDS
// ==========================================

setInterval(
    checkWaterReminder,
    30000
);


// ==========================================
// INITIALIZE WEBSITE
// ==========================================

updateEverything();

checkWaterReminder();

console.log(
    "💧 HydroLife is running successfully!"
);