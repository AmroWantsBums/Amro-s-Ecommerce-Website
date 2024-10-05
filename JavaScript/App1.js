/* 
This code handles the visualization of car data retrieved via URL parameters. 
It extracts car details like name, price, image, and a fetch link, which is crucial for gathering model-specific information.
*/
function getQueryParams() {
    const params = new URLSearchParams(window.location.search);
    return {
        name: params.get('name'),
        price: params.get('price'),
        image: params.get('image'),
        fetchLink: params.get('fetchLink') // Essential for fetching more details about the specific car model.
    };
}

// Retrieve car details from the URL.
const carDetails = getQueryParams(); 
let dataPoints = []; // Array to hold data points for visualization.

// Begin the data visualization process using the fetch link.
CreateDataVisualization(carDetails.fetchLink); 

/* 
The CreateDataVisualization function fetches car data from the provided link. 
It processes the data by extracting relevant details for each model, ensuring they are valid for visualization.
*/
function CreateDataVisualization(carFetchLink) {
    fetch(carFetchLink)
        .then(response => response.json())
        .then(data => {
            const fetchPromises = data.map(car => {
                const modelFetchLink = `${carFetchLink}/${car.codigo}`;
                return fetch(modelFetchLink)
                    .then(response => response.json())
                    .then(modelData => {
                        // Clean and validate the fetched data.
                        let valor = parseFloat(modelData.Valor.replace('R$', '').replace(/\./g, '').replace(',', '.'));
                        if (!isNaN(valor) && modelData.AnoModelo >= 1950 && modelData.AnoModelo <= 2024) {
                            console.log(`Adding point for year: ${modelData.AnoModelo} with value: ${valor}`);
                            dataPoints.push({
                                x: modelData.AnoModelo, // Year
                                y: valor, // Price
                                model: modelData.Modelo, // Car model for tooltip
                                year: modelData.AnoModelo, // Year
                                value: valor // Value for tooltip
                            });
                        } else {
                            console.error(`Invalid data: ModelYear = ${modelData.AnoModelo}, Valor = ${valor}`);
                        }
                    });
            });

            return Promise.all(fetchPromises); // Wait for all fetch operations to complete.
        })
        .then(() => {
            // Set up scales and axes based on collected data points.
            xScale.domain(d3.extent(dataPoints, d => d.x)); 
            yScale.domain([0, d3.max(dataPoints, d => d.y)]); 
            createxScale();  
            createyScale();  

            // Render circles on the SVG canvas for each data point.
            svg.selectAll("circle")
                .data(dataPoints)
                .enter()
                .append("circle")
                .attr("class", "circles")
                .attr("r", 8)
                .attr("cx", d => xScale(d.x) + MARGIN) 
                .attr("cy", d => yScale(d.y) + MARGIN)  
                .attr("fill", "black")
                .on("mouseover", function(event, d) {
                    // Show tooltip with car details on hover.
                    tooltip.transition()
                        .duration(200)
                        .style("opacity", .9);
                    tooltip.html(`Model: ${d.model}<br>Year: ${d.year}<br>Value: R$${d.value.toLocaleString()}`)
                        .style("left", (event.pageX + 5) + "px")
                        .style("top", (event.pageY - 28) + "px");
                })
                .on("mouseout", function() {
                    // Hide the tooltip when the mouse leaves.
                    tooltip.transition()
                        .duration(500)
                        .style("opacity", 0);
                });

            createLine(); // Draw the connecting line after plotting the circles.
        })
        .catch(error => console.error(error)); // Handle any errors during fetching.
}

// Visualization setup with defined dimensions and margins.
let HEIGHT = 500,
    WIDTH = 500,
    MARGIN = 80;

// Create a tooltip for displaying information.
let tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0)
    .style("position", "absolute")
    .style("background-color", "#f9f9f9")
    .style("padding", "8px")
    .style("border", "1px solid #d3d3d3")
    .style("border-radius", "4px")
    .style("pointer-events", "none"); 

// Set up the SVG canvas for the visualization.
let svg = d3.select("#dataVisalization")
    .append("svg")
    .attr("height", HEIGHT + MARGIN + MARGIN)
    .attr("width", WIDTH + MARGIN + MARGIN);

let xScale = d3.scaleLinear().range([0, WIDTH]); // Linear scale for the x-axis.
let yScale = d3.scaleLinear().range([HEIGHT, 0]); // Linear scale for the y-axis, inverted.

function createxScale() {
    // Draw the x-axis using the defined xScale.
    svg.append("g")
        .attr("transform", `translate(${MARGIN}, ${HEIGHT})`)
        .call(d3.axisBottom(xScale));
}

function createyScale() {
    // Draw the y-axis using the defined yScale.
    svg.append("g")
        .attr("transform", `translate(${MARGIN}, 0)`)
        .call(d3.axisLeft(yScale));
}

function createLine() {
    // Sort the data points by year for the line.
    dataPoints.sort((a, b) => a.x - b.x); 

    // Create a line generator using the scales.
    const lineGenerator = d3.line()
        .x(d => xScale(d.x) + MARGIN) 
        .y(d => yScale(d.y) + MARGIN);

    // Append the line path to the SVG.
    const path = svg.append("path")
        .datum(dataPoints)
        .attr("class", "line")
        .attr("d", lineGenerator)
        .attr("fill", "none")
        .attr("stroke", "red")
        .attr("stroke-width", 2);

    // Animate the drawing of the line.
    const totalLength = path.node().getTotalLength();
    path
        .attr("stroke-dasharray", totalLength + " " + totalLength)
        .attr("stroke-dashoffset", totalLength)
        .transition()
        .duration(4000)
        .ease(d3.easeLinear)
        .attr("stroke-dashoffset", 0);
}
