const noteInput = document.getElementById('NoteInput');
const saveBtn = document.getElementById('saveNote');
const status = document.getElementById('saveStatus');
const storageKey = 'Notes';

// Load saved when the page loads
window.addEventListener('load', () => {
  const savedNote = localStorage.getItem(storageKey);
  if (savedNote) {
    noteInput.value = savedNote;
  }
});

// Save note when the "Save" button is clicked
saveBtn.addEventListener('click', () => {
  const note = noteInput.value;
  localStorage.setItem(storageKey, note); // Save the note to localStorage
  status.textContent = 'Note saved!';
  setTimeout(() => (status.textContent = ''), 2000);
});
