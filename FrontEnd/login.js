const loginForm = document.getElementById("login-form");
const loginButton = document.getElementById("login-button");

loginForm.addEventListener("submit", function(event) {
    event.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    fetch("http://localhost:5678/api/users/login", {
        method: 'POST',
        body: JSON.stringify({ email: email, password: password }),
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' }
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            console.log(email);
            console.log(password);
            if (data.token) {
                let token = data.token;
                console.log(token);
                localStorage.setItem("token", token);
                alert("Connexion réussie ! Cliquer sur OK pour revenir à la page d'accueil.")
                // Redirection vers la page d'accueil
                window.location = "http://127.0.0.1:5500/FrontEnd/index.html";
            } else {
                alert("Identifiants incorrects.");
                // Afficher un message d'erreur
            };
        })
        .catch(error => console.error(error));
});