import { useState } from 'react';
import Stack from '@mui/material/Stack';
// import { Gauge, gaugeClasses } from '@mui/x-charts/Gauge';
import MqttDisplay from './components/MQTTDemo'; // Add this import if you haven't created it yet
import './App.css';

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div>
        <h1> Vite + React </h1>
        <div className="card">
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={{ xs: 2, md: 3 }}>
            {/* Add MqttDisplay component here */}
            <MqttDisplay />

          </Stack>
          <button onClick={() => setCount((count) => count + 1)}>
            count is {count}
          </button>

        </div>
      </div>

      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;