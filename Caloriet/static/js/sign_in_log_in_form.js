// Initialize Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "api_key",
  authDomain: "caloriet-140e0.firebaseapp.com",
  projectId: "caloriet-140e0",
  storageBucket: "caloriet-140e0.appspot.com",
  messagingSenderId: "749478286575",
  appId: "1:749478286575:web:4df968d0de6a71d4a2771a"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Function to handle sign-in
function signIn(email, password) {
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in successfully
      const user = userCredential.user;
      const uid = user.uid;
      console.log('User signed in:', user);
      // Redirect or perform other actions
      window.location.href = "/mealplan?uid=" + encodeURIComponent(uid);
    })
    .catch((error) => {
      // Handle sign-in errors
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error('Sign-in error:', errorMessage);
    });
}

// Event listener for sign-in button
const signInForms = document.querySelectorAll(".sign-in-form");
signInForms.forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault(); // Prevent form submission
    const emailInput = form.querySelector('input[name="in_email"]');
    const passwordInput = form.querySelector('input[name="in_password"]');
    // Check if input fields exist
    if (emailInput && passwordInput) {
      const email = emailInput.value;
      const password = passwordInput.value;
      signIn(email, password);
    } else {
      console.error('Input fields not found!');
    }
  });
});



const sign_in_btn = document.querySelector("#sign-in-btn");
const sign_up_btn = document.querySelector("#sign-up-btn");
const container = document.querySelector(".container");

sign_up_btn.addEventListener("click", () => {
  container.classList.add("sign-up-mode");
});

sign_in_btn.addEventListener("click", () => {
  container.classList.remove("sign-up-mode");
});
