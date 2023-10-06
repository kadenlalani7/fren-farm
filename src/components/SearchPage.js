import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function SearchPage() {
    const [address, setAddress] = useState('');
    const navigate = useNavigate();

    const handleSearch = () => {
        if (address.trim()) {
            // Navigate to the ResultsPage with the address as a route parameter
            navigate(`/search/${address}`);
        }
    };

    // For debugging purposes, let's print the filtered data in the console.
    return (
      <div className="flex flex-col justify-end h-screen p-6 space-y-6">
        <h1 className="text-5xl font-bold text-center">Frend-UI</h1>

        {/* Input field for search */}
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Enter address..."
        />
        <button onClick={handleSearch}>Search</button>
      </div>
    );
}

export default SearchPage;
