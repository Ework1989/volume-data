// Function to fetch data for a specific ticker
// Function to fetch data for a specific ticker
async function getStockData(ticker) {
    try {
        const apiUrl = `http://localhost:5000/api/v1.0/${ticker}`;
        const response = await fetch(apiUrl);

        if (response.ok) {
            const data = await response.json();
            return data;
        } else {
            console.error(`API request failed for ${ticker} with status code: ${response.status}`);
            return [];
        }
    } catch (error) {
        console.error(`Error fetching stock data for ${ticker}: ${error}`);
        return [];
    }
}

// Function to fetch data for multiple tickers
async function getAllStockData(tickers) {
    const promises = tickers.map(ticker => getStockData(ticker));
    return Promise.all(promises);
}

// Function to create a pie chart for latest Volume with a legend and mouseover
// Function to create a pie chart for latest Volume with a legend
function createPieChartForLatestVolume(data, containerId) {
    // Set the size of the SVG container
    const svgWidth = 800;
    const svgHeight = 600;

    const svg = d3.select(`#${containerId}`)
        .append("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight)
        .append("g")
        .attr("transform", `translate(${svgWidth / 2},${svgHeight / 2})`); // Center the pie chart

    // Extract the latest Volume from the last data point for each ticker
    const latestVolume = data.map(tickerData => {
        const lastDataPoint = tickerData.length > 0 ? tickerData[tickerData.length - 1] : null;
        return lastDataPoint ? { ticker: lastDataPoint.ticker, volume: lastDataPoint.volume } : null;
    }).filter(Boolean);

    console.log(latestVolume);

    // Create a pie chart layout
    const pie = d3.pie()
        .value(d => d.volume);

    // Generate arc paths based on the pie layout
    const arcs = d3.arc()
        .innerRadius(0)
        .outerRadius(Math.min(svgWidth, svgHeight) / 2 - 30); // Set the outer radius based on the SVG size

    // Draw the pie chart
    const arcPaths = svg.selectAll("path")
        .data(pie(latestVolume))
        .enter()
        .append("path")
        .attr("d", arcs)
        .attr("fill", (d, i) => d3.schemeCategory10[i]);

    // Add labels
    svg.selectAll("text")
        .data(pie(latestVolume))
        .enter()
        .append("text")
        .attr("transform", d => `translate(${arcs.centroid(d)})`)
        .attr("text-anchor", "middle")
        .text(d => `${d.data.ticker}: ${d.data.volume.toFixed(2)}`);

    // Add legend
   // Add legend with ticker and volume
   const legend = svg.selectAll(".legend")
   .data(latestVolume)
   .enter()
   .append("g")
   .attr("class", "legend")
   .attr("transform", (d, i) => `translate(0,${i * 30})`); // Adjust the spacing between legend items

legend.append("rect")
   .attr("x", svgWidth / 2 - 18)
   .attr("width", 18)
   .attr("height", 18)
   .style("fill", (d, i) => d3.schemeCategory10[i]);

legend.append("text")
   .attr("x", svgWidth / 2 - 24)
   .attr("y", 9)
   .attr("dy", ".35em")
   .style("text-anchor", "end")
   .text(d => d.ticker +`(`+ d.volume+`)`);
}

// ... (rest of the code remains unchanged)

// List of tickers
const tickers = ["AAPL", "GOOGL", "AMZN", "META", "NFLX", "MSFT"];

// Fetch data for all tickers
async function updatePieChartForLatestVolume() {
    const allStockData = await getAllStockData(tickers);
    document.getElementById("latestVolumePieChartContainer").innerHTML = "";
    createPieChartForLatestVolume(allStockData, "latestVolumePieChartContainer");
}

// Initial rendering of the pie chart for latest Volume
updatePieChartForLatestVolume();
