
let totalMoney = 0;
let referralEarnings = 0;

function updateDisplay() {
  document.getElementById("money-display").textContent = totalMoney.toFixed(2) + " PKR";
  document.getElementById("referral-earnings").textContent = referralEarnings.toFixed(2) + " PKR";
}

function confirmWithdraw() {
  const name = document.getElementById("account-name").value;
  const number = document.getElementById("account-number").value;
  const method = document.getElementById("payment-method").value;
  const amount = parseFloat(document.getElementById("amount").value);
  const message = document.getElementById("message");

  if (amount > totalMoney) {
    message.textContent = "Not enough balance.";
    return;
  }

  if (name && number && method && amount >= 5) {
    message.textContent = "Withdrawal requested!";
    totalMoney -= amount;
    updateDisplay();
    document.querySelector('.withdrawal-form').style.display = "none";
  } else {
    message.textContent = "Fill all fields correctly.";
  }
}

function generateReferralLink(uid) {
  const link = `${window.location.href.split("?")[0]}?ref=${uid}`;
  document.getElementById("ref-link").value = link;
}

function handleReferralBonus() {
  const urlParams = new URLSearchParams(window.location.search);
  const ref = urlParams.get("ref");
  if (ref && !localStorage.getItem("referred")) {
    referralEarnings += 2;
    totalMoney += 2;
    localStorage.setItem("referred", "true");
    updateDisplay();
  }
}

function signInWithGoogle() {
  const provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().signInWithPopup(provider)
    .then((result) => {
      const user = result.user;
      document.getElementById("login-area").style.display = "none";
      document.getElementById("user-info").style.display = "block";
      document.getElementById("user-pic").src = user.photoURL;
      document.getElementById("user-name").textContent = user.displayName;
      document.getElementById("user-email").textContent = user.email;

      generateReferralLink(user.uid);
      handleReferralBonus();

      document.querySelector(".main-content").style.display = "block";

      const adsContainer = document.getElementById("ads-container");
      for (let i = 1; i <= 20; i++) {
        const ad = document.createElement("div");
        ad.className = "ad";
        ad.textContent = "Ad " + i;
        ad.addEventListener("click", () => {
          totalMoney += 1;
          updateDisplay();
        });
        adsContainer.appendChild(ad);
      }
    })
    .catch((error) => {
      alert("Login failed: " + error.message);
    });
}
