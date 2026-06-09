const objectsCategoryId = 1;
const apartmentsCategoryId = 2;
const hotelsAndRestaurantsCategoryId = 3;

let allWorks = [];
let currentFilter = "all";
let newWorkIds = [];

fetchWorks().then(works => {
    allWorks = works;
    showWorks(works);
});
document.addEventListener("DOMContentLoaded", pageManager);


// Fonction de récupération des travaux depuis l'API
async function fetchWorks() {
    const response = await fetch("http://localhost:5678/api/works");
    return response.json();
}


// Fonction de gestion de la page
function pageManager() {
    // Authentification
    loginLogoutDisplay();
    logoutMainPage();

    // Bouton de retour en haut de page
    backToTopButton();

    // Menu hamburger de la page d'accueil
    initBurgerMenu(".burger-menu", ".burger-menu-links");

    // Galerie principale & modale
    openModalButton();
    escapeAndTabKeys();
    switchModalDisplay();
    clickOnThePicture();
    previewPicture();
    filterButtons();
    addOneWork();
    deleteAllWorksLink();
}

// Fonction pour basculer l'état du menu
function toggleMenu(menu, isOpen) {
    if (isOpen) {
        menu.style.opacity = "1";
        menu.style.visibility = "visible";
        menu.style.transform = "translateY(0)";
    } else {
        menu.style.opacity = "0";
        menu.style.visibility = "hidden";
        menu.style.transform = "translateY(-10px)";
    }
}

// Fonction générique pour un menu hamburger
function initBurgerMenu(buttonSelector, listSelector) {
    const button = document.querySelector(buttonSelector);
    const list = document.querySelector(listSelector);
    if (!button || !list) return;

    let isOpen = false;

    button.addEventListener("click", (e) => {
        e.stopPropagation();
        isOpen = !isOpen;
        toggleMenu(list, isOpen);
    });

    document.addEventListener("click", (e) => {
        if (isOpen && !button.contains(e.target) && !list.contains(e.target)) {
            isOpen = false;
            toggleMenu(list, isOpen);
        }
    });
}


// Gestion de l'affichage des travaux dans les deux galeries (principale & modale)
// Les oeuvres déjà présentes en base ne sont pas supprimables individuellement (pas de bouton "poubelle")
function showWorks(works) {
    for (let i = 0; i < works.length; i++) {
        const work = works[i];
        const figureElement = createElements(work);
        attachElements(figureElement);
        const modalFigureElement = createModalElements(work, false);
        attachModalElements(modalFigureElement);
    };
};


// Gestion de l'affichage des travaux dans la galerie principale uniquement (filtrage)
function showFilteredWorks(works) {
    for (let i = 0; i < works.length; i++) {
        const figureElement = createElements(works[i]);
        attachElements(figureElement);
    };
};


// Fonction de suppression de tous les travaux de la galerie principale
function deleteWorksMainGallery() {
    document.querySelector(".gallery").innerHTML = "";
};


// Création des éléments dans la galerie principale
function createElements(work) {
    const imageElement = document.createElement("img");
    imageElement.src = work.imageUrl;
    const nameElement = document.createElement("figcaption");
    nameElement.innerText = work.title;
    const figureElement = document.createElement("figure");
    figureElement.setAttribute("id", "figure-" + work.id);
    figureElement.appendChild(imageElement);
    figureElement.appendChild(nameElement);
    return figureElement;
};


// Rattachement au parent dans la galerie principale
function attachElements(figureElement) {
    const gallery = document.querySelector(".gallery");
    gallery.appendChild(figureElement);
};


// Paramètres de tri des travaux courants
function filterParameters(parameter) {
    currentFilter = parameter;
    deleteWorksMainGallery();
    if (parameter === "all") {
        showFilteredWorks(allWorks);
        return;
    }
    let categoryId;
    if (parameter === "objects") { categoryId = objectsCategoryId; }
    else if (parameter === "apartments") { categoryId = apartmentsCategoryId; }
    else if (parameter === "hotels-and-restaurants") { categoryId = hotelsAndRestaurantsCategoryId; }
    filters(categoryId);
}


// Boutons de filtres
function filterButtons() {
    const buttons = document.querySelectorAll("#filters button");

    function setActiveButton(activeBtn) {
        buttons.forEach(btn => {
            btn.style.backgroundColor = "";
            btn.style.color = "";
        });
        activeBtn.style.backgroundColor = "#1D6154";
        activeBtn.style.color = "#FFFEF8";
    }

    // "Tous" actif par défaut au chargement
    const allButton = document.getElementById("all");
    if (allButton) setActiveButton(allButton);

    buttons.forEach(btn => {
        btn.addEventListener("click", function () {
            setActiveButton(this);
            filterParameters(this.id);
        });
    });
};


// Fonction de filtrage (synchrone, depuis le cache)
function filters(categoryId) {
    const filteredWorks = allWorks.filter(work => parseInt(work.categoryId, 10) === categoryId);
    showFilteredWorks(filteredWorks);
};


// Gestion de l'affichage en mode connecté/déconnecté
function loginLogoutDisplay() {
    const headerLoginButton = document.querySelector(".header-login-button");
    const headerLogoutButton = document.querySelector(".header-logout-button");
    const headerLoginButtonBurgerMenu = document.querySelector(".header-login-button2");
    const headerLogoutButtonBurgerMenu = document.querySelector(".header-logout-button2");
    const filtersDiv = document.querySelector("#filters");
    const modifyImg = document.querySelector(".image-modify");
    const modifyArticle = document.querySelector(".article-modify");
    const modifyPortfolio = document.querySelector(".portfolio-modify");
    const loggedBlackStripe = document.querySelector(".logged-black-stripe");
    if (sessionStorage.getItem("token")) {
        headerLoginButton.style.display = "none";
        headerLogoutButton.style.display = "block";
        headerLoginButtonBurgerMenu.style.display = "none";
        headerLogoutButtonBurgerMenu.style.display = "block";
        modifyImg.style.display = "block";
        modifyArticle.style.display = "block";
        modifyPortfolio.style.display = "block";
        filtersDiv.style.visibility = "visible";
        loggedBlackStripe.style.display = "flex";
    } else {
        headerLoginButton.style.display = "block";
        headerLogoutButton.style.display = "none";
        headerLoginButtonBurgerMenu.style.display = "block";
        headerLogoutButtonBurgerMenu.style.display = "none";
        modifyImg.style.display = "none";
        modifyArticle.style.display = "none";
        modifyPortfolio.style.display = "none";
        filtersDiv.style.visibility = "visible";
        loggedBlackStripe.style.display = "none";
    };
};


// Bouton flottant de retour en haut de page (visible uniquement quand l'utilisateur a scrollé vers le bas)
function backToTopButton() {
    const button = document.getElementById("back-to-top-button");
    const showThreshold = 200;

    window.addEventListener("scroll", function() {
        button.classList.toggle("visible", window.scrollY > showThreshold);
    });

    button.addEventListener("click", function() {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
};


// Boutons de déconnexion de la page d'accueil
function logoutMainPage() {
    const headerLogoutButton = document.querySelector(".header-logout-button");
    const headerLogoutButtonBurgerMenu = document.querySelector(".header-logout-button2");
    headerLogoutButton.addEventListener("click", function () {
        sessionStorage.removeItem("token");
        loginLogoutDisplay();
    });
    headerLogoutButtonBurgerMenu.addEventListener("click", function () {
        sessionStorage.removeItem("token");
        loginLogoutDisplay();
    })
};




////////// Gestion de la boîte modale //////////
const focusableSelector = "button, a, input, textarea";
let focusables = [];
let modal = null;
let previouslyFocusedElement = null;


// Fonction d'ouverture de la modale
function openModal(e) {
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
function closeModal(e) {
    if (modal === null) return;
    // Quand déclenchée par le listener du backdrop, ne fermer que si le clic
    // a réellement touché le fond (#modal lui-même), pas un élément intérieur.
    if (e && e.type === "click" && e.currentTarget === modal && e.target !== modal) return;
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
// Le bouton "poubelle" n'est créé que pour les oeuvres nouvellement ajoutées (isNewWork = true)
function createModalElements(work, isNewWork) {
    const modalImageElement = document.createElement("img");
    modalImageElement.src = work.imageUrl;
    const modalFigureCaption = document.createElement("figcaption");
    modalFigureCaption.innerText = "éditer";
    const modalFigureElement = document.createElement("figure");
    modalFigureElement.setAttribute("id", "modal-figure-" + work.id);
    modalFigureElement.appendChild(modalImageElement);
    if (isNewWork) {
        const deleteButton = document.createElement("button");
        deleteButton.setAttribute("id", "work-" + work.id);
        deleteButton.classList.add("delete-button");
        const deleteIcon = document.createElement("i");
        deleteIcon.classList.add("fa-solid", "fa-trash-can");
        deleteButton.appendChild(deleteIcon);
        modalFigureElement.appendChild(deleteButton);
    }
    modalFigureElement.appendChild(modalFigureCaption);
    return modalFigureElement;
};


// Fonction de rattachement au parent dans la galerie de la modale
function attachModalElements(modalFigureElement) {
    const modalGallery = document.querySelector(".modal-gallery");
    modalGallery.appendChild(modalFigureElement);
};


// Boutons "poubelle" pour supprimer l'un des travaux (-> modale1)
function deleteOneModalWorkBin(work, modalFigureElement) {
    const deleteButton = document.getElementById("work-" + work.id);
    deleteButton.addEventListener("click", function(e) {
        e.stopPropagation();
        e.preventDefault();
        const token = sessionStorage.getItem("token");
        modalFigureElement.remove();
        const currentFigure = document.getElementById("figure-" + work.id);
        if (currentFigure) currentFigure.remove();
        fetch("http://localhost:5678/api/works/" + work.id, {
                method: "DELETE",
                headers: {
                    "Accept": "application/json",
                    "Authorization": `Bearer ${token}`
                }
        })
        .then(() => {
            allWorks = allWorks.filter(w => w.id !== work.id);
            newWorkIds = newWorkIds.filter(id => id !== work.id);
            updateDeleteGalleryLinkState();
            console.log("Oeuvre supprimée !");
        });
    });
};


// Lien rouge de suppression de tous les travaux (-> modale1)
// Ne supprime que les oeuvres nouvellement ajoutées : celles déjà en base sont protégées
function deleteAllWorksLink() {
    const deleteAllWorksLink = document.querySelector(".modal-delete-gallery");
    updateDeleteGalleryLinkState();
    deleteAllWorksLink.addEventListener("click", function(e) {
        e.stopPropagation();
        e.preventDefault();
        if (newWorkIds.length === 0) return;
        const worksToDelete = allWorks.filter(work => newWorkIds.includes(work.id));
        allWorks = allWorks.filter(work => !newWorkIds.includes(work.id));
        newWorkIds = [];
        for (let i = 0; i < worksToDelete.length; i++) {
            deleteOneWorkOnly(worksToDelete[i]);
        }
        updateDeleteGalleryLinkState();
    });
};


// Grise le lien "Supprimer la galerie" tant qu'aucune oeuvre n'a été nouvellement ajoutée
function updateDeleteGalleryLinkState() {
    const deleteAllWorksLink = document.querySelector(".modal-delete-gallery");
    deleteAllWorksLink.classList.toggle("modal-delete-gallery-disabled", newWorkIds.length === 0);
};


// Fonction de suppression d'une oeuvre dans la bdd avec actualisation du DOM (-> modale1)
function deleteOneWorkOnly(work) {
    const token = sessionStorage.getItem("token");
    const figureRemoved = document.getElementById("figure-" + work.id);
    const modalFigureRemoved = document.getElementById("modal-figure-" + work.id);
    if (figureRemoved) figureRemoved.remove();
    if (modalFigureRemoved) modalFigureRemoved.remove();
    fetch("http://localhost:5678/api/works/" + work.id, {
            method: "DELETE",
            headers: {
                "Accept": "application/json",
                "Authorization": `Bearer ${token}`
            }
    })
    .then(() => console.log("Oeuvre supprimée !"))
};


// Fonction de rafraichissement de toute la galerie de la modale (-> modale1)
function refreshModalGallery() {
    document.querySelector(".modal-gallery").innerHTML = "";
};


// Retour à la vue "Galerie photo" de la modale (modale1)
function goToModalDisplay1() {
    resetForm();
    document.querySelector(".modal-display-1").style.display = "flex";
    document.querySelector(".modal-display-2").style.display = "none";
    document.querySelector(".modal-back-arrow").style.visibility = "hidden";
    document.getElementById("image-form-uploaded").style.display = "none";
    document.querySelector(".modal-form-landscape-icon").style.display = "flex";
    document.getElementById("add-image-form-label").style.display = "flex";
    document.getElementById("file").style.display = "flex";
    document.getElementById("form-file-input-paragraph").style.display = "flex";
    document.querySelector("#form-submit-button").style.backgroundColor = "#A7A7A7";
};


// Passage d'un affichage de la modale à un autre (modale1 / modale2)
function switchModalDisplay() {
    const modalAddImageButton = document.querySelector(".modal-add-image-button");
    const modalBackArrow = document.querySelector(".modal-back-arrow");
    const fileInput = document.getElementById("file");
    const submitButton = document.querySelector("#form-submit-button");
    // Affichage "Galerie photo" (-> modale1)
    modalBackArrow.addEventListener("click", function() {
        goToModalDisplay1();
    });
    // Affichage "Ajout photo" (-> modale2)
    modalAddImageButton.addEventListener("click", function() {
        resetForm();
        modalBackArrow.style.visibility = "visible";
        document.querySelector(".modal-display-1").style.display = "none";
        document.querySelector(".modal-display-2").style.display = "flex";
        document.getElementById("image-form-uploaded").style.display = "none";
        document.querySelector(".modal-form-landscape-icon").style.display = "flex";
        document.getElementById("add-image-form-label").style.display = "flex";
        fileInput.style.display = "flex";
        document.getElementById("form-file-input-paragraph").style.display = "flex";
        submitButton.style.backgroundColor = "#A7A7A7";
    });
};


// Fonction de réinitialisation du formulaire (-> modale2)
function resetForm() {
    document.querySelector(".modal-form").reset();
}


// Fonction d'ajout d'une nouvelle oeuvre avec actualisation du DOM (-> modale2)
function addOneWork() {
    submitButtonColor();
    const modalForm = document.querySelector(".modal-form");
    modalForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const token = sessionStorage.getItem("token");

        const formData = new FormData();
        const formImgFile = document.getElementById("file").files[0];
        const formTitle = document.getElementById("title").value;
        const formCategoryId = document.getElementById("category-id").value;
        formData.append("image", formImgFile);
        formData.append("title", formTitle);
        formData.append("category", formCategoryId);

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
            allWorks.push(newWork);
            newWorkIds.push(newWork.id);

            // Galerie principale : re-rendu en respectant le filtre courant
            filterParameters(currentFilter);

            // Galerie de la modale (oeuvre nouvellement ajoutée -> bouton "poubelle" visible)
            const modalFigureElement = createModalElements(newWork, true);
            attachModalElements(modalFigureElement);
            deleteOneModalWorkBin(newWork, modalFigureElement);
            updateDeleteGalleryLinkState();

            // Retour à la galerie de la modale sans fermer la fenêtre
            goToModalDisplay1();
        })
        .catch(error => console.log(error));
    });
};


// Fonction d'affichage de la miniature dans le formulaire d'ajout (-> modale2)
function previewPicture() {
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
        if (fileInput.value !== "" && titleInput.value !== "" && selectCategory.value !== "") {
            submitButton.style.backgroundColor = "#1D6154";
        } else {
            submitButton.style.backgroundColor = "#A7A7A7";
        };
    });
};
