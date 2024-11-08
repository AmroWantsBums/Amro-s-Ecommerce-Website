let HEIGHT = 590,
    WIDTH = 780;

const tooltipPlaceholder = document.getElementById('tooltipPlaceholder');    
const mainPanel = document.querySelector("#mainPanel");
const filterDisplay = document.querySelector("#filterSeperator");

// Create the SVG element in the specified container and set its height and width.
let svg = d3
    .select("#wordMap")
    .append("svg")
    .attr("height", HEIGHT)
    .attr("width", WIDTH);

let fixedRadius = 30;
const redShades = [
    'rgb(0, 0, 0)'  
];

// Function to select a random color from the redShades array.
function randomRedShade() {
    const randomIndex = Math.floor(Math.random() * redShades.length);
    return redShades[randomIndex];
}

// Function to fetch car data from the API.
function fetchCarData() {
    return fetch('https://parallelum.com.br/fipe/api/v1/carros/marcas/20/modelos')
        .then(response => response.json())
        .then(data => {
            let carData = data.modelos;
            let carCodes = carData.map(car => car.codigo);
            let carNames = carData.map(car => car.nome);

            return Promise.all(carCodes.map((code, index) => {
                return fetch(`https://parallelum.com.br/fipe/api/v1/carros/marcas/20/modelos/${code}/anos`)
                    .then(response => response.json())
                    .then(yearData => {
                        return fetch(`https://parallelum.com.br/fipe/api/v1/carros/marcas/20/modelos/${code}/anos/${yearData[0].codigo}`)
                            .then(response => response.json())
                            .then(priceData => {
                                return {
                                    name: carNames[index],
                                    valor: parseFloat(priceData.Valor.replace('R$', '').replace(/\./g, '').replace(',', '.')),
                                    fuel: priceData.Combustivel || 'Unknown',
                                    year: priceData.AnoModelo
                                };
                            });
                    });
            }));
        });
}

// Check sessionStorage for fetched car data
let fetchedCarData = sessionStorage.getItem('fetchedCarData');

if (fetchedCarData) {
    // If data exists in sessionStorage, parse and use it
    CreateBubbles(JSON.parse(fetchedCarData));
} else {
    // Fetch data from the API if it's not in sessionStorage
    fetchCarData()
        .then(results => {
            // Store the fetched car data in sessionStorage
            sessionStorage.setItem('fetchedCarData', JSON.stringify(results));
            // Pass the fetched car data to the CreateBubbles function for visualization
            CreateBubbles(results);
        })
        .catch(error => console.error('Error fetching car data:', error));
}

// The CreateBubbles function generates the visual representation of the data by creating circles for each car model.
function CreateBubbles(data) {
    document.getElementById('loading').style.display = 'none';
    let bubbles = svg
        .selectAll("circle")
        .data(data)
        .enter()
        .append('circle')
        .attr("r", fixedRadius)
        .attr("cx", () => Math.random() * WIDTH) // Random initial position.
        .attr("cy", () => Math.random() * HEIGHT)
        .style("fill", () => randomRedShade())
        .on("mouseenter", function(event, d) {
            d3.select(this)
                .style("cursor", "pointer")
                .transition()
                .duration(200)
                .attr("r", fixedRadius * 1.7)
                .style("fill", "rgb(147, 147, 0)")
                .on("end", () => d3.select(this).raise());
        
            d3.select(event.target)
                .style("opacity", 1)
                .style("fill", 'rgb(189, 177, 177)') // Highlight the hovered bubble.
                .transition()
                .duration(200)
                .attr("r", fixedRadius * 1.5); // Enlarge the bubble.
        })
        .on("mouseleave", function(event, d) {
            d3.select(this)
                .transition()
                .duration(200)
                .attr("r", fixedRadius)
                .style("fill", randomRedShade());
        
        })        
        .on("click", (event, d) => {
            const clickedCircle = d3.select(event.target);
            const clickedX = +clickedCircle.attr("cx");
            const clickedY = +clickedCircle.attr("cy");
            
            const newCircle = document.createElement('div');
            newCircle.classList.add('moving-circle');
            document.body.appendChild(newCircle);
            newCircle.style.position = 'absolute'; 
            const svgRect = svg.node().getBoundingClientRect();
            newCircle.style.left = `${clickedX + svgRect.left}px`;
            newCircle.style.top = `${clickedY + svgRect.top + window.scrollY}px`; 

            const targetX = 1138; 
            const targetY = 360 + window.scrollY; 
        
            setTimeout(() => {
                newCircle.style.transition = 'left 0.5s ease, top 0.5s ease';
                newCircle.style.left = `${targetX}px`;
                newCircle.style.top = `${targetY}px`;
                
                setTimeout(() => {
                    newCircle.remove();
                    tooltipPlaceholder.style.transform = 'translateX(-47rem)'; 
                    mainPanel.style.opacity = "0";
                    setTimeout(() => {
                        d3.select("#tooltip")
                            .style("display", "flex")
                            .style("opacity", 1)
                            .style("flex-direction", "column")
                            .style("align-items", "center")
                            .style("justify-content", "center")
                            .select("#tooltipName").text(d.name);
                        
                        d3.select("#tooltip")
                            .select("#tooltipPrice").text(`Price: R$${d.valor.toFixed(2)}`);
                        
                        // Randomly select facts for each attribute
                        d3.select("#tooltip")
                            .select("#tooltipHorsepower").text(`Horsepower: ${getRandomFact(horsepowerOptions)}`);
                        d3.select("#tooltip")
                            .select("#tooltipTopSpeed").text(`Top Speed: ${getRandomFact(topSpeedOptions)}`);
                        d3.select("#tooltip")
                            .select("#tooltipFuelEfficiency").text(`Fuel Efficiency: ${getRandomFact(fuelEfficiencyOptions)}`);
                        d3.select("#tooltip")
                            .select("#tooltipZeroToSixty").text(`0-60 mph: ${getRandomFact(zeroToSixtyOptions)}`);
                        d3.select("#tooltip")
                            .select("#tooltipPopularity").text(`Special Note: ${getRandomFact(popularityOptions)}`);
                        
                        d3.select("#tooltip")
                            .select(".tooltipImage")
                            .attr("src", `../Catalogue/Images/${d.name.replace(/\//g, '')}.jpg`);
                        
                        d3.select("#tooltip")
                            .select(".tooltipImage")
                            .attr("alt", `Image of ferrari ${d.name.replace(/\//g, '')}`);
                        
    
                        
                        const resetButton = document.createElement('button');
                        const resetText = document.createElement('span'); 
                        resetText.textContent = "Reset"; 
                        resetButton.appendChild(resetText); 
                        resetButton.classList.add("ResetButton");
                        resetButton.style.position = 'fixed';
                        resetButton.style.top = '30rem'; 
                        resetButton.style.left = '22.9rem'; 
                        resetButton.style.zIndex = '1000'; 
                        resetButton.onclick = () => {
                            bubbles.style("opacity", 1).attr("r", fixedRadius); 
                            d3.select("#tooltip").style("display", "none").style("opacity", 0);
                            tooltipPlaceholder.style.transform = 'translateX(0rem)'; 
                            mainPanel.style.opacity = "1";
                            resetButton.remove();
                        };
                        
                        document.body.appendChild(resetButton);
                    }, 1000);
                }, 1000); 
            }, 0);
            
            bubbles.style("opacity", 0.2);
            d3.select(event.target)
                .style("opacity", 1)
                .transition()
                .duration(200)
                .attr("r", fixedRadius * 1.5);
        });

    // Add text labels for each bubble, truncated if too long.
    let text = svg
        .selectAll("text")
        .data(data)
        .enter()
        .append("text")
        .attr("dy", ".35em")
        .attr("text-anchor", "middle")
        .attr("fill", "white")
        .style("font-size", `${fixedRadius / 4}px`)
        .style("pointer-events", "none")
        .text(d => {
            const maxLength = Math.floor(fixedRadius / 5);
            return d.name.length > maxLength ? d.name.substring(0, maxLength) + '...' : d.name; // Truncate names if necessary.
        });

    // Set up the simulation for existing bubbles
    let simulation = d3.forceSimulation(data)
    .force("x", d3.forceX(WIDTH / 2).strength(0.05))
    .force("y", d3.forceY(HEIGHT / 2).strength(0.05))
    .force("collide", d3.forceCollide(fixedRadius + 2).strength(1))
    .on("tick", () => {
        bubbles.attr("cx", d => d.x).attr("cy", d => d.y);
        text.attr("x", d => d.x).attr("y", d => d.y);
    });

    // Add event listener for the split button
    document.getElementById("splitButton").addEventListener("click", () => {
        splitCarsByYear(simulation, bubbles, text);
        filterDisplay.style.display = "block";
    });
    }

// Function to split cars based on year, adjusting their positions to either left or right side of the screen
    function splitCarsByYear(simulation, bubbles, text) {
    const leftCenter = WIDTH * 0.25;  // Position for pre-2000 cars
    const rightCenter = WIDTH * 0.75; // Position for post-2000 cars

simulation
    .force("x", d3.forceX(d => (d.year < 2010 ? leftCenter : rightCenter)).strength(0.15))
    .alpha(1)
    .restart();

    
document.getElementById("resetButton").addEventListener("click", resetBubbles);

function resetBubbles() {
    simulation
        .force("x", d3.forceX(WIDTH / 2).strength(0.05))  // Re-center bubbles in X axis
        .alpha(1)
        .restart();
        filterDisplay.style.display = "none";
}
}



const viewCatalogueButton = document.querySelector("#viewCatalogueButton").addEventListener("click", function(){
    window.location.href = "../Catalogue/Catalogue.html";
});


// Arrays of random facts for different car attributes
const horsepowerOptions = ["250 HP", "320 HP", "400 HP", "500 HP", "600 HP"];
const topSpeedOptions = ["220 km/h", "250 km/h", "280 km/h", "320 km/h", "350 km/h"];
const fuelEfficiencyOptions = ["10 km/l", "12 km/l", "15 km/l", "8 km/l", "9 km/l"];
const zeroToSixtyOptions = ["3.5 seconds", "4.0 seconds", "4.5 seconds", "5.0 seconds", "3.0 seconds"];
const popularityOptions = ["Popular model", "Collector's item", "High resale value", "Limited edition", "Top-rated by enthusiasts"];

// Function to pick a random element from an array
function getRandomFact(array) {
    return array[Math.floor(Math.random() * array.length)];
}