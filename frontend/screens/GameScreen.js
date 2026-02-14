import React, { useRef } from 'react';
import { WebView } from 'react-native-webview';
import { View, StyleSheet } from 'react-native';
import PredictionOverlay from '../components/PredictionOverlay';

const GameScreen = () => {
  const webviewRef = useRef(null);
  const TARGET_URL = 'https://www.lottery7ww.com/#/register?invitationCode=8786413101107';
  const ALLOWED_DOMAIN = 'lottery7ww.com';

  const onNavigationStateChange = (navState) => {
    // Block navigation to any URL not containing the allowed domain
    if (!navState.url.includes(ALLOWED_DOMAIN)) {
      webviewRef.current.stopLoading();
      // Force reload the original URL
      webviewRef.current.injectJavaScript(`
        window.location.href = '${TARGET_URL}';
      `);
    }
  };

  return (
    <View style={styles.container}>
      <WebView
        ref={webviewRef}
        source={{ uri: TARGET_URL }}
        onNavigationStateChange={onNavigationStateChange}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        style={styles.webview}
      />
      <PredictionOverlay />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  webview: { flex: 1 },
});

export default GameScreen;
