let CartContainer = document.querySelector("#cart");
let totalPrice = document.querySelector("#totalPrice");

function getQueryParams() {
    const params = new URLSearchParams(window.location.search);
    return {
        name: params.get('name'),
        price: params.get('price'),
        image: params.get('image'),
    };
}

const carDetails = getQueryParams();
createCartPlaceHolder(carDetails.name, carDetails.price, carDetails.image);

function createCartPlaceHolder(name, price, image){
    console.log("rnsdf");
    let itemHtml = `
        <div class="product">
            <img src="${image}" alt="" class="productImage">
            <h4 class="productName">${name}</h4>
            <h5 class="productPrice">${price}</h5>
            <button class="removeButton">Remove from cart</button>
        </div>
    `
    CartContainer.innerHTML = CartContainer.innerHTML + itemHtml;
    
    let filteredPrice = parseFloat(price.replace(/[^0-9.-]+/g, ''));
    
    // Get current total price
    let currentPrice = parseFloat(totalPrice.innerText.replace(/[^0-9.-]+/g, '')) || 0;

    // Update total price with two decimal places
    let newTotalPrice = currentPrice + filteredPrice;

    // Format the total price to BRL with comma as decimal separator and always show two decimals
    totalPrice.innerText = "R$ " + newTotalPrice.toFixed(2).replace('.', ',') + "0,000.00";
}