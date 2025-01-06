import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

export default function FeatureCards() {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.card}>
        <Image
          source={{ uri: '/placeholder.svg' }}
          style={styles.image}
        />
        <Text style={styles.cardText}>Ask Blissa AI</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.card}>
        <Image
          source={{ uri: '/placeholder.svg' }}
          style={styles.image}
        />
        <Text style={styles.cardText}>Create Appointment</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  card: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 15,
    marginHorizontal: 5,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  image: {
    width: '100%',
    height: 150,
    borderRadius: 15,
    marginBottom: 10,
  },
  cardText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1B4B43',
    textAlign: 'center',
  },
});

