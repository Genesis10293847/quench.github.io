const datetimeDisplay = document.getElementById('datetime');
const entryDateTimeInput = document.getElementById('entryDateTime');
const currentUser = localStorage.getItem("currentUser");

const STORAGE_KEY = `waterEntries_${currentUser}`;
let entries = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

const now = new Date();
function updateTime() {
  const current = new Date();
  let hours = current.getHours();
  const minutes = current.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  datetimeDisplay.textContent = `Current Time: ${hours}:${minutes} ${ampm}`;
}
setInterval(updateTime, 1000);
updateTime();

function setDefaultDateTime() {
  const now = new Date();
  const offset = now.getTimezoneOffset();
  const localDate = new Date(now.getTime() - (offset * 60000));
  entryDateTimeInput.value = localDate.toISOString().slice(0, 16);
}
setDefaultDateTime();

let currentMonth = now.getMonth();
let currentYear = now.getFullYear();

function changeMonth(offset) {
  currentMonth += offset;
  if (currentMonth < 0) {
    currentMonth = 11;
    currentYear--;
  } else if (currentMonth > 11) {
    currentMonth = 0;
    currentYear++;
  }
  renderCalendar();
}

function renderCalendar() {
  const calendarEl = document.getElementById('calendar');
  const monthYearEl = document.getElementById('month-year');
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  monthYearEl.textContent = `${monthNames[currentMonth]} ${currentYear}`;
}
renderCalendar();

const ctx = document.getElementById('waterChart').getContext('2d');
let chartView = 'day';

function getChartSums(view) {
  const result = [];

  if (view === 'day') {
    for (let i = 0; i < 24; i++) result.push(0);
    entries.forEach(({ date, amount }) => {
      const d = new Date(date);
      result[d.getHours()] += amount;
    });

  } else if (view === 'week') {
    for (let i = 0; i < 7; i++) result.push(0);
    entries.forEach(({ date, amount }) => {
      const d = new Date(date);
      result[d.getDay()] += amount;
    });

  } else if (view === 'month') {
    for (let i = 0; i < 4; i++) result.push(0);
    entries.forEach(({ date, amount }) => {
      const d = new Date(date);
      const week = Math.floor((d.getDate() - 1) / 7);
      result[week] += amount;
    });

  } else if (view === 'year') {
    for (let i = 0; i < 12; i++) result.push(0);
    entries.forEach(({ date, amount }) => {
      const d = new Date(date);
      result[d.getMonth()] += amount;
    });
  }

  return result;
}

let waterChart = new Chart(ctx, {
  type: 'bar',
  data: {
    labels: Array.from({ length: 24 }, (_, i) => `${i}:00`),
    datasets: [{
      label: 'Water Intake (ml)',
      data: getChartSums('day'),
      backgroundColor: 'rgba(54, 162, 235, 0.6)',
      borderColor: 'rgba(54, 162, 235, 1)',
      borderWidth: 1
    }]
  },
  options: {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        max: 3000,
        ticks: {
          stepSize: 500
        }
      }
    }
  }
});

function updateChartView() {
  chartView = document.getElementById('viewToggle').value;
  const viewSettings = {
    day: Array.from({ length: 24 }, (_, i) => `${i}:00`),
    week: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    month: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    year: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  };
  waterChart.data.labels = viewSettings[chartView];
  waterChart.data.datasets[0].data = getChartSums(chartView);
  waterChart.update();
}

function updateWaterIntake() {
  const amount = parseInt(document.getElementById('amount').value);
  const dateTimeStr = document.getElementById('entryDateTime').value;

  if (amount === 0) {
    entries = entries.filter(e => new Date(e.date).toISOString().slice(0, 16) !== dateTimeStr);
  } else {
    entries.push({ date: dateTimeStr, amount });
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  updateChartView();
}

function subtractWaterIntake() {
  const amount = parseInt(document.getElementById('amount').value);
  const dateTimeStr = document.getElementById('entryDateTime').value;

  let remaining = amount;
  for (let i = 0; i < entries.length && remaining > 0; i++) {
    if (entries[i].date === dateTimeStr) {
      if (entries[i].amount <= remaining) {
        remaining -= entries[i].amount;
        entries[i].amount = 0;
      } else {
        entries[i].amount -= remaining;
        remaining = 0;
      }
    }
  }
  entries = entries.filter(e => e.amount > 0);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  updateChartView();
}
