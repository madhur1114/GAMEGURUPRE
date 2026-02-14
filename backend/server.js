const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Quantum Core prediction logic (enhanced version)
function quantumPredict(history) {
  // If no history, return default prediction
  if (!history || history.length === 0) {
    return {
      bigSmall: 'Big',
      numbers: [5, 9],
      colors: ['Green', 'Green']
    };
  }

  // Extract recent numbers
  const numbers = history.map(h => h.number);
  const recent = numbers.slice(0, 10);

  // Frequency analysis
  const freq = Array(10).fill(0);
  numbers.forEach(n => freq[n]++);
  
  // Find top 2 most frequent numbers
  let topNums = freq
    .map((count, num) => ({ num, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 2)
    .map(item => item.num);

  // If not enough variety, use recent trend
  if (topNums.length < 2 || topNums[0] === topNums[1]) {
    const last = recent[0] || 5;
    const second = recent[1] || (last + 3) % 10;
    topNums = [last, second];
  }

  // Determine Big/Small based on most frequent number
  const mostFreqNum = topNums[0];
  const bigSmall = mostFreqNum >= 5 ? 'Big' : 'Small';

  // Determine colors
  const colors = topNums.map(num => 
    [1, 3, 5, 7, 9].includes(num) ? 'Green' : 'Red'
  );

  return {
    bigSmall,
    numbers: topNums,
    colors
  };
}

// Prediction endpoint
app.post('/predict', (req, res) => {
  const { history } = req.body;
  const prediction = quantumPredict(history);
  res.json({ prediction });
});

// Health check
app.get('/', (req, res) => {
  res.send('Fusion Server is running.');
});

app.listen(port, () => {
  console.log(`Fusion Server listening on port ${port}`);
});
