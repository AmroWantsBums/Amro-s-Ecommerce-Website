// Fetch car data
fetch('https://parallelum.com.br/fipe/api/v1/carros/marcas/20/modelos')
    .then((response) => response.json())
    .then((data) => {
        let carData = data.modelos;
        let carNames = carData.map(car => car.nome);
        console.log(carNames);

        // Create a dataset with fixed size for all cars
        let carDataset = carNames.map(name => ({
            name: name,
            sales: 100, // Fixed size for demonstration
            decade: "pre-2000" // Dummy decade for demonstration
        }));

        CreateBubbles(carDataset);
    });

// Set up SVG dimensions
let HEIGHT = 780,
    WIDTH = 780;

let svg = d3
    .select("#wordMap")
    .append("svg")
    .attr("height", HEIGHT)
    .attr("width", WIDTH);

// Create scales
let fixedRadius = 40; // Fixed radius for all circles
let cScale = d3.scaleOrdinal().range(d3.schemeSet3);

const redShades = [
    'rgb(255, 0, 0)',     // Pure Red
    'rgb(255, 51, 51)',   // Light Red
    'rgb(255, 102, 102)',  // Lighter Red
    'rgb(255, 153, 153)',  // Very Light Red
    'rgb(255, 204, 204)',  // Pinkish
    'rgb(255, 230, 230)'   // Very Pale Pink
];

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

// Create bubbles
function CreateBubbles(data) {
    let bubbles = svg
        .selectAll("circle")
        .data(data)
        .enter()
        .append('circle')
        .attr("r", fixedRadius) // Set fixed radius
        .style("fill", randomRedShade)
        .on("mouseover", (event, d) => {
            d3.select("#tooltip")
                .style("display", "block")
                .html(`Name: ${d.name}`)
                .style("left", (event.pageX + 5) + "px")
                .style("top", (event.pageY - 28) + "px");
        })
        .on("mousemove", (event) => {
            d3.select("#tooltip")
                .style("left", (event.pageX + 5) + "px")
                .style("top", (event.pageY - 28) + "px");
        })
        .on("mouseout", () => {
            d3.select("#tooltip").style("display", "none");
        });

    let text = svg
        .selectAll("text")
        .data(data)
        .enter()
        .append("text")
        .attr("dy", ".35em") // Center the text vertically
        .attr("text-anchor", "middle") // Center the text horizontally
        .style("font-size", `${fixedRadius / 4}px`) // Dynamic font size
        .text(d => {
            // Truncate text if it's too long
            const maxLength = Math.floor(fixedRadius / 5);
            return d.name.length > maxLength ? d.name.substring(0, maxLength) + '...' : d.name;
        });

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