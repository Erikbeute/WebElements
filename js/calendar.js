let posts = [];

const months = [
    "Januari", "Februari", "Maart", "April", "Mei", "Juni",
    "Juli", "Augustus", "September", "Oktober", "November", "December"
];


// Thanks to .. ? for making this JS framework -calendar
const getPrevMonth = (date) => {
    const copy = new Date(date.getTime());
    return new Date(copy.setMonth(date.getMonth() - 1, 1));
};

const getNextMonth = (date) => {
    const copy = new Date(date.getTime());
    return new Date(copy.setMonth(date.getMonth() + 1, 1));
};

function monthStartDay(date) {
    let firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    return firstDay.getDay();
}

function indexOfFirstday(date) {
    return monthStartDay(date);
}

function indexOfLastday(date) {
    return indexOfFirstday(date) + daysInMonth(date) - 1;
}

function getLocalTimestring(date) {
    const options = { hour: "2-digit", minute: "2-digit" };
    return date.toLocaleTimeString([], options);
}

function daysInMonth(date) {
    let nextMonthStart = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    return nextMonthStart.getDate();
}

function cellNumsInMonth(date) {
    const startDay = monthStartDay(date);
    const numOfDays = daysInMonth(date);
    let cellNums = [];
    for (var i = startDay; i < startDay + numOfDays; i++) {
        cellNums.push(i);
    }
    return cellNums;
}

function classifyMonthCells(date, cells) {
    const validCellNums = cellNumsInMonth(date);
    const cellsInMonth = Array.from(cells).filter((elem, i) => validCellNums.includes(i));
    const cellsOutsideMonth = Array.from(cells).filter((elem, i) => !validCellNums.includes(i));
    for (const cell of cellsInMonth) {
        cell.classList.add("inside-month");
        cell.classList.remove("outside-month");
    }
    for (const cell of cellsOutsideMonth) {
        cell.classList.add("outside-month");
        cell.classList.remove("inside-month");
    }
}

function numberMonthCells(date, cells) {
    const validCellNums = cellNumsInMonth(date);
    const cellsInMonth = Array.from(cells).filter((elem, i) => validCellNums.includes(i));
    for (const [index, cell] of cellsInMonth.entries()) {
        const txt = document.createTextNode(`${index + 1}`);
        const span = document.createElement("span");
        span.classList.add("day-number");
        span.appendChild(txt);
        cell.appendChild(span);
    }
}

function updateCalendarTitle(date, titleElement) {
    titleElement.textContent = `${months[date.getMonth()]} ${date.getFullYear()}`;
}

function showPostsInMonth(dateInMonth, posts, cells) {
    const monthStart = new Date(dateInMonth.getFullYear(), dateInMonth.getMonth(), 1);
    const monthEnd = new Date(dateInMonth.getFullYear(), dateInMonth.getMonth() + 1, 1);
    for (const post of posts) {
        if (!post.start_date) {
            console.error('Post missing start_date:', post);
            continue;
        }
        let start = post.start_date.split("/").reverse().join("-");
        let end = post.end_date ? post.end_date.split("/").reverse().join("-") : start;
        for (let d = new Date(start); d <= new Date(end); d.setDate(d.getDate() + 1)) {
            if (d.getFullYear() === dateInMonth.getFullYear() && d.getMonth() === dateInMonth.getMonth()) {
                const targetCellNum = monthStartDay(dateInMonth) + d.getDate() - 1;
                const cellForPost = cells[targetCellNum];
                const postBlock = document.createElement("div");
                if (post.channelID && icon4channel(post.channelID)) {
                    const channelIcon = document.createElement("i");
                    channelIcon.classList.add("fab");
                    channelIcon.classList.add(icon4channel(post.channelID));
                    postBlock.appendChild(channelIcon);
                    postBlock.classList.add(`channel-${post.channelID}`);
                    const postTitle = document.createElement("span");
                    postTitle.innerHTML = `${post.title}`;
                    postBlock.appendChild(postTitle);
                    postBlock.classList.add("post-item");
                    postBlock.setAttribute("id", `post-${post.id}`);
                    if (config.postClickHandler) {
                        postBlock.addEventListener("click", config.postClickHandler, false);
                    }
                    if (config.postHoverHandler) {
                        postBlock.addEventListener("mouseover", config.postHoverHandler, false);
                    }
                    cellForPost.appendChild(postBlock);
                }
            }
        }
    }
}

function highlightToday(calDate, monthCells) {
    const now = new Date();
    if (calDate.getFullYear() !== now.getFullYear() || calDate.getMonth() !== now.getMonth()) {
        return;
    }
    const indexOfToday = monthStartDay(now) + now.getDate() - 1;
    monthCells[indexOfToday].classList.add("today");
}

function makeCellsDroppable() {
    if (!config.isDraggable) {
        return;
    }
    const listOfcellCanvas = document.querySelectorAll(".days li .content");
}

function addNavButtonActions() {
    const prevBtn = document.querySelector(".calendar header button:nth-of-type(1)");
    prevBtn.onclick = () => {
        const currDate = getCalendarDate();
        const prevMonth = getPrevMonth(currDate);
        renderMonthview(prevMonth, posts);
    };
    const todayBtn = document.querySelector("#today-button");
    todayBtn.onclick = () => {
        const now = new Date();
        renderMonthview(now, posts);
    };
    const nextBtn = document.querySelector(".calendar header button:nth-of-type(3)");
    nextBtn.onclick = () => {
        const currDate = getCalendarDate();
        const nextMonth = getNextMonth(currDate);
        renderMonthview(nextMonth, posts);
    };
}

function icon4channel(channelID) {
    const m = new Map();
    m.set(1, "fa-circle");
    m.set(2, "fa-circle");
    m.set(3, "fa-circle");
    m.set(4, "fa-circle");
    m.set(5, "fa-circle");
    return m.get(channelID) || null;
}

function getCalendarDate() {
    const stateElem = document.getElementById(`calendar-date`);
    const currDate = stateElem.getAttribute("data-date");
    return new Date(currDate);
}

function setCalendarDate(date) {
    const stateElem = document.getElementById(`calendar-date`);
    stateElem.setAttribute("data-date", date.toISOString());
}

function clearMonthCells(monthCells) {
    for (const cell of monthCells) {
        cell.innerHTML = "";
        cell.className = "content";
    }
}

function renderMonthview(date, posts) {
    setCalendarDate(date);
    const calendarTitleElem = document.getElementById(`calendar-title`);
    updateCalendarTitle(date, calendarTitleElem);
    const monthCells = document.querySelectorAll(".days li .content");
    const _monthCells = document.querySelectorAll(".days li");
    clearMonthCells(monthCells);
    classifyMonthCells(date, _monthCells);
    numberMonthCells(date, monthCells);
    if (posts) {
        showPostsInMonth(date, posts, monthCells);
    }
    if (config.highlightToday) {
        highlightToday(date, _monthCells);
    }
    hideCellsInUnusedRows(date, _monthCells);
}

function hideCellsInUnusedRows(date, monthCells) {
    const lastDayIndex = indexOfLastday(date);
    if (lastDayIndex < 35) {
        for (let i = 35; i < monthCells.length; i++) {
            monthCells[i].classList.add("in-unused-row");
        }
    } else {
        for (let i = 35; i < monthCells.length; i++) {
            monthCells[i].classList.remove("in-unused-row");
        }
    }
}

const config = {
    isDraggable: false,
    drag: (ev) => {},
    dragStart: (ev) => {
        ev.dataTransfer.setData("text/plain", ev.target.id);
        ev.dataTransfer.effectAllowed = "move";
    },
    dragEnd: (ev) => {},
    dragExit: (ev) => {},
    dragOver: (ev) => {
        ev.currentTarget.classList.add("cell-dragover");
        ev.preventDefault();
        ev.dataTransfer.dropEffect = "move";
    },
    dragEnter: (ev) => {},
    dragLeave: (ev) => {
        ev.currentTarget.classList.remove("cell-dragover");
    },
    drop: (ev) => {
        ev.currentTarget.classList.remove("cell-dragover");
        const postId = ev.dataTransfer.getData("text/plain");
        ev.currentTarget.appendChild(document.getElementById(postId));
        ev.preventDefault();
    },
    highlightToday: true,
    postClickHandler: (ev) => {
        console.log(`Clicked on post: ${ev.currentTarget.id}`);
        showDetails(ev.currentTarget.id);
    },
    postHoverHandler: (ev) => {
        console.log(`Hover on post: ${ev.currentTarget.id}`);
    },
    useMilitaryTime: false
};
// ... Thanks! we take it from here... 

function showDetails(postId) {
  const post = posts.find(p => p.id === parseInt(postId.replace('post-', '')));
  if (post) {
      console.log(`ID: ${post.id}`);
      console.log(`Titel: ${post.title}`);
      console.log(`Start evenement: ${post.start_date}`);
      console.log(`Eind evenement: ${post.end_date}`);
      console.log(`Link: ${post.permalink}`);

      // Convert start_date and end_date strings to Date objects
      const startDate = new Date(post.start_date.split("/").reverse().join("-"));
      const endDate = post.end_date ? new Date(post.end_date.split("/").reverse().join("-")) : null;

      const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
      const detailPopup = document.getElementById('detailPopup');
      let endEventHtml = '';

      if (endDate && !isNaN(endDate.getTime())) {
          endEventHtml = `<p id="popupEndEvent">Eind evenement: ${endDate.toLocaleDateString('nl-NL', options)}</p>`;
      }

      detailPopup.innerHTML = `
          <p id="popupTitle">${post.title}</p> 
          <p id="popupStartEvent">Start evenement: ${startDate.toLocaleDateString('nl-NL', options)}</p>
          ${endEventHtml} 
          <p id="popupDescription">${post.description}</p>
          <p id="popupLink">Link: <a href="${post.permalink}" target="_blank">${post.permalink}</a></p>
      `;
      const closeButton = document.createElement('span');
      closeButton.className = 'close-btn';
      closeButton.innerHTML = '&times;';
      closeButton.onclick = closePopup;
      detailPopup.appendChild(closeButton);
      detailPopup.style.display = 'block';
  }
}


function closePopup() {
    const detailPopup = document.getElementById('detailPopup');
    detailPopup.style.display = 'none';
}

function doStuff() {
    const date = new Date(Date.now());
    renderMonthview(date, posts);
    addNavButtonActions();
}

window.onload = doStuff;
