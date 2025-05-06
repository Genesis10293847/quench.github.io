const currentPage = window.location.pathname;
const user = localStorage.getItem("currentUser");

// Don't redirect if already on sign-in page
if (!user && !currentPage.includes("sign-in.html")) {
  window.location.href = "sign-in.html";
  } else if (user) {
    const userElement = document.getElementById("user");
    if (userElement) {
      userElement.innerText = user;
    }
  }