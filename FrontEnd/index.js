const objectsCategoryId = 1;
const apartmentsCategoryId = 2;
const hotelsAndRestaurantsCategoryId = 3;
const headerLoginButton = document.querySelector("#header-login-button");
const headerLogoutButton = document.querySelector("#header-logout-button");
const filtersDiv = document.querySelector("#filters");
const modifyImg = document.querySelector(".image-modify");
const modifyArticle = document.querySelector(".article-modify");
const modifyPortfolio = document.querySelector(".portfolio-modify");
const loggedBlackStripe = document.querySelector(".logged-black-stripe");


// Récupération des travaux depuis l'API
const response = fetch("http://localhost:5678/api/works").then(raise => raise.json()).then(data => galleryManager(data));


// Fonction de gestion de la galerie
function galleryManager(data) {
    showWorks(data);
    filterButtons(data);
};


// Fonction d'affichage des travaux
function showWorks(works) {
    // Itérer sur les travaux
    for (let i = 0; i < works.length; i++) {
        const work = works[i];
        const figureElement = createElements(work);
        attachElements(figureElement);
    };
};


// Fonction de rafraichissement de la galerie
function refreshGallery(works) {
    // Itérer sur les travaux
    for (let i = 0; i < works.length; i++) {
        const work = works[i];
        removeElements();
    };
};


// Création des éléments
function createElements(work) {
    const imageElement = document.createElement("img");
    imageElement.src = work.imageUrl;
    const nameElement = document.createElement("figcaption");
    nameElement.innerText = work.title;
    const figureElement = document.createElement("figure");
    figureElement.setAttribute("id", "figureElement");
    figureElement.appendChild(imageElement);
    figureElement.appendChild(nameElement);
    return figureElement;
};


// Rattachement au parent
function attachElements(figureElement) {
    const gallery = document.querySelector(".gallery");
    gallery.appendChild(figureElement);
};


// Fonction de suppression des éléments
function removeElements() {
    const figureRemoved = document.getElementById("figureElement");
    figureRemoved.remove();
};


// Implémentation des boutons de filtres
function filterButtons(data) {
    const works = data;
    const filterButtons = document.querySelectorAll("#filters button");
    let currentWorks;
    for (let filter of filterButtons) {
        filter.addEventListener("click", function () {
        let buttonTag = this.id;
        console.log(buttonTag);
        if (currentWorks === undefined) {
            refreshGallery(works);
        };
        if (buttonTag === "objects") {
            console.log(currentWorks);
            if (currentWorks != undefined) {
                refreshGallery(currentWorks);
            };
            const filteredWorks = works.filter(work => work.category.id === objectsCategoryId);
            showWorks(filteredWorks);
            currentWorks = filteredWorks;
            
        } else if (buttonTag === "apartments") {
            console.log(currentWorks);
            currentWorks = filters(works, currentWorks, apartmentsCategoryId);

        } else if (buttonTag === "hotels-and-restaurants") {
            console.log(currentWorks);
            currentWorks = filters(works, currentWorks, hotelsAndRestaurantsCategoryId);

        } else if (buttonTag === "all") {
            console.log(currentWorks);
            const filteredWorks = works;
            if (currentWorks != undefined){
                refreshGallery(currentWorks);
            };
            showWorks(filteredWorks);
            currentWorks = filteredWorks;
        };
        
    })
    };
};


// Automatisation du processus de filtrage (catégories Appartements et Hôtels & restaurants)
function filters(works, currentWorks, categoryId) {
    if (currentWorks != undefined) {
        refreshGallery(currentWorks);
    };
    const filteredWorks = works.filter(work => work.category.id === categoryId);
    showWorks(filteredWorks);
    currentWorks = filteredWorks;
    return currentWorks;
};


// Gestion de l'affichage en mode connecté/déconnecté
if (localStorage.getItem("token")) {
    headerLoginButton.style.display = "none";
    headerLogoutButton.style.display = "block";
    filtersDiv.style.visibility = "hidden";
} else {
    headerLoginButton.style.display = "block";
    headerLogoutButton.style.display = "none";
    modifyImg.style.display = "none";
    modifyArticle.style.display = "none";
    modifyPortfolio.style.display = "none";
    loggedBlackStripe.style.display = "none";
};


// Bouton de déconnexion de la page d'accueil
headerLogoutButton.addEventListener("click", function () {
    localStorage.removeItem("token");
    window.location.replace("index.html");
});


// Gestion de la boîte modale
let modal = null;

// Fonction d'ouverture de la modale
const openModal = function(e) {
    e.preventDefault();
    const target = document.querySelector(e.target.getAttribute("href"));
    target.style.display = null;
    target.removeAttribute("aria-hidden");
    target.setAttribute("aria-modal", true);
    modal = target;
    modal.addEventListener("click", closeModal);
    modal.querySelector(".js-modal-close").addEventListener("click", closeModal);
    modal.querySelector(".js-modal-stop").addEventListener("click", stopPropagation);
};

// Fonction de fermeture de la modale
const closeModal = function(e) {
    if (modal === null) {
        return
    };
    e.preventDefault();
    modal.style.display = "none";
    modal.setAttribute("aria-hidden", "true");
    modal.removeAttribute("aria-modal");
    modal.removeEventListener("click", closeModal);
    modal.querySelector(".js-modal-close").removeEventListener("click", closeModal);
    modal.querySelector(".js-modal-stop").removeEventListener("click", stopPropagation);
    modal = null;
};

// On ne quitte la modale que si on clique en dehors/sur le bouton "close"
const stopPropagation = function(e) {
    e.stopPropagation();
};


document.querySelectorAll(".js-modal").forEach(a => {
    a.addEventListener("click", openModal);
});