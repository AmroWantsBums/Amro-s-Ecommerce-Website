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
let HEIGHT = window.innerHeight,
    WIDTH = window.innerWidth;

let svg = d3
    .select("#wordMap")
    .append("svg")
    .attr("height", HEIGHT)
    .attr("width", WIDTH);

// Create scales
let fixedRadius = 50; // Fixed radius for all circles
let cScale = d3.scaleOrdinal().range(d3.schemeSet3);

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
        .style("fill", (d, i) => cScale(i))
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
        .style("font-size", "10px") // Adjust font size as needed
        .text(d => d.name); // Set the text to be the car name

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
