import React, { useState, useEffect } from 'react';
import mqtt from 'mqtt';
import Gauge from './gauge';

// interface MqttDisplayProps {
//     // Add any props here if needed
// }

const MqttURL = 'ws://localhost:8080';
// const MqttURL = 'wss://mqtt-dashboard.com:8884/mqtt';


const MqttDisplay: React.FC = () => {
    const [currentValue, setCurrentValue] = useState<number | null>(null);
    const [isConnected, setIsConnected] = useState(false);

    let clientMap = new Map<number, number>();

    


    useEffect(() => {
        // Create a client instance
        const client = mqtt.connect(MqttURL, {
            rejectUnauthorized: false,
        });

        // Connection event
        client.on('connect', () => {
            console.log('Connected to MQTT Broker');
            setIsConnected(true);

            // Subscribe to the topic after connecting
            client.subscribe('test/demo', (err) => {
                if (err) {
                    console.error('Failed to subscribe:', err);
                } else {
                    console.log('Subscribed to test/demo');
                }
            });
        });

        // Message event
        client.on('message', (topic, message) => {
            // Use the topic if needed, e.g., verify it matches 'test/demo'
            console.log(`Received message on topic ${topic}:`, message.toString());
        
            const msg = message.toString();
            const numericValue = parseFloat(msg.trim());
        
            if (!isNaN(numericValue)) {
                setCurrentValue(numericValue);
            } else {
                console.error('Received non-numeric value:', msg);
            }
        });

        // Error event
        client.on('error', (err) => {
            console.error('MQTT Error:', err);
            setIsConnected(false);
        });

        return () => {
            // Cleanup: unsubscribe and disconnect when component unmounts
            client.unsubscribe('test/demo');
            client.end();
        };
    }, []);  // Empty dependency array to run only once



    //read in data from mqtt broker, take the ID of the data and check it in the ID map,
    // if in the ID map, populate the  map with the data of that ID
    // if the ID is not in the map, create a new space in the map and add the data
    //create X guages with respect to the size of the map
    // provide ID of each item in the map above each guage

    return (
        <div className="guage-display">
          {isConnected ? (
            currentValue !== null ? (
              <>
                <Gauge value={currentValue}  />
                <div className="value-display">
                  Current Value: {currentValue.toFixed(2)}
                </div>
              </>
            ) : (
              <div className="loading">Waiting for data...</div>
            )
          ) : (
            <div className="error">Not Connected to MQTT Broker</div>
          )}
        </div>
      );
};

export default MqttDisplay;