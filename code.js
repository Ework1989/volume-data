// Function to create a line chart
function createLineChart(data, containerId) {
    // Your D3.js code for creating a line chart based on 'data' goes here
    // This is a simplified example, and you may need to customize it based on your actual data structure

    const svg = d3.select(`#${containerId}`)
        .append("svg")
        .attr("width", 800)
        .attr("height", 400);

    // Parse date strings into JavaScript Date objects
    data.forEach(d => {
        d.date = d3.timeParse("%d/%m/%Y")(d.date);
    });

    // Define scales for x and y axes
    const xScale = d3.scaleTime()
        .domain(d3.extent(data, d => d.date))
        .range([0, 800]);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.Adjclose)])
        .range([400, 0]);

    // Define line function
    const line = d3.line()
        .x(d => xScale(d.date))
        .y(d => yScale(d.Adjclose));

    // Draw the line
    svg.append("path")
        .data([data])
        .attr("class", "line")
        .attr("d", line)
        .attr("fill", "none")
        .attr("stroke", "blue");

    // Add x-axis with time format
    svg.append("g")
        .attr("transform", `translate(0, ${400})`)
        .call(d3.axisBottom(xScale).ticks(d3.timeMonth).tickFormat(d3.timeFormat("%b %d")));

    // Add y-axis
    svg.append("g")
        .call(d3.axisLeft(yScale));

    // Add circles for data points
    // svg.selectAll("circle")
    //     .data(data)
    //     .enter().append("circle")
    //     .attr("cx", d => xScale(d.date))
    //     .attr("cy", d => yScale(d.Adjclose))
    //     .attr("r", 5)
    //     .attr("fill", "red");
}



// Function to update charts based on the selected stock
async function updateCharts() {
    const selectedStock = document.getElementById("stockSelector").value;
    const selectedStockData = await getStockData(selectedStock);

    // Clear the chart container before rendering new charts
    document.getElementById("chartContainer").innerHTML = "";

    // Render charts for the selected stock
    createLineChart(selectedStockData, "chartContainer");
}

// Function to fetch stock data from the API
async function getStockData(ticker) {
    try {
        // Replace 'YOUR_API_BASE_URL' with the actual base URL of your API
        const apiUrl = `http://localhost:5000/api/v1.0/${ticker}`;

        // Make a GET request to the API
        const response = await fetch(apiUrl);

        // Check if the request was successful (status code 200)
        if (response.ok) {
            const data = await response.json();
            return data;
        } else {
            console.error(`API request failed with status code: ${response.status}`);
            return [];
        }
    } catch (error) {
        console.error(`Error fetching stock data: ${error}`);
        return [];
    }
}

// Initial rendering of charts based on the default selected stock
updateCharts();
