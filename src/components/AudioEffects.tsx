import React, { useEffect, useRef, useState } from 'react';

const AudioEffects: React.FC = () => {
  const [audioInitialized, setAudioInitialized] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const heartbeatIntervalRef = useRef<number | null>(null);
  const randomSoundIntervalRef = useRef<number | null>(null);

  const initializeAudio = () => {
    if (audioInitialized) return;
    
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    audioContextRef.current = audioContext;
    
    // Create a low ambient drone
    createDroneSound(audioContext);
    
    // Heartbeat sound at random intervals
    createHeartbeatEffect();
    
    // Random creepy sounds
    createRandomSounds();
    
    setAudioInitialized(true);
  };

  const createDroneSound = (audioContext: AudioContext) => {
    // Create oscillators for the drone sound
    const createOscillator = (freq: number, type: OscillatorType, gain: number) => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.type = type;
      oscillator.frequency.value = freq;
      
      gainNode.gain.value = 0;
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.start();
      
      // Slowly fade in
      gainNode.gain.linearRampToValueAtTime(gain, audioContext.currentTime + 5);
      
      return { oscillator, gainNode };
    };
    
    // Create multiple oscillators for a richer sound
    const osc1 = createOscillator(55, 'sine', 0.03); // Low bass drone
    const osc2 = createOscillator(110, 'sine', 0.01); // Overtone
    const osc3 = createOscillator(82.5, 'sine', 0.01); // Slightly dissonant tone
    
    // Add subtle modulation to the frequency of the third oscillator
    const lfo = audioContext.createOscillator();
    const lfoGain = audioContext.createGain();
    
    lfo.type = 'sine';
    lfo.frequency.value = 0.1; // Very slow modulation
    lfoGain.gain.value = 0.5;
    
    lfo.connect(lfoGain);
    lfoGain.connect(osc3.oscillator.frequency);
    lfo.start();
  };

  const createHeartbeatEffect = () => {
    if (!audioContextRef.current) return;
    
    const createHeartbeatSound = () => {
      const audioContext = audioContextRef.current!;
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.type = 'sine';
      oscillator.frequency.value = 60;
      
      gainNode.gain.value = 0;
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.start();
      
      // First beat
      gainNode.gain.linearRampToValueAtTime(0.2, audioContext.currentTime + 0.05);
      gainNode.gain.linearRampToValueAtTime(0.05, audioContext.currentTime + 0.2);
      
      // Second beat (stronger)
      gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.3);
      gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.6);
      
      // Clean up
      setTimeout(() => {
        oscillator.stop();
        oscillator.disconnect();
        gainNode.disconnect();
      }, 700);
    };
    
    // Play heartbeat at random intervals
    const heartbeatInterval = window.setInterval(() => {
      const shouldPlay = Math.random() > 0.7; // 30% chance to play
      
      if (shouldPlay) {
        createHeartbeatSound();
      }
    }, 5000) as unknown as number;
    
    heartbeatIntervalRef.current = heartbeatInterval;
  };

  const createRandomSounds = () => {
    if (!audioContextRef.current) return;
    
    const sounds = [
      // Whisper sound
      () => {
        const audioContext = audioContextRef.current!;
        const noise = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        const filter = audioContext.createBiquadFilter();
        
        noise.type = 'sawtooth';
        noise.frequency.value = 200 + Math.random() * 300;
        
        filter.type = 'bandpass';
        filter.frequency.value = 1000 + Math.random() * 2000;
        filter.Q.value = 0.9;
        
        gainNode.gain.value = 0;
        
        noise.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        noise.start();
        
        gainNode.gain.linearRampToValueAtTime(0.02 + Math.random() * 0.02, audioContext.currentTime + 0.1);
        gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.5 + Math.random() * 1);
        
        // Modulate frequency for effect
        noise.frequency.linearRampToValueAtTime(100 + Math.random() * 200, audioContext.currentTime + 0.5 + Math.random() * 0.5);
        
        setTimeout(() => {
          noise.stop();
          noise.disconnect();
          gainNode.disconnect();
          filter.disconnect();
        }, 1500);
      },
      
      // Distant knock sound
      () => {
        const audioContext = audioContextRef.current!;
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.type = 'sine';
        oscillator.frequency.value = 80 + Math.random() * 40;
        
        gainNode.gain.value = 0;
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.start();
        
        gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.01);
        gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.2);
        
        setTimeout(() => {
          oscillator.stop();
          oscillator.disconnect();
          gainNode.disconnect();
        }, 300);
      }
    ];
    
    // Play random sounds at random intervals
    const randomInterval = window.setInterval(() => {
      const shouldPlay = Math.random() > 0.85; // 15% chance to play
      
      if (shouldPlay) {
        const randomSound = sounds[Math.floor(Math.random() * sounds.length)];
        randomSound();
      }
    }, 3000) as unknown as number;
    
    randomSoundIntervalRef.current = randomInterval;
  };

  useEffect(() => {
    // Cleanup function
    return () => {
      if (heartbeatIntervalRef.current) {
        clearInterval(heartbeatIntervalRef.current);
      }
      
      if (randomSoundIntervalRef.current) {
        clearInterval(randomSoundIntervalRef.current);
      }
      
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  return (
    <div className="audio-controls">
      {!audioInitialized && (
        <button
          onClick={initializeAudio}
          className="sound-button"
          aria-label="Enable sound"
        >
          Enable Sound
        </button>
      )}
    </div>
  );
};

export default AudioEffects; 