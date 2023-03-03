
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
    let clickCounter = 0;
    let currentWorks;
    const objectsCategoryId = 1;
    const apartmentsCategoryId = 2;
    const hotelsAndRestaurantsCategoryId = 3;
    // Bouton pour afficher tous les travaux
    const allWorksFilterButton = document.querySelector(".all");
    allWorksFilterButton.addEventListener("click", () => {
        const filteredWorks = works;
        if (clickCounter === 0) {
            refreshGallery(works);
            showWorks(filteredWorks);
            console.log(currentWorks);
        } else if (clickCounter > 0 && currentWorks === undefined) {
            refreshGallery(filteredWorks);
            showWorks(filteredWorks);
            currentWorks = undefined;
            currentWorks = filteredWorks;
            console.log(currentWorks);
        } else if (clickCounter > 0 && currentWorks != undefined) {
            refreshGallery(filteredWorks);
            showWorks(currentWorks);
            currentWorks = undefined;
            currentWorks = filteredWorks;
            console.log(currentWorks);
        };
        clickCounter++;
    });
    // Bouton pour filtrer par la catégorie "Objets"
    const objectsFilterButton = document.querySelector(".objects");
    objectsFilterButton.addEventListener("click", () => {
        const filteredWorks = works.filter(work => work.category.id === objectsCategoryId);
        if (clickCounter === 0) {
            refreshGallery(works);
            showWorks(filteredWorks);
            console.log(currentWorks);
        } else if (clickCounter > 0 && currentWorks === undefined) {
            refreshGallery(filteredWorks);
            showWorks(filteredWorks);
            currentWorks = undefined;
            currentWorks = filteredWorks;
            console.log(currentWorks);
        } else if (clickCounter > 0 && currentWorks != undefined) {
            refreshGallery(filteredWorks);
            showWorks(currentWorks);
            currentWorks = undefined;
            currentWorks = filteredWorks;
            console.log(currentWorks);
        };
        clickCounter++;
    });
    // Bouton pour filtrer par la catégorie "Appartements"
    const apartmentsFilterButton = document.querySelector(".apartments");
    apartmentsFilterButton.addEventListener("click", () => {
        const filteredWorks = works.filter(work => work.category.id === apartmentsCategoryId);
        if (clickCounter === 0) {
            refreshGallery(works);
            showWorks(filteredWorks);
            console.log(currentWorks);
        } else if (clickCounter > 0 && currentWorks === undefined) {
            refreshGallery(filteredWorks);
            showWorks(filteredWorks);
            currentWorks = undefined;
            currentWorks = filteredWorks;
            console.log(currentWorks);
        } else if (clickCounter > 0 && currentWorks != undefined) {
            refreshGallery(filteredWorks);
            showWorks(currentWorks);
            currentWorks = undefined;
            currentWorks = filteredWorks;
            console.log(currentWorks);
        };
        clickCounter++;
    });
    // Bouton pour filtrer par la catégorie "Hôtels & restaurants"
    const hotelsAndRestaurantsFilterButton = document.querySelector(".hotels-and-restaurants");
    hotelsAndRestaurantsFilterButton.addEventListener("click", () => {
        const filteredWorks = works.filter(work => work.category.id === hotelsAndRestaurantsCategoryId);
        if (clickCounter === 0) {
            refreshGallery(works);
            showWorks(filteredWorks);
            console.log(currentWorks);
        } else if (clickCounter > 0 && currentWorks === undefined) {
            refreshGallery(filteredWorks);
            showWorks(filteredWorks);
            currentWorks = undefined;
            currentWorks = filteredWorks;
            console.log(currentWorks);
        } else if (clickCounter > 0 && currentWorks != undefined) {
            refreshGallery(filteredWorks);
            showWorks(currentWorks);
            currentWorks = undefined;
            currentWorks = filteredWorks;
            console.log(currentWorks);
        };
        clickCounter++;
    });
};
