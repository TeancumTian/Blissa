import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';

export default function BottomNavigation() {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.tab}>
        <Feather name="star" size={24} color="#1B4B43" />
        <Text style={styles.tabText}>Log</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.tab}>
        <Feather name="heart" size={24} color="#1B4B43" />
        <Text style={styles.tabText}>Inspo</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.tab}>
        <Feather name="home" size={24} color="#1B4B43" />
        <Text style={styles.tabText}>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.tab}>
        <Feather name="message-circle" size={24} color="#1B4B43" />
        <Text style={styles.tabText}>Ask</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.tab}>
        <Feather name="calendar" size={24} color="#1B4B43" />
        <Text style={styles.tabText}>Appt.</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 30,
    margin: 20,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabText: {
    fontSize: 12,
    color: '#1B4B43',
    marginTop: 4,
  },
});

