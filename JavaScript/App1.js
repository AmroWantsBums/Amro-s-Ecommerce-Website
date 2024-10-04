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

                        if (!isNaN(valor) && modelData.AnoModelo >= 1990 && modelData.AnoModelo <= 2024) {
                            console.log(`Adding point for year: ${modelData.AnoModelo} with value: ${valor}`);
                            dataPoints.push({
                                x: modelData.AnoModelo,
                                y: valor
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
                .attr("r", 4)
                .attr("cx", d => xScale(d.x) + MARGIN)  // x-axis is based on AnoModelo
                .attr("cy", d => yScale(d.y) + MARGIN);  // y-axis is based on Valor

            createLine(); // Call to create the line after all points are plotted
        })
        .catch(error => console.error('Error fetching data:', error));
}


// Visualization setup
let HEIGHT = 600,
    WIDTH = 800,
    MARGIN = 80;

let svg = d3.select("section")
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
    // Create a line generator
    const lineGenerator = d3.line()
        .x(d => xScale(d.x) + MARGIN) // Adjust x based on the scale and margin
        .y(d => yScale(d.y) + MARGIN); // Adjust y based on the scale and margin

    // Append the line to the SVG
    svg.append("path")
        .datum(dataPoints) // Bind data
        .attr("class", "line")
        .attr("d", lineGenerator) // Generate path data
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 2);
}
