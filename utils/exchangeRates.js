let cachedRate = { rate: null, lastFetched: null };

export const fetchAndCacheExchangeRate = async () => {
  const currentDate = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

  if (cachedRate.lastFetched === currentDate) {
    return cachedRate.rate;
  }

  try {
    const response = await fetch(
      "https://api.exchangerate-api.com/v4/latest/USD"
    );
    const data = await response.json();
    cachedRate = {
      rate: data.rates.MAD,
      lastFetched: currentDate,
    };
    return cachedRate.rate;
  } catch (error) {
    console.error("Failed to fetch exchange rate:", error);
    return null; // Consider a fallback rate or error handling strategy
  }
};
