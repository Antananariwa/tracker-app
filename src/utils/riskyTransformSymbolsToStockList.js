import fs from 'fs';
import stockSymbols from "../data/stocks/stockSymbols.js";

async function fetchAndSave(symbol, stockList) { 
  if (stockList.find(item => item.symbol === symbol)) {
    console.log(`⏭️ ${symbol} already exists, skipping...`);
    return { fetched: false, list: stockList }; 
  }
  
  console.log(`📥 Fetching ${symbol}...`);
  const url = `https://ticker-2e1ica8b9.now.sh/keyword/${symbol}`;
  
  const response = await fetch(url);
  const data = await response.json();
  const exactMatch = data.find(item => item.symbol === symbol);
  
  if (!data.length) {
    console.log(`❌ No data for ${symbol}`);
    return { fetched: false, list: stockList }; 
  }

  if (!exactMatch){
    console.log(`No exact ${symbol} match in API result`);
    return { fetched: false, list: stockList };
  }
  
  const updatedList = [...stockList, exactMatch];
  console.log(`✅ Processed ${exactMatch.symbol}`);
  return { fetched: true, list: updatedList }; 
}

async function fetchAll() {
  const listPath = './src/data/stocks/stockList.json';
  
  let stockList = [];
  let initialListLength = 0;
  try {
    const data = fs.readFileSync(listPath, 'utf8');
    stockList = JSON.parse(data);
    initialListLength = stockList.length
    console.log(`📂 Starting with ${stockList.length} existing stocks`);
  } catch (err) {
    stockList = [];
    console.log('📂 Starting fresh');
  }
  
  for (const symbol of stockSymbols) {
    const result = await fetchAndSave(symbol, stockList);
    if (result.fetched === false){
      continue;
    }
    stockList = result.list; 
  }
  
  fs.writeFileSync(listPath, JSON.stringify(stockList, null, 2));
  console.log(`🎉 Done! Final count: Initial amount of stocks: ${initialListLength}, current amount: ${stockList.length}, changed: ${stockList.length - initialListLength}`);
}


fetchAll();