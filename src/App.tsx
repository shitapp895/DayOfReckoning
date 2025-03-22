import React, { useState, useEffect } from 'react';
import './App.css';
import BackgroundEffects from './components/BackgroundEffects';
import AudioEffects from './components/AudioEffects';

function App() {
  // Set the target date for the "Day of Reckoning" - next Monday at 8PM
  const getNextMonday = () => {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 is Sunday, 1 is Monday, etc.
    const daysUntilNextMonday = dayOfWeek === 0 ? 1 : 8 - dayOfWeek;
    
    // Create a date for next Monday at 8:00 PM
    const nextMonday = new Date(today);
    nextMonday.setDate(today.getDate() + daysUntilNextMonday);
    nextMonday.setHours(20, 0, 0, 0);
    
    return nextMonday;
  };

  const targetDate = getNextMonday();
  
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = targetDate.getTime() - new Date().getTime();
      
      if (difference > 0) {
        return {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        };
      } else {
        return {
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0
        };
      }
    };

    // Update the countdown every second
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    // Initial calculation
    setTimeLeft(calculateTimeLeft());

    // Cleanup the interval on component unmount
    return () => clearInterval(timer);
  }, [targetDate]);

  // Check if the day of reckoning has arrived
  const isReckoning = timeLeft.days === 0 && timeLeft.hours === 0 && 
                     timeLeft.minutes === 0 && timeLeft.seconds === 0;

  // Format the time units to have leading zeros
  const formatTimeUnit = (value: number) => {
    return value.toString().padStart(2, '0');
  };

  return (
    <div className="App">
      <BackgroundEffects />
      <div className="content">
        <header className="header">
          <div className="candle-container left">
            <div className="candle left-candle">
              <div className="flame"></div>
              <div className="wick"></div>
            </div>
          </div>
          <h1 className="title">THE DAY OF RECKONING</h1>
          <div className="candle-container right">
            <div className="candle right-candle">
              <div className="flame"></div>
              <div className="wick"></div>
            </div>
          </div>
        </header>
        
        <div className="countdown-container">
          {isReckoning ? (
            <div className="reckoning-message">IT HAS BEGUN</div>
          ) : (
            <>
              <div className="countdown-timer">
                <div className="time-unit">{formatTimeUnit(timeLeft.days)}</div>
                <div className="time-separator">:</div>
                <div className="time-unit">{formatTimeUnit(timeLeft.hours)}</div>
                <div className="time-separator">:</div>
                <div className="time-unit">{formatTimeUnit(timeLeft.minutes)}</div>
                <div className="time-separator">:</div>
                <div className="time-unit">{formatTimeUnit(timeLeft.seconds)}</div>
              </div>
              <div className="time-labels">
                <span>DAYS</span>
                <span>HOURS</span>
                <span>MINUTES</span>
                <span>SECONDS</span>
              </div>
            </>
          )}
        </div>
        
        <div className="message">
          JUDGEMENT AWAITS US ALL...
        </div>
      </div>
      <AudioEffects />
    </div>
  );
}

export default App;
