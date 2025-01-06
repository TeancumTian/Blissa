import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function WelcomeCard() {
  return (
    <View style={styles.card}>
      <View style={styles.content}>
        <Text style={styles.title}>Welcome</Text>
        <Text style={styles.subtitle}>Your Guide To{'\n'}Acne-Free Skin.</Text>
        <TouchableOpacity>
          <LinearGradient
            colors={['#FFB6C1', '#98FB98']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Get Inspired</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
      <Image
        source={{ uri: '/placeholder.svg' }}
        style={styles.image}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1B4B43',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#1B4B43',
    opacity: 0.8,
    marginBottom: 20,
  },
  button: {
    padding: 12,
    borderRadius: 25,
    alignItems: 'center',
  },
  buttonText: {
    color: '#1B4B43',
    fontSize: 16,
    fontWeight: '600',
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 10,
  },
});

