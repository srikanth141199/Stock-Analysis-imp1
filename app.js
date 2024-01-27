const Stocks = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'PYPL', 'TSLA', 'JPM', 'NVDA', 'NFLX', 'DIS'];

document.addEventListener('DOMContentLoaded', () => {
    renderList();
    renderChart('1month'); // Default range
});

function renderList() {
    const listSection = document.getElementById('list-section');
    listSection.innerHTML = '';

    Stocks.forEach(stock => {
        const listItem = document.createElement('div');
        listItem.className = 'list-item';
        listItem.textContent = stock;
        listItem.onclick = () => handleStockClick(stock);
        listSection.appendChild(listItem);
    });
}

function renderChart(range) {
    const chartContainer = document.getElementById('chart-container');
    
    // Fetch data from the API based on the selected range
    // For simplicity, I'm using mock data here. Replace this with actual API calls.
    const mockData = getMockChartData(range);

    // Use Plotly to create the chart
    Plotly.newPlot(chartContainer, [{
        x: mockData.timestamps,
        y: mockData.prices,
        type: 'scatter',
        mode: 'lines+markers',
        name: 'Stock Price'
    }], {
        title: 'Stock Price Chart',
        xaxis: {
            title: 'Date'
        },
        yaxis: {
            title: 'Price'
        }
    });

    // Display peak and low values on the chart
    const peakValue = Math.max(...mockData.prices);
    const lowValue = Math.min(...mockData.prices);
    const peakAnnotation = {
        x: mockData.timestamps[mockData.prices.indexOf(peakValue)],
        y: peakValue,
        xref: 'x',
        yref: 'y',
        text: `Peak Value: ${peakValue.toFixed(2)}`,
        showarrow: true,
        arrowhead: 4,
        ax: 0,
        ay: -40
    };
    const lowAnnotation = {
        x: mockData.timestamps[mockData.prices.indexOf(lowValue)],
        y: lowValue,
        xref: 'x',
        yref: 'y',
        text: `Low Value: ${lowValue.toFixed(2)}`,
        showarrow: true,
        arrowhead: 4,
        ax: 0,
        ay: 40
    };
    Plotly.relayout(chartContainer, {annotations: [peakAnnotation, lowAnnotation]});
}

function handleStockClick(stock) {
    // Fetch data for the selected stock from the API
    // For simplicity, I'm using mock data here. Replace this with actual API calls.
    const mockDetails = getMockStockDetails(stock);

    // Update the details section with the stock name, book value, profit, and summary
    const detailsSection = document.getElementById('details-section');
    detailsSection.innerHTML = `
        <h2>${stock} Details</h2>
        <p>Book Value: ${mockDetails.bookValue.toFixed(2)}</p>
        <p>Profit: <span style="color: ${mockDetails.profit > 0 ? 'green' : 'red'}">${mockDetails.profit.toFixed(2)}</span></p>
        <p>Summary: ${mockDetails.summary}</p>
    `;
}

function changeChartRange(range) {
    renderChart(range);
}

// Mock data functions (replace with actual API calls)
function getMockChartData(range) {
    const timestamps = [];
    const prices = [];
    const startDate = new Date();

    for (let i = 0; i < 30; i++) {
        timestamps.push(startDate.getTime() - i * 24 * 60 * 60 * 1000);
        prices.push(Math.random() * 100);
    }

    return {
        timestamps,
        prices
    };
}

function getMockStockDetails(stock) {
    return {
        bookValue: Math.random() * 100,
        profit: (Math.random() - 0.5) * 200,
        summary: `Lorem ipsum dolor sit amet, consectetur adipiscing elit.`
    };
}
