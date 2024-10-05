/* 
Set up the dimensions for the SVG element, defining the area where the visualization will take place.
This establishes a 780x780 pixel space that accommodates the bubbles we will create.
*/
let HEIGHT = 780,
    WIDTH = 780;

// Create the SVG element in the specified container and set its height and width.
let svg = d3
    .select("#wordMap")
    .append("svg")
    .attr("height", HEIGHT)
    .attr("width", WIDTH);
    
// Define a fixed radius for the bubbles and an array of shades of red to fill them. This adds visual variety to the bubbles in the visualization.
let fixedRadius = 40;
const redShades = [
    'rgb(255, 0, 0)',     
    'rgb(255, 51, 51)',   
    'rgb(255, 102, 102)',  
    'rgb(255, 153, 153)',  
    'rgb(255, 204, 204)',  
    'rgb(255, 230, 230)'   
];

/* 
The randomRedShade function selects a random color from the redShades array, ensuring that each bubble has a unique appearance.
This function enhances the aesthetics of the visualization by preventing uniformity among the bubbles.
*/
function randomRedShade() {
    const randomIndex = Math.floor(Math.random() * redShades.length);
    return redShades[randomIndex];
}

// Set up forces to make the bubbles move towards the center while preventing overlap. This uses D3's force simulation features to create a dynamic visual effect.
const forceX = d3.forceX(WIDTH / 2).strength(0.05);
const forceY = d3.forceY(HEIGHT / 2).strength(0.05);
const collideForce = d3.forceCollide(fixedRadius + 2).strength(1);

const simulation = d3.forceSimulation()
    .force("x", forceX)
    .force("y", forceY)
    .force("collide", collideForce)
    .velocityDecay(0.2)
    .alphaTarget(0.05)
    .alphaDecay(0.02)
    .restart();

// Fetch car data from the API, which will serve as the basis for the bubbles. This part retrieves model names, prices, fuel types, and years.
fetch('https://parallelum.com.br/fipe/api/v1/carros/marcas/20/modelos')
    .then((response) => response.json())
    .then((data) => {
        let carData = data.modelos;
        let carCodes = carData.map(car => car.codigo);
        let carNames = carData.map(car => car.nome);

        // For each car code, fetch additional details such as year and price. This is done in parallel using Promise.all.
        return Promise.all(carCodes.map((code, index) => {
            return fetch(`https://parallelum.com.br/fipe/api/v1/carros/marcas/20/modelos/${code}/anos`)
                .then(response => response.json())
                .then(yearData => {
                    return fetch(`https://parallelum.com.br/fipe/api/v1/carros/marcas/20/modelos/${code}/anos/${yearData[0].codigo}`)
                        .then(response => response.json())
                        .then(priceData => {
                            // Create an object with relevant data for each car.
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
    .catch(error => console.error("Error fetching data:", error));

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
        .on("mouseover", (event, d) => {
            // Display a tooltip with car details on mouseover.
            d3.select("#tooltip")
                .style("display", "block")
                .html(`
                    <img src="../Catalogue/Images/${d.name.replace(/\//g, '')}.jpg" alt="${d.name}" id="tooltipImage">
                    <h4 id="tooltipName">${d.name}</h4>
                    <h4 id="tooltipPrice">Price: R$${d.valor.toFixed(2)}</h4>
                    <p>Fuel: ${d.fuel}</p>
                `)
                .style("opacity", 1);

            // Dim other bubbles while highlighting the current one.
            bubbles.style("opacity", 0.2);
            d3.select(event.target)
                .style("opacity", 1)
                .style("fill", 'rgb(255, 0, 0)') // Highlight the hovered bubble.
                .transition()
                .duration(200)
                .attr("r", fixedRadius * 1.5); // Enlarge the bubble.
        })
        .on("mouseout", (event) => {
            // Reset the bubble size and opacity on mouse out.
            d3.select(event.target)
                .transition()
                .duration(200)
                .attr("r", fixedRadius)
                .style("fill", d3.select(event.target).attr("data-original-color")); // Restore original color.
        });

    // Add text labels for each bubble, truncated if too long.
    let text = svg
        .selectAll("text")
        .data(data)
        .enter()
        .append("text")
        .attr("dy", ".35em")
        .attr("text-anchor", "middle")
        .style("font-size", `${fixedRadius / 4}px`)
        .style("pointer-events", "none")
        .text(d => {
            const maxLength = Math.floor(fixedRadius / 5);
            return d.name.length > maxLength ? d.name.substring(0, maxLength) + '...' : d.name; // Truncates the names if necessary.
        });

    // Update bubble positions during the simulation.
    simulation.nodes(data)
    .on("tick", () => {
        bubbles.attr("cx", d => d.x) // Update x positions.
               .attr("cy", d => d.y); // Update y positions.

        text.attr("x", d => d.x) // Position text labels.
            .attr("y", d => d.y);
    });
}
