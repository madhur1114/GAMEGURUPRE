import { fetchLatestResults, getStoredPatterns } from './api';

// Replace with your actual Render backend URL after deployment
const FUSION_SERVER_URL = 'https://your-backend-name.onrender.com/predict';

// Local fallback prediction
const localPrediction = (history) => {
  if (!history || history.length < 5) {
    return { bigSmall: 'Big', numbers: [5, 9], colors: ['Green', 'Green'] };
  }
  
  const last = history.slice(0, 10);
  const bigCount = last.filter(d => d.size === 'Big').length;
  const bigSmall = bigCount > 5 ? 'Big' : 'Small';
  
  // Simple prediction: use most recent number and a pattern
  const recentNums = last.map(d => d.number);
  const nextNum1 = recentNums[0] !== undefined ? recentNums[0] : 5;
  const nextNum2 = (nextNum1 + 3) % 10;
  
  const color1 = [1,3,5,7,9].includes(nextNum1) ? 'Green' : 'Red';
  const color2 = [1,3,5,7,9].includes(nextNum2) ? 'Green' : 'Red';
  
  return { bigSmall, numbers: [nextNum1, nextNum2], colors: [color1, color2] };
};

export const fetchPrediction = async () => {
  // First fetch latest results to update stored patterns
  await fetchLatestResults();
  const history = await getStoredPatterns();

  try {
    const response = await fetch(FUSION_SERVER_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ history: history.slice(0, 50) }) // send recent 50
    });
    if (!response.ok) throw new Error('Server error');
    const data = await response.json();
    return data.prediction;
  } catch (error) {
    console.log('Fusion server unavailable, using local prediction', error);
    return localPrediction(history);
  }
};
