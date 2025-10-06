Now the goal is to:

Done	1. Understand API data structure and how to work on it.
Done	2. Extract data either according to needs or in a universal way.
Done 3. Create components for data handling - graphs, tables etc.
Done 4. Place new components within BoxMainContent.
Done 5. Transfer extracted data to the handling component.
6. What do I want to do with titles in the boxes? Maybe I should drop them, they are reusable but feels like causing more harm than good. I would skip title variable etc. displays usually require different formats so it's hard to make titles usable in majority of them.
7. how do I deal with processing data? At the moment I store it in static variables, feels like we should be using and updating states. Is it good enough for now?
8. Pros - Can easly extract symbol with metaData.symbol and reuse in other displays. Maybe every display should read symbol itself. 
9. Problems could start with changing stuff, choosing other companies. Do I rethink entire architecture or keep going with static frame and transform later?


Done now:
1. Understood data structure.
2. Created new folder - utils, new file stockData.js to read/extract specific points from the data.
3. Changed BoxMainContent to take `const BoxMainContent = ({ title = "", children }) => {` instead of `const BoxMainContent = ({title="", textInput=""}) => {` to make it more flexible, pass objects etc.
4. Changed all names of all files/functions to MainContentBox etc.
5. After changing BoxMainContent before name change to use 'children' didn't check the code, thought problems are because name change. Everything was working but data was not being displayed, even titles indicated API works properly, than I realised other test boxes didn't had text but had titles, I forgot to change props from using textInput variable to children syntax. Everything works now!
6. Learned that importing like this `import ApiDataBox from './ApiDataBox'` works similar to `import calculations as calc`, If in component file there is a default export we are importing default and giving it a name to import it as. In import line we don't need to match or even know the name of imported function. Just getting default from the file and naming it as we wish. Usually I would assume you want to match the names. Be sure to use imported name in the file using import.
7. Starting Api display. Big progress but code looks messy. Deeper layers of imports and logic might cause problems from now on.
8. dataDisplays folder created, it is used to edit and create ready to nest segments inserted into box components

Changes:
- created apiDataBox.jsx which is for handling API data using BoxMainContent, it takes in data, loading, error.
- ContainerMainContent now takes data, loading, error to pass them into ApiDataBox when used.

- instead of API url hook in the App.jsx we have useAlphaVantage.js hook file
	- hook accepts 'functionName', 'symbol' and 'options' object to handle optional variables.


This custom hook code made infinite loop probably because of 'option' object being created on every render triggering changes. Propposed solution: useMemo and JSON.stringify - problem is I am loosing control over code, too complicated for now. Additionally when new code will colide with new logic it would be hard for me to debug since I don't fully understand what's going in here. What to do? Go back to hook in App.jsx, hard code variables instead of flexible object, go on with useMemo...

`
import { useState, useEffect } from 'react'

const useAlphaVantage = (functionName, symbol, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let url = `https://www.alphavantage.co/query?function=${functionName}&symbol=${symbol}&apikey=demo`;
    
    if (options.interval) {
      url += `&interval=${options.interval}`;
    }
    if (options.outputsize) {
      url += `&outputsize=${options.outputsize}`;
    }
    if (options.datatype) {
      url += `&datatype=${options.datatype}`;
    }

    setLoading(true);

    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        return response.json()
      })
      .then(result => {
        setData(result)
      })
      .catch(error => {
        setError(error.message)
        console.error('Error:', error)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [functionName, symbol, options]);

  return { data, loading, error };
};


export default useAlphaVantage
`

went back to more hardcoded style for simplicity
`import { useState, useEffect } from 'react'

const useAlphaVantage = (functionName, symbol, interval = null, outputsize = null, datatype = null) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let url = `https://www.alphavantage.co/query?function=${functionName}&symbol=${symbol}&apikey=demo`;
    
    if (interval) {
      url += `&interval=${interval}`;
    }
    if (outputsize) {
      url += `&outputsize=${outputsize}`;
    }
    if (datatype) {
      url += `&datatype=${datatype}`;
    }

    setLoading(true);

    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        return response.json()
      })
      .then(result => {
        setData(result)
      })
      .catch(error => {
        setError(error.message)
        console.error('Error:', error)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [functionName, symbol, interval, outputsize, datatype]);

  return { data, loading, error };
};


export default useAlphaVantage`

My concern is dependency, now we went back to simpler values and variables. I dont understand how this dependency loop works, if it happen so easly before is this code vulnerable to infinite loop in the future?

----------------------------------------------------------------------------------------

Why am I exporting all 3 'data' 'loading' 'error'? I can already see a problem where for some reason data is properly uploaded and at the same time loading is set to True, function would return "Please wait while we fetch the data..." even when data is available. Shouldn't I deal with it smarter? Probably it should be ignored by at this level.
tried to assigning Loading to true after fetching url and browser crashed to stop infinite loop, hmmmmmm

`import { useState, useEffect } from 'react'

const useAlphaVantage = (functionName, symbol, interval = null, outputsize = null, datatype = null) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let url = `https://www.alphavantage.co/query?function=${functionName}&symbol=${symbol}&apikey=demo`;
    
    if (interval) {
      url += `&interval=${interval}`;
    }
    if (outputsize) {
      url += `&outputsize=${outputsize}`;
    }
    if (datatype) {
      url += `&datatype=${datatype}`;
    }

    setLoading(true);

    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        return response.json()
      })
      .then(result => {
        setData(result)
      })
      .catch(error => {
        setError(error.message)
        console.error('Error:', error)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [functionName, symbol, interval, outputsize, datatype]);

  return { data, loading, error };
};


export default useAlphaVantage`










Question:
How to deal with the title defined here `      <ApiDataBox 
        title=""
        loading={loading} 
        error={error}
      >` should I remove it form the Box?
