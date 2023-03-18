const loginForm = document.getElementById("login-form");
// const loginButton = document.getElementById("login-button");

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
            console.log(token);
            localStorage.setItem("token", token);
            // alert("Connexion réussie ! Cliquer sur OK pour revenir à la page d'accueil.")
            // Redirection vers la page d'accueil
            window.location = "index.html";
        } else {
            alert("Identifiants incorrects.");
        };
    })
    .catch(error => console.error(error));
    });
};

loginFormManager();