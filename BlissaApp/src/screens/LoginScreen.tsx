import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

export default function LoginScreen() {
  const navigation = useNavigation();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (id, value) => {
    setFormData(prevState => ({
      ...prevState,
      [id]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('https://your-api-url.com/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      await AsyncStorage.setItem('token', data.token);
      await AsyncStorage.setItem('user', JSON.stringify(data.user));

      console.log('Login successful, token:', data.token);
      console.log('User info:', data.user);

      if (data.user.role === 'expert') {
        navigation.replace('ExpertDashboard');
      } else {
        navigation.replace('Appointments');
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={['#FFE4E1', '#E6E6FA', '#98FB98']}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <View style={styles.content}>
            <View style={styles.header}>
              <Text style={styles.title}>BLISSA</Text>
              <Text style={styles.subtitle}>Simplify Skincare</Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.welcomeText}>Welcome Back!</Text>
              <Text style={styles.loginText}>{isLogin ? 'Login to continue' : 'Create an account'}</Text>

              <View style={styles.form}>
                {error ? <Text style={styles.errorText}>{error}</Text> : null}

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Email</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="your@email.com"
                    placeholderTextColor="#164032"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={formData.email}
                    onChangeText={(text) => handleInputChange('email', text)}
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Password</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your password"
                    placeholderTextColor="#164032"
                    secureTextEntry
                    value={formData.password}
                    onChangeText={(text) => handleInputChange('password', text)}
                  />
                </View>

                <TouchableOpacity 
                  onPress={() => navigation.navigate('ForgotPassword')}
                  style={styles.forgotPassword}
                >
                  <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleSubmit}
                  disabled={isLoading}
                >
                  <LinearGradient
                    colors={['#FFB6C1', '#98FB98']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={[styles.button, isLoading && styles.buttonDisabled]}
                  >
                    {isLoading ? (
                      <ActivityIndicator color="#164032" />
                    ) : (
                      <Text style={styles.buttonText}>{isLogin ? 'Login' : 'Sign Up'}</Text>
                    )}
                  </LinearGradient>
                </TouchableOpacity>

                <View style={styles.signupContainer}>
                  <Text style={styles.signupText}>
                    {isLogin ? "Don't have an account? " : "Already have an account? "}
                  </Text>
                  <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
                    <Text style={styles.signupLink}>{isLogin ? 'Sign up' : 'Login'}</Text>
                  </TouchableOpacity>
                </View>

                {!isLogin && (
                  <View style={styles.expertSignupContainer}>
                    <TouchableOpacity onPress={() => navigation.navigate('ExpertRegister')}>
                      <Text style={styles.expertSignupLink}>Sign up as an expert</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginVertical: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#164032',
  },
  subtitle: {
    fontSize: 18,
    color: '#164032',
    opacity: 0.8,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 30,
    padding: 24,
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#164032',
    textAlign: 'center',
  },
  loginText: {
    fontSize: 16,
    color: '#164032',
    opacity: 0.8,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  form: {
    gap: 16,
  },
  inputContainer: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#164032',
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    color: '#164032',
    borderWidth: 1,
    borderColor: 'rgba(22, 64, 50, 0.1)',
  },
  forgotPassword: {
    alignSelf: 'flex-end',
  },
  forgotPasswordText: {
    color: '#164032',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  button: {
    padding: 16,
    borderRadius: 25,
    marginTop: 24,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#164032',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  signupText: {
    color: '#164032',
    fontSize: 14,
  },
  signupLink: {
    color: '#164032',
    fontSize: 14,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  expertSignupContainer: {
    alignItems: 'center',
    marginTop: 16,
  },
  expertSignupLink: {
    color: '#164032',
    fontSize: 14,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
});

