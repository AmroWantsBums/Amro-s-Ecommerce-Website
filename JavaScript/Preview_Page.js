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

// Log the car details for debugging
console.log(carDetails.name);  // Access car name
console.log(carDetails.price); // Access car price
console.log(carDetails.image); // Access car image URL

// Select the HTML elements where car details will be displayed
let carImage = document.querySelector("#carImage"); // Get the image element
let carName = document.querySelector("#carName"); // Get the name element
let carPrice = document.querySelector("#carPrice"); // Get the price element

// Set the selected elements with the car details from the URL
carImage.src = carDetails.image; // Set the image source
carName.innerText = carDetails.name; // Set the name text
carPrice.innerText = carDetails.price; // Set the price text

console.log(carDetails.fetchLink); // Log the fetch link for debugging (if needed)

// Function to add the car to the cart
export function AddToCart() {
    const name = encodeURIComponent(carName.innerText); // Encode the car name for URL
    const price = encodeURIComponent(carPrice.innerText); // Encode the car price for URL
    const image = encodeURIComponent(carImage.src); // Encode the car image URL for URL

    // Redirect to the cart page with the car details as query parameters
    window.location.href = `../Cart/Cart.html?name=${name}&price=${price}&image=${image}`;
}
