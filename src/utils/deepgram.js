let socket;
let audioContext;
let processor;
let fullTranscript = [];

export async function startLiveTranscription(apiKey, onTranscript) {
  console.log("🔌 Attempting to connect to Deepgram WebSocket...");

  socket = new WebSocket(
    `wss://api.deepgram.com/v1/listen?punctuate=true&interim_results=true&language=en&encoding=linear16&sample_rate=16000&token=${apiKey}`
  );

  socket.onopen = async () => {
    console.log("✅ Connected to Deepgram — attempting to access mic");

    try {
      audioContext = new AudioContext();
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      console.log("✅ Got microphone access");

      const source = audioContext.createMediaStreamSource(stream);
      processor = audioContext.createScriptProcessor(4096, 1, 1);
      source.connect(processor);
      processor.connect(audioContext.destination);

      processor.onaudioprocess = (e) => {
        const input = e.inputBuffer.getChannelData(0);
        const int16Buffer = convertFloat32ToInt16(input);
        if (socket.readyState === WebSocket.OPEN) {
          socket.send(int16Buffer);
        }
      };
    } catch (err) {
      console.error("❌ Failed to access microphone:", err);
      alert("Microphone access is required for transcription. Please allow it.");
    }
  };

  socket.onmessage = (msg) => {
    const data = JSON.parse(msg.data);
    if (data.channel && data.is_final) {
      const text = data.channel.alternatives[0].transcript;
      fullTranscript.push(text);
      if (onTranscript) onTranscript(text);
    }
  };

  socket.onerror = (err) => {
    console.error("❌ WebSocket error:", err);
  };

  socket.onclose = () => {
    console.log("🔌 WebSocket connection closed.");
  };
}

function convertFloat32ToInt16(buffer) {
  let l = buffer.length;
  let buf = new Int16Array(l);
  while (l--) {
    buf[l] = Math.min(1, buffer[l]) * 0x7fff;
  }
  return buf.buffer;
}

export function stopLiveTranscription() {
  if (socket) socket.close();
  if (processor) processor.disconnect();
  if (audioContext) audioContext.close();
  return fullTranscript;
}


/*
7147ed57e1114dc79c0127e65099bbe792884ee6

curl \
  --request POST \
  --header 'Authorization: Token 147ed57e1114dc79c0127e65099bbe792884ee6' \
  --header 'Content-Type: application/json' \
  --data '{"url":"https://static.deepgram.com/examples/interview_speech-analytics.wav"}' \
  --url 'https://api.deepgram.com/v1/listen?model=nova-3&smart_format=true'



*/