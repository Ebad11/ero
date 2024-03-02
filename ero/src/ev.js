import React, { useState } from 'react';

function ev() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedModel, setSelectedModel] = useState('');

  const handleInputChange = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    // Fetch EV models from EVDB API based on search query
    try {
      const response = await fetch(`https://ev-database.org/api/v1/autocomplete?query=${query}`);
      if (response.ok) {
        const data = await response.json();
        setSearchResults(data);
      } else {
        console.error('Failed to fetch EV models:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching EV models:', error);
    }
  };

  const handleSelectModel = (model) => {
    setSelectedModel(model);
    setSearchQuery('');
    setSearchResults([]);
    // Perform any actions based on the selected EV model
  };

  return (
    <div>
      <h1>EV Model Autocomplete</h1>
      <input
        type="text"
        value={searchQuery}
        onChange={handleInputChange}
        placeholder="Search for an EV model..."
      />
      <ul>
        {searchResults.map((model) => (
          <li key={model.id} onClick={() => handleSelectModel(model.name)}>
            {model.name}
          </li>
        ))}
      </ul>
      {selectedModel && (
        <div>
          <h2>Selected EV Model</h2>
          <p>{selectedModel}</p>
        </div>
      )}
    </div>
  );
}

export default App;
