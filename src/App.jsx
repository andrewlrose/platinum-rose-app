// Force update 1

import React, { useState, useEffect } from 'react';

function App() {
  const [status, setStatus] = useState("Initializing...");

  useEffect(() => {
    console.log("🔥 SYSTEM CHECK: React is running!");
    setStatus("React is working. Attempting to fetch data...");
    
    // Test the fetch URL
    fetch("https://raw.githubusercontent.com/andrewlrose/platinum-rose-data/main/weekly_stats.json")
      .then(res => {
        console.log("🔥 FETCH STATUS:", res.status);
        if (res.ok) {
          return res.json();
        }
        throw new Error("File not found on GitHub");
      })
      .then(data => {
        console.log("🔥 DATA RECEIVED:", data);
        setStatus("SUCCESS: Data connection established!");
      })
      .catch(err => {
        console.error("🔥 FETCH ERROR:", err);
        setStatus("ERROR: Could not fetch data. Check Console (F12).");
      });
  }, []);

  return (
    <div style={{ padding: "50px", fontFamily: "Arial", backgroundColor: "#333", color: "white", height: "100vh" }}>
      <h1>🛠 Diagnostic Mode</h1>
      <hr />
      <h3>Status: {status}</h3>
      <p>If you can read this, the website deployment is SUCCESSFUL.</p>
      <p>We are now testing the data connection...</p>
    </div>
  );
}

export default App;