function CreateDataVisualization(carFetchLink) {
    let dataPoints = [];

    // Fetch the data using the provided full URL
    fetch(carFetchLink)
        .then(response => response.json())
        .then(data => {
            // Calculate the price value
            let valor = parseFloat(data.Valor
                .replace('R$', '')
                .replace(/\./g, '')
                .replace(',', '.'));
            
            // Check if valor is valid
            if (!isNaN(valor) && data.AnoModelo >= 2021 && data.AnoModelo <= 2024) {
                dataPoints.push({
                    x: xScale(data.AnoModelo),
                    y: yScale(valor)
                });

                // Create circle for this data
                svg.append("circle")
                    .attr("class", "circles")
                    .attr("r", 4)
                    .attr("cx", xScale(data.AnoModelo))
                    .attr("cy", yScale(valor));
            }
        })
        .then(() => {
            // Sort the dataPoints by x value (AnoModelo)
            dataPoints.sort((a, b) => a.x - b.x);
            createLine(); // Call function to create line after all promises are resolved
        });
}

// Visualization setup
let HEIGHT = 600,
    WIDTH = 800, 
    MARGIN = 80;

let svg = d3.select("section")
    .append("svg")
    .attr("height", HEIGHT + MARGIN + MARGIN)
    .attr("width", WIDTH + MARGIN + MARGIN);

let xScale = d3.scaleLinear().domain([2021, 2025]).range([0, WIDTH]);
let yScale = d3.scaleLinear().domain([3200000, 4500000]).range([HEIGHT, 0]);

function createxScale(data) {
    svg.append("g")
        .attr("transform", `translate(${MARGIN}, ${HEIGHT})`)
        .call(d3.axisBottom(xScale));
}

function createyScale(data) {
    svg.append("g")
        .attr("transform", `translate(${MARGIN}, 0)`)
        .call(d3.axisLeft(yScale));
}

function createLine() {
    // Create a line generator
    const lineGenerator = d3.line()
        .x(d => d.x)
        .y(d => d.y);

    // Append the line to the SVG
    svg.append("path")
        .datum(dataPoints) // Bind data
        .attr("class", "line")
        .attr("d", lineGenerator) // Generate path data
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 2);
}
