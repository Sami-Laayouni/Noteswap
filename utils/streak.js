// utils/streak.js
export const getDailyStreak = () => {
    const lastAccessedDate = localStorage.getItem('lastAccessedDate');
    if (lastAccessedDate) {
      return new Date(lastAccessedDate);
    }
    return null;
  };
  
  export const updateDailyStreak = () => {
    const lastAccessedDate = getDailyStreak();
    const currentDate = new Date();
  
    if (lastAccessedDate) {
      // Check if the last accessed date is yesterday
      const isYesterday =
        lastAccessedDate.getDate() === currentDate.getDate() - 1 &&
        lastAccessedDate.getMonth() === currentDate.getMonth() &&
        lastAccessedDate.getFullYear() === currentDate.getFullYear();
  
      if (isYesterday) {
        // User accessed the app consecutively
        return true;
      }
    }
  
    // Reset streak if not accessed yesterday
    localStorage.setItem('lastAccessedDate', currentDate.toISOString());
    return false;
  };
  