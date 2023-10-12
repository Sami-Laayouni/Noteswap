import React, { useState, useEffect } from 'react';

const TimeTracker = () => {
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);

  useEffect(() => {
    setStartTime(new Date());

    const handleUnload = () => {
      setEndTime(new Date());
    };

    window.addEventListener('beforeunload', handleUnload);

    return () => {
      window.removeEventListener('beforeunload', handleUnload);
    };
  }, []); // Empty dependency array ensures useEffect runs only once, mimicking componentDidMount behavior

  useEffect(() => {
    if (startTime && endTime) {
      // Calculate the time spent on the website
      const timeSpent = endTime - startTime;
      // Send this data to your analytics server or perform any desired action
      console.log(`User spent ${timeSpent} milliseconds on the website.`);
    }
  }, [startTime, endTime]); // Add startTime and endTime as dependencies for this useEffect

  return <></>;
};

export default TimeTracker;
