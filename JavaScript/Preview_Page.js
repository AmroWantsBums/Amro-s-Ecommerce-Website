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

const carDetailse = getQueryParams(); // Fetch the car details from the URL

// Select the HTML elements where car details will be displayed
let carName = document.querySelector("#carName"); // Get the name element
let carDesc = document.querySelector("#carDesc"); // Get the description element

// Set the selected elements with the car details from the URL
carName.innerText = carDetailse.name; // Set the name text

// Array of descriptions
const descriptions = [
    `The Ferrari ${carDetailse.name} embodies the perfect blend of luxury and performance. With its sleek lines and aerodynamic design, this masterpiece is not just a car; it’s a statement. Every curve is meticulously crafted to enhance both aesthetics and functionality, making it a head-turner on the road and a true symbol of automotive excellence.`,
    
    `Under the hood, the Ferrari ${carDetailse.name} boasts an impressive engine that delivers exhilarating speed and responsiveness. With cutting-edge technology and engineering, it accelerates from 0 to 60 mph in mere seconds. Whether you're on the racetrack or cruising along a coastal highway, this vehicle promises an adrenaline rush like no other.`,
    
    `Ferrari has long been synonymous with innovation, and the ${carDetailse.name} is no exception. Equipped with the latest advancements in automotive technology, this car offers features such as advanced aerodynamics, adaptive suspension, and state-of-the-art infotainment systems. Every ride in the ${carDetailse.name} is an experience that combines tradition and modernity.`,
    
    `Step inside the Ferrari ${carDetailse.name}, and you'll be greeted by a world of luxury. The cabin is designed with premium materials, from leather to carbon fiber, ensuring that every detail speaks to quality and sophistication. With ergonomic seating and intuitive controls, driving the ${carDetailse.name} is as comfortable as it is thrilling.`,
    
    `Owning a Ferrari ${carDetailse.name} means joining an exclusive community of automotive enthusiasts. Ferrari owners share a passion for excellence and a love for the open road. From exhilarating track days to exclusive events, being a part of this legacy is as rewarding as driving the car itself.`
];

// Select a random description
const randomIndex = Math.floor(Math.random() * descriptions.length);
const randomDescription = descriptions[randomIndex];

// Insert the selected description into the carDesc element
carDesc.innerHTML = randomDescription;

const testDriveButton = document.querySelector("#testDriveButton");

testDriveButton.addEventListener("click", function(){
    window.location.href = "../Booking/Booking.html";
})