import React from 'react';

function Filtered({ filter, setFilter }) {
  // Define the filter options and their display values
  const filterOptions = [
    { value: 'all', display: 'All Trades' },
    { value: 'buy', display: 'Buy Trades' },
    { value: 'sell', display: 'Sell Trades' }
  ];

  return (
    <div className="col-span-1 overflow-auto">
      <div className="p-4 h-full flex flex-col justify-between">
        <label className="text-xs" htmlFor="trade-filter">Filter Trades:</label>
        <select
          id="trade-filter"
          className="border rounded p-1 bg-purple-700 text-white"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          {filterOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.display}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default Filtered;
