// utils/streak.js
export const getDailyStreak = () => {
  const streak = localStorage.getItem("streak");
  if (!streak) {
    localStorage.setItem("streak", 1);
    return 1;
  }
  return streak;
};

export const updateDailyStreak = () => {
  const lastAccessedDate = localStorage.getItem("lastAccessedDate");
  const currentDate = new Date();

  if (lastAccessedDate) {
    // Check if the last accessed date is yesterday
    const isYesterday = lastAccessedDate == currentDate.getDate() - 1;

    if (isYesterday) {
      const streak = parseInt(localStorage.getItem("streak"));
      localStorage.setItem("streak", streak + 1);
      localStorage.setItem("lastAccessedDate", currentDate.getDate());
    } else if(lastAccessedDate == currentDate.getDate()){
      return false
    } else {
      localStorage.setItem("streak", 1);
      localStorage.setItem("lastAccessedDate", currentDate.getDate());
    }
  }
  localStorage.setItem("lastAccessedDate", currentDate.getDate());

  // Reset streak if not accessed yesterday
  return false;
};
