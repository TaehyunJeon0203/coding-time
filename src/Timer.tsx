import React, { useState, useEffect } from "react";

const Timer: React.FC = () => {
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (intervalId) {
      clearInterval(intervalId);
    }

    if (startTime) {
      const id = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);

      setIntervalId(id);
    }
  }, [startTime]);

  const startTimer = () => {
    setStartTime(Date.now());
  };

  const stopTimer = () => {
    if (intervalId) {
      clearInterval(intervalId);
    }
    setStartTime(null);
    setElapsedTime(0);
  };

  return (
    <div>
      <h1>Elapsed Time: {elapsedTime}s</h1>
      <button onClick={startTimer}>Start</button>
      <button onClick={stopTimer}>Stop</button>
    </div>
  );
};

export default Timer;
