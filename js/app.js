let events = [];
let arr = [];

const eventName = document.querySelector('#eventName');
const eventDate = document.querySelector('#eventDate');
const btnAdd = document.querySelector('#btnAdd');
const eventsContainer = document.querySelector('#eventsContainer');

const json = load();

try {
  arr = JSON.parse(json);
} catch (error) {
  arr = [];
}
events = arr ? [...arr] : [];

renderEvents();

// Method to add the event with the form
document.querySelector('form').addEventListener('submit', e => {
  e.preventDefault();
  addEvent();
});

// Function to generate new event
function addEvent() {
  //Form field validation
  if (eventName.value === '' || eventDate.value === '') {
    return;
  }

  // Validation for past dates
  if (dateDiff(eventDate.value) < 0) {
    return;
  }

  // Create the new event
  const newEvent = {
    id: (Math.random() * 100).toString(36).slice(3),
    name: eventName.value,
    date: eventDate.value,
  };

  // Add the event to the beginning of the array
  events.unshift(newEvent);

  save(JSON.stringify(events));

  // Returns the name field to empty
  eventName.value = '';
  eventDate.value = '';

  renderEvents();
}

// Function to calculate the remaining days
function dateDiff(d) {
  const targetDate = new Date(d);
  const currentDate = new Date();
  const difference = targetDate.getTime() - currentDate.getTime();
  const days = Math.ceil(difference / (1000 * 3600 * 24));
  return days;
}

// Function to render the events
function renderEvents() {
  const eventsHTML = events.map(event => {
    return `
      <div class="event">
        <div class="days">
          <span class="days-number">${dateDiff(event.date)}</span>
          <span class="days-text">Days</span>
        </div>
        <div class="event-name">${event.name}</div>
        <div class="event-date">${event.date}</div>
        <div class="actions">
          <button class="btn-delete" data-id="${event.id}">Delete</button>
        </div>
      </div>
    `;
  });

  eventsContainer.innerHTML = eventsHTML.join('');

  // Method to delete events
  document.querySelectorAll('.btn-delete').forEach(button => {
    button.addEventListener('click', (e) => {
      const id = button.getAttribute('data-id');
      events = events.filter((event) => event.id != id);

      save(JSON.stringify(events));

      renderEvents();
    });
  });
}

// Function to save the data in the browser
function save(data) {
  localStorage.setItem('items', data);
}

// Function to load the data in the browser
function load() {
  return localStorage.getItem('items');
}