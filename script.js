function togglePassword() {
    const pass = document.getElementById("password");
    pass.type = pass.type === "password" ? "text" : "password";
  }
  
  function login() {
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;
  
    const users = JSON.parse(localStorage.getItem("users")) || {};
    
    if (users[username] && users[username] === password) {
      localStorage.setItem("currentUser", username);
      window.location.href = "home.html";
    } else {
      document.getElementById("error").style.display = "block";
    }
  }
  
  function register() {
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;
  
    if (!username || !password) return alert("Please enter username and password.");
  
    let users = JSON.parse(localStorage.getItem("users")) || {};
    if (users[username]) return alert("User already exists.");
  
    users[username] = password;
    localStorage.setItem("users", JSON.stringify(users));
    alert("User registered. You can now log in.");
  }
  
  function showLoginText() {
    const display = document.getElementById("loginDisplay");
    display.style.display = "block";
  }
  function hideLoginText() {
    document.getElementById("loginDisplay").style.display = "none";
  }

function logout() {
  localStorage.removeItem("currentUser");
  window.location.href = "index.html";
}


  











  