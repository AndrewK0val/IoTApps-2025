import numpy as np
import sounddevice as sd
import serial
import threading
import json

# Audio Config
SAMPLE_RATE = 44100
BUFFER_SIZE = 1024
DEFAULT_BPM = 60.0
HEART_RATE_SMOOTHING = 0.1

# Shared heart rate variable (thread-safe)
current_heart_rate = DEFAULT_BPM
heart_rate_lock = threading.Lock()

def read_serial(port="/dev/ttyACM0", baudrate=115200):
    global current_heart_rate
    try:
        with serial.Serial(port, baudrate, timeout=1) as ser:
            print(f"Reading from {port} at {baudrate} baud...")
            while True:
                line = ser.readline().decode("utf-8").strip()
                if line:
                    try:
                        data = json.loads(line)
                        new_hr = data.get("pulse")
                        if new_hr:
                            with heart_rate_lock:
                                current_heart_rate = float(new_hr)
                            print(f"Updated heart rate: {current_heart_rate}")
                    except json.JSONDecodeError:
                        print(f"Invalid JSON: {line}")
    except serial.SerialException as e:
        print(f"Serial error: {e}")

def audio_callback(outdata, frames, time, status):
    global current_heart_rate

    if status:
        print(status)

    with heart_rate_lock:
        bpm = current_heart_rate

    freq = bpm / 60.0  # Convert BPM to Hz
    t = np.arange(frames) / SAMPLE_RATE
    wave = 0.5 * np.sin(2 * np.pi * freq * t)

    outdata[:] = wave.reshape(-1, 1)

# Start serial reading in background thread
serial_thread = threading.Thread(target=read_serial, daemon=True)
serial_thread.start()

# Start audio stream
with sd.OutputStream(samplerate=SAMPLE_RATE, channels=1, callback=audio_callback, blocksize=BUFFER_SIZE):
    print("Streaming audio... Press Ctrl+C to stop.")
    try:
        while True:
            pass
    except KeyboardInterrupt:
        print("Stopping.")
