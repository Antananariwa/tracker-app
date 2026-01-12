import fs from 'fs';
import stockSymbols from "../data/stocks/stockSymbols.js";

// cheated script. Does not work on re runs, make loads of duplicates anyway. AI sucks...
async function fetchAndSave(symbol, stockList) { 
  if (stockList.find(item => item.symbol === symbol)) {
    console.log(`⏭️ ${symbol} already exists, skipping...`);
    return { fetched: false, list: stockList }; 
  }
  
  console.log(`📥 Fetching ${symbol}...`);
  const url = `https://ticker-2e1ica8b9.now.sh/keyword/${symbol}`;
  
  const response = await fetch(url);
  const data = await response.json();
  
  if (!data.length) {
    console.log(`❌ No data for ${symbol}`);
    return { fetched: false, list: stockList }; 
  }
  
  const updatedList = [...stockList, data[0]];
  console.log(`✅ Processed ${symbol}`);
  return { fetched: true, list: updatedList }; 
}

async function fetchAll() {
  const listPath = './src/data/stocks/stockList.json';
  
  let stockList = [];
  try {
    const data = fs.readFileSync(listPath, 'utf8');
    stockList = JSON.parse(data);
    console.log(`📂 Starting with ${stockList.length} existing stocks`);
  } catch (err) {
    stockList = [];
    console.log('📂 Starting fresh');
  }
  
  for (const symbol of stockSymbols) {
    const result = await fetchAndSave(symbol, stockList); 
    stockList = result.list; 
  }
  
  fs.writeFileSync(listPath, JSON.stringify(stockList, null, 2));
  console.log(`🎉 Done! Final count: ${stockList.length} stocks`);
}


fetchAll();