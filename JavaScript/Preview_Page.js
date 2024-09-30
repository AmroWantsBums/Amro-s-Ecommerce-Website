function getQueryParams() {
    const params = new URLSearchParams(window.location.search);
    return {
        name: params.get('name'),
        price: params.get('price'),
        image: params.get('image'),
    };
}

const carDetails = getQueryParams();

console.log(carDetails.name);  // Access car name
console.log(carDetails.price); // Access car price
console.log(carDetails.image);

let carImage = document.querySelector("#carImage");
let carName = document.querySelector("#carName");
let carPrice = document.querySelector("#carPrice");

carImage.src = carDetails.image;
carName.innerText = carDetails.name;
carPrice.innerText = carDetails.price;


export function AddToCart(){

    const name = encodeURIComponent(carName.innerText);
    const price = encodeURIComponent(carPrice.innerText);
    const image = encodeURIComponent(carImage.src);

    window.location.href = `../Cart/Cart.html?name=${name}&price=${price}&image=${image}`;
}