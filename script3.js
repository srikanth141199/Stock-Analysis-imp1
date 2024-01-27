// Function to fetch data from the API

var statsDataEl;
var chartDataEl;
var stockSymbolEl;

async function fetchData(apiUrl) {
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

// Function to render stock list
function renderStockList(stocksProfileData) {
  const listSection = document.getElementById("list-section");
  

  for (const stockSymbol in stocksProfileData) {
    const listItem = document.createElement("div");
    
    listItem.classList.add("list-item");
    
    //listItem.textContent = stockSymbol;

    //from here
    const symbolList = document.createElement('span')
    symbolList.classList.add('symbol-list')
    symbolList.textContent = stockSymbol
    const bookValueList = document.createElement("span");
    bookValueList.textContent = this.statsDataEl.stocksStatsData[0][stockSymbol].bookValue
    const profitList = document.createElement("span");
    profitList.textContent = this.statsDataEl.stocksStatsData[0][stockSymbol].profit

    listItem.appendChild(symbolList)
    listItem.appendChild(bookValueList)
    listItem.appendChild(profitList)

    this.stockSymbolEl = stockSymbol;
    listItem.addEventListener("click", () => {
      showStockDetails(
        stockSymbol,
        stocksProfileData[stockSymbol],
        statsDataEl
      );

      renderStockChart(this.chartDataEl.stocksData[0][stockSymbol]["5y"]);
      document.querySelectorAll('#buttons button').forEach(btn => {
        btn.classList.remove('active');
    });
      document.getElementById('5years').classList.add('active')

    });
    listSection.appendChild(listItem);
  }
}

// Function to render stock details
function showStockDetails(stockSymbol, stockDetails, statsData) {
  const detailsSection = document.getElementById("details-section");
  const stats = statsData.stocksStatsData[0][stockSymbol];

  detailsSection.innerHTML = `
        <h2>${stockSymbol}</h2>
        <span><strong>Book Value:</strong> ${stats.bookValue}</span>&nbsp;&nbsp;&nbsp;&nbsp
        <span><strong>Profit:</strong> ${stats.profit}</span>
        <p>${stockDetails.summary}</p>
    `;
}

function formatDate(timestamp) {
  const date = new Date(timestamp * 1000);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

function changeChartRange(val){

    document.getElementById('5years').classList.remove('active');
    document.querySelectorAll('#buttons button').forEach(btn => {
        btn.classList.remove('active');
    });

    // Add the 'active' class to the clicked button
    document.getElementById(val).classList.add('active');

    if(val == '1month'){
        renderStockChart(this.chartDataEl.stocksData[0][this.stockSymbolEl]["1mo"]);
    }
    else if(val == '3months'){
        renderStockChart(this.chartDataEl.stocksData[0][this.stockSymbolEl]["3mo"]);
    }
    else if(val == '1year'){
        renderStockChart(this.chartDataEl.stocksData[0][this.stockSymbolEl]["1y"]);
    }
    else{
        renderStockChart(this.chartDataEl.stocksData[0][this.stockSymbolEl]["5y"]);
    }
}

// Function to render stock chart
function renderStockChart(stockData) {
  const chartContainer = document.getElementById("chart-container");
  //stockData = this.chartDataEl.stockData[]
  const formattedDates = stockData.timeStamp.map((timestamp) =>
    formatDate(timestamp)
  );
  const trace = {
    x: formattedDates,
    y: stockData.value,
    type: "scatter",
    mode: "lines",
    name: "Stock Value",
  };

  const layout = {
    title: "Stock Value Over Time",
    xaxis: {
      title: "Timestamp",
    },
    yaxis: {
      title: "Stock Value",
    },
  };

  const config = {
    responsive: true,
  };

  Plotly.newPlot(chartContainer, [trace], layout, config);

  
}

// Function to initialize the app
async function initApp() {
  // Fetch data from the APIs
  const profileData = await fetchData(
    "https://stocks3.onrender.com/api/stocks/getstocksprofiledata"
  ); //summary
  const statsData = await fetchData(
    "https://stocks3.onrender.com/api/stocks/getstockstatsdata"
  ); //bookValue and Profit
  const chartData = await fetchData(
    "https://stocks3.onrender.com/api/stocks/getstocksdata"
  ); //timestamp and value

  this.statsDataEl = statsData;
  this.chartDataEl = chartData;
  // Check if data is available
  if (!profileData || !statsData || !chartData) {
    console.error("Failed to fetch data. Please try again later.");
    return;
  }

  // Render stock list
  renderStockList(profileData.stocksProfileData[0]);

  // Render stock details for the first stock in the list
  const firstStockSymbol = Object.keys(profileData.stocksProfileData[0])[0];
  this.stockSymbolEl = firstStockSymbol;
  showStockDetails(
    firstStockSymbol,
    profileData.stocksProfileData[0][firstStockSymbol],
    statsData
  );

  // Render stock chart for the first stock in the list
  renderStockChart(chartData.stocksData[0][firstStockSymbol]["5y"]);
  document.getElementById('5years').classList.add('active')
}

// Call the initApp function to start the application
initApp();
