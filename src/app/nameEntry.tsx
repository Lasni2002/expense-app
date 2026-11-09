import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function NameEntryScreen() {
  const router = useRouter();
  const [name, setName] = useState('');

  const handleContinue = async () => {
    if (name.trim().length > 0) {
      await AsyncStorage.setItem('@user_name', name.trim());
      router.replace('/home' as any); 
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView style={{ flex: 1, justifyContent: 'space-between' }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={{ padding: 24, alignItems: 'center', flex: 1, justifyContent: 'center' }}>
          <View style={styles.iconCircle}><Ionicons name="person" size={40} color="#0A2540" /></View>
          <Text style={styles.title}>What should we call you?</Text>
          <Text style={styles.subtitle}>We'll use this to personalize your dashboard.</Text>
          
          <View style={styles.inputContainer}>
            <Ionicons name="person-outline" size={20} color="#A0AEC0" style={{ marginRight: 10 }} />
            <TextInput
              style={styles.textInput}
              placeholder="e.g. Kasun"
              value={name}
              onChangeText={setName}
              autoFocus
            />
          </View>
        </View>

        <View style={{ padding: 24 }}>
          <TouchableOpacity style={[styles.button, !name.trim() && { backgroundColor: '#FEF3C7' }]} onPress={handleContinue} disabled={!name.trim()}>
            <Text style={[styles.buttonText, !name.trim() && { color: '#A0AEC0' }]}>Continue</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  iconCircle: { width: 90, height: 90, borderRadius: 45, backgroundColor: '#F0F4F8', alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  title: { fontSize: 24, fontWeight: '800', color: '#0A2540', marginBottom: 10 },
  subtitle: { fontSize: 14, color: '#64748B', textAlign: 'center', marginBottom: 30 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAFC', borderRadius: 16, paddingHorizontal: 15, height: 60, width: '100%', borderWidth: 1, borderColor: '#E2E8F0' },
  textInput: { flex: 1, fontSize: 16, color: '#0A2540' },
  button: { backgroundColor: '#FFD700', height: 60, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  buttonText: { fontSize: 16, fontWeight: '800', color: '#000' }
});