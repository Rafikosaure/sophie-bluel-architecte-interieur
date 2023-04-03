const loginForm = document.getElementById("login-form");


// Authentification de l'utilisateur
function loginFormManager() {
    loginForm.addEventListener("submit", function(event) {
    event.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        body: JSON.stringify({ email: email, password: password }),
        headers: {"Accept": "application/json", "Content-Type": "application/json"}
    })
    .then(response => response.json())
    .then(data => {
        if (data.token) {
            let token = data.token;
            // Authentification réussie
            localStorage.setItem("token", token);
            window.location = "index.html";
        } else {
            // Echec de l'authentification
            incorrectLogins();
        };
    })
    .catch(error => console.error(error));
    });
};


// Message "Identifiants incorrects !"
function incorrectLogins() {
    const incorrectLogins = document.querySelector("#incorrect-logins");
    incorrectLogins.style.display = "block";
        setTimeout(() => {
        incorrectLogins.style.display = "none";
        }, 2000);
};


loginFormManager();