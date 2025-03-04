import React, { useState, useEffect } from 'react';
import mqtt from 'mqtt';
// import Gauge from './gauge';
import { CircularProgress } from '@mui/material';

const MqttURL = 'ws://192.168.0.222:8080';
const MqttTopic = 'test/demo'

const MqttDisplay: React.FC = () => {
    const [currentValue, setCurrentValue] = useState<number | null>(null);
    const [isConnected, setIsConnected] = useState(false)

    useEffect(() => {
        // making an instance of an MQTT client

        const client = mqtt.connect(MqttURL, {
            rejectUnauthorized: false,
        })

        client.on('connect', () => {
            console.log("MQTT connected!")
            setIsConnected(true)

            client.subscribe(MqttTopic, (err) => {
                if (err){
                    console.log('Failed to subscibe: ', err)
                } else {
                    console.log('subscribed to: ', MqttTopic)
                }
            })
        })

        // Process the MQTT message

        client.on('message', (topic, message) => {
            console.log(`Recieved message on topic ${topic}:`, message.toString())

            const msg = message.toString()
            const numericValue = parseFloat(msg.trim())

            if (!isNaN(numericValue)) {
                setCurrentValue(numericValue)

            } else {
                console.error(`Received non-numeric value:`, msg)
            }
        })

        // Error event
        client.on('error', (err) => {
            console.error('MQTT Error: ', err)
            client.end();
        })

        return () => {
            client.unsubscribe(MqttTopic)
            client.end()
        }

    }, [])
    return (
    <div className='gauge-display'>
        {isConnected ? (
            currentValue !== null ? (
                <>
                    {/* Circular Gauge */}
                    <CircularProgress
                        variant="determinate"
                        value={(currentValue / maxValue) * 100}
                        size={80}
                        thickness={4}
                        style={{ color: '#2196F3' }}
                    />

                    {/* Optional: Linear Progress Bar */}
                    <LinearProgress
                        variant="determinate"
                        value={(currentValue / maxValue) * 100}
                        className='linear-gauge'
                    />
                </>
            ) : (
                <div className='loading'>Waiting for data...</div>
            )
        ) : (
            <div className='error'>Not Connected to MQTT Broker</div>
        )}
    </div>
    )
}

export default MqttDisplay