fetch('https://ergast.com/api/f1/drivers/leclerc/constructors/ferrari/results.json')
    .then(response => response.json())
    .then(data => {
        // Hide loading indicator
        document.getElementById('loading').style.display = 'none';

        // Process data for 2019 and 2020 seasons only
        const races = data.MRData.RaceTable.Races
            .filter(race => race.season === "2019" || race.season === "2020")
            .map(race => ({
                season: race.season,
                round: +race.round, // Convert round to number for sorting
                position: +race.Results[0].position, // Convert position to number
                raceName: race.raceName,
                date: race.date
            }));

        // Sort by season and round to ensure correct order
        races.sort((a, b) => a.season === b.season ? a.round - b.round : a.season - b.season);

        // Sequential round mapping (1 to 21 for 2019, then 22 to 30 for 2020)
        races.forEach((race, index) => {
            race.sequentialRound = index + 1;
            race.displayRound = `${race.season} Round ${race.round}`;
        });

        // Set dimensions and margins for the chart
        const margin = { top: 20, right: 30, bottom: 70, left: 60 };
        const width = 600 - margin.left - margin.right;
        const height = 400 - margin.top - margin.bottom;

        // Create an SVG canvas
        const svg = d3.select("#chart")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        // Set up x and y scales
        const xScale = d3.scaleLinear()
            .domain([1, races.length]) // Sequentially numbered rounds from 1 to total races
            .range([0, width]);

        const yScale = d3.scaleLinear()
            .domain([20, 1]) // Assuming 20 as max finishing position
            .range([height, 0]);

        // Create x and y axes
        svg.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(xScale)
                .tickValues(races.map(d => d.sequentialRound)) // Use sequential round numbers as ticks
                .tickFormat((d, i) => races[i] ? races[i].displayRound : '')
            )
            .selectAll("text")
            .attr("transform", "rotate(45)")
            .style("text-anchor", "start");

        svg.append("g")
            .call(d3.axisLeft(yScale));

        // // Create the line generator
        // const line = d3.line()
        //     .x(d => xScale(d.sequentialRound))
        //     .y(d => yScale(d.position));

        // // Draw the line for race positions
        // svg.append("path")
        //     .datum(races)
        //     .attr("fill", "none")
        //     .attr("stroke", "steelblue")
        //     .attr("stroke-width", 1.5)
        //     .attr("d", line);

        // Add circles for each race point
        svg.selectAll("circle")
            .data(races)
            .enter()
            .append("circle")
            .attr("cx", d => xScale(d.sequentialRound))
            .attr("cy", d => yScale(d.position))
            .attr("r", 4)
            .attr("fill", "red");

        // Update function to highlight selected race round
        function update(round) {
            const selectedRace = races.find(d => d.sequentialRound === round);
            svg.selectAll("circle")
                .attr("fill", d => d === selectedRace ? "black" : "red");

            if (selectedRace) {
                document.getElementById('dataContainer').innerText = 
                    `Round ${selectedRace.round} (${selectedRace.displayRound}): ${selectedRace.raceName} on ${selectedRace.date} - Position: ${selectedRace.position}`;
            }
        }

        // Interactive slider to select the round
        const slider = document.getElementById("slider");
        slider.max = races.length;
        slider.addEventListener("input", event => {
            const round = +event.target.value;
            update(round);
        });
    })
    .catch(error => console.error('Error fetching data:', error));
