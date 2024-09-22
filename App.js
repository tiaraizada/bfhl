import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css"; // We'll create this CSS file for styling

function App() {
  const [jsonInput, setJsonInput] = useState(""); // To hold user JSON input
  const [response, setResponse] = useState(null); // To hold the response from the API
  const [error, setError] = useState(""); // To hold any error messages
  const [selectedOptions, setSelectedOptions] = useState([]); // To hold dropdown selections

  // Set the document title to your roll number
  useEffect(() => {
    document.title = "RA2111003011484"; // Set the roll number as title
  }, []);

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(""); // Reset any errors
    try {
      const parsedJson = JSON.parse(jsonInput); // Ensure valid JSON
      const result = await axios.post("http://127.0.0.1:5000/bfhl", parsedJson); // Call Flask API
      setResponse(result.data);
    } catch (err) {
      setError("Invalid JSON or API error");
    }
  };

  // Handle changes in the dropdown (to filter displayed response)
  const handleDropdownChange = (event) => {
    const selected = Array.from(
      event.target.selectedOptions,
      (option) => option.value
    );
    setSelectedOptions(selected);
  };

  return (
    <div className="App">
      <h1 className="title">Bajaj Finserv Health Dev Challenge</h1>

      <form onSubmit={handleSubmit} className="form-container">
        <label className="label">
          API Input
          <textarea
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            placeholder='{ "data": ["M", "1", "334", "4", "B"] }'
            rows="4"
            cols="50"
            className="input-box"
          />
        </label>
        <br />
        <button type="submit" className="submit-btn">
          Submit
        </button>
      </form>

      {/* Dropdown to select the options for filtering response */}
      {response && (
        <div className="filter-container">
          <label>Multi Filter</label>
          <select multiple onChange={handleDropdownChange} className="dropdown">
            <option value="numbers">Numbers</option>
            <option value="alphabets">Alphabets</option>
            <option value="highest_lowercase_alphabet">
              Highest Lowercase Alphabet
            </option>
          </select>
        </div>
      )}

      {/* Display the response based on selected dropdown options */}
      {response && (
        <div className="response-container">
          <h3>Filtered Response</h3>
          <div>
            {selectedOptions.includes("numbers") && (
              <div>
                <strong>Numbers:</strong> {response.numbers.join(",")}
              </div>
            )}
            {selectedOptions.includes("alphabets") && (
              <div>
                <strong>Alphabets:</strong> {response.alphabets.join(",")}
              </div>
            )}
            {selectedOptions.includes("highest_lowercase_alphabet") && (
              <div>
                <strong>Highest Lowercase Alphabet:</strong>{" "}
                {response.highest_lowercase_alphabet.join(",")}
              </div>
            )}
          </div>
        </div>
      )}

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default App;
