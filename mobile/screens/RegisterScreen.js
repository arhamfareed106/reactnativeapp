import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('worker'); // Default to worker
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post('http://localhost:5000/api/v1/auth/register', {
        name,
        email,
        password,
        role,
      });

      if (res.data.token) {
        await AsyncStorage.setItem('token', res.data.token);
        navigation.navigate('Dashboard');
      }
    } catch (err) {
      console.error(err);
      Alert.alert(
        'Registration Failed',
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
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join our verified workforce platform</Text>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Enter your full name"
          />

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

          <Text style={styles.label}>Confirm Password</Text>
          <TextInput
            style={styles.input}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Confirm your password"
            secureTextEntry
          />

          {/* Role selection - default is worker */}
          <Text style={styles.roleLabel}>Account Type</Text>
          <View style={styles.roleSelector}>
            <TouchableOpacity
              style={[
                styles.roleOption,
                role === 'worker' && styles.selectedRole,
              ]}
              onPress={() => setRole('worker')}
            >
              <Text
                style={[
                  styles.roleText,
                  role === 'worker' && styles.selectedRoleText,
                ]}
              >
                Worker
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.button, loading && styles.disabledButton]}
            onPress={handleRegister}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Creating Account...' : 'Register'}
            </Text>
          </TouchableOpacity>

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={styles.loginLink}>Login</Text>
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
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
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
  roleLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginVertical: 15,
  },
  roleSelector: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 5,
    marginBottom: 20,
  },
  roleOption: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
    borderRadius: 6,
  },
  selectedRole: {
    backgroundColor: '#137fec',
  },
  roleText: {
    fontSize: 16,
    color: '#6b7280',
  },
  selectedRoleText: {
    color: 'white',
    fontWeight: 'bold',
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
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  loginText: {
    fontSize: 14,
    color: '#6b7280',
  },
  loginLink: {
    fontSize: 14,
    color: '#137fec',
    fontWeight: 'bold',
  },
});

export default RegisterScreen;