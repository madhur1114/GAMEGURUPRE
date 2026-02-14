import AsyncStorage from '@react-native-async-storage/async-storage';

let lastIssue = null;
let last10Data = [];

export const fetchLatestResults = async () => {
  try {
    const res = await fetch('https://draw.ar-lottery01.com/WinGo/WinGo_1M/GetHistoryIssuePage.json');
    const data = await res.json();
    const list = data.data.list;

    const newLast10 = list.slice(0, 10).map(item => ({
      issue: item.issueNumber.slice(-5),
      number: Number(item.number),
      size: Number(item.number) >= 5 ? 'Big' : 'Small',
      color: [1,3,5,7,9].includes(Number(item.number)) ? 'Green' : 'Red'
    }));

    const newIssue = list[0].issueNumber;

    if (newIssue !== lastIssue) {
      lastIssue = newIssue;
      await storePatterns(newLast10);
      return { newIssue, newLast10, updated: true };
    } else {
      return { newLast10, updated: false };
    }
  } catch (err) {
    console.error('Fetch error:', err);
    return null;
  }
};

const storePatterns = async (data) => {
  try {
    const existing = await AsyncStorage.getItem('patterns');
    let patterns = existing ? JSON.parse(existing) : [];
    // Add new data at beginning (most recent first)
    patterns = [...data, ...patterns];
    // Keep only last 500 entries to avoid storage bloat
    if (patterns.length > 500) patterns = patterns.slice(0, 500);
    await AsyncStorage.setItem('patterns', JSON.stringify(patterns));
  } catch (e) {
    console.error('Storage error', e);
  }
};

export const getStoredPatterns = async () => {
  try {
    const stored = await AsyncStorage.getItem('patterns');
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    console.error('Failed to load patterns', e);
    return [];
  }
};
