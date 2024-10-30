// Select the container where the products will be displayed
const Container = document.getElementById("main");

// Arrays to hold car names, prices, and fetch links
let carNames = [];
let carPrices = [];
let carFetchLinks = []; // Array to store fetch links for future use

// Uncomment the fetch logic and comment out the hardcoded data when ready

// Fetch car data from the API
/*
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
        localStorage.setItem('carFetchLinks', JSON.stringify(carFetchLinks)); // Save fetch links to local storage
    });
*/

// Hardcoded data for testing
carNames = ['360 Spider 400cv', '360 Challenge Stradale', '575M Maranello F1 V12 515cv', '348 GTS 3.4', '348 GTS 3.4', '348 GTS 3.4', '348 GTS 3.4', '348 GTS 3.4']; // Example car names
carPrices = ['$20,000', '$25,000', '$30,000', '$40,000', '$50,000', '$60,000', '$70,000', '$80,000']; // Example car prices
carFetchLinks = ['https://parallelum.com.br/fipe/api/v1/carros/marcas/20/modelos/10624/anos', 'https://parallelum.com.br/fipe/api/v1/carros/marcas/20/modelos/10624/anos/2024-1', 'https://parallelum.com.br/fipe/api/v1/carros/marcas/20/modelos/10624/anos/2023-1']; // Example fetch links

// Call the function to create product elements
createProducts();

// Function to create product elements and display them
function createProducts() {
    Container.innerHTML = carNames.map((name, index) => {
        const sanitizedName = name.replace(/\//g, ''); // Remove slashes from name to avoid issues
        return `
            <div class="product">
                <img src="./Images/${sanitizedName}.jpg" alt="" class="productImage"> <!-- Display car image -->
                <div class="deets">
                <h3 class="productName">${name}</h3> <!-- Display car name -->
                <h4 class="productPrice">${carPrices[index] || '$0.00'}</h4> <!-- Display car price -->
                <button class="viewButton" onclick="viewCarFunctionallity(this, ${index})"><span>View</span></button> <!-- Button to view car details -->
                </div>
            </div>`;
    }).join(""); // Join the array of HTML strings into one
}


// Function to handle viewing car details
function viewCarFunctionallity(CarButton, index) {
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
