/* =========================================================
   MR. SUBEDEE'S DAILY WATER HYDRATION
   COMPLETE JAVASCRIPT
========================================================= */

"use strict";


/* =========================================================
   SETTINGS
========================================================= */

const START_HOUR = 6;
const END_HOUR = 21;

const TOTAL_REMINDERS = END_HOUR - START_HOUR + 1;

const STORAGE_KEYS = {
    name: "waterAppName",
    daily: "waterDailyData",
    history: "waterHistory",
    settings: "waterSettings"
};


/* =========================================================
   CRAZY REMINDER MESSAGES
========================================================= */

const crazyMessages = [

    "Oiii! 😭💧 Pani khayeu? Aaja ko pani khau hai!",

    "HALO? PANI? 💧😭 Your body is waiting bro!",

    "Oii! 👀💧 Water break! No excuses 😤",

    "Aaja pani birsine plan ho kya? 😂💧",

    "Brooo... your water bottle is getting lonely 😭💧",

    "HYDRATION POLICE HERE 👮💧 Drink water. NOW.",

    "One glass. Right now. GO! 💨💧",

    "Oii hero 😭💧 Pani khau, reel pachi hera!",

    "Your body just sent a complaint 😂💀💧",

    "Pani khau hai dada 😭💧 Don't make me come again!",

    "Breaking news 🚨: You still haven't had your water! 💧😂",

    "Stop scrolling for 30 seconds 😭💧 WATER TIME!",

    "Excuse me sir 👀💧 Where is the water?",

    "Your water bottle said: 'Ma sanga risako ho?' 😭😂💧",

    "PANI KHAU! 😤💧 This is your official reminder!"
];


const followUpMessages = [

    "Oiii 😭💧 30 minutes bhayo! Pani ajhai khayena?",

    "HALO BRO 💀💧 You ignored the water reminder!",

    "Still no water?! 😭💧 Please drink now!",

    "Your water bottle is judging you 👀💧",

    "30 MINUTE WARNING 🚨💧 Pani khau hai!",
    
    "Oii! 😂💧 Enough scrolling. Drink your water!"
];


const realityMessages = [

    "Your water bottle is literally watching you. 👀💧",

    "Be honest... when was your last glass? 😂💧",

    "Your body called. It wants water. 📞💧",

    "Water first. Everything else later. 😤💧",

    "Scrolling won't hydrate you bro 😭📱💧",

    "A glass of water won't hurt. Promise. 😂💧",

    "Hydration level: Don't make your body file a complaint. 💀💧",

    "If your bottle is full, that's not a flex. 😭💧",

    "Drink water like your future self is watching. 😎💧",

    "Tiny break. Big hydration. 💦"
];


/* =========================================================
   APP STATE
========================================================= */

let dailyData = loadDailyData();

let settings = loadSettings();

let reminderTimers = {};

let followUpTimers = {};

let lastReminderCheck = "";

let audioContext = null;


/* =========================================================
   DOM
========================================================= */

const welcomeScreen = document.getElementById("welcomeScreen");
const dashboard = document.getElementById("dashboard");

const nameInput = document.getElementById("nameInput");
const startBtn = document.getElementById("startBtn");

const brandTitle = document.getElementById("brandTitle");

const dateDisplay = document.getElementById("dateDisplay");
const greeting = document.getElementById("greeting");

const completedCount = document.getElementById("completedCount");

const progressBar = document.getElementById("progressBar");
const percentageText = document.getElementById("percentageText");

const drankText = document.getElementById("drankText");
const remainingText = document.getElementById("remainingText");
const streakText = document.getElementById("streakText");

const nextReminder = document.getElementById("nextReminder");
const nextReminderMessage = document.getElementById("nextReminderMessage");

const scheduleList = document.getElementById("scheduleList");

const realityMessage = document.getElementById("realityMessage");

const notificationStatus =
    document.getElementById("notificationStatus");

const enableNotificationsBtn =
    document.getElementById("enableNotificationsBtn");

const settingsBtn =
    document.getElementById("settingsBtn");

const settingsModal =
    document.getElementById("settingsModal");

const closeSettingsBtn =
    document.getElementById("closeSettingsBtn");

const notificationToggle =
    document.getElementById("notificationToggle");

const soundToggle =
    document.getElementById("soundToggle");

const crazyToggle =
    document.getElementById("crazyToggle");

const changeNameBtn =
    document.getElementById("changeNameBtn");

const currentNameText =
    document.getElementById("currentNameText");

const resetDayBtn =
    document.getElementById("resetDayBtn");

const toast =
    document.getElementById("toast");


/* =========================================================
   INITIALIZE
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    checkNewDay();

    applySettingsToUI();

    if (dailyData.name) {

        showDashboard();

    } else {

        showWelcome();

    }

    updateEverything();

    startReminderEngine();

    updateNotificationStatus();

});


/* =========================================================
   START / WELCOME
========================================================= */

startBtn.addEventListener("click", startApp);


nameInput.addEventListener("keydown", (event) => {

    if (event.key === "Enter") {

        startApp();

    }

});


function startApp() {

    const name = nameInput.value.trim();

    if (!name) {

        showToast("Please enter your name first 😊💧");

        nameInput.focus();

        return;

    }

    dailyData.name = name;

    saveDailyData();

    showDashboard();

    updateEverything();

    /*
       Ask for notification permission after
       the user has interacted with the page.
    */

    requestNotificationPermission();

    /*
       Unlock Web Audio after user interaction.
    */

    unlockAudio();

    showToast(`Welcome ${name}! Let's stay hydrated! 💧😎`);

}


/* =========================================================
   SCREEN CONTROL
========================================================= */

function showWelcome() {

    welcomeScreen.classList.remove("hidden");

    dashboard.classList.add("hidden");

}


function showDashboard() {

    welcomeScreen.classList.add("hidden");

    dashboard.classList.remove("hidden");

}


/* =========================================================
   DATE
========================================================= */

function getDateKey(date = new Date()) {

    const year = date.getFullYear();

    const month =
        String(date.getMonth() + 1).padStart(2, "0");

    const day =
        String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;

}


function formatDate(date = new Date()) {

    return date.toLocaleDateString(
        "en-US",
        {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric"
        }
    );

}


function checkNewDay() {

    const today = getDateKey();

    if (!dailyData.date) {

        dailyData = createNewDailyData(
            dailyData.name || ""
        );

        saveDailyData();

        return;

    }


    if (dailyData.date !== today) {

        savePreviousDay();

        const name = dailyData.name || "";

        dailyData =
            createNewDailyData(name);

        saveDailyData();

    }

}


/* =========================================================
   DAILY DATA
========================================================= */

function createNewDailyData(name = "") {

    return {

        date: getDateKey(),

        name: name,

        completed: {},

        reminderSent: {},

        followUpSent: {},

        completionNoticeSent: {}

    };

}


function loadDailyData() {

    try {

        const saved =
            localStorage.getItem(
                STORAGE_KEYS.daily
            );

        if (!saved) {

            return createNewDailyData();

        }

        const data = JSON.parse(saved);

        if (!data.completed) {
            data.completed = {};
        }

        if (!data.reminderSent) {
            data.reminderSent = {};
        }

        if (!data.followUpSent) {
            data.followUpSent = {};
        }

        if (!data.completionNoticeSent) {
            data.completionNoticeSent = {};
        }

        return data;

    } catch (error) {

        console.error(error);

        return createNewDailyData();

    }

}


function saveDailyData() {

    localStorage.setItem(
        STORAGE_KEYS.daily,
        JSON.stringify(dailyData)
    );

}


/* =========================================================
   SETTINGS
========================================================= */

function defaultSettings() {

    return {

        notifications: true,

        sound: true,

        crazyMode: true

    };

}


function loadSettings() {

    try {

        const saved =
            localStorage.getItem(
                STORAGE_KEYS.settings
            );

        if (!saved) {

            return defaultSettings();

        }

        return {
            ...defaultSettings(),
            ...JSON.parse(saved)
        };

    } catch (error) {

        return defaultSettings();

    }

}


function saveSettings() {

    localStorage.setItem(
        STORAGE_KEYS.settings,
        JSON.stringify(settings)
    );

}


function applySettingsToUI() {

    notificationToggle.checked =
        settings.notifications;

    soundToggle.checked =
        settings.sound;

    crazyToggle.checked =
        settings.crazyMode;

    currentNameText.textContent =
        dailyData.name
            ? `Current name: ${dailyData.name}`
            : "No name set";

}


/* =========================================================
   SCHEDULE
========================================================= */

function getScheduleHours() {

    const hours = [];

    for (
        let hour = START_HOUR;
        hour <= END_HOUR;
        hour++
    ) {

        hours.push(hour);

    }

    return hours;

}


function formatHour(hour) {

    const suffix =
        hour >= 12 ? "PM" : "AM";

    let displayHour =
        hour % 12;

    if (displayHour === 0) {
        displayHour = 12;
    }

    return `${displayHour}:00 ${suffix}`;

}


function renderSchedule() {

    scheduleList.innerHTML = "";

    const now = new Date();

    const currentHour =
        now.getHours();

    getScheduleHours().forEach((hour) => {

        const completed =
            Boolean(
                dailyData.completed[hour]
            );

        const isCurrent =
            currentHour === hour;

        const item =
            document.createElement("div");

        item.className =
            "schedule-item";

        if (completed) {

            item.classList.add("completed");

        }

        if (isCurrent) {

            item.classList.add("current");

        }

        const left =
            document.createElement("div");

        left.className =
            "schedule-left";

        const water =
            document.createElement("div");

        water.className =
            "schedule-water";

        water.textContent =
            completed ? "✅" : "💧";

        const details =
            document.createElement("div");

        const time =
            document.createElement("div");

        time.className =
            "schedule-time";

        time.textContent =
            formatHour(hour);

        const status =
            document.createElement("div");

        status.className =
            "schedule-status";

        if (completed) {

            status.textContent =
                "Water drank! Nice 😎💧";

        } else if (isCurrent) {

            status.textContent =
                "It's water time! 🔔";

        } else if (hour < currentHour) {

            status.textContent =
                "Still waiting... 💧";

        } else {

            status.textContent =
                "Coming up 💦";

        }

        details.appendChild(time);

        details.appendChild(status);

        left.appendChild(water);

        left.appendChild(details);


        const button =
            document.createElement("button");

        button.type = "button";

        button.className =
            "drink-btn";

        button.dataset.hour =
            String(hour);

        button.textContent =
            completed
                ? "✓ Done"
                : "I Drank Water 💧";

        button.addEventListener(
            "click",
            () => markWaterDrank(hour)
        );


        item.appendChild(left);

        item.appendChild(button);

        scheduleList.appendChild(item);

    });

}


/* =========================================================
   MARK WATER DRANK
========================================================= */

function markWaterDrank(hour) {

    if (dailyData.completed[hour]) {

        showToast(
            "You already marked this water as drank 😎💧"
        );

        return;

    }


    dailyData.completed[hour] = {

        time:
            new Date().toISOString()

    };


    /*
       IMPORTANT:
       Once the user drinks water,
       the follow-up reminder for this hour
       must NOT appear.
    */

    cancelFollowUp(hour);

    saveDailyData();

    updateEverything();

    playTingTong();

    showToast(
        "Good! You drank your water! 😎💧"
    );


    /*
       Optional GOOD notification.
       This happens AFTER the user clicks Done,
       never before the original reminder.
    */

    if (
        settings.notifications &&
        !dailyData.completionNoticeSent[hour]
    ) {

        sendCompletionNotification(hour);

        dailyData.completionNoticeSent[hour] = true;

        saveDailyData();

    }

}


/* =========================================================
   NOTIFICATION PERMISSION
========================================================= */

async function requestNotificationPermission() {

    if (
        !("Notification" in window)
    ) {

        updateNotificationStatus();

        return;

    }


    if (
        Notification.permission === "granted"
    ) {

        updateNotificationStatus();

        return;

    }


    if (
        Notification.permission === "denied"
    ) {

        updateNotificationStatus();

        return;

    }


    try {

        const permission =
            await Notification.requestPermission();

        updateNotificationStatus();

        if (permission === "granted") {

            showToast(
                "Notifications enabled! 🔔💧"
            );

        }

    } catch (error) {

        console.error(
            "Notification permission error:",
            error
        );

    }

}


/* =========================================================
   NOTIFICATION STATUS
========================================================= */

function updateNotificationStatus() {

    if (
        !("Notification" in window)
    ) {

        notificationStatus.textContent =
            "This browser does not support notifications.";

        return;

    }


    if (
        Notification.permission === "granted"
    ) {

        notificationStatus.textContent =
            "Notifications are enabled 🔔💧";

        enableNotificationsBtn.textContent =
            "Enabled ✓";

        return;

    }


    if (
        Notification.permission === "denied"
    ) {

        notificationStatus.textContent =
            "Notifications are blocked. Enable them in browser settings.";

        enableNotificationsBtn.textContent =
            "Blocked";

        return;

    }


    notificationStatus.textContent =
        "Notifications are not enabled yet.";

    enableNotificationsBtn.textContent =
        "Enable 🔔";

}


/* =========================================================
   MAIN REMINDER ENGINE
========================================================= */

function startReminderEngine() {

    /*
       Check immediately.
    */

    checkReminders();


    /*
       Then check every second.
       This keeps the hour timing accurate.
    */

    setInterval(() => {

        checkNewDay();

        updateDateOnly();

        checkReminders();

    }, 1000);

}


function checkReminders() {

    if (!dailyData.name) {

        return;

    }


    if (!settings.notifications) {

        return;

    }


    if (
        !("Notification" in window)
    ) {

        return;

    }


    if (
        Notification.permission !== "granted"
    ) {

        return;

    }


    const now = new Date();

    const hour =
        now.getHours();

    const minute =
        now.getMinutes();

    const second =
        now.getSeconds();


    /*
       Only reminder hours:
       6 AM → 9 PM
    */

    if (
        hour < START_HOUR ||
        hour > END_HOUR
    ) {

        return;

    }


    /*
       FIRST REMINDER
       Exactly at HH:00
    */

    if (
        minute === 0 &&
        second < 3
    ) {

        if (
            !dailyData.completed[hour] &&
            !dailyData.reminderSent[hour]
        ) {

            sendWaterNotification(
                hour,
                false
            );

            dailyData.reminderSent[hour] =
                new Date().toISOString();

            saveDailyData();

            scheduleFollowUp(hour);

        }

    }


    /*
       CATCH-UP LOGIC
       
       If the page was open but the exact
       second was missed, don't repeatedly
       spam the user.

       We allow a small catch-up window
       during the first minute.
    */

    if (
        minute === 1 &&
        second < 3
    ) {

        if (
            !dailyData.completed[hour] &&
            !dailyData.reminderSent[hour]
        ) {

            sendWaterNotification(
                hour,
                false
            );

            dailyData.reminderSent[hour] =
                new Date().toISOString();

            saveDailyData();

            scheduleFollowUp(hour);

        }

    }

}


/* =========================================================
   FIRST WATER NOTIFICATION
========================================================= */

function sendWaterNotification(
    hour,
    isFollowUp = false
) {

    const name =
        dailyData.name || "Bro";


    let title =
        "WATER REMINDER 💧";


    let message;


    if (hour === 6 && !isFollowUp) {

        message =
            `Good Morning ${name}! 🌅💧`;

    } else {

        if (settings.crazyMode) {

            if (isFollowUp) {

                message =
                    randomItem(
                        followUpMessages
                    );

            } else {

                message =
                    randomItem(
                        crazyMessages
                    );

            }

        } else {

            message =
                `Hey ${name}! 💧 Time to drink your water.`;

        }

    }


    showBrowserNotification(
        title,
        message
    );


    if (settings.sound) {

        playTingTong();

    }

}


/* =========================================================
   FOLLOW-UP
========================================================= */

function scheduleFollowUp(hour) {

    /*
       9 PM is the final reminder.
       No 9:30 PM follow-up because
       quiet hours begin at 9 PM.
    */

    if (hour >= END_HOUR) {

        return;

    }


    cancelFollowUp(hour);


    followUpTimers[hour] =
        setTimeout(() => {

            if (
                dailyData.completed[hour]
            ) {

                return;

            }


            if (
                !dailyData.followUpSent[hour]
            ) {

                sendWaterNotification(
                    hour,
                    true
                );

                dailyData.followUpSent[hour] =
                    new Date().toISOString();

                saveDailyData();

            }

        }, 30 * 60 * 1000);

}


function cancelFollowUp(hour) {

    if (
        followUpTimers[hour]
    ) {

        clearTimeout(
            followUpTimers[hour]
        );

        delete followUpTimers[hour];

    }

}


/* =========================================================
   BROWSER NOTIFICATION
========================================================= */

function showBrowserNotification(
    title,
    body
) {

    if (
        !("Notification" in window)
    ) {

        return;

    }


    if (
        Notification.permission !== "granted"
    ) {

        return;

    }


    try {

        const notification =
            new Notification(
                title,
                {
                    body: body,

                    icon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ctext y='.9em' font-size='85'%3E💧%3C/text%3E%3C/svg%3E",

                    badge: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ctext y='.9em' font-size='85'%3E💧%3C/text%3E%3C/svg%3E",

                    tag: "water-reminder",

                    renotify: true
                }
            );


        notification.onclick = () => {

            window.focus();

            notification.close();

        };

    } catch (error) {

        console.error(
            "Notification error:",
            error
        );

    }

}


/* =========================================================
   COMPLETION NOTIFICATION
========================================================= */

function sendCompletionNotification(hour) {

    const name =
        dailyData.name || "Bro";


    showBrowserNotification(

        "WATER REMINDER 💧",

        `Good ${name}! 😎💧 You drank your ${formatHour(hour)} water!`

    );

}


/* =========================================================
   SOUND
========================================================= */

function unlockAudio() {

    try {

        if (!audioContext) {

            audioContext =
                new (
                    window.AudioContext ||
                    window.webkitAudioContext
                )();

        }


        if (
            audioContext.state === "suspended"
        ) {

            audioContext.resume();

        }

    } catch (error) {

        console.log(
            "Audio unavailable."
        );

    }

}


function playTingTong() {

    if (!settings.sound) {

        return;

    }


    try {

        if (!audioContext) {

            unlockAudio();

        }


        if (!audioContext) {

            return;

        }


        const now =
            audioContext.currentTime;


        const oscillator1 =
            audioContext.createOscillator();

        const gain1 =
            audioContext.createGain();


        oscillator1.type =
            "sine";

        oscillator1.frequency.setValueAtTime(
            880,
            now
        );

        gain1.gain.setValueAtTime(
            0.0001,
            now
        );

        gain1.gain.exponentialRampToValueAtTime(
            0.18,
            now + 0.02
        );

        gain1.gain.exponentialRampToValueAtTime(
            0.0001,
            now + 0.30
        );


        oscillator1.connect(
            gain1
        );

        gain1.connect(
            audioContext.destination
        );


        oscillator1.start(now);

        oscillator1.stop(
            now + 0.32
        );


        const oscillator2 =
            audioContext.createOscillator();

        const gain2 =
            audioContext.createGain();


        oscillator2.type =
            "sine";

        oscillator2.frequency.setValueAtTime(
            1174.66,
            now + 0.12
        );

        gain2.gain.setValueAtTime(
            0.0001,
            now + 0.12
        );

        gain2.gain.exponentialRampToValueAtTime(
            0.14,
            now + 0.14
        );

        gain2.gain.exponentialRampToValueAtTime(
            0.0001,
            now + 0.45
        );


        oscillator2.connect(
            gain2
        );

        gain2.connect(
            audioContext.destination
        );


        oscillator2.start(
            now + 0.12
        );

        oscillator2.stop(
            now + 0.47
        );

    } catch (error) {

        console.log(
            "Sound could not play."
        );

    }

}


/* =========================================================
   PROGRESS
========================================================= */

function getCompletedCount() {

    return Object.keys(
        dailyData.completed
    ).length;

}


function updateProgress() {

    const completed =
        getCompletedCount();

    const total =
        TOTAL_REMINDERS;

    const percentage =
        Math.round(
            (completed / total) * 100
        );


    completedCount.textContent =
        completed;

    percentageText.textContent =
        `${percentage}%`;

    progressBar.style.width =
        `${percentage}%`;

    drankText.textContent =
        `${completed} ${
            completed === 1
                ? "glass"
                : "glasses"
        }`;

    const remaining =
        Math.max(
            total - completed,
            0
        );

    remainingText.textContent =
        `${remaining} ${
            remaining === 1
                ? "glass"
                : "glasses"
        }`;


    if (percentage === 100) {

        progressBar.style.width =
            "100%";

    }

}


/* =========================================================
   NEXT REMINDER
========================================================= */

function updateNextReminder() {

    const now =
        new Date();

    const currentHour =
        now.getHours();

    const currentMinute =
        now.getMinutes();


    let nextHour = null;


    /*
       If current hour is inside the schedule
       and hasn't been completed, that's the
       active reminder.
    */

    if (
        currentHour >= START_HOUR &&
        currentHour <= END_HOUR &&
        !dailyData.completed[currentHour]
    ) {

        nextHour =
            currentHour;

    } else {

        for (
            let hour = START_HOUR;
            hour <= END_HOUR;
            hour++
        ) {

            if (
                !dailyData.completed[hour] &&
                (
                    hour > currentHour ||
                    currentHour < START_HOUR
                )
            ) {

                nextHour =
                    hour;

                break;

            }

        }

    }


    if (nextHour === null) {

        nextReminder.textContent =
            "All done! 🎉💧";

        nextReminderMessage.textContent =
            "You completed today's hydration mission! 😎";

        return;

    }


    nextReminder.textContent =
        formatHour(nextHour);


    if (
        nextHour === currentHour &&
        currentMinute >= 0
    ) {

        nextReminderMessage.textContent =
            "It's water time! Don't ignore me 😂💧";

    } else {

        nextReminderMessage.textContent =
            `Get ready for your ${formatHour(nextHour)} water. 💦`;

    }

}


/* =========================================================
   DATE + GREETING
========================================================= */

function updateDateOnly() {

    dateDisplay.textContent =
        formatDate();


    const name =
        dailyData.name || "there";


    const hour =
        new Date().getHours();


    let greetingText;


    if (hour < 12) {

        greetingText =
            `Good morning, ${name}! 🌅💧`;

    } else if (hour < 18) {

        greetingText =
            `Good afternoon, ${name}! ☀️💧`;

    } else {

        greetingText =
            `Good evening, ${name}! 🌙💧`;

    }


    greeting.textContent =
        greetingText;


    if (dailyData.name) {

        brandTitle.textContent =
            `${dailyData.name}'s Daily Water Hydration`;

    }

}


function updateGreetingAndDate() {

    updateDateOnly();

}


/* =========================================================
   REALITY MESSAGE
========================================================= */

function updateRealityMessage() {

    realityMessage.textContent =
        randomItem(
            realityMessages
        );

}


/* =========================================================
   STREAK
========================================================= */

function getHistory() {

    try {

        const saved =
            localStorage.getItem(
                STORAGE_KEYS.history
            );

        if (!saved) {

            return {};

        }

        return JSON.parse(saved);

    } catch (error) {

        return {};

    }

}


function savePreviousDay() {

    if (
        !dailyData.date
    ) {

        return;

    }


    const history =
        getHistory();


    history[dailyData.date] = {

        completed:
            getCompletedCount(),

        total:
            TOTAL_REMINDERS,

        complete:
            getCompletedCount() ===
            TOTAL_REMINDERS

    };


    localStorage.setItem(
        STORAGE_KEYS.history,
        JSON.stringify(history)
    );

}


function calculateStreak() {

    const history =
        getHistory();


    let streak = 0;


    const today =
        new Date();


    /*
       Count completed full days
       going backwards from yesterday.
    */

    const checkDate =
        new Date(today);

    checkDate.setDate(
        checkDate.getDate() - 1
    );


    while (true) {

        const key =
            getDateKey(checkDate);


        if (
            history[key] &&
            history[key].complete
        ) {

            streak++;

            checkDate.setDate(
                checkDate.getDate() - 1
            );

        } else {

            break;

        }

    }


    /*
       If today's mission is complete,
       include today.
    */

    if (
        getCompletedCount() ===
        TOTAL_REMINDERS
    ) {

        streak++;

    }


    return streak;

}


function updateStreak() {

    const streak =
        calculateStreak();

    streakText.textContent =
        `${streak} ${
            streak === 1
                ? "day"
                : "days"
        }`;

}


/* =========================================================
   UPDATE EVERYTHING
========================================================= */

function updateEverything() {

    checkNewDay();

    updateDateOnly();

    updateProgress();

    renderSchedule();

    updateNextReminder();

    updateStreak();

    currentNameText.textContent =
        dailyData.name
            ? `Current name: ${dailyData.name}`
            : "No name set";

}


/* =========================================================
   SETTINGS EVENTS
========================================================= */

settingsBtn.addEventListener(
    "click",
    () => {

        settingsModal.classList.remove(
            "hidden"
        );

        applySettingsToUI();

    }
);


closeSettingsBtn.addEventListener(
    "click",
    closeSettings
);


settingsModal.addEventListener(
    "click",
    (event) => {

        if (
            event.target === settingsModal
        ) {

            closeSettings();

        }

    }
);


function closeSettings() {

    settingsModal.classList.add(
        "hidden"
    );

}


notificationToggle.addEventListener(
    "change",
    async () => {

        settings.notifications =
            notificationToggle.checked;

        saveSettings();

        if (
            settings.notifications
        ) {

            await requestNotificationPermission();

        }

        updateNotificationStatus();

    }
);


soundToggle.addEventListener(
    "change",
    () => {

        settings.sound =
            soundToggle.checked;

        saveSettings();

        if (
            settings.sound
        ) {

            unlockAudio();

            playTingTong();

        }

    }
);


crazyToggle.addEventListener(
    "change",
    () => {

        settings.crazyMode =
            crazyToggle.checked;

        saveSettings();

    }
);


/* =========================================================
   ENABLE NOTIFICATIONS BUTTON
========================================================= */

enableNotificationsBtn.addEventListener(
    "click",
    async () => {

        await requestNotificationPermission();

        if (
            Notification.permission === "granted"
        ) {

            settings.notifications =
                true;

            notificationToggle.checked =
                true;

            saveSettings();

            updateNotificationStatus();

            showToast(
                "Ready! I'll remind you 💧🔔"
            );

        }

    }
);


/* =========================================================
   CHANGE NAME
========================================================= */

changeNameBtn.addEventListener(
    "click",
    () => {

        const newName =
            prompt(
                "Enter your name:",
                dailyData.name || ""
            );


        if (
            newName === null
        ) {

            return;

        }


        const cleanName =
            newName.trim();


        if (!cleanName) {

            showToast(
                "Name cannot be empty 😊"
            );

            return;

        }


        dailyData.name =
            cleanName;

        saveDailyData();

        updateEverything();

        closeSettings();

        showToast(
            `Name changed to ${cleanName} 😎💧`
        );

    }
);


/* =========================================================
   RESET DAY
========================================================= */

resetDayBtn.addEventListener(
    "click",
    () => {

        const confirmed =
            confirm(
                "Reset today's water progress? 💧"
            );


        if (!confirmed) {

            return;

        }


        const name =
            dailyData.name;


        dailyData =
            createNewDailyData(name);

        saveDailyData();


        Object.keys(
            followUpTimers
        ).forEach((hour) => {

            cancelFollowUp(hour);

        });


        updateEverything();

        showToast(
            "Today's hydration has been reset 🔄💧"
        );

    }
);


/* =========================================================
   RANDOM ITEM
========================================================= */

function randomItem(array) {

    return array[
        Math.floor(
            Math.random() *
            array.length
        )
    ];

}


/* =========================================================
   TOAST
========================================================= */

let toastTimer = null;


function showToast(message) {

    if (!toast) {

        return;

    }


    toast.textContent =
        message;


    toast.classList.add(
        "show"
    );


    clearTimeout(
        toastTimer
    );


    toastTimer =
        setTimeout(() => {

            toast.classList.remove(
                "show"
            );

        }, 2800);

}


/* =========================================================
   VISIBILITY
========================================================= */

document.addEventListener(
    "visibilitychange",
    () => {

        if (
            !document.hidden
        ) {

            checkNewDay();

            updateEverything();

            updateNotificationStatus();

        }

    }
);


/* =========================================================
   MIDNIGHT / NEW DAY CHECK
========================================================= */

setInterval(
    () => {

        const today =
            getDateKey();

        if (
            dailyData.date !== today
        ) {

            checkNewDay();

            updateEverything();

        }

    },
    30000
);


/* =========================================================
   INITIAL REALITY MESSAGE
========================================================= */

if (realityMessage) {

    realityMessage.textContent =
        randomItem(
            realityMessages
        );

}


/* =========================================================
   FINAL SAFETY UPDATE
========================================================= */

window.addEventListener(
    "load",
    () => {

        checkNewDay();

        updateEverything();

        updateNotificationStatus();

    }
);