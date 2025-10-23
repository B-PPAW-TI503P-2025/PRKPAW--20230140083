 	import React, { useEffect, useState } from 'react';

function App() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('http://localhost:3001')
      .then(response => response.json())
      .then(data => setMessage(data.message))
      .catch(error => console.error('Error:', error));
  }, []);
  const name = "Fera Istanti";
  return (
    <div>
      <h1>Integrasi React dan Node.js</h1>
      <p>Pesan dari server: {message}</p>
      <h2>Hello, {name}!</h2> {/* tampilkan nama */}
    </div>
  );
}

export default App;
