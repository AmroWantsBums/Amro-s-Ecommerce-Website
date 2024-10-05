// Function to get query parameters from the URL
function getQueryParams() {
    const params = new URLSearchParams(window.location.search); // Create a URLSearchParams object to parse the query string
    return {
        name: params.get('name'), // Get the car name from the URL
        price: params.get('price'), // Get the car price from the URL
        image: params.get('image'), // Get the car image URL from the URL
        fetchLink: params.get('fetchLink') // Get the fetch link (not used here but available)
    };
}

const carDetails = getQueryParams(); // Fetch the car details from the URL

// Select the HTML elements where car details will be displayed
let carImage = document.querySelector("#carImage"); // Get the image element
let carName = document.querySelector("#carName"); // Get the name element
let carPrice = document.querySelector("#carPrice"); // Get the price element

// Set the selected elements with the car details from the URL
carImage.src = carDetails.image; // Set the image source
carName.innerText = carDetails.name; // Set the name text
carPrice.innerText = carDetails.price; // Set the price text



