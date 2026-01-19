import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post('http://localhost:5000/api/v1/auth/login', {
        email,
        password,
      });

      if (res.data.token) {
        await AsyncStorage.setItem('token', res.data.token);
        navigation.navigate('Dashboard');
      }
    } catch (err) {
      console.error(err);
      Alert.alert(
        'Login Failed',
        err.response?.data?.message || 'Something went wrong'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Image
            source={{
              uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAenFaz08Lw_x6Ww8KTPYQ53Or6Jt5u88ZLjf2cEW3xrrTHjU2Lo3kOeFXSPa3WpYqJSsHxgU-YeUB5otZi1HdN3WK6gmv_gy0qaHhUhsaY8g4k9Pcn642AFr-SUHOkysHOGaTxGOD_upBXJbcS5M_gXFXWEXBrYQgPakduzQsb6NleK2atEWTRHaHc-DJG-ndMdMm8x_6gWqWuViQLc8-IOEr6zcYuG0GJ2D3dD6-IeFjBXYhdfxaRN45CYydCarQV1zhisfYDYw',
            }}
            style={styles.logo}
          />
          <Text style={styles.title}>Workforce Platform</Text>
          <Text style={styles.subtitle}>Verified Training Marketplace</Text>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder="Enter your password"
            secureTextEntry
          />

          <TouchableOpacity
            style={[styles.button, loading && styles.disabledButton]}
            onPress={handleLogin}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Logging in...' : 'Login'}
            </Text>
          </TouchableOpacity>

          <View style={styles.signupContainer}>
            <Text style={styles.signupText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={styles.signupLink}>Sign Up</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.companyLinkContainer}>
            <Text style={styles.signupText}>Are you a Company or Trainer? </Text>
            <TouchableOpacity onPress={() => Alert.alert('Web Portal', 'Please visit the web portal from your browser to access company/trainer features.')}>
              <Text style={styles.signupLink}>Click here</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f7f8',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 12,
    marginBottom: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#137fec',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
  },
  formContainer: {
    backgroundColor: 'white',
    padding: 25,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 14,
    fontSize: 16,
    marginBottom: 20,
    backgroundColor: '#f9fafb',
  },
  button: {
    backgroundColor: '#137fec',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  disabledButton: {
    backgroundColor: '#93c5fd',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  companyLinkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  signupText: {
    fontSize: 14,
    color: '#6b7280',
  },
  signupLink: {
    fontSize: 14,
    color: '#137fec',
    fontWeight: 'bold',
  },
});

export default LoginScreen;