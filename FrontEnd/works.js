
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


// Création des éléments
function createElements(work) {
    const imageElement = document.createElement("img");
    imageElement.src = work.imageUrl;
    const nameElement = document.createElement("figcaption");
    nameElement.innerText = work.title;
    const figureElement = document.createElement("figure");
    figureElement.appendChild(imageElement);
    figureElement.appendChild(nameElement);
    return figureElement;
};


// Rattachement des éléments au parent
function attachElements(figureElement) {
    const gallery = document.querySelector(".gallery");
    gallery.appendChild(figureElement);
};


// Implémentation des boutons de filtres
function filterButtons(data) {
    const works = data;
    const objectsCategoryId = 1;
    const apartmentsCategoryId = 2;
    const hotelsAndRestaurantsCategoryId = 3;
    // Bouton pour afficher tous les travaux
    const allWorksFilterButton = document.querySelector(".all");
    allWorksFilterButton.addEventListener("click", () => {
        const filteredWorks = works;
        showWorks(filteredWorks);
    });
    // Bouton pour filtrer par la catégorie "Objets"
    const objectsFilterButton = document.querySelector(".objects");
    objectsFilterButton.addEventListener("click", () => {
        const filteredWorks = works.filter(work => work.category.id === objectsCategoryId);
        showWorks(filteredWorks);
    });
    // Bouton pour filtrer par la catégorie "Appartements"
    const apartmentsFilterButton = document.querySelector(".apartments");
    apartmentsFilterButton.addEventListener("click", () => {
        const filteredWorks = works.filter(work => work.category.id === apartmentsCategoryId);
        showWorks(filteredWorks);
    });
    // Bouton pour filtrer par la catégorie "Hôtels & restaurants"
    const hotelsAndRestaurantsFilterButton = document.querySelector(".hotels-and-restaurants");
    hotelsAndRestaurantsFilterButton.addEventListener("click", () => {
        const filteredWorks = works.filter(work => work.category.id === hotelsAndRestaurantsCategoryId);
        showWorks(filteredWorks);
    });
};
    