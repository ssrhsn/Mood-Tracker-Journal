let currentUser = localStorage.getItem("loggedUser") || null;
let currentMood = "😊";

const navLinks = document.getElementById("navLinks");
const sections = document.querySelectorAll("section");

function showSection(id) {
  sections.forEach(sec => sec.classList.remove("active"));
  document.getElementById(id).classList.add("active");
  if (id === "mood" && currentUser) loadEntries();
}

function signup() {
  const u = document.getElementById("signupUser").value;
  const p = document.getElementById("signupPass").value;
  if(!u || !p) return alert("Please fill all fields!");
  if(localStorage.getItem(u+"_pass")) return alert("Username already exists!");
  localStorage.setItem(u+"_pass", p);
  alert("Account created successfully!");
  showSection('login');
}

function login() {
  const u = document.getElementById("loginUser").value;
  const p = document.getElementById("loginPass").value;
  if(localStorage.getItem(u+"_pass") === p) {
    currentUser = u;
    localStorage.setItem("loggedUser", u);
    updateNav();
    document.getElementById("loggedUser").textContent = u;
    showSection("mood");
  } else {
    alert("Invalid username or password!");
  }
}

function logout() {
  localStorage.removeItem("loggedUser");
  currentUser = null;
  updateNav();
  showSection("home");
}

function updateNav() {
  if(currentUser) {
    navLinks.innerHTML = `
      <li><a href="#" onclick="showSection('home')">Home</a></li>
      <li><a href="#" onclick="showSection('mood')">Mood Tracker</a></li>
      <li><a href="#" onclick="showSection('settings')">Settings</a></li>
      <li><a href="#" onclick="logout()">Logout</a></li>`;
  } else {
    navLinks.innerHTML = `
      <li><a href="#" onclick="showSection('home')">Home</a></li>
      <li><a href="#" onclick="showSection('about')">About</a></li>
      <li><a href="#" onclick="showSection('login')">Login</a></li>
      <li><a href="#" onclick="showSection('signup')">Sign Up</a></li>`;
  }
}

function loadEntries() {
  const entries = JSON.parse(localStorage.getItem(currentUser+"_entries")) || [];
  const div = document.getElementById("entries");
  div.innerHTML = entries.map(e => `
    <div class="entry">${e.mood} <small>(${e.date})</small><br>${e.text}
      <button class="deleteBtn" onclick="deleteEntry(${e.id})">🗑</button>
    </div>`).join("");
}

function deleteEntry(id) {
  let entries = JSON.parse(localStorage.getItem(currentUser+"_entries")) || [];
  entries = entries.filter(e => e.id !== id);
  localStorage.setItem(currentUser+"_entries", JSON.stringify(entries));
  loadEntries();
}

document.addEventListener("click", e => {
  if(e.target.classList.contains("emoji")) currentMood = e.target.textContent;
});

document.getElementById("addBtn").addEventListener("click", () => {
  if(!currentUser) return alert("Please login first!");
  const text = document.getElementById("entryText").value;
  if(!text.trim()) return alert("Write something!");
  const newEntry = { id: Date.now(), mood: currentMood, text, date: new Date().toLocaleString() };
  const entries = JSON.parse(localStorage.getItem(currentUser+"_entries")) || [];
  entries.push(newEntry);
  localStorage.setItem(currentUser+"_entries", JSON.stringify(entries));
  document.getElementById("entryText").value = "";
  loadEntries();
});

document.getElementById("clearAllBtn").addEventListener("click", () => {
  if(confirm("Delete all entries?")) {
    localStorage.removeItem(currentUser+"_entries");
    loadEntries();
  }
});

// Initialize
updateNav();
if(currentUser) loadEntries();
