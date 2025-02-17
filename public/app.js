console.log("app.js is loaded");

// ========== BANNER FETCH (INDEX) ==========
let currentSlide = 0;

async function fetchBanner() {
  try {
    console.log("Fetching banner image...");
    const response = await fetch("/api/banner", { method: "GET" });

    if (!response.ok) throw new Error("Failed to fetch banner data");

    const payload = await response.json();
    console.log("Received banner payload:", payload);

    updateBannerImage(payload);
  } catch (error) {
    console.error("Error fetching banner image:", error);
  }
}

function updateBannerImage(payload) {
  const bannerImage = document.getElementById("banner-image");
  if (bannerImage && payload.image) {
    bannerImage.src = payload.image;
    console.log("Banner image updated:", payload.image);
  } else {
    console.warn("Banner image not found or payload missing 'image' field.");
  }
}

// ========== DOMContentLoaded ==========
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM fully loaded.");

  // If we're on index.html (it has #login-page, #main-app)
  const loginPage = document.getElementById("login-page");
  const mainApp = document.getElementById("main-app");
  const loginButton = document.getElementById("login-button");
  const errorMessage = document.getElementById("error-message");

  if (loginPage && mainApp && loginButton && errorMessage) {
    initIndexPage(); // attach login logic, etc.
  }

  // If we're on deposit.html (it has #typed-amount)
  const typedAmountInput = document.getElementById("typed-amount");
  if (typedAmountInput) {
    initDepositPage(); // attach deposit logic
  }

  // If there's a #carousel, handle swipe logic
  const carousel = document.getElementById("carousel");
  if (carousel) {
    initCarouselSwipe(carousel);
  }
});

// ========== INDEX PAGE INIT ==========
function initIndexPage() {
  console.log("Index page detected. Setting up login and banner fetch...");

  // Check login state
  if (sessionStorage.getItem("loggedIn") === "true") {
    showMainApp();
  } else {
    showLoginPage();
  }

  // Attach login button handler
  const loginButton = document.getElementById("login-button");
  const errorMessage = document.getElementById("error-message");
  loginButton.addEventListener("click", () => {
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    if (username === "darren@example.com" && password === "theaa") {
      console.log("Login successful");
      sessionStorage.setItem("loggedIn", "true");
      showMainApp();
    } else {
      console.log("Invalid credentials");
      errorMessage.style.display = "block";
      errorMessage.textContent =
        "Invalid username or password. Please try again.";
    }
  });

  // Optionally fetch banner after we know user is on main app
  fetchBanner();
}

function showLoginPage() {
  const loginPage = document.getElementById("login-page");
  const mainApp = document.getElementById("main-app");
  if (loginPage && mainApp) {
    loginPage.style.display = "flex";
    mainApp.style.display = "none";
  }
}

function showMainApp() {
  const loginPage = document.getElementById("login-page");
  const mainApp = document.getElementById("main-app");
  if (loginPage && mainApp) {
    loginPage.style.display = "none";
    mainApp.style.display = "flex";
  }
}

// ========== DEPOSIT PAGE INIT ==========
function initDepositPage() {
  console.log("Deposit page detected. Setting up deposit logic...");

  // Show existing balance
  const storedBalance = parseFloat(localStorage.getItem("balance")) || 0;
  const userBalanceEl = document.getElementById("user-balance");
  userBalanceEl.textContent = `£${storedBalance.toFixed(2)}`;

  // Quick deposit buttons
  document.querySelectorAll(".quick-buttons button").forEach((btn) => {
    btn.addEventListener("click", () => {
      const depositValue = parseFloat(btn.dataset.deposit);
      handleDeposit(depositValue);
    });
  });

  // Numeric keypad
  let typedAmount = "";
  const typedAmountInput = document.getElementById("typed-amount");
  document.querySelectorAll(".numeric-keypad button").forEach((keyBtn) => {
    keyBtn.addEventListener("click", () => {
      const key = keyBtn.dataset.key;
      if (key === "del") {
        // remove last digit
        typedAmount = typedAmount.slice(0, -1);
      } else {
        typedAmount += key;
      }
      typedAmountInput.value = typedAmount || "0";
    });
  });

  // Deposit button
  const depositButton = document.getElementById("deposit-button");
  depositButton.addEventListener("click", () => {
    if (typedAmount) {
      const depositValue = parseFloat(typedAmount);
      if (!isNaN(depositValue) && depositValue > 0) {
        handleDeposit(depositValue);
      } else {
        alert("Please enter a valid deposit amount.");
      }
      typedAmount = "";
      typedAmountInput.value = "0";
    } else {
      alert("Please enter a deposit amount via keypad or quick buttons.");
    }
  });

  // Return button
  const returnButton = document.getElementById("return-button");
  if (returnButton) {
    returnButton.addEventListener("click", () => {
      window.location.href = "index.html";
    });
  }
}

// Actually deposit money
function handleDeposit(amount) {
  let currentBalance = parseFloat(localStorage.getItem("balance")) || 0;
  currentBalance += amount;
  localStorage.setItem("balance", currentBalance);

  // Update displayed balance if on deposit page
  const userBalanceEl = document.getElementById("user-balance");
  if (userBalanceEl) {
    userBalanceEl.textContent = `£${currentBalance.toFixed(2)}`;
  
    // Store deposit in sessionStorage (instead of showing an alert)
    sessionStorage.setItem("depositSuccess", amount.toFixed(2));
      
        // 1) Show the spinner overlay
        const spinnerOverlay = document.getElementById("spinner-overlay");
        if (spinnerOverlay) {
          spinnerOverlay.style.display = "flex"; 
        }
      
        // 2) Hide the deposit page content if you like (optional)
        const depositPage = document.querySelector(".deposit-page");
        if (depositPage) {
          depositPage.style.display = "none";
        }
      
        // 3) After a short delay (e.g. 2 seconds), redirect to index.html
        setTimeout(() => {
          window.location.href = "index.html";
        }, 2000);
      }
      
  }

  const deposited = sessionStorage.getItem("depositedAmount");
  if (deposited) {
    const depositBanner = document.getElementById("deposit-banner");
    if (depositBanner) {
      depositBanner.textContent = `£${deposited} has been deposited successfully.`;
      depositBanner.style.display = "block";
    }

    // Remove it so it only shows once
    sessionStorage.removeItem("depositedAmount");
  }


// ========== HELPER FUNCS FOR INDEX PAGE ==========
function handleHelp(type) {
  alert(`You selected: ${type}`);
}

function navigateTo(page) {
  alert("Navigate to " + page);
}

// ========== CAROUSEL SWIPE ==========
function initCarouselSwipe(carousel) {
  console.log("Setting up carousel swipe...");
  let isDown = false;
  let startX;
  let scrollLeft;

  carousel.addEventListener("mousedown", (e) => {
    isDown = true;
    carousel.classList.add("active");
    startX = e.pageX - carousel.offsetLeft;
    scrollLeft = carousel.scrollLeft;
  });

  carousel.addEventListener("mouseleave", () => {
    isDown = false;
    carousel.classList.remove("active");
  });

  carousel.addEventListener("mouseup", () => {
    isDown = false;
    carousel.classList.remove("active");
  });

  carousel.addEventListener("mousemove", (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - carousel.offsetLeft;
    const walk = (x - startX) * 2;
    carousel.scrollLeft = scrollLeft - walk;
  });
}
