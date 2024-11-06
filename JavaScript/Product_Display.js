// Select the container where the products will be displayed
const Container = document.getElementById("main");

// Arrays to hold car names, prices, and fetch links
let carNames = [];
let carPrices = [];
let carFetchLinks = []; // Array to store fetch links for future use

// Uncomment the fetch logic and comment out the hardcoded data when ready

if (sessionStorage.getItem('carData')) {
    const carData = JSON.parse(sessionStorage.getItem('carData'));
    carNames = carData.carNames;
    carPrices = carData.carPrices;
    carFetchLinks = carData.carFetchLinks;
    createProducts(); // Call function to display products
} else {
// Fetch car data from the API

fetch('https://parallelum.com.br/fipe/api/v1/carros/marcas/20/modelos')
    .then((response) => response.json()) // Parse the response as JSON
    .then(data => {
        let carData = data.modelos; // Get the car models from the data
        carNames = carData.map(car => car.nome); // Extract car names
        let carCodes = carData.map(car => car.codigo); // Extract car codes

        // Fetch additional data for each car code
        return Promise.all(carCodes.map(code => {
            let fetchLink = `https://parallelum.com.br/fipe/api/v1/carros/marcas/20/modelos/${code}/anos`; // Store fetch link
            carFetchLinks.push(fetchLink); // Save the fetch link
            
            return fetch(fetchLink) // Fetch the years for the car
                .then(response => response.json())
                .then(yearData => {
                    let yearFetchLink = `https://parallelum.com.br/fipe/api/v1/carros/marcas/20/modelos/${code}/anos/${yearData[0].codigo}`; // Create year fetch link
                    return fetch(yearFetchLink) // Fetch the price for the most recent year
                        .then(response => response.json())
                        .then(priceData => {
                            return priceData.Valor; // Get the price
                        });
                });
        }));
    })
    .then(prices => {
        carPrices = prices; // Store the fetched prices
        createProducts(); // Call function to create product elements
        sessionStorage.setItem('carData', JSON.stringify({ carNames, carPrices, carFetchLinks }));
    });
}

// Function to create product elements and display them
function createProducts() {
    Container.innerHTML = carNames.map((name, index) => {
        const sanitizedName = name.replace(/\//g, ''); // Remove slashes from name to avoid issues
        return `
            <div class="product">
                <img src="./Images/${sanitizedName}.jpg" alt="Image of ferrari ${sanitizedName}" class="productImage"> <!-- Display car image -->
                <div class="deets">
                <h3 class="productName">${name}</h3> <!-- Display car name -->
                <h4 class="productPrice">${carPrices[index] || '$0.00'}</h4> <!-- Display car price -->
                <button class="viewButton" onclick="viewCarFunctionality(this, ${index})"><span>View</span></button> <!-- Button to view car details -->
                </div>
            </div>`;
    }).join(""); // Join the array of HTML strings into one
    addFunctionality();
}


// Function to handle viewing car details
function viewCarFunctionality(CarButton, index) {
    let parent = CarButton.closest(".product"); // Get the parent product element
    let priceElement = parent.querySelector('.productPrice'); // Get the price element
    let imageElement = parent.querySelector('.productImage'); // Get the image element
    let nameElement = parent.querySelector('.productName'); // Get the name element

    const name = encodeURIComponent(nameElement.innerText); // Encode the car name for URL
    const price = encodeURIComponent(priceElement.innerText); // Encode the car price for URL
    const image = encodeURIComponent(imageElement.src); // Encode the car image URL for URL
    const fetchLink = encodeURIComponent(carFetchLinks[index]); // Get the fetch link for this car

    // Redirect to the preview page with all the car details as query parameters
    window.location.href = `../Preview/Preview_Page.html?name=${name}&price=${price}&image=${image}&fetchLink=${fetchLink}`;
}

const performanceButton = document.querySelector("#viewPerformanceButton").addEventListener("click", function(){
    window.location.href = "../Performance/Performance.html";
})

function addFunctionality(){
    document.addEventListener('DOMContentLoaded', function() {
        const Hovers = document.querySelectorAll(".product");
        const Desc = document.querySelector("#desc");
        const searchBar = document.querySelector("#searchSection");

        Hovers.forEach(Hover => {
            Hover.addEventListener('mouseenter', function() {
                let Image = Hover.querySelector(".productImage");
                Image.classList.add("show");
    
                let deets = Hover.querySelector('.deets');
                deets.style.left = "30rem";
                Desc.style.opacity = "0";
                searchBar.style.opacity = "0";
                Hovers.forEach(otherHover => {
                    if (otherHover !== Hover) {
                        otherHover.style.width = "36rem";
                    } else {
                        otherHover.style.width = "68rem";
                    }
                });
            });
    
            Hover.addEventListener('mouseleave', function() {
                let Image = Hover.querySelector(".productImage");
                Image.classList.remove("show");
                
                let deets = Hover.querySelector('.deets');
                deets.style.left = "0rem";
                Desc.style.opacity = "1";
                searchBar.style.opacity = "1";
                Hovers.forEach(otherHover => {
                    otherHover.style.width = "36rem";
                });
            });
        });
    });
    
}

const searchInput = document.querySelector("#searchSection input"); // Select the search input
    searchInput.addEventListener("input", () => { // Listen for input changes
        const searchText = searchInput.value.toLowerCase(); // Get the lowercase search text
        const products = document.querySelectorAll(".product"); // Select all product elements

        products.forEach((product, index) => {
            const carName = carNames[index].toLowerCase(); // Get the car name for each product in lowercase
            if (carName.includes(searchText)) {
                product.style.display = ""; // Show if it matches
            } else {
                product.style.display = "none"; // Hide if it doesn't match
            }
        });
    });