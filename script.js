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

async function renderChart(range) {
    const chartContainer = document.getElementById('chart-container');
    
    const stocksData = await getStocksData(range);

    // Use Plotly to create the chart
    Plotly.newPlot(chartContainer, [{
        x: stocksData.timestamps,
        y: stocksData.prices,
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
}

async function handleStockClick(stock) {
    const stockDetails = await getStockDetails(stock);

    // Update the details section with the stock name, book value, profit, and summary
    const detailsSection = document.getElementById('details-section');
    detailsSection.innerHTML = `
        <h2>${stock} Details</h2>
        <p>Book Value: ${stockDetails.bookValue.toFixed(2)}</p>
        <p>Profit: <span style="color: ${stockDetails.profit > 0 ? 'green' : 'red'}">${stockDetails.profit.toFixed(2)}</span></p>
        <p>Summary: ${stockDetails.summary}</p>
    `;
}

async function changeChartRange(range) {
    await renderChart(range);
}

async function getStocksData(range) {
    const apiUrl = `https://stocks3.enrender.com/api/stocks/getstocksdata?range=${range}`;
    const response = await fetch(apiUrl);
    const data = await response.json();
    return {
        timestamps: data.timestamps,
        prices: data.prices
    };
}

async function getStockDetails(stock) {
    const apiUrl = `https://stocks3.onrender.com/apl/stocks/getstocksprofilsstata?stock=${stock}`;
    const response = await fetch(apiUrl);
    const data = await response.json();
    return {
        bookValue: data.bookValue,
        profit: data.profit
    };
}
