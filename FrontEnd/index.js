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
    openModalButton();
    escapeAndTabKeys();
    switchModalDisplay();
    addOneWork(data);
    clickOnThePicture();
    previewPicture();
    deleteAllWorksLink(data);
    filterButtons(data);
};


// Gestion de l'affichage des travaux dans les galeries
function showWorks(data) {
    let works = data;
    // Itérer sur les travaux
    for (let i = 0; i < works.length; i++) {
        const work = works[i];
        const figureElement = createElements(work);
        attachElements(figureElement);
        const modalFigureElement = createModalElements(work);
        attachModalElements(modalFigureElement);
        deleteOneModalWorkBin(works, work, figureElement, modalFigureElement);
    };
};


// Fonction de suppression de tous les travaux de la galerie principale
function deleteWorksMainGallery(data) {
    let works = data;
    // Itérer sur les travaux
    for (let i = 0; i < works.length; i++) {
        const work = works[i];
        removeElements();
    };
};


// Fonction de suppression d'un seul élément de la galerie principale
function removeElements() {
    const figureRemoved = document.getElementById("figureElement");
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
function filterButtons(data) {
    let works = data;
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
            if (currentWorks !== undefined) {
                deleteWorksMainGallery(currentWorks);
            } else if (currentWorks === undefined) {
                deleteWorksMainGallery(works);
            };
            const filteredWorks = works;
            showWorks(filteredWorks);
            currentWorks = filteredWorks;
        };
    });
    };
};


// Fonction de filtrage
function filters(data, currentWorks, categoryId) {
    let works = data;
    if (currentWorks !== undefined) {
        deleteWorksMainGallery(currentWorks);
    } else if (currentWorks === undefined) {
        deleteWorksMainGallery(works);
    };
    const filteredWorks = works.filter(work => parseInt(work.categoryId, 10) === categoryId);
    showWorks(filteredWorks);
    currentWorks = filteredWorks;
    return currentWorks;
};


// Gestion de l'affichage en mode connecté/déconnecté
function loginLogoutDisplay() {
    const headerLoginButton = document.querySelector("#header-login-button");
    const headerLogoutButton = document.querySelector("#header-logout-button");
    const filtersDiv = document.querySelector("#filters");
    const modifyImg = document.querySelector(".image-modify");
    const modifyArticle = document.querySelector(".article-modify");
    const modifyPortfolio = document.querySelector(".portfolio-modify");
    const loggedBlackStripe = document.querySelector(".logged-black-stripe");
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
    const headerLogoutButton = document.querySelector("#header-logout-button");
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
function deleteOneModalWorkBin(works, work, figureElement, modalFigureElement) {
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
        works.splice(works.indexOf(work), 1);
    });
};


// Lien rouge de suppression de tous les travaux (-> modale1)
function deleteAllWorksLink(works) {
    const deleteAllWorksLink = document.querySelector(".modal-delete-gallery");
    deleteAllWorksLink.addEventListener("click", function(e) {
        e.preventDefault();
        // Itérer sur les travaux
        for (let i = 0; i < works.length; i++) {
            const work = works[i];
            deleteOneWorkOnly(work);
        };
        works = [];
        pageManager(works);
    });
};


// Fonction de suppression d'une oeuvre dans la bdd avec actualisation du DOM (-> modale1)
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


// Fonction de rafraichissement de toute la galerie de la modale (-> modale1)
function refreshModalGallery(works) {
    // Itérer sur les travaux
    for (let i = 0; i < works.length; i++) {
        const work = works[i];
        const modalFigureRemoved = document.getElementById("modal-figure-element");
        modalFigureRemoved.remove();
    };
};


// Passage d'un affichage de la modale à un autre (modale1 / modale2)
function switchModalDisplay() {
    const modalAddImageButton = document.querySelector(".modal-add-image-button");
    const modalBackArrow = document.querySelector(".modal-back-arrow");
    const modalDisplay1 = document.querySelector(".modal-display-1");
    const modalDisplay2 = document.querySelector(".modal-display-2");
    const imageFormUploaded = document.getElementById("image-form-uploaded");
    const modalFormLandscapeIcon = document.querySelector(".modal-form-landscape-icon");
    const addImageFormLabel = document.getElementById("add-image-form-label");
    const fileInput = document.getElementById("file");
    const formFileInputParagraph = document.getElementById("form-file-input-paragraph");
    const submitButton = document.querySelector("#form-submit-button");
    // Affichage "Galerie photo" (-> modale1)
    modalBackArrow.addEventListener("click", function() {
        resetForm();
        modalDisplay1.style.display = "flex";
        modalDisplay2.style.display = "none";
        modalBackArrow.style.visibility = "hidden";
        imageFormUploaded.style.display = "none";
        modalFormLandscapeIcon.style.display = "flex";
        addImageFormLabel.style.display = "flex";
        fileInput.style.display = "flex";
        formFileInputParagraph.style.display = "flex";
        submitButton.style.backgroundColor = "#A7A7A7";
    });
    // Affichage "Ajout photo" (-> modale2)
    modalAddImageButton.addEventListener("click", function() {
        resetForm()
        modalBackArrow.style.visibility = "visible";
        modalDisplay1.style.display = "none";
        modalDisplay2.style.display = "flex";
        imageFormUploaded.style.display = "none";
        modalFormLandscapeIcon.style.display = "flex";
        addImageFormLabel.style.display = "flex";
        fileInput.style.display = "flex";
        formFileInputParagraph.style.display = "flex";
        submitButton.style.backgroundColor = "#A7A7A7";
    });
};


// Fonction de réinitialisation du formulaire (-> modale2)
function resetForm() {
    document.querySelector(".modal-form").reset();
}


// Fonction d'ajout d'une nouvelle oeuvre avec actualisation du DOM (-> modale2)
function addOneWork(data) {
    let works = data;
    submitButtonColor();
    const modalForm = document.querySelector(".modal-form");
    modalForm.addEventListener("submit", (e) => {
        e.preventDefault();

        // On récupère le jeton porteur
        const token = localStorage.getItem("token");

        // On élabore notre objet formData
        const formData = new FormData();
        const formImgFile = document.getElementById("file").files[0];
        const formTitle = document.getElementById("title").value;
        const formCategoryId = document.getElementById("category-id").value;
        formData.append("image", formImgFile);
        formData.append("title", formTitle);
        formData.append("category", formCategoryId);

        // On appelle l'api avec fetch et le verbe POST
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
            works.push(newWork);

            // Apparition de newWork dans le DOM
            const figureElement = createElements(newWork);
            attachElements(figureElement);
            const modalFigureElement = createModalElements(newWork);
            attachModalElements(modalFigureElement);

            // On appelle la fonction de suppression avec la nouvelle oeuvre en argument
            deleteOneModalWorkBin(works, newWork, figureElement, modalFigureElement);

            // On réinitialise le formulaire d'ajout ainsi que son affichage
            resetForm();
            document.querySelector("#image-form-uploaded").style.display = "none";
            document.querySelector(".modal-form-landscape-icon").style.display = "flex";
            document.querySelector("#add-image-form-label").style.display = "flex";
            document.querySelector("#file").style.display = "flex";
            document.querySelector("#form-file-input-paragraph").style.display = "flex";
            document.querySelector("#form-submit-button").style.backgroundColor = "#A7A7A7";
        })
        .catch(error => console.log(error))
    })
    modalAfterSubmit();
};


// Appel de fermeture de la modale après ajout d'une oeuvre
function modalAfterSubmit() {
    const modalForm = document.querySelector(".modal-form");
    modalForm.addEventListener("submit", closeModal);
};


// Fonction d'affichage de la miniature dans le formulaire d'ajout (-> modale2)
const previewPicture = function(e) {
    const imageFormUploaded = document.getElementById("image-form-uploaded");
    const modalFormLandscapeIcon = document.querySelector(".modal-form-landscape-icon");
    const addImageFormLabel = document.getElementById("add-image-form-label");
    const fileInput = document.getElementById("file");
    const formFileInputParagraph = document.getElementById("form-file-input-paragraph");

    fileInput.addEventListener("change", function() {

        imageFormUploaded.style.display = "block";
        modalFormLandscapeIcon.style.display = "none";
        addImageFormLabel.style.display = "none";
        fileInput.style.display = "none";
        formFileInputParagraph.style.display = "none";

        const reader = new FileReader();
        reader.readAsDataURL(fileInput.files[0]);

        reader.onload = function(e) {
            imageFormUploaded.src = e.target.result;
        };
    });
};


// Fonction de clic sur la miniature pour changer d'image (-> modale2)
function clickOnThePicture() {
    const imageFormUploaded = document.getElementById("image-form-uploaded");
    imageFormUploaded.addEventListener("click", function() {
        document.getElementById("file").click();
    });
};


// Bouton "submit" du formulaire d'ajout: changement de couleur (-> modale2)
function submitButtonColor() {
    const modalForm = document.querySelector(".modal-form");
    const submitButton = document.querySelector("#form-submit-button");
    const fileInput = document.querySelector("#file");
    const titleInput = document.querySelector("#title");
    const selectCategory = document.querySelector("#category-id");

    modalForm.addEventListener("change", (event) => {
        console.log(fileInput.value);
        if (fileInput.value !== "" && titleInput.value !== "" && selectCategory.value !== "") {
            submitButton.style.backgroundColor = "#1D6154";
        } else {
            submitButton.style.backgroundColor = "#A7A7A7";
        };
    });
};


