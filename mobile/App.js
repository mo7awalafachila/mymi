import React, { useMemo, useState } from 'react';
import { SafeAreaView, View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';

export default function App() {
  const [baseUrl, setBaseUrl] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [userId, setUserId] = useState('user_000');
  const [status, setStatus] = useState('Ready');
  const [prediction, setPrediction] = useState(null);

  const effectiveBaseUrl = useMemo(() => {
    return baseUrl?.trim() || 'https://YOUR-BACKEND-HOST';
  }, [baseUrl]);

  const fetchPredict = async () => {
    try {
      if (!apiKey) throw new Error('Missing API key.');
      if (!effectiveBaseUrl.startsWith('http')) throw new Error('Set a valid HTTPS base URL.');

      const res = await fetch(`${effectiveBaseUrl}/predict/${encodeURIComponent(userId)}`, {
        headers: { 'X-API-KEY': apiKey },
      });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(`HTTP ${res.status}: ${txt}`);
      }
      const json = await res.json();
      setPrediction(json);
      setStatus('Prediction updated');
    } catch (err) {
      setStatus(String(err.message || err));
    }
  };

  return (
    <SafeAreaView style={styles.root}>
      <KeyboardAvoidingView behavior={Platform.select({ ios: 'padding', android: undefined })} style={styles.container}>
        <Text style={styles.title}>Head Start – iOS Client</Text>
        <Text style={styles.subtitle}>Focus: GET /predict</Text>

        <View style={styles.card}>
          <Text style={styles.label}>API Base URL (https)</Text>
          <TextInput
            style={styles.input}
            placeholder="https://example.onrender.com"
            autoCapitalize="none"
            autoCorrect={false}
            value={baseUrl}
            onChangeText={setBaseUrl}
          />
          <Text style={styles.label}>API Token (X-API-KEY)</Text>
          <TextInput
            style={styles.input}
            placeholder="enter token"
            autoCapitalize="none"
            autoCorrect={false}
            secureTextEntry
            value={apiKey}
            onChangeText={setApiKey}
          />
          <Text style={styles.label}>User ID</Text>
          <TextInput
            style={styles.input}
            placeholder="user_000"
            autoCapitalize="none"
            autoCorrect={false}
            value={userId}
            onChangeText={setUserId}
          />
          <TouchableOpacity style={styles.button} onPress={fetchPredict}>
            <Text style={styles.buttonText}>GET /predict</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Status</Text>
          <Text style={styles.mono}>{status}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Prediction JSON</Text>
          <Text style={styles.mono} selectable>
            {prediction ? JSON.stringify(prediction, null, 2) : '(none)'}
          </Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#f1f5f9' },
  container: { flex: 1, padding: 16 },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 4 },
  subtitle: { color: '#475569', marginBottom: 12 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 12, marginBottom: 12, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8 },
  label: { fontWeight: '600', marginBottom: 6 },
  input: { borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 8, padding: 10, marginBottom: 10, backgroundColor: '#fff' },
  button: { backgroundColor: '#2563eb', padding: 12, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: '600' },
  mono: { fontFamily: Platform.select({ ios: 'Menlo', android: 'monospace' }), color: '#0f172a' },
});
