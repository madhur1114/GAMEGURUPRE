import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { fetchPrediction } from '../services/predictionService';

const PredictionOverlay = () => {
  const [prediction, setPrediction] = useState({ 
    bigSmall: 'Big', 
    numbers: [5, 7], 
    colors: ['Green', 'Green'] 
  });
  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    const updatePrediction = async () => {
      const newPred = await fetchPrediction();
      setPrediction(newPred);
      Animated.sequence([
        Animated.timing(fadeAnim, { 
          toValue: 1, 
          duration: 300, 
          useNativeDriver: true 
        }),
        Animated.timing(fadeAnim, { 
          toValue: 0.8, 
          duration: 200, 
          useNativeDriver: true 
        }),
      ]).start();
    };

    // Update immediately, then every 8 seconds
    updatePrediction();
    const interval = setInterval(updatePrediction, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
      <Text style={styles.title}>🔮 Quantum Prediction</Text>
      <View style={styles.row}>
        <Text style={styles.label}>Big/Small:</Text>
        <Text style={[
          styles.value, 
          prediction.bigSmall === 'Big' ? styles.big : styles.small
        ]}>
          {prediction.bigSmall}
        </Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Numbers:</Text>
        <View style={styles.numbers}>
          {prediction.numbers.map((num, idx) => (
            <Text 
              key={idx} 
              style={[
                styles.number, 
                prediction.colors[idx] === 'Green' ? styles.green : styles.red
              ]}
            >
              {num}
            </Text>
          ))}
        </View>
      </View>
      <Text style={styles.footer}>⚡ Fusion Server v2.0</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 60,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(20,30,50,0.95)',
    borderRadius: 20,
    padding: 15,
    borderWidth: 1,
    borderColor: '#00ffff',
    shadowColor: '#00ffff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 10,
    zIndex: 999,
  },
  title: { 
    color: '#fff', 
    fontSize: 18, 
    fontWeight: 'bold', 
    textAlign: 'center', 
    marginBottom: 10 
  },
  row: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginVertical: 5 
  },
  label: { 
    color: '#aaa', 
    fontSize: 16 
  },
  value: { 
    fontSize: 18, 
    fontWeight: 'bold' 
  },
  big: { 
    color: '#ffaa00' 
  },
  small: { 
    color: '#00ccff' 
  },
  numbers: { 
    flexDirection: 'row' 
  },
  number: { 
    fontSize: 22, 
    fontWeight: 'bold', 
    marginHorizontal: 5 
  },
  green: { 
    color: '#00ff88' 
  },
  red: { 
    color: '#ff5555' 
  },
  footer: { 
    color: '#888', 
    fontSize: 12, 
    textAlign: 'center', 
    marginTop: 10 
  },
});

export default PredictionOverlay;
