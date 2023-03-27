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
    // Galerie principale & modale
    showWorks(data);
    filterButtons(data)
    openModalButton();
    escapeAndTabKeys();
    switchModalDisplay();
    deleteAllWorksLink(data);
    addOneWork(data);
};


// Gestion de l'affichage des travaux dans les galeries
function showWorks(works) {
    // Itérer sur les travaux
    for (let i = 0; i < works.length; i++) {
        const work = works[i];
        const figureElement = createElements(work);
        attachElements(figureElement);
        const modalFigureElement = createModalElements(work);
        attachModalElements(modalFigureElement);
        deleteOneModalWork(work, figureElement, modalFigureElement);
    };
};


// Fonction de suppression de tous les travaux de la galerie principale
function deleteWorksMainGallery(works) {
    // Itérer sur les travaux
    for (let i = 0; i < works.length; i++) {
        const work = works[i];
        removeElements();
    };
};


// Fonction de suppression d'un seul élément de la galerie principale
function removeElements() {
    const figureRemoved = document.getElementById("figureElement");
    console.log("Contenu de figureElement avant sa suppression : " + figureRemoved);
    figureRemoved.remove();
};


// Création des éléments dans la galerie principale
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


// Rattachement au parent dans la galerie principale
function attachElements(figureElement) {
    const gallery = document.querySelector(".gallery");
    gallery.appendChild(figureElement);
};


// Boutons de filtres
function filterButtons(works) {
    // console.log("Nombre de travaux à l'ouverture des filtres: " + works.length);
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
            console.log('Longueur de "works" dans "filteredWorks": ' + works.length + ' travaux.');
            currentWorks = filters(works, currentWorks, hotelsAndRestaurantsCategoryId);

        } else if (buttonTag === "all") {
            const filteredWorks = works;
            if (currentWorks != undefined) {
                deleteWorksMainGallery(currentWorks);
            } else if (currentWorks === undefined) {
                deleteWorksMainGallery(works);
            };
            showWorks(filteredWorks);
            currentWorks = filteredWorks;
        };
    });
    };
};


// Fonction de filtrage
function filters(works, currentWorks, categoryId) {
    console.log('"Works" contient initialement: ' + works.length + ' travaux !');
    if (currentWorks !== undefined) {
        // console.log('"CurrentWorks" a une valeur, la voici : ' + currentWorks);
        // console.log("Longueur de currentWorks avant suppression: " + currentWorks.length)
        deleteWorksMainGallery(currentWorks);
        // console.log('Les travaux courants ont été supprimés.')
    } else if (currentWorks === undefined) {
        // console.log("CurrentWorks ne contient rien.");
        // console.log('(fonction filters) Longueur de "works" avant suppression: ' + works.length);
        deleteWorksMainGallery(works);
        // console.log("Les travaux ont été supprimés de la galerie.");
    };
    const filteredWorks = works.filter(work => work.category.id === categoryId);
    showWorks(filteredWorks);
    currentWorks = filteredWorks;
    // console.log('Valeur finale de "currentWorks": ' + currentWorks);
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
    const modalBackArrow = document.querySelector(".modal-back-arrow");
    const modalDisplay1 = document.querySelector(".modal-display-1");
    const modalDisplay2 = document.querySelector(".modal-display-2");
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
    modalBackArrow.style.visibility = "hidden";
    modalDisplay1.style.display = "flex";
    modalDisplay2.style.display = "none";
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


// Bouton d'ouverture de la modale
function openModalButton() {
    const openModalButton = document.querySelector(".js-modal");
    openModalButton.addEventListener("click", openModal);
};


// Fonction de création des éléments dans la galerie de la modale
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


// Fonction de rattachement au parent dans la galerie de la modale
function attachModalElements(modalFigureElement) {
    const modalGallery = document.querySelector(".modal-gallery");
    modalGallery.appendChild(modalFigureElement);
};


// Boutons "poubelle" pour supprimer l'un des travaux (-> modale1)
function deleteOneModalWork(work, figureElement, modalFigureElement) {
    const token = localStorage.getItem("token");
    const deleteButton = document.getElementById(work.id);
    deleteButton.addEventListener("click", function(e) {
        e.preventDefault();
        modalFigureElement.remove();
        figureElement.remove();
        fetch("http://localhost:5678/api/works/" + work.id, {

                method: "DELETE",
                headers: {
                    "Accept": "application/json",
                    "Authorization": `Bearer ${token}`
                }
        })
        .then(console.log("Oeuvre supprimée !"))
        // .catch(console.log("La suppression a échoué !"))
    });
};


// Lien rouge de suppression de tous les travaux (-> modale1)
function deleteAllWorksLink(works) {
    const deleteAllWorksLink = document.querySelector(".modal-delete-gallery");
    deleteAllWorksLink.addEventListener("click", function(e) {
        e.preventDefault();
        deleteAllModalWorks(works);
    });
};


// Fonction de suppression de tous les travaux dans la bdd (et dans le DOM)
function deleteAllModalWorks(works) {
    // Itérer sur les travaux
    for (let i = 0; i < works.length; i++) {
        const work = works[i];
        deleteOneWorkOnly(work);
    };
};


// Fonction de suppression d'une seule oeuvre dans la bdd (et dans le DOM)
function deleteOneWorkOnly(work) {
    const token = localStorage.getItem("token");
    const figureRemoved = document.getElementById("figureElement");
    const modalFigureRemoved = document.getElementById("modal-figure-element");
    figureRemoved.remove();
    modalFigureRemoved.remove();
    fetch("http://localhost:5678/api/works/" + work.id, {

            method: "DELETE",
            headers: {
                "Accept": "application/json",
                "Authorization": `Bearer ${token}`
            }
    })
    .then(console.log("Oeuvre supprimée !"))
};


// Fonction de rafraichissement de la galerie de la modale
function refreshModalGallery(works) {
    // Itérer sur les travaux
    for (let i = 0; i < works.length; i++) {
        const work = works[i];
        const modalFigureRemoved = document.getElementById("modal-figure-element");
        modalFigureRemoved.remove();
    };
};


// Mise à jour de l'affichage de la modale (modale1 / modale2)
const modalAddImageButton = document.querySelector(".modal-add-image-button");
const modalBackArrow = document.querySelector(".modal-back-arrow");
const modalDisplay1 = document.querySelector(".modal-display-1");
const modalDisplay2 = document.querySelector(".modal-display-2");
function switchModalDisplay() {
    // Affichage "Galerie photo" (-> modale1)
    modalBackArrow.addEventListener("click", function() {
        modalDisplay1.style.display = "flex";
        modalDisplay2.style.display = "none";
        modalBackArrow.style.visibility = "hidden";
    });
    // Affichage "Ajout photo" (-> modale2)
    modalAddImageButton.addEventListener("click", function() {
        modalBackArrow.style.visibility = "visible";
        modalDisplay1.style.display = "none";
        modalDisplay2.style.display = "flex";
    });
};


// Fonction d'ajout d'une nouvelle oeuvre dans la bdd (-> modale2)
function addOneWork(works) {
    const currentWorks = works;
    const modalForm = document.querySelector(".modal-form");
    modalForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");

        const formImgFile = document.getElementById("file").files[0];
        const formTitle = document.getElementById("title").value;
        const formCategoryId = document.getElementById("category-id").value;

        const formData = new FormData();
        formData.append("image", formImgFile);
        formData.append("title", formTitle);
        formData.append("category", formCategoryId);

        // const submitButton = document.getElementById("form-submit-button");
        // submitButton.style.backgroundColor = "#1D6154";

        
        // deleteWorksMainGallery(currentWorks);
        // refreshModalGallery(currentWorks);

        fetch("http://localhost:5678/api/works", {

            method: "POST",
            headers: {
                "accept": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: formData
        })
        .then(response => response.json())
        .then(function(newWork) {
            console.log(newWork);
            
            // fetch("http://localhost:5678/api/works")
            //     .then(response => response.json())
                // .then(works => pageManager(works))
                // .then(works => filterButtons(works))
            console.log("DOM mis à jour !")
            const figureElement = createElements(newWork);
            attachElements(figureElement);
            const modalFigureElement = createModalElements(newWork);
            attachModalElements(modalFigureElement);
            console.log("La nouvelle oeuvre est bien affichée !");
            deleteOneModalWork(newWork, figureElement, modalFigureElement);
        })
        .catch(error => console.log(error))
    })
};


// Fonction d'affichage de l'image chargée depuis le formulaire d'ajout
const previewPicture = function(e) {
    const [picture] = e.files;
    const imageFormUploaded = document.getElementById("image-form-uploaded");
    const addImageFormLabel = document.getElementById("add-image-form-label");
    const fileInput = document.getElementById("file");
    const formFileInputParagraph = document.getElementById("form-file-input-paragraph");

    const types = [ "image/jpg", "image/jpeg", "image/png" ];

    if (picture && types.includes(picture.type)) {

        imageFormUploaded.style.display = "block";
        addImageFormLabel.style.display = "none";
        fileInput.style.display = "none";
        formFileInputParagraph.style.display = "none";

        const reader = new FileReader();
        reader.onload = function(e) {
            imageFormUploaded.src = e.target.result;
        };
        reader.readAsDataURL(picture);
    };
    imageFormUploaded.addEventListener("click", function() {
        // ICI: détection d'un bug si on charge une autre image trop de fois.
        // Bug en question: le input type=file rouvre le navigateur au lieu 
        // d'afficher tout de suite l'image sélectionnée.
        document.getElementById("file").click();
    });
};
