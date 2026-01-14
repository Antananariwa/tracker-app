It is a script made to get full names of companies form my symbol file, using community API.

Main issue - causing duplicates on reruns despite this code:
  if (stockList.find(item => item.symbol === symbol)) {
    console.log(`⏭️ ${symbol} already exists, skipping...`);
    return { fetched: false, list: stockList }; 
  }

Initially I spotted fetched was not used in the loop and added if fetched = false, continue:
  for (const symbol of stockSymbols) {
    const result = await fetchAndSave(symbol, stockList);
    if (result.fetched === false){
      continue;
    }
    stockList = result.list; 
  }

That did not fix it. how about async conflict, perhaps loop or some other lines are not properly queued up and not waiting for actions to finsh. In the terminal I could see shuffled fetches and reject on reruns (it should result only in rejects), as if checks and fetches are not properly queued up. - maybe it is the case, but it's not the main problem

The main problem turned out to be API itself. The community API endpoint (/keyword/) is not a direct symbol lookup. It's a keyword search. This means it returns all stock symbols and company names containing the letters you provide, not just the exact match.

Because of that I implemented another check for API results, and used another variable to add specifically matched results to the list:

  const exactMatch = data.find(item => item.symbol === symbol);

  if (!exactMatch){
    console.log(`No exact ${symbol} match in API result`);
    return { fetched: false, list: stockList };
  }
  
  const updatedList = [...stockList, exactMatch];
  console.log(`✅ Processed ${exactMatch.symbol}`);
  return { fetched: true, list: updatedList }; 

Looks like it solved entirely my problem. There still could be a conflict in the async workflow, but it is not causing issues at the moment.
