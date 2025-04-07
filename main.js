// Firebase Configuration
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

function signInWithGoogle() {
  const provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider)
    .then((result) => {
      const user = result.user;
      document.getElementById("user-info").style.display = "block";
      document.getElementById("user-name").textContent = user.displayName;
      document.getElementById("user-email").textContent = user.email;
      document.getElementById("user-pic").src = user.photoURL;
      document.querySelector(".google-login-btn").style.display = "none";
    })
    .catch((error) => {
      alert("Login Failed: " + error.message);
    });
}

let totalMoney = 0;
let hasUsedFastWithdraw = localStorage.getItem("fastWithdrawUsed") === "true";
const moneyDisplay = document.querySelector(".money-display");
const adsContainer = document.getElementById("ads-container");
const withdrawalBtn = document.querySelector(".withdraw-btn");
const withdrawalForm = document.querySelector(".withdrawal-form");
const message = document.querySelector(".message");
const paymentMethodSelect = document.getElementById("payment-method");
const paymentBanner = document.getElementById("payment-banner");

const adColors = [
  "lightblue", "lightgreen", "lightcoral", "lightyellow", "lightpink",
  "lightgray", "lightskyblue", "lightseagreen", "lightgoldenrodyellow",
  "lightsteelblue", "lavender", "lemonchiffon", "mediumslateblue",
  "mintcream", "mistyrose", "moccasin", "navajowhite", "peachpuff",
  "powderblue", "rosybrown"
];

adColors.forEach((color, index) => {
  const ad = document.createElement("div");
  ad.className = "ad";
  ad.style.backgroundColor = color;
  ad.textContent = `Ad ${index + 1}`;
  ad.setAttribute("data-amount", "1");
  let clicked = false;
  ad.addEventListener("click", () => {
    if (!clicked) {
      let adAmount = parseFloat(ad.getAttribute("data-amount"));
      totalMoney += adAmount;
      moneyDisplay.textContent = totalMoney.toFixed(2) + " PKR";
      clicked = true;
      setTimeout(() => { clicked = false; }, 24 * 60 * 60 * 1000);
    }
  });
  adsContainer.appendChild(ad);
});

withdrawalBtn.addEventListener("click", () => {
  let minAmount = hasUsedFastWithdraw ? 100 : 5;
  if (totalMoney >= minAmount) {
    withdrawalForm.style.display = "block";
    message.textContent = "";
  } else {
    message.textContent = `Minimum withdrawal is ${minAmount} PKR.`;
  }
});

paymentMethodSelect.addEventListener("change", () => {
  const method = paymentMethodSelect.value;
  paymentBanner.style.display = "block";
  if (method === "JazzCash") {
    paymentBanner.innerHTML = '<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/JazzCash_logo.svg/1200px-JazzCash_logo.svg.png" alt="JazzCash Logo" />';
  } else if (method === "Easypaisa") {
    paymentBanner.innerHTML = '<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Easypaisa_Logo.svg/2560px-Easypaisa_Logo.svg.png" alt="Easypaisa Logo" />';
  } else {
    paymentBanner.style.display = "none";
  }
});

document.getElementById("confirm-withdrawal").addEventListener("click", () => {
  let accountName = document.getElementById("account-name").value;
  let accountNumber = document.getElementById("account-number").value;
  let paymentMethod = paymentMethodSelect.value;
  let amount = parseFloat(document.getElementById("amount").value);
  let minAmount = hasUsedFastWithdraw ? 100 : 5;

  if (!paymentMethod) {
    message.textContent = "Please select a payment method.";
    return;
  }

  if (amount >= minAmount && amount <= totalMoney) {
    message.textContent = `Transferring ${amount} PKR to ${accountName} via ${paymentMethod}...`;
    totalMoney -= amount;
    moneyDisplay.textContent = totalMoney.toFixed(2) + " PKR";
    withdrawalForm.style.display = "none";

    if (!hasUsedFastWithdraw && amount === 5) {
      hasUsedFastWithdraw = true;
      localStorage.setItem("fastWithdrawUsed", "true");
    }

    setTimeout(() => {
      message.textContent = `Amount will be received via ${paymentMethod} within 24 hours.`;
    }, 1000);
  } else {
    message.textContent = `Invalid amount. Minimum is ${minAmount} PKR.`;
  }
});
