let albumsData = [];

console.log("JS gekoppeld");

async function fetchData() {
    const apiUrl = '../data/foto-data.json'; // Easy changable 

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        albumsData = await response.json();
        console.log(albumsData);

    } catch (error) {
        console.error(error.message);
    }
}

async function filterAlbums() {
    console.log("called the filter..");

    let selectedYear = document.getElementById("jaar").value.toLowerCase();
    let selectedLocation = document.getElementById("locatie").value.toLowerCase();
    let selectedCategory = document.getElementById("categorie").value.toLowerCase();

    console.log(selectedLocation + " selectedLocation");
    console.log(selectedYear);
    console.log(selectedCategory);

    let filteredAlbums = albumsData.filter(AlbumItem => {
        const AlbumItemYear = AlbumItem.year ? AlbumItem.year.toLowerCase() : "";   
        const AlbumItemLocation = AlbumItem["locatie-event"] ? AlbumItem["locatie-event"].toLowerCase() : ""; 
        const AlbumItemCategories = AlbumItem.category ? AlbumItem.category.map(cat => cat.toLowerCase()) : [];

        let matchYear = selectedYear === "" || AlbumItemYear.includes(selectedYear);
        let matchLocation = selectedLocation === "" || AlbumItemLocation.includes(selectedLocation);
        let matchCategory = selectedCategory === "" || AlbumItemCategories.includes(selectedCategory);

        return matchYear && matchLocation && matchCategory;
    });

    console.log(filteredAlbums);
    displayAlbums(filteredAlbums);
}

function displayAlbums(filteredAlbums) {
    const resultsContainer = document.getElementById("filter-results");

    resultsContainer.innerHTML = "";
    const section = document.createElement("section");
    section.className = "archief";
  
    const container = document.createElement("div");
    container.className = "container";
  
    const row = document.createElement("div");
    row.className = "row";

    if (filteredAlbums.length > 0) {
        filteredAlbums.forEach(AlbumItem => {
            const col = document.createElement("div");
            col.className = "col-xl-4 col-md-6";

            const card = document.createElement("div"); 
            card.className = "card"; 
            card.onclick = () => showAlbumDetails(AlbumItem);

            const cardImage = document.createElement("div");
            cardImage.className = "card__image";

            const image = document.createElement("img"); 
            image.src = AlbumItem.albumhoesfoto;

            const cardData = document.createElement("div"); 
            cardData.className = "card__data"; 

            const cardTitle = document.createElement("div");
            cardTitle.className = "card__title"; 
            cardTitle.innerHTML = AlbumItem.title.substring(0, 36); // text-overflow in CSS will handle the rest

            const cardContent = document.createElement("div");
            cardContent.className = "card__content"; 
            cardContent.innerHTML = AlbumItem.year; 

            card.appendChild(cardImage);
            cardImage.appendChild(image); 
            card.appendChild(cardData); 
            cardData.appendChild(cardTitle); 
            cardData.appendChild(cardContent);

            col.appendChild(card); 
            row.appendChild(col);
        });

        section.appendChild(container);
        container.appendChild(row);
        resultsContainer.appendChild(section);
    } else {
        const noResults = document.createElement("p");
        noResults.textContent = "Geen zoekresultaten";
        resultsContainer.appendChild(noResults);
    }
}

function showAlbumDetails(AlbumItem) {
    const detailPopup = document.getElementById('detailPopup');
    detailPopup.innerHTML = `
        <div class="popup-content">
            <span class="close-btn" onclick="closePopup()">&times;</span>
            <h2>${AlbumItem.title}</h2>
            <p><strong>Locatie:</strong> ${AlbumItem["locatie-event"]}</p>
            <p><strong>Jaar:</strong> ${AlbumItem.year}</p>
            <p><strong>Categorieën:</strong> ${AlbumItem.category.join(', ')}</p>
            <a href="${AlbumItem.permalink}" target="_blank">Bekijk evenement</a>
        </div>
    `;
    detailPopup.style.display = 'block';
}

function closePopup() {
    const detailPopup = document.getElementById('detailPopup');
    detailPopup.style.display = 'none';
}

var allTitles = [];
var allYears = [];
var allLocations = [];
var allCategories = [];

function getAllLocations() {
    $('#locatie').empty();
    $('#locatie').append('<option value="">Locatie</option>');

    allLocations = [];
    albumsData.forEach(function(AlbumItem) {
        console.log(AlbumItem["locatie-event"]); // Log the locatie-event property
        if (AlbumItem["locatie-event"]) {
            const location = AlbumItem["locatie-event"];
            if (!allLocations.includes(location)) {
                allLocations.push(location);
                $('#locatie').append('<option value="' + location + '">' + location + '</option>');
            }
        }
    });
}

function updateYearDropdown(selectedLocation = "") {
    let filteredYears = [];
    
    $('#jaar').empty();
    $('#jaar').append('<option value="">Jaar</option>');

    albumsData.forEach(function (AlbumItem) {
        if (selectedLocation === "" || (AlbumItem["locatie-event"] && AlbumItem["locatie-event"] === selectedLocation)) {
            if (!filteredYears.includes(AlbumItem.year)) {
                filteredYears.push(AlbumItem.year);
            }
        }
    });

    filteredYears.sort(function(a, b){ return a - b });
    filteredYears.forEach(function(year) {
        $('#jaar').append('<option value="' + year + '">' + year + '</option>');
    });
}

function updateCategoryDropdown(selectedLocation = "") {
    let filteredCategories = [];

    $('#categorie').empty();
    $('#categorie').append('<option value="">Categorie</option>');

    albumsData.forEach(function (AlbumItem) { 
        if (selectedLocation === "" || (AlbumItem["locatie-event"] && AlbumItem["locatie-event"] === selectedLocation)) {
            if (AlbumItem.category) {
                AlbumItem.category.forEach(function (category) {
                    if (!filteredCategories.includes(category)) {
                        filteredCategories.push(category);
                        $('#categorie').append('<option value="' + category + '">' + category + '</option>');
                    }
                });
            }
        }
    });
}

$(document).ready(async function () {
    await fetchData();

    getAllLocations();
    updateCategoryDropdown();
    updateYearDropdown();
    filterAlbums();

    $('#locatie').change(function () {
        let selectedLocation = $(this).val();
        if (selectedLocation === "") {
            updateCategoryDropdown();
            updateYearDropdown();
        } else {
            updateCategoryDropdown(selectedLocation);
            updateYearDropdown(selectedLocation);
        }
    });

    const filterForm = $("#filter-form");

    filterForm.submit(function (event) {
        event.preventDefault();
        filterAlbums();
    });
});

fetch('../data/eventdata.json')
  .then(response => response.json())
  .then(eventsData => {
    posts = eventsData;
    doStuff();  
  })
  .catch(error => console.error('Error loading events:', error));
