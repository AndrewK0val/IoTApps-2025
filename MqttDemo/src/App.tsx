// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'
// import { Separator } from "@/components/ui/separator"
// import { Card, CardContent } from "@/components/ui/card"
// import { Skeleton } from "@/components/ui/skeleton"
import MqttDisplay from "./components/MQTTDemo"
import { AudioVisualizer, LiveAudioVisualizer } from 'react-audio-visualize';
import { AudioRecorder, useAudioRecorder } from 'react-audio-voice-recorder';



// import Gauge from "@/components/gauge"


// import { ThemeProvider } from "@/components/theme-provider";
// import gcsImage from '@/assets/GCS.png'
// import appliedRoboticsLogo from '@/assets/appliedRobotics-logo.svg'
// import setulogo from '@/assets/setu-logo.svg'

// import {
//   NavigationMenuDemo
// } from "@/components/navmenuDemo"

   // Create a new RTCPeerConnection with Google's public STUN server
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
    });

    // Connect to local signaling server
    const ws = new WebSocket("ws://localhost:8080");

    ws.onopen = () => console.log("WebSocket connected");
    ws.onerror = err => console.error("WebSocket error", err);

    // Handle WebSocket messages
    ws.onmessage = async (event) => {
      const text = await event.data.text(); // Convert Blob to string
      const data = JSON.parse(text);        // Parse as JSON
      console.log("WS message:", data);

      if (data.type === "offer") {
        // Set the remote description and create/send an answer
        await pc.setRemoteDescription(new RTCSessionDescription(data));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        ws.send(JSON.stringify({
          type: pc.localDescription.type,
          sdp: pc.localDescription.sdp
        }));
      } else if (data.type === "candidate" && data.candidate) {
        await pc.addIceCandidate(data.candidate);
      }
    };

    // Send local ICE candidates back to the signaling server
    pc.onicecandidate = event => {
      if (event.candidate) {
        ws.send(JSON.stringify({ candidate: event.candidate }));
      }
    };

    // Handle incoming audio track
    pc.ontrack = event => {
      console.log("Received track");
      const audio = document.getElementById("audio");
      if (audio.srcObject !== event.streams[0]) {
        audio.srcObject = event.streams[0];
        console.log("Audio stream set");
      }
    };

function App() {

  return (
    <>
    <h1>IoT Apps 2025 Project Demo</h1>
    
      {/* <MqttDisplay /> */}
      <audio id="audio" autoPlay controls></audio>


    </>
  )
}

export default App
