const photos = [
    "images/photo1.png",
    "images/photo2.png",
    "images/photo3.png",
    "images/photo4.png",
    "images/photo5.png",
    "images/photo6.jpg",
    "images/photo7.jpg",
    "images/photo8.jpg",
    "images/photo9.jpg"
];

const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
];

let currentDate = new Date();

/* ----------------------- */
/* SHUFFLE ARRAY */
/* ----------------------- */

function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

/* ----------------------- */
/* PHOTO ASSIGNMENT */
/* ----------------------- */

function getMonthPhoto(month) {

    let savedMap =
        JSON.parse(localStorage.getItem("monthPhotoMap")) || {};

    if (!savedMap[month]) {

        // Get or create shuffled photo list
        let shuffledPhotos =
            JSON.parse(localStorage.getItem("shuffledPhotos")) || shuffleArray(photos);

        // Assign photo to month
        const photoIndex = month % shuffledPhotos.length;
        const assignedPhoto = shuffledPhotos[photoIndex];

        savedMap[month] = assignedPhoto;

        // Save shuffled list for consistency
        localStorage.setItem(
            "shuffledPhotos",
            JSON.stringify(shuffledPhotos)
        );

        localStorage.setItem(
            "monthPhotoMap",
            JSON.stringify(savedMap)
        );
    }

    return savedMap[month];
}

/* ----------------------- */
/* QUOTES */
/* ----------------------- */

async function loadQuotes() {

    const response =
        await fetch("quotes.json");

    return await response.json();
}

/* ----------------------- */
/* BACKGROUND */
/* ----------------------- */

function updateBackground(month) {

    const bg =
        document.getElementById("background");

    bg.style.opacity = 0;

    setTimeout(() => {

        bg.style.backgroundImage =
            `url(${getMonthPhoto(month)})`;

        bg.style.opacity = 1;

    }, 250);
}

/* ----------------------- */
/* CALENDAR */
/* ----------------------- */

function renderCalendar(date, quotes) {

    const month =
        date.getMonth();

    const year =
        date.getFullYear();

    document.getElementById("monthYear").textContent =
        `${monthNames[month]} ${year}`;

    updateBackground(month);

    const quoteElement =
        document.getElementById("quote");

    const authorElement =
        document.getElementById("author");

    const quoteData =
        quotes[month % quotes.length];

    if (typeof quoteData === "object") {

        quoteElement.textContent =
            `"${quoteData.quote}"`;

        authorElement.textContent =
            quoteData.author;

    } else {

        quoteElement.textContent =
            quoteData;

        authorElement.textContent =
            "";
    }

    const calendar =
        document.getElementById("calendar");

    calendar.innerHTML = "";

    const firstDay =
        new Date(year, month, 1).getDay();

    const daysInMonth =
        new Date(year, month + 1, 0).getDate();

    for (let i = 0; i < firstDay; i++) {

        const empty =
            document.createElement("div");

        calendar.appendChild(empty);
    }

    const today =
        new Date();

    for (let day = 1; day <= daysInMonth; day++) {

        const div =
            document.createElement("div");

        div.classList.add("date");

        div.textContent = day;

        // Add 'sunday' class if this is a Sunday (first column, day % 7 == 0 in grid)
        const dayOfWeek = (firstDay + day - 1) % 7;
        if (dayOfWeek === 0) {
            div.classList.add("sunday");
        }

        if (
            day === today.getDate() &&
            month === today.getMonth() &&
            year === today.getFullYear()
        ) {
            div.classList.add("today");
        }

        calendar.appendChild(div);
    }
}

/* ----------------------- */
/* SWIPE */
/* ----------------------- */

function enableSwipe(quotes) {

    let startX = 0;

    document.addEventListener(
        "touchstart",
        e => {
            startX =
                e.touches[0].clientX;
        }
    );

    document.addEventListener(
        "touchend",
        e => {

            const endX =
                e.changedTouches[0].clientX;

            const diff =
                startX - endX;

            if (Math.abs(diff) < 60) return;

            if (diff > 0) {

                currentDate.setMonth(
                    currentDate.getMonth() + 1
                );

            } else {

                currentDate.setMonth(
                    currentDate.getMonth() - 1
                );
            }

            renderCalendar(
                currentDate,
                quotes
            );
        }
    );
}

/* ----------------------- */
/* INIT */
/* ----------------------- */

loadQuotes().then(quotes => {

    renderCalendar(
        currentDate,
        quotes
    );

    enableSwipe(quotes);
});
