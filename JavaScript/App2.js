
/* 
Set up the dimensions for the SVG element, defining the area where the visualization will take place.
This establishes a 780x780 pixel space that accommodates the bubbles we will create.
*/
let HEIGHT = 590,
    WIDTH = 780;

const tooltipPlaceholder = document.getElementById('tooltipPlaceholder');    
const mainPanel = document.querySelector("#mainPanel");


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

/* 
The randomRedShade function selects a random color from the redShades array.
*/
function randomRedShade() {
    const randomIndex = Math.floor(Math.random() * redShades.length);
    return redShades[randomIndex];
}

// Dummy data for testing
const testData = [
    { name: "360 Modena", valor: 20000, fuel: "Gasoline", year: 2020 },
    { name: "Car 2", valor: 25000, fuel: "Diesel", year: 2019 },
    { name: "Car 3", valor: 30000, fuel: "Electric", year: 2021 },
];

/* 
// Commenting out the API fetch section for testing purposes
fetch('https://parallelum.com.br/fipe/api/v1/carros/marcas/20/modelos')
    .then((response) => response.json())
    .then((data) => {
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
    })
    .then(results => {
        // Pass the fetched car data to the CreateBubbles function for visualization.
        CreateBubbles(results);
    })
    .catch(error => console.error(error));
*/

// Instead of fetching data, use the test data for visualization.
CreateBubbles(testData);

// The CreateBubbles function generates the visual representation of the data by creating circles for each car model.
function CreateBubbles(data) {
    // Create and style the bubbles (circles) based on the car data.
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
                .style("cursor", "pointer");
        })
        .on("mouseleave", function(event, d) {
            d3.select(this)
                .style("cursor", "default");
        })
        .on("click", (event, d) => {
            // Get the position of the clicked circle
            const clickedCircle = d3.select(event.target);
            const clickedX = +clickedCircle.attr("cx");
            const clickedY = +clickedCircle.attr("cy");
            
            // Create a new div to represent the moving circle
            const newCircle = document.createElement('div');
            newCircle.classList.add('moving-circle');
            document.body.appendChild(newCircle);
            
            // Position it at the clicked circle's location
            newCircle.style.position = 'absolute'; // Make it absolute
            const svgRect = svg.node().getBoundingClientRect();
            
            // Adjust position for scrolling
            newCircle.style.left = `${clickedX + svgRect.left}px`;
            newCircle.style.top = `${clickedY + svgRect.top + window.scrollY}px`; // Add scrollY
            
            // Move the new circle to a predetermined position
            const targetX = 1138; // Move to the right side of the screen
            const targetY = 360 + window.scrollY; // Keep the same vertical position + scrollY
        
            // Animate the new circle
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
                        d3.select("#tooltip")
                            .select(".tooltipImage") // Make sure to select the class with a dot (.)
                            .attr("src", `../Catalogue/Images/${d.name.replace(/\//g, '')}.jpg`);
                            const resetButton = document.createElement('button');
                            const resetText = document.createElement('span'); // Create a span for the text
                            resetText.textContent = "Reset"; // Set the text content for the span
                            resetButton.appendChild(resetText); 
                            resetButton.classList.add("ResetButton");
                            resetButton.style.position = 'fixed';
                            resetButton.style.top = '30rem'; // Adjust as needed
                            resetButton.style.left = '22.9rem'; // Adjust as needed
                            resetButton.style.zIndex = '1000'; // Ensure it's above other elements
                            resetButton.onclick = () => {
                                bubbles.style("opacity", 1) 
                                       .attr("r", fixedRadius); 
                                d3.select("#tooltip").style("display", "none").style("opacity", 0);
                                tooltipPlaceholder.style.transform = 'translateX(0rem)'; 
                                mainPanel.style.opacity = "1";
                                resetButton.remove();
                            };
                        
                            // Append the reset button to the body
                            document.body.appendChild(resetButton);
                    }, 1000); // Delay for tooltip display
                }, 1000); 
            }, 0);
            
            // Dim other bubbles
            bubbles.style("opacity", 0.2);
            d3.select(event.target)
                .style("opacity", 1)
                .transition()
                .duration(200)
                .attr("r", fixedRadius * 1.5); // Enlarge the clicked bubble.
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
            return d.name.length > maxLength ? d.name.substring(0, maxLength) + '...' : d.name; // Truncates the names if necessary.
        });

    // Set up the simulation for existing bubbles
    const simulation = d3.forceSimulation(data)
        .force("x", d3.forceX(WIDTH / 2).strength(0.05))
        .force("y", d3.forceY(HEIGHT / 2).strength(0.05))
        .force("collide", d3.forceCollide(fixedRadius + 2).strength(1))
        .on("tick", () => {
            bubbles.attr("cx", d => d.x) // Update x positions.
                   .attr("cy", d => d.y); // Update y positions.

            text.attr("x", d => d.x) // Position text labels.
                .attr("y", d => d.y);
        });
}


const viewCatalogueButton = document.querySelector("#viewCatalogueButton").addEventListener("click", function(){
    window.location.href = "../Catalogue/Catalogue.html";
})