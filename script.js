const backendIPAddress = "127.0.0.1:3000";

console.log();

const calendar = document.querySelector(".calendar");
const date = document.querySelector(".date");
const daysContainer = document.querySelector(".days");
const prev = document.querySelector(".prev");
const next = document.querySelector(".next");
const eventsContainer = document.querySelector(".events");
const addEventSubmit = document.querySelector(".add-event-btn");
const addEventBtn = document.querySelector(".add-event");
const addEventContainer = document.querySelector(".add-event-wrapper");
const addEventCloseBtn = document.querySelector(".close");
const addEventTitle = document.querySelector(".event-name");
const addEventWrapper = document.querySelector(".add-event-wrapper ");
const progressbar = document.querySelector('.progress');

const eventDay = document.querySelector(".event-day");
const eventDate = document.querySelector(".event-date");

let today = new Date();
let activeDay;
let month = today.getMonth();
let year = today.getFullYear();
let eventsArr = [];
let allCvId = [];
let progress = 0;
let allprogress = 0;
let itemsData;
let allDB_Id = [];

let cvidToName = new Map();
let cvidToImg = new Map();


// const eventsArr = [
//     {
//         day: 20,
//         month: 4,
//         year: 2023,
//         events: [
//             {
//                 title: "Event 1 lorem ipsun dolar sit genfa tersd dsad ",
//                 time: "10:00 AM",
//             },
//             {
//                 title: "Event 2",
//                 time: "11:00 AM",
//             },
//         ],
//     },
// ];

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
//const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function initCalendar() {

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const prevLastDay = new Date(year, month, 0);
    const prevDays = prevLastDay.getDate();
    const lastDate = lastDay.getDate();
    const day = firstDay.getDay();
    const nextDays = 7 - lastDay.getDay() - 1;

    date.innerHTML = months[month] + " " + year;

    let days = "";
    for (let x = day; x > 0; x--) {
        days += `<div class="day prev-date">${prevDays - x + 1}</div>`;
    }

    for (let i = 1; i <= lastDate; i++) {
        let event = false;
        eventsArr.forEach((eventObj) => {
            if (eventObj.day === i && eventObj.month === month + 1 && eventObj.year === year) {
                event = true;
            }
        });

        if (i === today.getDate() && year === today.getFullYear() && month === today.getMonth()) {
            activeDay = i;
            getActiveDay(i);
            updateEvents(i);
            //activeDay.classList.add("active");
            if (event) {
                days += `<div class="day today active event">${i}</div>`;
            } else {
                days += `<div class="day today active">${i}</div>`;
            }
            //days += `<div class="day today">${i}</div>`;
        } else {
            //days += `<div class="day">${i}</div>`;
            if (event) {
                days += `<div class="day event">${i}</div>`;
            } else {
                days += `<div class="day">${i}</div>`;
            }
        }
    }

    for (let j = 1; j <= nextDays; j++) {
        days += `<div class="day next-date">${j}</div>`
    }
    daysContainer.innerHTML = days;
    addListner();
}

const authorizeApplication = () => {
  window.location.href = `http://${backendIPAddress}/courseville/auth_app`;
};

const getGroupNumber = () => {
  return 8;
};

const getUserProfile = async () => {
  const options = {
    method: "GET",
    credentials: "include",
  };
  await fetch(
    `http://${backendIPAddress}/courseville/get_profile_info`,
    options
  )
    .then((response) => response.json())
    .then((data) => {
      data = data.data.student;
      //cvidData = data;
      //console.log(cvidData);
      // return data;
      allcvId = data.length;
      for(let i = 0; i < data.length; ++i){
        //allCvId.push(data[i].cv_cid);
        getCourseInfo(data[i].cv_cid);
      }

      for(let i = 0; i < allCvId.length; ++i){
        getAllAssignment(allCvId[i]);
      }
    })
    .catch((error) => console.error(error));
};

const getCourse = async () => {
    const options = {
      method: "GET",
      credentials: "include",
    };
    await fetch(
      `http://${backendIPAddress}/courseville/get_courses`,
      options
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      })
      .catch((error) => console.error(error));
};

const getCourseInfo = async (cv_cid) => {
    const options = {
      method: "GET",
      credentials: "include",
    };
    await fetch(`http://${backendIPAddress}/courseville/get_course_info/${cv_cid}`, options)
      .then((response) => response.json())
      .then((data) => {
        cvidData.set(cv_cid, data.data);
        currcvId += 1;

        if(allcvId == currcvId) readyToUseData = true;
        //console.log("found Info", cv_cid, data.data);
        //console.log("found", cv_cid, data.data.title);
        //cvidToName.set(cv_cid, data.data.title);
        //cvidToImg.set(cv_cid, data.data.course_icon);
      })
      .catch((error) => console.error(error));
};

const getAllAssignment = async (cv_cid) => {

    const options = {
        method: "GET",
        credentials: "include",
      };
      await fetch(
        `http://${backendIPAddress}/courseville/get_course_assignments/${cv_cid}`,
        options
      )
        .then((response) => response.json())
        .then((data) => {
          Alldata = data.data;
          //console.log(Alldata);
          allprogress += Alldata.length;
          for(let i = 0; i < Alldata.length; ++i){
            getAssignmentInfo(Alldata[i], cv_cid);
          }
          
        })
        .catch((error) => console.error(error));
};

const getAssignmentInfo = async (assignmentsData, cv_cid) => {
    let itemid = assignmentsData.itemid;
    const options = {
      method: "GET",
      credentials: "include",
    };
    await fetch(
      `http://${backendIPAddress}/courseville/get_assignment_detail/${itemid}`,
      options
    )
      .then((response) => response.json())
      .then((data) => {
        addAssignmentToCal(data.data, cv_cid);
        progress++;

        progressbar.style.width = Math.round(progress/allprogress * 100) + "%";

        if(Math.round(progress/allprogress * 100) >= 100){
            setTimeout(function(){
                progressbar.style.height = "0%";
            },1000);
        }

      })
      .catch((error) => console.error(error));
};

function addAssignmentToCal(assignmentData, cv_cid){
    const eventTitle = assignmentData.title;
    if (eventTitle === "") {
        return;
    }

    const newEvent = {
        title: "("+ cvidToName.get(cv_cid) + ") :\n" + eventTitle,
        icon: cvidToImg.get(cv_cid)
    };

    dueDate = assignmentData.duedate;
    dueDate = dueDate.split('-');
    let day = Number(dueDate[2]);
    let month = Number(dueDate[1]) - 1;
    let year = Number(dueDate[0]);
    
    //console.log(newEvent);
    //console.log(day, month, year);
    
    let eventAdded = false;

    if (eventsArr.length > 0) {
        eventsArr.forEach((item) => {
            if (item.day === day && item.month === month + 1 && item.year === year) {
                item.events.push(newEvent);
                eventAdded = true;
            }
        });
    }

    if (!eventAdded) {
        eventsArr.push({
            day: day,
            month: month + 1,
            year: year,
            events: [newEvent],
        });
    }

    addEventWrapper.classList.remove("active");

    addEventTitle.value = "";
    updateEvents(activeDay);

    const activeDayElem = document.querySelector(".day.active");
    if (!activeDayElem.classList.contains("event")) {
        activeDayElem.classList.add("event");
    }
    return assignmentData;
}

function prevMonth() {
    month--;
    if (month < 0) {
        month = 11;
        year--;
    }
    initCalendar();
}

function nextMonth() {
    month++;
    if (month > 11) {
        month = 0;
        year++;
    }
    initCalendar();
}

addEventBtn.addEventListener("click", () => {
    addEventWrapper.classList.toggle("active");
});

addEventCloseBtn.addEventListener("click", () => {
    addEventWrapper.classList.remove("active");
});

document.addEventListener("click", (e) => {
    if (e.target !== addEventBtn && !addEventContainer.contains(e.target)) {
        addEventWrapper.classList.remove("active");
    }
});

addEventTitle.addEventListener("input", (e) => {
    addEventTitle.value = addEventTitle.value.slice(0, 50);
});

prev.addEventListener("click", prevMonth);
next.addEventListener("click", nextMonth);

function addListner() {
    const days = document.querySelectorAll(".day");
    days.forEach((day) => {
        day.addEventListener("click", (e) => {
            activeDay = e.target.innerHTML;
            getActiveDay(e.target.innerHTML);
            updateEvents(e.target.innerHTML);

            days.forEach((day) => {
                day.classList.remove("active");
            });

            if (e.target.classList.contains("prev-date")) {
                prevMonth();

                setTimeout(() => {
                    const days = document.querySelectorAll(".day");

                    days.forEach((day) => {
                        if (!day.classList.contains("prev-date") && day.innerHTML === e.target.innerHTML) {
                            day.classList.add("active");
                        }
                    });
                }, 100);
            } else if (e.target.classList.contains("next-date")) {
                nextMonth();

                setTimeout(() => {
                    const days = document.querySelectorAll(".day");

                    days.forEach((day) => {
                        if (!day.classList.contains("next-date") && day.innerHTML === e.target.innerHTML) {
                            day.classList.add("active");
                        }
                    });
                }, 100);
            } else {
                e.target.classList.add("active");
            }
        });
    });

}

function getActiveDay(date) {
    const day = new Date(year, month, date);
    const dayName = day.toString().split(" ")[0];
    eventDay.innerHTML = dayName;
    eventDate.innerHTML = date + " " + months[month] + " " + year;
    
}

function updateEvents(date) {
    let events = "";
    // console.log(date, month, year);
    // console.log(eventsArr);
    eventsArr.forEach((event) => {
        if (date == event.day && month + 1 == event.month && year == event.year) {
            event.events.forEach((event) => {
                if(event.icon == null) event.icon = 'https://cdn-icons-png.flaticon.com/512/4552/4552718.png';

                events += `
                <div class="event">
                    <div class="title">
                        <img src=${event.icon} height="50" width="50"></img>
                        <h3 class="event-title">${event.title}</h3>
                    </div>
                </div>
                `;
                
            });
        }
    });

    if (events === "") {
        events = `
        <div class="no-event">
            <h3>No Events</h3>
        </div>
        `;
    }

    eventsContainer.innerHTML = events;
}

addEventSubmit.addEventListener("click", () => {
    const eventTitle = addEventTitle.value;

    // if (eventTitle === "") {
    //     alert("Please fill event name");
    //     return;
    // }

    // const newEvent = {
    //     title: eventTitle
    // };

    // console.log(newEvent);
    // console.log(activeDay);

    // let eventAdded = false;

    // if (eventsArr.length > 0) {
    //     eventsArr.forEach((item) => {
    //         if (item.day === activeDay && item.month === month + 1 && item.year === year) {
    //             item.events.push(newEvent);
    //             eventAdded = true;
    //         }
    //     });
    // }

    // if (!eventAdded) {
    //     eventsArr.push({
    //         day: activeDay,
    //         month: month + 1,
    //         year: year,
    //         events: [newEvent],
    //     });
    // }

    // console.log(eventsArr);
    // addEventWrapper.classList.remove("active");

    // addEventTitle.value = "";
    addItem(eventTitle);
    updateEvents(activeDay);
    

    // const activeDayElem = document.querySelector(".day.active");
    // if (!activeDayElem.classList.contains("event")) {
    //     activeDayElem.classList.add("event");
    // }
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
              console.log(item, eventTitle);
              if (item.title == eventTitle) {
                event.events.splice(index, 1);
                deleteItem(item.id);
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

// Data-Base Section
function addDBID(DB_Id){
    for(let i = 0; i < allDB_Id.length; ++i){
        if(allDB_Id[i] == DB_Id){
            return;   
        }
    }
    allDB_Id.push(DB_Id);
}

function checkExited(DB_Id){
    for(let i = 0; i < allDB_Id.length; ++i){
        if(allDB_Id[i] == DB_Id){
            return true;   
        }
    }
    return false;
}

const getItemsFromDB = async () => {
    const options = {
      method: "GET",
      credentials: "include",
    };
    await fetch(`http://${backendIPAddress}/items`, options)
      .then((response) => response.json())
      .then((data) => {
        itemsData = data;
        for(let i = 0; i < itemsData.length; ++i){
            if(checkExited(itemsData[i].id)) continue;

            addItemToCal(itemsData[i]);
            addDBID(itemsData[i].id);
        }
      })
      .catch((error) => console.error(error));
};

const addItem = async (title) => {

    const itemToAdd = {
                day: activeDay,
                month: month,
                year: year,
                events: title
            }
    
    const options = {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(itemToAdd)
    };
    
    await fetch(`http://${backendIPAddress}/items`, options)
      .then((response)=>{
        console.log("Item Added");
      })
      .catch((error)=>console.error(error));
  
    await getItemsFromDB();
    //showItemsInTable(itemsData);
  
};

const deleteItem = async (id) => {
    const options = {
      method: "DELETE",
      credentials: "include"
    };
    await fetch(`http://${backendIPAddress}/items/${id}`, options)
      .then((response)=>{
        console.log("Item deleted", response);
      })
      .catch((error)=>console.error(error));
};
  
function addItemToCal(data){
    const eventTitle = data.events;
    if (eventTitle === "" || checkExited(data.id)) {
        return;
    }

    const newEvent = {
        title: eventTitle,
        id : data.id
    };

    let day = data.day;
    let month = data.month;
    let year = data.year;
    
    //console.log(day, month, year);
    
    let eventAdded = false;

    if (eventsArr.length > 0) {
        eventsArr.forEach((item) => {
            if (item.day === day && item.month === month + 1 && item.year === year) {
                item.events.push(newEvent);
                eventAdded = true;
            }
        });
    }

    if (!eventAdded) {
        eventsArr.push({
            day: day,
            month: month + 1,
            year: year,
            events: [newEvent],
        });
    }

    //console.log(eventsArr);
    addEventWrapper.classList.remove("active");

    addEventTitle.value = "";
    updateEvents(activeDay);

    const activeDayElem = document.querySelector(".day.active");
    if (!activeDayElem.classList.contains("event")) {
        activeDayElem.classList.add("event");
    }
}

// Get data from my coursevill section

let cvidData = new Map();
let allcvId = 0;
let currcvId = 0;
let readyToUseData = false;
function getAllCvidInfomation(){
  getUserProfile();
}

console.log(getUserProfile());
getUserProfile();
initCalendar();
getItemsFromDB();

getAllCvidInfomation();