function getQueryParams() {
    const params = new URLSearchParams(window.location.search);
    return {
        name: params.get('name'),
        price: params.get('price'),
        image: params.get('image'),
        fetchLink: params.get('fetchLink')
    };
}

const carDetails = getQueryParams();
let dataPoints = [];
CreateDataVisualization(carDetails.fetchLink);

function CreateDataVisualization(carFetchLink) {
    fetch(carFetchLink)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            const fetchPromises = data.map(car => {
                const modelFetchLink = `${carFetchLink}/${car.codigo}`;
                return fetch(modelFetchLink)
                    .then(response => response.json())
                    .then(modelData => {
                        console.log(modelData);
                        let valor = parseFloat(modelData.Valor.replace('R$', '').replace(/\./g, '').replace(',', '.'));

                        if (!isNaN(valor) && modelData.AnoModelo >= 1950 && modelData.AnoModelo <= 2024) {
                            console.log(`Adding point for year: ${modelData.AnoModelo} with value: ${valor}`);
                            dataPoints.push({
                                x: modelData.AnoModelo,
                                y: valor,
                                model: modelData.Modelo,
                                year: modelData.AnoModelo,
                                value: valor
                            });
                        } else {
                            console.error(`Invalid data: ModelYear = ${modelData.AnoModelo}, Valor = ${valor}`);
                        }
                    });
            });

            return Promise.all(fetchPromises);
        })
        .then(() => {
            console.log(dataPoints); // Log all data points

            // Update scales based on actual data points
            xScale.domain(d3.extent(dataPoints, d => d.x)); // Adjust x-axis domain
            yScale.domain([0, d3.max(dataPoints, d => d.y)]); // Adjust y-axis domain based on max value

            createxScale();  // Call after updating domains
            createyScale();  // Call after updating domains

            // Now, plot circles after the scales are updated
            svg.selectAll("circle")
                .data(dataPoints)
                .enter()
                .append("circle")
                .attr("class", "circles")
                .attr("r", 8) // Increase the radius for better interactivity
                .attr("cx", d => xScale(d.x) + MARGIN)  // x-axis is based on AnoModelo
                .attr("cy", d => yScale(d.y) + MARGIN)  // y-axis is based on Valor
                .attr("fill", "black") // Set circle color
                .on("mouseover", function(event, d) {
                    tooltip.transition()
                        .duration(200)
                        .style("opacity", .9);
                    tooltip.html(`Model: ${d.model}<br>Year: ${d.year}<br>Value: R$${d.value.toLocaleString()}`)
                        .style("left", (event.pageX + 5) + "px")
                        .style("top", (event.pageY - 28) + "px");
                })
                .on("mouseout", function() {
                    tooltip.transition()
                        .duration(500)
                        .style("opacity", 0);
                });

            createLine(); // Call to create the line after all points are plotted
        })
        .catch(error => console.error('Error fetching data:', error));
}


// Visualization setup
let HEIGHT = 500,
    WIDTH = 500,
    MARGIN = 80;

// Add the tooltip div
let tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0)
    .style("position", "absolute")
    .style("background-color", "#f9f9f9")
    .style("padding", "8px")
    .style("border", "1px solid #d3d3d3")
    .style("border-radius", "4px")
    .style("pointer-events", "none"); // Make sure it's not blocking mouse events

let svg = d3.select("#dataVisalization")
    .append("svg")
    .attr("height", HEIGHT + MARGIN + MARGIN)
    .attr("width", WIDTH + MARGIN + MARGIN);

let xScale = d3.scaleLinear().range([0, WIDTH]); // Remove hardcoded domain, to be updated with data
let yScale = d3.scaleLinear().range([HEIGHT, 0]); // Remove hardcoded domain, to be updated with data

function createxScale() {
    svg.append("g")
        .attr("transform", `translate(${MARGIN}, ${HEIGHT})`)
        .call(d3.axisBottom(xScale));
}

function createyScale() {
    svg.append("g")
        .attr("transform", `translate(${MARGIN}, 0)`)
        .call(d3.axisLeft(yScale));
}

function createLine() {
    // Sort data points by year (or by price if needed)
    dataPoints.sort((a, b) => a.x - b.x); // Sort ascending by year

    // Create a line generator
    const lineGenerator = d3.line()
        .x(d => xScale(d.x) + MARGIN) // Adjust x based on the scale and margin
        .y(d => yScale(d.y) + MARGIN); // Adjust y based on the scale and margin

    // Append the line to the SVG
    const path = svg.append("path")
        .datum(dataPoints) // Bind sorted data
        .attr("class", "line")
        .attr("d", lineGenerator) // Generate path data
        .attr("fill", "none")
        .attr("stroke", "red") // Set line color to red
        .attr("stroke-width", 2);

    // Get the total length of the path
    const totalLength = path.node().getTotalLength();

    // Set up the dash array and dash offset properties for the animation
    path
        .attr("stroke-dasharray", totalLength + " " + totalLength)
        .attr("stroke-dashoffset", totalLength)
        .transition() // Start the transition
        .duration(4000) // Duration of the animation (2 seconds)
        .ease(d3.easeLinear) // Use linear easing for smooth animation
        .attr("stroke-dashoffset", 0); // Animate to the final dash offset (which will draw the line)
}

