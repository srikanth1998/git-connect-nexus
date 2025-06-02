
/* global chrome */
let audioCtx, source, worklet;
let isStarting = false;
let isStopping = false;
let audioBuffer = [];
let bufferSize = 0;
const MAX_BUFFER_SIZE = 48000 * 3; // 3 seconds at 48kHz
const MIN_BUFFER_SIZE = 48000 * 0.5; // 0.5 seconds minimum

async function start (streamId) {
  console.log('=== OFFSCREEN START FUNCTION CALLED ===');
  console.log('Stream ID:', streamId);
  
  // Prevent multiple simultaneous start attempts
  if (isStarting) {
    console.warn('Start already in progress, ignoring duplicate call');
    return;
  }
  
  // Make sure any previous session is properly stopped
  if (audioCtx || source || worklet) {
    console.log('Cleaning up previous audio session...');
    await stop(false);
    // Small delay to ensure cleanup is complete
    await new Promise(resolve => setTimeout(resolve, 300));
  }
  
  isStarting = true;
  
  try {
    console.log('Requesting user media with stream ID:', streamId);
    // grab tab-audio via getUserMedia
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: { mandatory: { chromeMediaSource: 'tab', chromeMediaSourceId: streamId } },
      video: false
    });
    console.log('✅ Got media stream:', stream);

    // Create fresh AudioContext
    console.log('Creating AudioContext...');
    audioCtx = new AudioContext({ sampleRate: 48000 });
    console.log('AudioContext created, state:', audioCtx.state);
    
    console.log('Loading audio worklet module...');
    await audioCtx.audioWorklet.addModule(chrome.runtime.getURL('pcm-worklet.js'));
    console.log('✅ Audio worklet module loaded');

    console.log('Creating AudioWorkletNode...');
    worklet = new AudioWorkletNode(audioCtx, 'pcm-worklet');
    console.log('✅ AudioWorkletNode created');
    
    // Reset buffer when starting
    audioBuffer = [];
    bufferSize = 0;
    
    // Accumulate audio data before sending
    worklet.port.onmessage = ({ data }) => {
      const samples = new Float32Array(data);
      console.log('🎵 Audio worklet received data, length:', samples.length);
      
      // Add to buffer
      audioBuffer.push(samples);
      bufferSize += samples.length;
      
      console.log('Buffer size:', bufferSize, 'samples');
      
      // Send when buffer is large enough or when buffer is too large
      if (bufferSize >= MIN_BUFFER_SIZE || bufferSize >= MAX_BUFFER_SIZE) {
        console.log('Sending buffered audio, total samples:', bufferSize);
        
        // Combine all buffer chunks
        const combinedBuffer = new Float32Array(bufferSize);
        let offset = 0;
        for (const chunk of audioBuffer) {
          combinedBuffer.set(chunk, offset);
          offset += chunk.length;
        }
        
        try {
          // Send combined audio data to background script
          chrome.runtime.sendMessage({
            type: 'audio-data',
            audioData: Array.from(combinedBuffer)
          }).then(() => {
            console.log('✅ Buffered audio data sent to background script');
          }).catch(err => {
            console.warn('❌ Error sending buffered audio to background script:', err);
          });
        } catch (err) {
          console.warn('❌ Error processing buffered audio data:', err);
        }
        
        // Reset buffer
        audioBuffer = [];
        bufferSize = 0;
      }
    };

    console.log('Creating media stream source...');
    source = audioCtx.createMediaStreamSource(stream);
    console.log('✅ Media stream source created');
    
    console.log('Connecting source to worklet...');
    source.connect(worklet);
    console.log('✅ Audio pipeline connected');

    console.log('=== AUDIO CAPTURE PIPELINE SETUP COMPLETE ===');
    
  } catch (error) {
    console.error('=== ERROR IN OFFSCREEN START ===', error);
    await stop(true);
    throw error;
  } finally {
    isStarting = false;
  }
}

async function stop (report = false) {
  console.log('=== OFFSCREEN STOP FUNCTION CALLED ===');
  
  // Prevent multiple simultaneous stop attempts
  if (isStopping) {
    console.warn('Stop already in progress, ignoring duplicate call');
    return;
  }
  
  isStopping = true;
  
  try {
    // Send any remaining buffered audio before stopping
    if (audioBuffer.length > 0 && bufferSize > 0) {
      console.log('Sending final buffered audio before stopping, samples:', bufferSize);
      const combinedBuffer = new Float32Array(bufferSize);
      let offset = 0;
      for (const chunk of audioBuffer) {
        combinedBuffer.set(chunk, offset);
        offset += chunk.length;
      }
      
      try {
        chrome.runtime.sendMessage({
          type: 'audio-data',
          audioData: Array.from(combinedBuffer)
        });
      } catch (err) {
        console.warn('Error sending final buffered audio:', err);
      }
    }
    
    // Reset buffer
    audioBuffer = [];
    bufferSize = 0;
    
    // Disconnect and clean up audio components
    if (source) {
      try { 
        console.log('Disconnecting source...');
        source.disconnect(); 
        source = null;
        console.log('✅ Source disconnected');
      } catch (err) { 
        console.warn('Error disconnecting source:', err); 
      }
    }
    
    if (worklet) {
      try { 
        console.log('Closing worklet port...');
        worklet.port.close();
        worklet = null;
        console.log('✅ Worklet port closed');
      } catch (err) { 
        console.warn('Error closing worklet port:', err); 
      }
    }
    
    if (audioCtx && audioCtx.state !== 'closed') {
      try { 
        console.log('Closing AudioContext...');
        await audioCtx.close();
        console.log('✅ AudioContext closed');
      } catch (err) { 
        console.warn('Error closing AudioContext:', err); 
      }
    }
    audioCtx = null;
    
    console.log('=== AUDIO CAPTURE CLEANUP COMPLETE ===');
    
    // Report back to background script if requested
    if (report) {
      try {
        console.log('Sending offscreen-stopped message to background...');
        chrome.runtime.sendMessage({ type: 'offscreen-stopped' });
      } catch (err) {
        console.warn('Error sending offscreen-stopped message:', err);
      }
    }
  } finally {
    isStopping = false;
  }
}

/* ---------- message bridge ---------- */
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  console.log('=== OFFSCREEN RECEIVED MESSAGE ===', msg);
  
  if (msg.type === 'offscreen-start') {
    console.log('Received offscreen-start command with streamId:', msg.streamId);
    start(msg.streamId).then(() => {
      console.log('✅ Offscreen started successfully');
      sendResponse({ success: true });
    }).catch(err => {
      console.error('❌ Offscreen start error', err);
      stop(true);
      sendResponse({ success: false, error: err.message });
    });
    return true; // Indicates async response
  }
  
  if (msg.type === 'offscreen-stop') {
    console.log('Received offscreen-stop command');
    stop().then(() => {
      console.log('✅ Offscreen stopped successfully');
      sendResponse({ success: true });
    }).catch(err => {
      console.error('❌ Offscreen stop error', err);
      sendResponse({ success: false, error: err.message });
    });
    return true; // Indicates async response
  }
});
