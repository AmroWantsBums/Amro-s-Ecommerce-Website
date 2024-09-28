const Container = document.querySelector("#container");

let carNames = [];
let carPrices = [];

fetch('https://parallelum.com.br/fipe/api/v1/carros/marcas/20/modelos')
    .then((response) => response.json())
    .then((data) => {
        console.log(data);
        let carData = data.modelos;
        carNames = carData.map(car => car.nome); 
        let carCodes = carData.map(car => car.codigo);

        return Promise.all(carCodes.map(code => {
            return fetch(`https://parallelum.com.br/fipe/api/v1/carros/marcas/20/modelos/${code}/anos`)
                .then(response => response.json())
                .then(yearData => {
                    return fetch(`https://parallelum.com.br/fipe/api/v1/carros/marcas/20/modelos/${code}/anos/${yearData[0].codigo}`)
                        .then(response => response.json())
                        .then(priceData => {
                            return priceData.Valor; // Get the price
                        });
                });
        }));
    })
    .then(prices => {
        carPrices = prices; 
        createProducts(); 
    });

function createProducts() {
    Container.innerHTML = carNames.map((name, index) => {
        const sanitizedName = name.replace(/\//g, '');        
        return `
            <div class="product">
                <img src="./Images/${sanitizedName}.jpg" alt="" class="productImage">
                <h3 class="productName">
                    ${name}
                </h3>
                <h4 class="productPrice">
                    ${carPrices[index] || '$0.00'} 
                </h4>
                <button class="viewButton" onclick="viewCarFunctionallity(this)">
                    View
                </button>
            </div>`;
    }).join("");
}

function viewCarFunctionallity(CarButton) {
    let parent = CarButton.closest(".product");
    let priceElement = parent.querySelector('.productPrice');
    let imageElement = parent.querySelector('.productImage');
    let nameElement = parent.querySelector('.productName');

    const name = encodeURIComponent(nameElement.innerText);
    const price = encodeURIComponent(priceElement.innerText);
    const image = encodeURIComponent(imageElement.src);

    window.location.href = `../Preview/Preview_Page.html?name=${name}&price=${price}&image=${image}`;
}
