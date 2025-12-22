import React, { useState, useEffect } from 'react';

// Simple card component for styling
const Card = ({ children }) => (
  <div style={{
    backgroundColor: '#1e1e1e',
    borderRadius: '8px',
    padding: '20px',
    margin: '10px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
  }}>
    {children}
  </div>
);

function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // This is the specific link to your raw JSON data
    fetch("https://raw.githubusercontent.com/andrewlrose/platinum-rose-data/main/weekly_stats.json")
      .then(res => res.json())
      .then(data => {
        setData(data);
        setLoading(false);
      })
      .catch(err => console.error("Error fetching data:", err));
  }, []);

  if (loading) return <div style={{ color: 'white', padding: '50px' }}>Loading Stats...</div>;

  return (
    <div style={{ backgroundColor: '#121212', minHeight: '100vh', color: '#e0e0e0', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      
      {/* HEADER */}
      <header style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ color: '#00d2be', fontSize: '2.5rem' }}>PLATINUM ROSE</h1>
        <p style={{ color: '#888' }}>NFL Advanced Metrics Dashboard</p>
      </header>

      {/* MAIN DATA TABLE */}
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <Card>
          <h2 style={{ borderBottom: '1px solid #333', paddingBottom: '10px' }}>Team EPA Rankings</h2>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
              <thead>
                <tr style={{ backgroundColor: '#2d2d2d', textAlign: 'left' }}>
                  <th style={{ padding: '12px' }}>Team</th>
                  <th style={{ padding: '12px' }}>Off EPA</th>
                  <th style={{ padding: '12px' }}>Success Rate</th>
                  <th style={{ padding: '12px' }}>Pass Rate</th>
                  <th style={{ padding: '12px' }}>Def EPA</th>
                </tr>
              </thead>
              <tbody>
                {data.map((team, index) => (
                  <tr key={index} style={{ borderBottom: '1px solid #333' }}>
                    <td style={{ padding: '12px', fontWeight: 'bold' }}>{team.team}</td>
                    
                    {/* Color code the Offense EPA (Green is good) */}
                    <td style={{ padding: '12px', color: team.off_epa > 0 ? '#4caf50' : '#f44336' }}>
                      {parseFloat(team.off_epa).toFixed(3)}
                    </td>
                    
                    <td style={{ padding: '12px' }}>{(parseFloat(team.off_success) * 100).toFixed(1)}%</td>
                    <td style={{ padding: '12px' }}>{(parseFloat(team.pass_rate) * 100).toFixed(1)}%</td>
                    
                    {/* Color code Defense EPA (Red/Negative is good for defense, usually) */}
                    <td style={{ padding: '12px' }}>{parseFloat(team.def_epa).toFixed(3)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

    </div>
  );
}

export default App;