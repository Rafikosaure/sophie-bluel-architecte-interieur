const objectsCategoryId = 1;
const apartmentsCategoryId = 2;
const hotelsAndRestaurantsCategoryId = 3;


// Récupération des travaux depuis l'API
const response = fetch("http://localhost:5678/api/works").then(raise => raise.json()).then(data => pageManager(data));


// Fonction de gestion de la page
function pageManager(data) {
    // Authentification
    loginLogoutDisplay();
    logoutMainPage();
    // Galerie principale
    showWorks(data);
    filterButtons(data);
    // Modale
    openModalButton();
    escapeAndTabKeys();
    showModalWorks(data);
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
    console.log("Contenu de figureElement avant sa suppression : " + figureRemoved);
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
        if (buttonTag === "objects") {
            currentWorks = filters(works, currentWorks, objectsCategoryId);
            
        } else if (buttonTag === "apartments") {
            currentWorks = filters(works, currentWorks, apartmentsCategoryId);

        } else if (buttonTag === "hotels-and-restaurants") {
            currentWorks = filters(works, currentWorks, hotelsAndRestaurantsCategoryId);

        } else if (buttonTag === "all") {
            const filteredWorks = works;
            if (currentWorks != undefined) {
                refreshGallery(currentWorks);
            } else if (currentWorks === undefined) {
                refreshGallery(works);
            };
            showWorks(filteredWorks);
            currentWorks = filteredWorks;
        };
    });
    };
};


// Fonction de filtrage
function filters(works, currentWorks, categoryId) {
    if (currentWorks !== undefined) {
        console.log("Si currentWorks a une valeur : " + currentWorks);
        refreshGallery(currentWorks);
    } else if (currentWorks === undefined) {
        console.log("Si currentWorks ne contient rien : " + currentWorks);
        refreshGallery(works);
    };
    const filteredWorks = works.filter(work => work.category.id === categoryId);
    showWorks(filteredWorks);
    currentWorks = filteredWorks;
    return currentWorks;
};


// Gestion de l'affichage en mode connecté/déconnecté
const headerLoginButton = document.querySelector("#header-login-button");
const headerLogoutButton = document.querySelector("#header-logout-button");
const filtersDiv = document.querySelector("#filters");
const modifyImg = document.querySelector(".image-modify");
const modifyArticle = document.querySelector(".article-modify");
const modifyPortfolio = document.querySelector(".portfolio-modify");
const loggedBlackStripe = document.querySelector(".logged-black-stripe");

function loginLogoutDisplay() {
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
        filtersDiv.style.visibility = "visible";
        loggedBlackStripe.style.display = "none";
    };
};


// Bouton de déconnexion de la page d'accueil
function logoutMainPage() {
    headerLogoutButton.addEventListener("click", function () {
        localStorage.removeItem("token");
        loginLogoutDisplay();
    });
};




////////// Gestion de la boîte modale //////////
const focusableSelector = "button, a, input, textarea";
let focusables = [];
let modal = null;
let previouslyFocusedElement = null;


// Fonction d'ouverture de la modale
const openModal = function(e) {
    e.preventDefault();
    modal = document.querySelector(e.target.getAttribute("href"));
    focusables = Array.from(modal.querySelectorAll(focusableSelector));
    previouslyFocusedElement = document.querySelector(":focus");
    focusables[0].focus();
    modal.style.display = null;
    modal.removeAttribute("aria-hidden");
    modal.setAttribute("aria-modal", true);
    modal.addEventListener("click", closeModal);
    modal.querySelector(".modal-close-cross").addEventListener("click", closeModal);
    modal.querySelector(".js-modal-stop").addEventListener("click", stopPropagation);
};


// Fonction de fermeture de la modale
const closeModal = function(e) {
    if (modal === null) {
        return
    };
    if (previouslyFocusedElement !== null) {
        previouslyFocusedElement.focus();
    };
    e.preventDefault();
    window.setTimeout(function() {
        modal.style.display = "none";
        modal = null;
    }, 500);
    modal.setAttribute("aria-hidden", "true");
    modal.removeAttribute("aria-modal");
    modal.removeEventListener("click", closeModal);
    modal.querySelector(".modal-close-cross").removeEventListener("click", closeModal);
    modal.querySelector(".js-modal-stop").removeEventListener("click", stopPropagation);
};


// On ne quitte la modale que si on clique en dehors/sur le bouton "close"
const stopPropagation = function(e) {
    e.stopPropagation();
};


// La touche "Echap" ferme la modale & la touche "Tab" change le focus
function escapeAndTabKeys() {
    window.addEventListener("keydown", function (e) {
        if (e.key === "Escape" || e.key === "Esc") {
            closeModal(e);
        };
        if (e.key === "Tab" && modal !== null) {
            focusInModal(e)
        };
    });
};



// Le focus des tabulations reste à l'intérieur de la modale
const focusInModal = function(e) {
    e.preventDefault();
    let index = focusables.findIndex(f => f === modal.querySelector(":focus"));
    if (e.shiftKey === true) {
        index--;
    } else {
        index++;
    };
    if (index >= focusables.length) {
        index = 0;
    };
    if (index < 0) {
        index = focusables.length - 1;
    };
    focusables[index].focus();
};


// Boutons d'ouverture de la modale
function openModalButton() {
    document.querySelectorAll(".js-modal").forEach(a => {
    a.addEventListener("click", openModal);
    });
};


// Affichage des travaux dans la modale
function showModalWorks(works) {
    // Itérer sur les travaux
    for (let i = 0; i < works.length; i++) {
        const work = works[i];
        const modalFigureElement = createModalElements(work);
        attachModalElements(modalFigureElement);
        deleteOneModalWork(work);
    };
};


// Fonction de création des éléments dans la modale
function createModalElements(work) {
    const modalImageElement = document.createElement("img");
    modalImageElement.src = work.imageUrl;
    const deleteButton = document.createElement("button");
    deleteButton.setAttribute("id", work.id);
    deleteButton.classList.add("delete-button");
    const deleteIcon = document.createElement("i");
    deleteIcon.classList.add("fa-solid", "fa-trash-can");
    deleteButton.appendChild(deleteIcon);
    const modalFigureCaption = document.createElement("figcaption");
    modalFigureCaption.innerText = "éditer";
    const modalFigureElement = document.createElement("figure");
    modalFigureElement.setAttribute("id", "modal-figure-element");
    modalFigureElement.appendChild(modalImageElement);
    modalFigureElement.appendChild(deleteButton);
    modalFigureElement.appendChild(modalFigureCaption);
    return modalFigureElement;
};


// Fonction de rattachement au parent dans la modale
function attachModalElements(modalFigureElement) {
    const modalGallery = document.querySelector(".modal-gallery");
    modalGallery.appendChild(modalFigureElement);
};


// Boutons "poubelle" pour supprimer des travaux dans la modale
function deleteOneModalWork(work) {
    const token = localStorage.getItem("token");
    const deleteButton = document.getElementById(work.id);
    console.log(deleteButton);
    deleteButton.addEventListener("click", function(e) {
        e.preventDefault();
        removeElements();
        removeModalElements();        
        console.log(deleteButton);
        fetch("http://localhost:5678/api/works/" + work.id, {

                method: "DELETE",
                headers: {
                    "Accept": "application/json",
                    "Authorization": `Bearer ${token}`
                }
        })
        .then(console.log("Oeuvre supprimée !"))
        .catch(console.log("La suppression a échoué !"))
    });
    
};


// Galerie de la modale : fonction de suppression des éléments du DOM
function removeModalElements() {
    const modalFigureRemoved = document.getElementById("modal-figure-element");
    console.log("Contenu de modalfigureElement avant sa suppression : " + modalFigureRemoved);
    modalFigureRemoved.remove();
};