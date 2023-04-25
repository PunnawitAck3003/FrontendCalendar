const backendIPAddress = "127.0.0.1:3000";

const calendar = document.querySelector(".calendar"),
  date = document.querySelector(".date"),
  daysContainer = document.querySelector(".days"),
  prev = document.querySelector(".prev"),
  next = document.querySelector(".next"),
  eventDay = document.querySelector(".event-day"),
  eventDate = document.querySelector(".event-date"),
  eventsContainer = document.querySelector(".events"),
  addEventBtn = document.querySelector(".add-event"),
  addEventWrapper = document.querySelector(".add-event-wrapper"),
  addEventCloseBtn = document.querySelector(".event-close"),
  addEventTitle = document.querySelector(".event-name"),
  addEventSubmit = document.querySelector(".add-event-btn"),
  openToDoListBtn = document.querySelector(".to-do-button"),
  toDoListOverlay = document.querySelector(".to-do-list-overlay"),
  toDoListCloseBtn = document.querySelector(".to-do-close");
  monthSelect = document.querySelector(".month-select-box")
  monthSelectBtn = document.querySelector(".month-select-submit")

const listMonth = document.querySelectorAll(".list-month");

let today = new Date();
let activeDay;
let month = today.getMonth();
let year = today.getFullYear();

const months = [
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
  "December",
];

const monthsAbbrev = {
  "Jan":0,"Feb":1,"Mar":2,"Apr":3,"May":4,"Jun":5,
  "Jul":6,"Aug":7,"Sep":8,"Oct":9,"Nov":10,"Dec":11,
}
// const eventsArr = [
//   {
//     day: 13,
//     month: 11,
//     year: 2022,
//     events: [
//       {
//         title: "Event 1 lorem ipsun dolar sit genfa tersd dsad ",
//         time: "10:00 AM",
//       },
//       {
//         title: "Event 2",
//         time: "11:00 AM",
//       },
//     ],
//   },
// ];

const eventsArr = [];
getEvents();

//function to add days in days with class day and prev-date next-date on previous month and next month days and active on today
function initCalendar() {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const lastDate = lastDay.getDate();
  const day = firstDay.getDay();
  const prevDays = day - 1;
  const nextDays = 42-(prevDays+lastDate+1)

  date.innerHTML = months[month] + " " + year;

  let days = "";

  for (let x = prevDays *-1 ; x <= 0; x++) {
    days += `<div class="day prev-date">${new Date(year, month, x).getDate()}</div>`;
  }

  for (let i = 1; i <= lastDate; i++) {
    //check if event is present on that day
    let event = false;
    eventsArr.forEach((eventObj) => {
      if (
        eventObj.day === i &&
        eventObj.month === month + 1 &&
        eventObj.year === year
      ) {
        event = true;
      }
    });
    if (
      i === new Date().getDate() &&
      year === new Date().getFullYear() &&
      month === new Date().getMonth()
    ) {
      activeDay = i;
      getActiveDay(i);
      updateEvents(i);
      if (event) {
        days += `<div class="day today active event">${i}</div>`;
      } else {
        days += `<div class="day today active">${i}</div>`;
      }
    } else {
      if (event) {
        days += `<div class="day event">${i}</div>`;
      } else {
        days += `<div class="day ">${i}</div>`;
      }
    }
  }

  for (let j = 1; j <= nextDays; j++) {
    days += `<div class="day next-date">${j}</div>`;
  }
  daysContainer.innerHTML = days;
  addListner();
}


function changeMonthCalendar() {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const lastDate = lastDay.getDate();
  const day = firstDay.getDay();
  const prevDays = day - 1;
  const nextDays = 42-(prevDays+lastDate+1)

  date.innerHTML = months[month] + " " + year;

  let days = "";

  for (let x = prevDays *-1 ; x <= 0; x++) {
    days += `<div class="day prev-date">${new Date(year, month, x).getDate()}</div>`;
  }

  for (let i = 1; i <= lastDate; i++) {
    //check if event is present on that day
    let event = false;
    eventsArr.forEach((eventObj) => {
      if (
        eventObj.day === i &&
        eventObj.month === month + 1 &&
        eventObj.year === year
      ) {
        event = true;
      }
    });
    if (
      i === new Date().getDate() &&
      year === new Date().getFullYear() &&
      month === new Date().getMonth()
    ) {
      if (event) {
        days += `<div class="day today event">${i}</div>`;
      } else {
        days += `<div class="day today">${i}</div>`;
      }
    } else {
      if (event) {
        days += `<div class="day event">${i}</div>`;
      } else {
        days += `<div class="day ">${i}</div>`;
      }
    }
  }

  for (let j = 1; j <= nextDays; j++) {
    days += `<div class="day next-date">${j}</div>`;
  }
  daysContainer.innerHTML = days;

  addListner();
}

//function to add month and year on prev and next button
function prevMonth() {
  month--;
  if (month < 0) {
    month = 11;
    year--;
    }
    if(year < 1970){
      alert("You cannot go further back.")
      year = 1970;
      month = 0;
      return;
  }
  changeMonthCalendar();
  checkForActive();
}
function nextMonth() {
  month++;
  if (month > 11) {
    month = 0;
    year++;
  }
  changeMonthCalendar();
  checkForActive();
}

prev.addEventListener("click", prevMonth);
next.addEventListener("click", nextMonth);

initCalendar();

//function to add active to day tracing back from event day and event date
function checkForActive() {
  const displayDay =  eventDate.innerHTML.split(" ")[0];
  const displayMonth = eventDate.innerHTML.split(" ")[1];
  const displayYear = eventDate.innerHTML.split(" ")[2];
  const days = document.querySelectorAll(".day")

  if (year.toString() === displayYear && months[month] === displayMonth)
  {days.forEach((day) => {
      day.classList.remove("active");
      if (day.innerHTML === displayDay || '0'+day.innerHTML === displayDay){
        if (!day.classList.contains("prev-date") && !day.classList.contains("next-date")){
          day.classList.add("active");
        }
      }
  })
  }
}

//function to add active on day
function addListner() {
  const days = document.querySelectorAll(".day");
  days.forEach((day) => {
    day.addEventListener("click", (e) => {
      //remove active
      days.forEach((day) => {
        day.classList.remove("active");
      });
      //if clicked prev-date or next-date switch to that month
      if (e.target.classList.contains("prev-date")) {
        prevMonth();
        //add active to clicked day afte month is change
        setTimeout(() => {
          //add active where no prev-date or next-date
          const days = document.querySelectorAll(".day");
          days.forEach((day) => {
            if (
              !day.classList.contains("prev-date") &&
              day.innerHTML === e.target.innerHTML
            ) {
              getActiveDay(day.innerHTML);
              updateEvents(Number(day.innerHTML));
              activeDay = Number(day.innerHTML);
              day.classList.add("active");
              checkForActive();
            }
          });
        }, 100);
      } else if (e.target.classList.contains("next-date")) {
        nextMonth();
        //add active to clicked day afte month is changed
        setTimeout(() => {
          const days = document.querySelectorAll(".day");
          days.forEach((day) => {
            if (
              !day.classList.contains("next-date") &&
              day.innerHTML === e.target.innerHTML
            ) {
              getActiveDay(day.innerHTML);
              updateEvents(Number(day.innerHTML));
              activeDay = Number(day.innerHTML);
              day.classList.add("active");
              checkForActive();
            }
          });
        }, 100);
      } else {
        getActiveDay(e.target.innerHTML);
        updateEvents(Number(e.target.innerHTML));
        activeDay = Number(e.target.innerHTML);
        e.target.classList.add("active");
      }
    });
  });
}

//function to open and close up to-do list overlay
openToDoListBtn.addEventListener("click", () => {
  toDoListOverlay.style.display = "flex";
});
toDoListCloseBtn.addEventListener("click", () => {
  toDoListOverlay.style.display = "none";
}
)

//function to open up month selection
date.addEventListener("click", () => {
  monthSelect.classList.add("active");
});

document.addEventListener("click", (e) => {
  if (e.target !== monthSelectBtn && !monthSelect.contains(e.target) && e.target !== date) {
    monthSelect.classList.remove("active");
  }
});

function addSelected(){
  listMonth.forEach((listedMonth) =>  {
    listedMonth.addEventListener("click", (e) =>{
      if(listedMonth.classList.contains("selected")){
        listedMonth.classList.remove("selected");
        return;
      }
      listMonth.forEach((listedMonth) => {
        listedMonth.classList.remove("selected");
      });
    e.target.classList.add("selected");
    });
  });
}

addSelected();

//function to navigate to selected month and year
monthSelectBtn.addEventListener("click",() =>{
  let yearValue = document.querySelector(".year-input").value;
  if (yearValue === "" || Number(yearValue)<1970){
    alert("Please fill in a valid year.")
    return;
  }
  listMonth.forEach((listedMonth) => {
    if(listedMonth.classList.contains("selected")){
      month = monthsAbbrev[listedMonth.innerHTML];
      year = Number(yearValue);
      changeMonthCalendar();
      checkForActive();
      listedMonth.classList.remove("selected");
      document.querySelector(".year-input").value = ""
      return;
    } 
  });
});


//function get active day day name and date and update eventday eventdate
function getActiveDay(date) {
  const day = new Date(year, month, date);
  const dayName = day.toString().split(" ")[0];
  eventDay.innerHTML = dayName;
  eventDate.innerHTML = date + " " + months[month] + " " + year;
}

//function update events when a day is active
function updateEvents(date) {
  let events = "";
  eventsArr.forEach((event) => {
    if (
      date === event.day &&
      month + 1 === event.month &&
      year === event.year
    ) {
      event.events.forEach((event) => {
        events += `<div class="event">
            <div class="title">
              <i class="fas fa-circle"></i>
              <h3 class="event-title">${event.title}</h3>
            </div>
        </div>`;
      });
    }
  });
  if (events === "") {
    events = `<div class="no-event">
            <h3>No Events</h3>
        </div>`;
  }
  eventsContainer.innerHTML = events;
  saveEvents();
}

//function to add event
addEventBtn.addEventListener("click", () => {
  addEventWrapper.classList.add("active");
});

addEventCloseBtn.addEventListener("click", () => {
  addEventWrapper.classList.remove("active");
});

document.addEventListener("click", (e) => {
  if (e.target !== addEventBtn && !addEventWrapper.contains(e.target)) {
    addEventWrapper.classList.remove("active");
  }
});

//allow 50 chars in eventtitle
addEventTitle.addEventListener("input", (e) => {
  addEventTitle.value = addEventTitle.value.slice(0, 60);
});
//function to add event to eventsArr
addEventSubmit.addEventListener("click", () => {
  const eventTitle = addEventTitle.value;
  if (eventTitle === "") {
    alert("Please fill all the fields");
    return;
  }
  //check if event is already added
  let eventExist = false;
  eventsArr.forEach((event) => {
    if (
      event.day === activeDay &&
      event.month === month + 1 &&
      event.year === year
    ) {
      event.events.forEach((event) => {
        if (event.title === eventTitle) {
          eventExist = true;
        }
      });
    }
  });
  if (eventExist) {
    alert("Event already added");
    return;
  }
  const newEvent = {
    title: eventTitle,
  };
  console.log(newEvent);
  console.log(activeDay);
  let eventAdded = false;
  if (eventsArr.length > 0) {
    eventsArr.forEach((item) => {
      if (
        item.day === activeDay &&
        item.month === month + 1 &&
        item.year === year
      ) {
        item.events.push(newEvent);
        eventAdded = true;
      }
    });
  }

  if (!eventAdded) {
    eventsArr.push({
      day: activeDay,
      month: month + 1,
      year: year,
      events: [newEvent],
    });
  }

  console.log(eventsArr);
  addEventWrapper.classList.remove("active");
  addEventTitle.value = "";
  updateEvents(activeDay);
  //select active day and add event class if not added
  const activeDayEl = document.querySelector(".day.active");
  if (!activeDayEl.classList.contains("event")) {
    activeDayEl.classList.add("event");
  }
});

//function to delete event when clicked on event
eventsContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains("event")) {
    if (confirm("Are you sure you want to delete this event?")) {
      const eventTitle = e.target.children[0].children[1].innerHTML;
      eventsArr.forEach((event) => {
        if (
          event.day === activeDay &&
          event.month === month + 1 &&
          event.year === year
        ) {
          event.events.forEach((item, index) => {
            if (item.title === eventTitle) {
              event.events.splice(index, 1);
            }
          });
          //if no events left in a day then remove that day from eventsArr
          if (event.events.length === 0) {
            eventsArr.splice(eventsArr.indexOf(event), 1);
            //remove event class from day
            const activeDayEl = document.querySelector(".day.active");
            if (activeDayEl.classList.contains("event")) {
              activeDayEl.classList.remove("event");
            }
          }
        }
      });
      updateEvents(activeDay);
    }
  }
});

//function to save events in local storage
function saveEvents() {
  localStorage.setItem("events", JSON.stringify(eventsArr));
}

//function to get events from local storage
function getEvents() {
  //check if events are already saved in local storage then return event else nothing
  if (localStorage.getItem("events") === null) {
    return;
  }
  eventsArr.push(...JSON.parse(localStorage.getItem("events")));
}