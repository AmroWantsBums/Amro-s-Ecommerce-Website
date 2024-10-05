// Select the container where the products will be displayed
const Container = document.querySelector("#container");

// Arrays to hold car names, prices, and fetch links
let carNames = [];
let carPrices = [];
let carFetchLinks = []; // Array to store fetch links for future use

// Fetch car data from the API
fetch('https://parallelum.com.br/fipe/api/v1/carros/marcas/20/modelos')
    .then((response) => response.json()) // Parse the response as JSON
    .then(data => {
        console.log(data); // Log the fetched data for debugging
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

// Function to create product elements and display them
function createProducts() {
    Container.innerHTML = carNames.map((name, index) => {
        const sanitizedName = name.replace(/\//g, ''); // Remove slashes from name to avoid issues
        return `
            <div class="product">
                <img src="./Images/${sanitizedName}.jpg" alt="" class="productImage"> <!-- Display car image -->
                <h3 class="productName">
                    ${name} <!-- Display car name -->
                </h3>
                <h4 class="productPrice">
                    ${carPrices[index] || '$0.00'} <!-- Display car price, default to $0.00 if undefined -->
                </h4>
                <button class="viewButton" onclick="viewCarFunctionallity(this, ${index})">
                    View
                </button> <!-- Button to view car details -->
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
