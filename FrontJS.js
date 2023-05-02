const backendIPAddress = "3.222.110.126:3000";

const calendar = document.querySelector(".calendar"),
    logoutBtn = document.querySelector(".log-out-button"),
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
    toDoListCloseBtn = document.querySelector(".to-do-close-button"),
    monthSelect = document.querySelector(".month-select-box"),
    monthSelectBtn = document.querySelector(".month-select-submit"),
    eventChoiceBtn = document.querySelector(".add-event-choice-button"),
    eventChoiceBox = document.querySelector(".add-event-choice-box");

const listMonth = document.querySelectorAll(".list-month");

let selectTask;
let dragOverDay;

let today = new Date();
let activeDay;
let month = today.getMonth();
let year = today.getFullYear();
let currentSemester;
let currentAcademicYear;

let CvidToData = new Map();
let nameToCvide = new Map();
let allCvId = [];
let progress = 0;
let allprogress = 0;
let progressCourse = 0;
let allProgressCourse = 0;
let userID;

function getCurrAcademicYear() {
    if (month >= 7 && month <= 11) {
        currentSemester = 1;
        currentAcademicYear = year;
    } else if (0 <= month <= 4) {
        currentSemester = 2;
        currentAcademicYear = year - 1;
    } else if (5 <= month <= 6) {
        currentSemester = 3;
        currentAcademicYear = year - 1;
    }
}
getCurrAcademicYear();


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
    "Jan": 0, "Feb": 1, "Mar": 2, "Apr": 3, "May": 4, "Jun": 5,
    "Jul": 6, "Aug": 7, "Sep": 8, "Oct": 9, "Nov": 10, "Dec": 11,
}

const eventsArr = [];
//getEvents();
console.log(eventsArr);
const authorizeApplication = () => {
    window.location.href = `http://${backendIPAddress}/courseville/auth_app`;
};
const logout = async () => {
    window.location.href = `http://${backendIPAddress}/courseville/logout`;
};
//function to add days in days with class day and prev-date next-date on previous month and next month days and active on today
function initCalendar() {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const lastDate = lastDay.getDate();
    const day = firstDay.getDay();
    const prevDays = day - 1;
    const nextDays = 42 - (prevDays + lastDate + 1)

    date.innerHTML = months[month] + " " + year;

    let days = "";

    for (let x = prevDays * -1; x <= 0; x++) {
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
                days += `<div class="day today active event">${i}<span class="event-marker"></span></div>`;
            } else {
                days += `<div class="day today active">${i}</div>`;
            }
        } else {
            if (event) {
                days += `<div class="day event">${i}<span class="event-marker"></span></div>`;
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
    displayFire(month);

}

function changeMonthCalendar() {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const lastDate = lastDay.getDate();
    const day = firstDay.getDay();
    const prevDays = day - 1;
    const nextDays = 42 - (prevDays + lastDate + 1)

    date.innerHTML = months[month] + " " + year;

    let days = "";

    for (let x = prevDays * -1; x <= 0; x++) {
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
    displayFire(month);

}

//function to add month and year on prev and next button
function prevMonth() {
    month--;
    if (month < 0) {
        month = 11;
        year--;
    }
    if (year < 1970) {
        alert("You cannot go further back.")
        year = 1970;
        month = 0;
        return;
    }
    changeMonthCalendar();
    checkForActive();
    updateMarker();
}
function nextMonth() {
    month++;
    if (month > 11) {
        month = 0;
        year++;
    }
    changeMonthCalendar();
    checkForActive();
    updateMarker();
}

initCalendar();

//function to add active to day tracing back from event day and event date
function checkForActive() {
    const displayDay = eventDate.innerHTML.split(" ")[0];
    const displayMonth = eventDate.innerHTML.split(" ")[1];
    const displayYear = eventDate.innerHTML.split(" ")[2];
    const days = document.querySelectorAll(".day")

    if (year.toString() === displayYear && months[month] === displayMonth) {
        days.forEach((day) => {
            day.classList.remove("active");
            if (day.innerHTML === displayDay || '0' + day.innerHTML === displayDay) {
                if (!day.classList.contains("prev-date") && !day.classList.contains("next-date")) {
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
                day.classList.add("active");
            }
        });
    });

    days.forEach((day) => {
        day.addEventListener("dragover", (e) => {
            e.preventDefault();
            dragOverDay = day.innerHTML;
            day.classList.add('dragover');
        });
        day.addEventListener("dragleave", (e) => {
            e.preventDefault();
            day.classList.remove('dragover');
        });
        day.addEventListener("drop", (e) => {
            day.classList.remove('dragover');
            e.preventDefault();

            if(day.classList.contains("next-date") || day.classList.contains("next-date")){
                alert("Please drop on a valid date");
                return;
            }

            const eventTitle = selectTask.getAttribute("text");
            const cvid = selectTask.value;
            console.log(eventTitle, cvid, selectTask);

            data = CvidToData.get(cvid);
            let newEvent;

            if(data == null){
                newEvent = {
                    subject: "To-do",
                    title: eventTitle,
                    icon: "",
                    year: '2022',
                    semester: '2',
                };
            }else{
                newEvent = {
                    subject: data.title,
                    title: eventTitle,
                    icon: data.course_icon,
                    year: '2022',
                    semester: '2',
                };
            }

            console.log(newEvent);

            addItemToDB(newEvent, dragOverDay);
            updateEvents(activeDay);
            selectTask.children[1].onclick();
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

//function to select month for navigation
function addSelected() {
    listMonth.forEach((listedMonth) => {
        listedMonth.addEventListener("click", (e) => {
            if (listedMonth.classList.contains("selected")) {
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
monthSelectBtn.addEventListener("click", () => {
    let yearValue = document.querySelector(".year-input").value;
    if (yearValue === "" || Number(yearValue) < 1970) {
        alert("Please fill in a valid year.")
        return;
    }
    listMonth.forEach((listedMonth) => {
        if (listedMonth.classList.contains("selected")) {
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
                if (event.icon === null || event.icon == ' ') event.icon = "https://cdn-icons-png.flaticon.com/512/4552/4552718.png"

                let subject = event.subject;
                if (subject == null) subject = "To-do"

                events += `<div class="event">
            <div class="title">
              <img src=${event.icon} height="50" width="50"></img>
              <div class="event-title" value=$()>(${subject}) ${event.title}</div>
            </div>
        </div>`;
            });
        }
    });
    if (events === "") {
        events = `<div class="no-event">
            <div>No Events</div>
        </div>`;
        eventsContainer.style.overflowY = "hidden";
    } else {
        eventsContainer.style.overflowY = "auto";
    }
    eventsContainer.innerHTML = events;
    updateMarker();
    //saveEvents();
}

function updateMarker(){
    const days = document.querySelectorAll(".day");
    days.forEach((day) => {
        let event = false;
        eventsArr.forEach((eventObj) => {
            if (
                eventObj.day === Number(day.innerHTML) &&
                eventObj.month === month + 1 &&
                eventObj.year === year
            ) {
                event = true;
            }
        });

        if(event && !(day.classList.contains("prev-date") || day.classList.contains("next-date"))){
            day.classList.add("marker");
            //day.innerHTML = day.innerHTML + "<span class=\"event-marker\"></span>";
        }
    });
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
        eventChoiceBox.classList.remove("active");
    }
});

eventChoiceBtn.addEventListener("click", () => {
    eventChoiceBox.classList.add("active");
})

function getParamsFromChoiceBtn() {
    let subjCVId = eventChoiceBtn.value;
    let data = CvidToData.get(Number(subjCVId));

    if (data == null) {
        return {
            icon: " ",
            year: currentAcademicYear,
            semester: currentSemester
        }
    }

    return {
        icon: data.course_icon,
        year: data.year,
        semester: data.semester,
        subject: data.title
    };
}

//allow 50 chars in eventtitle
addEventTitle.addEventListener("input", (e) => {
    addEventTitle.value = addEventTitle.value.slice(0, 60);
});
//function to add event to eventsArr
addEventSubmit.addEventListener("click", () => {
    const eventTitle = addEventTitle.value;

    let paramsChoice = getParamsFromChoiceBtn();
    console.log(paramsChoice);

    const newEvent = {
        title: eventTitle,
        icon: paramsChoice.icon,
        year: paramsChoice.year,
        semester: paramsChoice.semester,
        subject: paramsChoice.subject
    };

    console.log(newEvent);

    addItemToDB(newEvent);
    updateEvents(activeDay);
});

//function to delete event when clicked on event
eventsContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("event")) {
        if (confirm("Are you sure you want to delete this event?")) {
            let eventTitle = e.target.children[0].children[1].textContent;
            eventsArr.forEach((event) => {
                if (
                    event.day === activeDay &&
                    event.month === month + 1 &&
                    event.year === year
                ) {
                    event.events.forEach((item, index) => {

                        let subject = item.subject;
                        console.log(subject);
                        if (subject == null) subject = "To-do"

                        const title = item.title

                        const subAndTitle = "(" + subject + ") " + title;
                        //console.log(subAndTitle, eventTitle);

                        if (subAndTitle === eventTitle && item.type == "Assignment") {
                            alert("You can't delete assignment");
                            return;
                        }
                        console.log(eventTitle);
                        console.log(subAndTitle);
                        if (subAndTitle === eventTitle) {
                            console.log(item);
                            event.events.splice(index, 1);
                            deleteItem(item.id);
                            return;
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
                        if (activeDayEl.classList.contains("marker")) {
                            activeDayEl.classList.remove("marker");
                        }
                    }
                }
            });
            updateEvents(activeDay);
        }
    }
});

//function to save events in local storage
// function saveEvents() {
//   localStorage.setItem("events", JSON.stringify(eventsArr));
// }

//function to get events from local storage
// function getEvents() {
//   //check if events are already saved in local storage then return event else nothing
//   if (localStorage.getItem("events") === null) {
//     return;
//   }
//   eventsArr.push(...JSON.parse(localStorage.getItem("events")));
// }

const inputBox = document.querySelector(".inputField input");
const addBtn = document.querySelector(".to-do-input-button");
const todoList = document.querySelector(".todoList");
const deleteAllBtn = document.querySelector(".to-do-clear-button");
const todoCourseBtn = document.querySelector(".to-do-course-button");
// onkeyup event
inputBox.onkeyup = () => {
    let userEnteredValue = inputBox.value; //getting user entered value
    if (userEnteredValue.trim() != 0) { //if the user value isn't only spaces
        addBtn.classList.add("active"); //active the add button
        todoCourseBtn.classList.add("active"); //active the course button
    } else {
        addBtn.classList.remove("active"); //unactive the add button
        todoCourseBtn.classList.remove("active"); //unactive the course button
    }
}
//showTasks(); //calling showTask function
addBtn.onclick = () => { //when user click on plus icon button
    // console.log("test");
    const index = todoCourseBtn.selectedIndex;
    const selectCourse = todoCourseBtn.children[index];

    let userEnteredValue = [inputBox.value, selectCourse.value]; //getting input field value
    let getLocalStorageData = localStorage.getItem("New Todo"); //getting localstorage
    if (getLocalStorageData == null) { //if localstorage has no data
        listArray = []; //create a blank array
    } else {
        listArray = JSON.parse(getLocalStorageData);  //transforming json string into a js object
    }
    listArray.push(userEnteredValue); //pushing or adding new value in array
    localStorage.setItem("New Todo", JSON.stringify(listArray)); //transforming js object into a json string
    todoCourseBtn.selectedIndex = 0; //resetting the select option box to default
    showTasks(); //calling showTask function
    addBtn.classList.remove("active"); //unactive the add button once the task added
}
document.body.addEventListener('keypress', (e) => {
    let userData = inputBox.value;
    if (e.key == 'Enter' && userData.trim() != 0) {

        let userData = inputBox.value;
        let getLocalStorage = localStorage.getItem("New Todo");
        if (getLocalStorage == null) {
            listArr = [];
        } else {
            listArr = JSON.parse(getLocalStorage);
        }
        listArr.push(userData);
        localStorage.setItem("New Todo", JSON.stringify(listArr));
        showTasks();
        addBtn.classList.remove("active");
    }
});
function showTasks() {
    let getLocalStorageData = localStorage.getItem("New Todo");
    if (getLocalStorageData == null) {
        listArray = [];
    } else {
        listArray = JSON.parse(getLocalStorageData);
    }
    const pendingTasksNumb = document.querySelector(".pendingTasks");
    pendingTasksNumb.textContent = listArray.length; //passing the array length in pendingtask
    if (listArray.length > 0) { //if array length is greater than 0
        deleteAllBtn.classList.add("active"); //active the delete button
    } else {
        deleteAllBtn.classList.remove("active"); //unactive the delete button
    }
    let newLiTag = "";
    listArray.forEach((element, index) => {
        const data = CvidToData.get(Number(element[1]));
        console.log(data, listArray);

        let img, subject;
        if(data == null || data.course_icon == null) img = "https://cdn-icons-png.flaticon.com/512/4552/4552718.png";
        else img = data.course_icon;

        if(data == null || data.title == null) subject = "To-do";
        else subject = data.title;

        newLiTag += `<li value=${element[1]} text=${element[0]}> <img src=${img} height="25" width="25"></img>(${subject}) ${element[0]}<span class="icon" onclick="deleteTask(${index})"><i class="fas fa-trash"></i></span></li>`;
    });

    todoList.innerHTML = newLiTag; //adding new li tag inside ul tag
    inputBox.value = ""; //once task added leave the input field blank

    let taskElement = document.querySelector(".todoList").getElementsByTagName("li");
    for (let i = 0; i < taskElement.length; ++i) {
        taskElement[i].addEventListener("dragstart", (e) => {
            selectTask = taskElement[i];
        });
    }

}


// delete task function
function deleteTask(index) {
    let getLocalStorageData = localStorage.getItem("New Todo");
    listArray = JSON.parse(getLocalStorageData);
    listArray.splice(index, 1); //delete or remove the li
    localStorage.setItem("New Todo", JSON.stringify(listArray));
    showTasks(); //call the showTasks function
}
// delete all tasks function
deleteAllBtn.onclick = () => {
    listArray = []; //empty the array
    localStorage.setItem("New Todo", JSON.stringify(listArray)); //set the item in localstorage
    showTasks(); //call the showTasks function
}

// Data Base Section
let allDB_Id = []

function addDBID(DB_Id) {
    for (let i = 0; i < allDB_Id.length; ++i) {
        if (allDB_Id[i] == DB_Id) {
            return;
        }
    }
    allDB_Id.push(DB_Id);
}

function checkExited(DB_Id) {
    for (let i = 0; i < allDB_Id.length; ++i) {
        if (allDB_Id[i] == DB_Id) {
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
            for (let i = 0; i < itemsData.length; ++i) {
                if (checkExited(itemsData[i].id) || itemsData[i].userID != userID) continue;

                addItemToCal(itemsData[i]);
                addDBID(itemsData[i].id);
            }
        })
        .catch((error) => console.error(error));
};

const addItemToDB = async (data, date) => {
    if (date == null) date = activeDay;
    date = Number(date);

    const itemToAdd = {
        day: date,
        month: month,
        year: year,
        userID: userID,
        event: data
    }

    const options = {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(itemToAdd)
    };

    await fetch(`http://${backendIPAddress}/items`, options)
        .then((response) => {
            console.log("Item Added");
        })
        .catch((error) => console.error(error));

    await getItemsFromDB();

};

const deleteItem = async (id) => {
    const options = {
        method: "DELETE",
        credentials: "include"
    };
    await fetch(`http://${backendIPAddress}/items/${id}`, options)
        .then((response) => {
            console.log("Item deleted", response);
        })
        .catch((error) => console.error(error));
};

function addItemToCal(data) {
    const event = data.event;

    if (event == null || event.title === "" || checkExited(data.id)) {
        return;
    }

    let day = data.day;
    let month = data.month;
    let year = data.year;

    const newEvent = {
        title: event.title,
        id: data.id,
        icon: event.icon,
        year: event.year,
        semester: event.semester,
        subject: event.subject
    };

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
}

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
            userID = data.data.student.id;
            getItemsFromDB();
        })
        .catch((error) => console.error(error));
};

getUserProfile();

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
            data = data.data.student;

            allProgressCourse = data.length;
            // add course info to CvidTodata
            for (let i = 0; i < data.length; ++i) {
                getCourseInfo(data[i].cv_cid);
                allCvId.push(data[i].cv_cid);
            }

            setTimeout(function () {
                if(progress != allprogress){
                    let overlayElement = document.querySelector(".overlay");
                    overlayElement.remove();
                    alert("Can not pull all data");
                    document.querySelector('.progress-bar').style.height = "0px";
                }
            }, 300000);

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
            console.log("found", cv_cid, data.data);
            progressCourse++;
            CvidToData.set(cv_cid, data.data);
            nameToCvide.set(data.data.title, cv_cid);

            //console.log(progressCourse, allProgressCourse);
            const percent = Math.round(progressCourse / allProgressCourse * 100) + "%";
            if(progressCourse == allProgressCourse){
               for (let i = 0; i < allCvId.length; ++i) {
                getAllAssignment(allCvId[i]);
               } 
               showTasks(); //calling showTask function
               addChoices();
            }
            document.querySelector('.progress').style.width = percent;
            
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
            allprogress += Alldata.length;

            for (let i = 0; i < Alldata.length; ++i) {
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

            const percent = Math.round(progress / allprogress * 100) + "%";
            console.log(progress, allprogress);
            if (progress == allprogress) {
                setTimeout(function () {
                    let overlayElement = document.querySelector(".overlay");
                    overlayElement.remove();
                }, 1000);
            }
            document.querySelector('.progress').style.width = percent;

        })
        .catch((error) => console.error(error));
};

function addAssignmentToCal(assignmentData, cv_cid) {

    // if title empty then do nothing
    if (assignmentData.title === "") {
        return;
    }

    const cvidData = CvidToData.get(cv_cid);

    //data about assignment
    const newEvent = {
        subject: cvidData.title,
        title: assignmentData.title,
        icon: cvidData.course_icon,
        year: cvidData.year,
        semester: cvidData.semester,
        type: "Assignment"
    };

    dueDate = assignmentData.duedate;
    dueDate = dueDate.split('-');
    let day = Number(dueDate[2]);
    let month = Number(dueDate[1]) - 1;
    let year = Number(dueDate[0]);

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
}

function addChoices() {

    let choiceCV = '<div class="event-choice none" value="0">No Course</div>';
    let choiceToDo = `<option class="to-do-choice none" value="0">No Course</option>`;

    allCvId.forEach((CvID) => {
        let cv_cid_Data = CvidToData.get(CvID);
        if(cv_cid_Data != null){
           choiceCV += `<div class="event-choice" value=${CvID}>${cv_cid_Data.title}</div>`;
            choiceToDo += `<option class="to-do-choice" value=${CvID}>${cv_cid_Data.title}</option>`; 
        }
        
    })

    eventChoiceBox.innerHTML = choiceCV;
    todoCourseBtn.innerHTML = choiceToDo;
    changeChoiceBtnText();

}

function changeChoiceBtnText() {
    let choiceBtns = document.querySelectorAll(".event-choice");

    choiceBtns.forEach((choiceBtn) => {
        choiceBtn.addEventListener("click", () => {
            eventChoiceBtn.innerHTML = choiceBtn.innerHTML;
            eventChoiceBtn.value = choiceBtn.getAttribute("value");
            eventChoiceBox.classList.remove("active");
        });
    })
}

// init data from mycoruseville (first call)
getCourse();


function displayFire(currentMonth) {
    const fire = document.querySelector(".fire")
    if ([2, 4, 9, 11].includes(currentMonth)) {
        fire.style.display = "inline";
    }
    else {
        fire.style.display = "none";
    }
}
const currentYear = new Date().getFullYear();
const yearInput = document.querySelector('.year-input');
yearInput.value = currentYear;
