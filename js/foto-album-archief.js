let data = [];

console.log("JS gekoppeld");

async function getData() {
    const url = 'data/foto-data.json'; // Updated to load from the local JSON file

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        data = await response.json();
        console.log(data);

    } catch (error) {
        console.error(error.message);
    }
}

async function filterData() {
    console.log("called the filter..");

    let selectedAlbumYear = document.getElementById("jaar").value.toLowerCase();
    let selectedAlbumLocation = document.getElementById("locatie").value.toLowerCase();
    let selectedAlbumCategory = document.getElementById("categorie").value.toLowerCase();

    console.log(selectedAlbumLocation + " Selectedalbumlocation");
    console.log(selectedAlbumYear);
    console.log(selectedAlbumCategory);

    let filteredAlbums = data.filter(element => {
        const elementYear = element.year ? element.year.toLowerCase() : "";   
        const elementLocation = element["locatie-event"] ? element["locatie-event"].toLowerCase() : ""; 
        const elementCategory = element.category ? element.category.map(cat => cat.toLowerCase()) : [];

        let matchYear = selectedAlbumYear === "" || elementYear.includes(selectedAlbumYear);
        let matchLocation = selectedAlbumLocation === "" || elementLocation.includes(selectedAlbumLocation);
        let matchCategory = selectedAlbumCategory === "" || elementCategory.includes(selectedAlbumCategory);

        return matchYear && matchLocation && matchCategory;
    });

    console.log(filteredAlbums);
    displayData(filteredAlbums);
}

function displayData(filteredAlbums) {
    const resultsContainer = document.getElementById("filter-results");

    resultsContainer.innerHTML = "";
    const section = document.createElement("section");
    section.className = "archief";
  
    const container = document.createElement("div");
    container.className = "container";
  
    const row = document.createElement("div");
    row.className = "row";

    if (filteredAlbums.length > 0) {
        filteredAlbums.forEach(album => {
            const col = document.createElement("div");
            col.className = "col-xl-4 col-md-6";

            const card = document.createElement("div"); 
            card.className = "card"; 
            card.onclick = () => showDetails(album);

            const cardImage = document.createElement("div");
            cardImage.className = "card__image";

            const image = document.createElement("img"); 
            image.src = album.albumhoesfoto;

            const cardData = document.createElement("div"); 
            cardData.className = "card__data"; 

            const cardTitle = document.createElement("div");
            cardTitle.className = "card__title"; 
            cardTitle.innerHTML = album.title.substring(0, 36); // text-overflow in CSS will handle the rest

            const cardContent = document.createElement("div");
            cardContent.className = "card__content"; 
            cardContent.innerHTML = album.year; 

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

function showDetails(album) {
    const detailPopup = document.getElementById('detailPopup');
    detailPopup.innerHTML = `
        <div class="popup-content">
            <span class="close-btn" onclick="closePopup()">&times;</span>
            <h2>${album.title}</h2>
            <p><strong>Locatie:</strong> ${album["locatie-event"]}</p>
            <p><strong>Jaar:</strong> ${album.year}</p>
            <p><strong>Categorieën:</strong> ${album.category.join(', ')}</p>
            <a href="${album.permalink}" target="_blank">Bekijk evenement</a>
        </div>
    `;
    detailPopup.style.display = 'block';
}

function closePopup() {
    const detailPopup = document.getElementById('detailPopup');
    detailPopup.style.display = 'none';
}

var titles = [];
var albumYears = [];
var locations = [];
var categories = [];

function getAllLocations() {
    $('#locatie').empty();
    $('#locatie').append('<option value="">Locatie</option>');

    locations = [];
    data.forEach(function(album) {
        console.log(album["locatie-event"]); // Log the locatie-event property
        if (album["locatie-event"]) {
            const location = album["locatie-event"];
            if (!locations.includes(location)) {
                locations.push(location);
                $('#locatie').append('<option value="' + location + '">' + location + '</option>');
            }
        }
    });
}

function updateYearDropdown(selectedLocation = "") {
    let filteredYears = [];
    
    $('#jaar').empty();
    $('#jaar').append('<option value="">Jaar</option>');

    data.forEach(function (album) {
        if (selectedLocation === "" || (album["locatie-event"] && album["locatie-event"] === selectedLocation)) {
            if (!filteredYears.includes(album.year)) {
                filteredYears.push(album.year);
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

    data.forEach(function (album) { 
        if (selectedLocation === "" || (album["locatie-event"] && album["locatie-event"] === selectedLocation)) {
            if (album.category) {
                album.category.forEach(function (category) {
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
    await getData();

    getAllLocations();
    updateCategoryDropdown();
    updateYearDropdown();
    filterData();

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
        filterData();
    });
});
