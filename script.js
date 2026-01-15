function openFeatures() {
  var allElem = document.querySelectorAll(".elem");
  var FullelemPage = document.querySelectorAll(".fullElem");
  var FullelemPageBackBtn = document.querySelectorAll(".fullElem .back");

  allElem.forEach(function (elem) {
    elem.addEventListener("click", function () {
      FullelemPage[elem.id].style.display = "block";
    });
  });

  FullelemPageBackBtn.forEach(function (back) {
    back.addEventListener("click", function () {
      FullelemPage[back.id].style.display = "none";
    });
  });
}
openFeatures();
function todoList() {
  var form = document.querySelector(".addTask form");
  var taskInput = document.querySelector(".addTask form #task-input");
  var taskDetailsinput = document.querySelector(".addTask form textarea");
  var taskCheckbox = document.querySelector(".addTask form #check");

  var cuurentTask = [];
  if (localStorage.getItem("cuurentTask")) {
    cuurentTask = JSON.parse(localStorage.getItem("cuurentTask"));
  } else {
    console.log("Task is Empty");
  }

  function renderTask() {
    localStorage.setItem("cuurentTask", JSON.stringify(cuurentTask));
    var allTask = document.querySelector(".allTask");

    let sum = "";
    cuurentTask.forEach(function (elem, idx) {
      sum += ` <div class="task">
              <h5>${elem.task} <span class=${elem.imp}>imp</span></h5>
              <div class="actions">
          <button class="complete" data-id="${idx}">Completed</button>
          <button class="delete" data-id="${idx}">Delete</button>
        </div>
          </div>`;
    });
    allTask.innerHTML = sum;
  }
  renderTask();

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    cuurentTask.push({
      task: taskInput.value,
      details: taskDetailsinput.value,
      imp: taskCheckbox.checked,
    });

    taskInput.value = "";
    taskDetailsinput.value = "";
    taskCheckbox.checked = false;
    renderTask();
  });

  var allTask = document.querySelector(".allTask");

  allTask.addEventListener("click", function (e) {
    // ✅ DELETE BUTTON
    if (e.target.classList.contains("delete")) {
      const idx = e.target.dataset.id;
      cuurentTask.splice(idx, 1);
      localStorage.setItem("cuurentTask", JSON.stringify(cuurentTask));
      renderTask();
    }

    // ✅ COMPLETED BUTTON
    if (e.target.classList.contains("complete")) {
      const idx = e.target.dataset.id;
      cuurentTask[idx].completed = true;
      localStorage.setItem("cuurentTask", JSON.stringify(cuurentTask));
      renderTask();
    }
  });
}
todoList();

function dailyPlanner() {
  var dayPlanData = JSON.parse(localStorage.getItem("dayPlanData")) || {};

  var dayPlanner = document.querySelector(".day-planner");

  function timeAMPM(hour) {
    if (hour < 12) {
      return hour + ":00 AM";
    } else if (hour === 12) {
      return "12:00 PM";
    } else {
      return hour - 12 + ":00 PM";
    }
  }

  var hours = Array.from({ length: 18 }, function (_, idx) {
    let start = 6 + idx;
    let end = start + 1;

    return timeAMPM(start) + " - " + timeAMPM(end);
  });

  var wholeDaySum = "";
  hours.forEach(function (elem, idx) {
    var saveData = dayPlanData[idx] || "";
    wholeDaySum =
      wholeDaySum +
      ` <div class="day-planner-time">
            <p>${elem}</p>
            <input id=${idx} type="text" placeholder="..."   value="${
        dayPlanData[idx] || ""
      }">
          </div>`;
  });

  dayPlanner.innerHTML = wholeDaySum;

  var dayPlannerInput = document.querySelectorAll(".day-planner input");
  dayPlannerInput.forEach(function (elem) {
    elem.addEventListener("input", function () {
      dayPlanData[elem.id] = elem.value;

      localStorage.setItem("dayPlanData", JSON.stringify(dayPlanData));
    });
  });
}
dailyPlanner();

function motivationalQuoteContent() {
  var motivationQuote = document.querySelector(".motivation-2 h2");
  var motivationAuther = document.querySelector(".motivation-3 h2");

  async function fetchQuote() {
    // if (!motivationQuote.textContent) {
    //   motivationQuote.textContent = " ";
    //   motivationAuther.textContent = " ";
    // }

    let res = await fetch("https://dummyjson.com/quotes/random");
    let data = await res.json();

    motivationQuote.innerHTML = data.quote;
    motivationAuther.innerHTML = data.author;
  }
  fetchQuote();
}
motivationalQuoteContent();
function pomodoroTimer() {
  let timer = document.querySelector(".pomo-timer h1");
  var startBtn = document.querySelector(".pomo-timer .start-timer");
  var pauseBtn = document.querySelector(".pomo-timer .pause-timer");
  var resetBtn = document.querySelector(".pomo-timer .reset-timer");
  var session = document.querySelector(".pomodore-fullpage .session");

  let isWork = true;
  let totalSeconds = 1500;
  let timerInterval = null;

  function updateTimer() {
    let minutes = Math.floor(totalSeconds / 60);
    let seconds = totalSeconds % 60;

    timer.innerHTML = `${String(minutes).padStart(2, "0")}:${String(
      seconds
    ).padStart(2, "0")}`;
  }
  function startTimer() {
    clearInterval(timerInterval);

    if (isWork) {
      timerInterval = setInterval(() => {
        if (totalSeconds > 0) {
          totalSeconds--;
          updateTimer();
        } else {
          isWork = false;
          clearInterval(timerInterval);
          timer.innerHTML = "05:00";
          session.innerHTML = "Take a Break";
          session.style.backgroundColor = "var(--blue)";
          totalSeconds = 5 * 60;
        }
      }, 1000);
    } else {
      timerInterval = setInterval(() => {
        if (totalSeconds > 0) {
          totalSeconds--;
          updateTimer();
        } else {
          isWork = true;
          clearInterval(timerInterval);
          timer.innerHTML = "25:00";
          session.innerHTML = "Work Session";
          session.style.backgroundColor = "var(--gre)";
          totalSeconds = 25 * 60;
        }
      }, 1000);
    }
  }

  function pauseTimer() {
    clearInterval(timerInterval);
  }

  function resetTimer() {
    clearInterval(timerInterval);
    totalSeconds = 25 * 60;
    updateTimer();
  }
  startBtn.addEventListener("click", startTimer);
  pauseBtn.addEventListener("click", pauseTimer);
  resetBtn.addEventListener("click", resetTimer);
}
pomodoroTimer();

function dailyGoalsAdvanced() {
  const form = document.querySelector(".goal-form");
  const input = document.querySelector(".goal-form input");
  const goalList = document.querySelector(".goal-list");
  const progressBar = document.querySelector(".goal-progress span");

  let goals = JSON.parse(localStorage.getItem("dailyGoals")) || [];

  function renderGoals() {
    localStorage.setItem("dailyGoals", JSON.stringify(goals));

    let completed = goals.filter((g) => g.done).length;
    let total = goals.length;
    let percent = total === 0 ? 0 : Math.round((completed / total) * 100);

    progressBar.style.width = percent + "%";
    progressBar.innerText = percent + "%";

    let clutter = "";
    goals.forEach((goal, idx) => {
      clutter += `
        <div class="goal ${goal.done ? "done" : ""} ${goal.priority}">
          <h3>${goal.text}</h3>
          <small>
            Priority: ${goal.priority.toUpperCase()} |
            Reminder: ${goal.reminder || "None"}
          </small>

          <div class="goal-actions">
            <button class="complete" data-id="${idx}">
              ${goal.done ? "Undo" : "Done"}
            </button>
            <button class="delete" data-id="${idx}">Delete</button>
          </div>
        </div>
      `;
    });

    goalList.innerHTML = clutter;
  }

  renderGoals();

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const priority = document.querySelector("#priority").value;
    const reminder = document.querySelector("#reminder").value;

    goals.push({
      text: input.value,
      priority,
      reminder,
      done: false,
    });

    input.value = "";
    document.querySelector("#reminder").value = "";
    renderGoals();
  });

  goalList.addEventListener("click", function (e) {
    const id = e.target.dataset.id;

    if (e.target.classList.contains("complete")) {
      goals[id].done = !goals[id].done;
      renderGoals();
    }

    if (e.target.classList.contains("delete")) {
      goals.splice(id, 1);
      renderGoals();
    }
  });

  // ⏰ Reminder alert
  setInterval(() => {
    let now = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    goals.forEach((goal) => {
      if (goal.reminder === now && !goal.done) {
        alert(`⏰ Reminder: ${goal.text}`);
      }
    });
  }, 60000);
}

dailyGoalsAdvanced();


function wheatherFunctionality(){
  
var apiKey = `7de6ce66482a4f7886071821261201`;
var city = "Nagpur";
var data = null;

var header1Time = document.querySelector(".header1 h1");
var header1Date = document.querySelector(".header1 h2");
var header2Temp = document.querySelector(".header2 h1");
var header2Condition = document.querySelector(".header2 h4");
var header2Precipitation = document.querySelector(".header2 .precipitation");
var header2Humadity = document.querySelector(".header2 .humidity");
var header2Wind = document.querySelector(".header2 .wind");






async function whetherAPICall() {
  var response = await fetch(
    `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`
  );
 data = await response.json();
 header2Temp.innerHTML = `${data.current.temp_c}°C⛅`
 header2Condition.innerHTML = `${data.current.condition.text}`
 header2Precipitation.innerHTML = `Heat Index : ${data.current.heatindex_c}% `
 header2Humadity.innerHTML = `Humidity: ${data.current.humidity}%`
 header2Wind.innerHTML = `Wind: ${data.current.wind_kph} km/h`
}
whetherAPICall();

var date = null;
function timeDate() {
  const totalDaysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
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
    "December",
  ];
 
  var date = new Date();

  var dayOfWeek = totalDaysOfWeek[date.getDay()];

  var hours = date.getHours();
  var minutes = date.getMinutes();
  var seconds = date.getSeconds();

  var tarik = date.getDate();
  var month = monthNames[date.getMonth()];
  var year = date.getFullYear();

   header1Date.innerHTML = `${tarik} ${month}, ${year}`

if(hours>12){
header1Time.innerHTML = `${dayOfWeek}, ${String(hours - 12).padStart('2', '0')}:${String(minutes).padStart('2', '0')}:${String(seconds).padStart('2', '0')} PM`}
else{
header1Time.innerHTML = `${dayOfWeek}, ${String(hours).padStart('2', '0')}:${String(minutes).padStart('2', '0')}:${String(seconds).padStart('2', '0')} AM`

}
}
setInterval(() => {
  timeDate()
}, 1000);
}

wheatherFunctionality();
var theme = document.querySelector('.theme')
var rootElement = document.documentElement
var flag = 0

theme.addEventListener('click', function () {

  /* 🌙 DARK PREMIUM */
  // 🌙 DARK PREMIUM
if (flag === 0) {
  rootElement.style.setProperty('--pri', '#F9FAFB')      // headings / UI text
  rootElement.style.setProperty('--black', '#FFFFFF')   // ✅ TASK TEXT WHITE
  rootElement.style.setProperty('--sec', '#0F172A')
  rootElement.style.setProperty('--tri1', '#7588a5')
  rootElement.style.setProperty('--tri2', '#e0e2e5')
  rootElement.style.setProperty('--sea', '#38BDF8')
  rootElement.style.setProperty('--gre', '#22C55E')
  rootElement.style.setProperty('--blue', '#60A5FA')
  rootElement.style.setProperty('--red', '#EF4444')
  flag = 1
}


  /* ☀️ WARM COFFEE / CHAI */
  else if (flag === 1) {
    rootElement.style.setProperty('--pri', '#2A1A0A')
    rootElement.style.setProperty('--black', '#000000')  // ✅ TASK TEXT BLACK
    rootElement.style.setProperty('--sec', '#FBF3E6')
    rootElement.style.setProperty('--tri1', '#E7C9A9')
    rootElement.style.setProperty('--tri2', '#8B5A2B')
    rootElement.style.setProperty('--sea', '#C08457')
    rootElement.style.setProperty('--gre', '#16A34A')
    rootElement.style.setProperty('--blue', '#2563EB')
    rootElement.style.setProperty('--red', '#B91C1C')
    flag = 2
  }

  /* 🧊 DEFAULT / SOFT NEUTRAL */
  else {
    rootElement.style.setProperty('--pri', '#1F2937')
    rootElement.style.setProperty('--black', '#000000')  // ✅ TASK TEXT BLACK
    rootElement.style.setProperty('--sec', '#F8F6F1')
    rootElement.style.setProperty('--tri1', '#E4E8D9')
    rootElement.style.setProperty('--tri2', '#9BAF8F')
    rootElement.style.setProperty('--sea', '#6B8E6E')
    rootElement.style.setProperty('--gre', '#22C55E')
    rootElement.style.setProperty('--blue', '#3B82F6')
    rootElement.style.setProperty('--red', '#DC2626')
    flag = 0
  }
})

