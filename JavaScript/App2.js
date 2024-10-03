// Set up SVG dimensions
let HEIGHT = 780,
    WIDTH = 780;

let svg = d3
    .select("#wordMap")
    .append("svg")
    .attr("height", HEIGHT)
    .attr("width", WIDTH);

// Create a fixed radius for the bubbles
let fixedRadius = 40;

// Define an array of red shades
const redShades = [
    'rgb(255, 0, 0)',     // Pure Red
    'rgb(255, 51, 51)',   // Light Red
    'rgb(255, 102, 102)',  // Lighter Red
    'rgb(255, 153, 153)',  // Very Light Red
    'rgb(255, 204, 204)',  // Pinkish
    'rgb(255, 230, 230)'   // Very Pale Pink
];

// Function to get a random shade of red
function randomRedShade() {
    const randomIndex = Math.floor(Math.random() * redShades.length);
    return redShades[randomIndex];
}

// Set up forces for the simulation
const forceX = d3.forceX(WIDTH / 2).strength(0.05);
const forceY = d3.forceY(HEIGHT / 2).strength(0.05);
const collideForce = d3.forceCollide(fixedRadius + 2);
const forceXSplit = d3.forceX(d => d.decade === "pre-2000" ? 300 : 1000);

const simulation = d3
    .forceSimulation()
    .force("x", forceX)
    .force("y", forceY)
    .force("collide", collideForce);

// Fetch car data
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
                            //console.log(priceData);
                            return {
                                name: carNames[index], // Use the corresponding name
                                valor: parseFloat(priceData.Valor.replace('R$', '').replace(/\./g, '').replace(',', '.')),
                                fuel: priceData.Combustivel || 'Unknown', // Fallback if fuel is undefined
                                year : priceData.AnoModelo
                            };
                        });
                });
        }));
    })
    .then(results => {
        CreateBubbles(results); // Pass the fetched data to the CreateBubbles function
    })
    .catch(error => console.error("Error fetching data:", error));


   // Create bubbles
function CreateBubbles(data) {
    let bubbles = svg
        .selectAll("circle")
        .data(data)
        .enter()
        .append('circle')
        .attr("r", fixedRadius) // Set initial fixed radius
        .style("fill", () => randomRedShade()) // Use a random color from the array
        .on("mouseover", (event, d) => {
            // Update tooltip content
            d3.select("#tooltip")
                .style("display", "block")
                .html(`
                    <img src="../Catalogue/Images/${d.name.replace(/\//g, '')}.jpg" alt="${d.name}" id="tooltipImage">
                    <h4 id="tooltipName">${d.name}</h4>
                    <h4 id="tooltipPrice">Price: R$${d.valor.toFixed(2)}</h4>
                    <p>Fuel: ${d.fuel}</p>
                `)
                .style("opacity", 1); // Ensure the tooltip is visible

            // Highlight the current bubble
            bubbles.style("opacity", 0.2);
            d3.select(event.target)
                .style("opacity", 1)
                .style("fill", 'rgb(255, 0, 0)'); // Highlight the current bubble

            // Increase the radius of the hovered circle
            d3.select(event.target)
                .transition() // Add a transition for smooth enlargement
                .duration(200)
                .attr("r", fixedRadius * 1.5); // Increase the radius
        })
        .on("mousemove", (event) => {
            // Update tooltip position using CSS
            d3.select("#tooltip")
                .style("top", (event.pageY - 28) + "px");
        })
        .on("mouseout", (event) => {
            // Reset the radius of the hovered circle
            d3.select(event.target)
                .transition() // Add a transition for smooth shrinking
                .duration(200)
                .attr("r", fixedRadius) // Reset to original radius
                .style("fill", d3.select(event.target).attr("data-original-color")); // Reset to original color
            
            // Do not hide the tooltip; keep it displayed
        });

    // Position the text elements at the center of the circles
    let text = svg
        .selectAll("text")
        .data(data)
        .enter()
        .append("text")
        .attr("dy", ".35em") // Center the text vertically
        .attr("text-anchor", "middle") // Center the text horizontally
        .style("font-size", `${fixedRadius / 4}px`) // Dynamic font size
        .style("pointer-events", "none") // Prevent mouse events on text
        .text(d => {
            const maxLength = Math.floor(fixedRadius / 5);
            return d.name.length > maxLength ? d.name.substring(0, maxLength) + '...' : d.name;
        });

    // Position the text elements at the center of the circles
    simulation.nodes(data)
        .on("tick", () => {
            bubbles.attr("cx", d => d.x)
                   .attr("cy", d => d.y);

            text.attr("x", d => d.x)
                .attr("y", d => d.y); // Position text at the center of the circle
        });

    d3.select("#split").on("click", function() {
        simulation.force("x", forceXSplit).alphaTarget(0.6).restart();
    });
}
