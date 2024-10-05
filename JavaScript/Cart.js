let CartContainer = document.querySelector("#cart"); // Get the cart container element
let totalPrice = document.querySelector("#totalPrice"); // Get the total price element

// Function to get query parameters from the URL
function getQueryParams() {
    const params = new URLSearchParams(window.location.search); // Create a URLSearchParams object
    return {
        name: params.get('name'), // Get the car name from URL
        price: params.get('price'), // Get the car price from URL
        image: params.get('image'), // Get the car image URL from URL
    };
}

const carDetails = getQueryParams(); // Fetch the car details from URL params
createCartPlaceHolder(carDetails.name, carDetails.price, carDetails.image); // Create the cart item

// Function to create a placeholder in the cart for the product
function createCartPlaceHolder(name, price, image) {
    let itemHtml = `
        <div class="product"> <!-- Start of product div -->
            <img src="${image}" alt="" class="productImage"> <!-- Product image -->
            <h4 class="productName">${name}</h4> <!-- Product name -->
            <h5 class="productPrice">${price}</h5> <!-- Product price -->
        </div>
    `;
    
    // Append the new item HTML to the cart container
    CartContainer.innerHTML = CartContainer.innerHTML + itemHtml; 
    
    // Clean up the price string to get a number
    let filteredPrice = parseFloat(price.replace(/[^0-9.-]+/g, '')); 
    
    // Get the current total price, if there's no price yet, default to 0
    let currentPrice = parseFloat(totalPrice.innerText.replace(/[^0-9.-]+/g, '')) || 0; 

    // Calculate the new total price
    let newTotalPrice = currentPrice + filteredPrice;

    // Format the total price to BRL
    totalPrice.innerText = "R$ " + newTotalPrice.toFixed(2).replace('.', ',') + "0,000.00"; //I was struggling to get the format right because the brazillian currency uses commas to seperate the cents 
}

