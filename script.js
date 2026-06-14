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
  "January","February","March","April",
  "May","June","July","August",
  "September","October","November","December"
];

let currentDate = new Date();

async function loadQuotes() {
  const response = await fetch("quotes.json");
  return await response.json();
}

function getPhotoForMonth(month) {
  return photos[month % photos.length];
}

function renderCalendar(date, quotes) {

  const month = date.getMonth();
  const year = date.getFullYear();

  document.getElementById("monthYear").textContent =
    `${monthNames[month]} ${year}`;

  document.getElementById("background").style.backgroundImage =
    `url(${getPhotoForMonth(month)})`;

  document.getElementById("quote").textContent =
    quotes[month % quotes.length];

  const calendar = document.getElementById("calendar");
  calendar.innerHTML = "";

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  for (let i = 0; i < firstDay; i++) {
    const empty = document.createElement("div");
    calendar.appendChild(empty);
  }

  const today = new Date();

  for (let day = 1; day <= daysInMonth; day++) {

    const div = document.createElement("div");
    div.classList.add("date");
    div.textContent = day;

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

loadQuotes().then(quotes => {
  renderCalendar(currentDate, quotes);

  let startX = 0;

  document.addEventListener("touchstart", e => {
    startX = e.touches[0].clientX;
  });

  document.addEventListener("touchend", e => {

    let endX = e.changedTouches[0].clientX;
    let diff = startX - endX;

    if (Math.abs(diff) > 50) {

      if (diff > 0) {
        currentDate.setMonth(currentDate.getMonth() + 1);
      } else {
        currentDate.setMonth(currentDate.getMonth() - 1);
      }

      renderCalendar(currentDate, quotes);
    }
  });
});
