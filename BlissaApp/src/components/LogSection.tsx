import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function LogSection() {
  return (
    <View style={styles.container}>
      <View style={styles.logButtons}>
        <TouchableOpacity style={styles.logButton}>
          <Text style={styles.logButtonText}>Daily Log</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.logButton}>
          <Text style={styles.logButtonText}>Weekly Log</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.logButton}>
          <Text style={styles.logButtonText}>Yearly Log</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.progressCard}>
        <View style={styles.progressRing}>
          <Text style={styles.progressText}>3 Days</Text>
        </View>
        <Text style={styles.progressLabel}>Check Ins This Week</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  logButtons: {
    flex: 1,
    marginRight: 20,
  },
  logButton: {
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  logButtonText: {
    color: '#1B4B43',
    fontSize: 16,
    fontWeight: '600',
  },
  progressCard: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressRing: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 8,
    borderColor: '#98FB98',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  progressText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1B4B43',
  },
  progressLabel: {
    fontSize: 14,
    color: '#1B4B43',
    textAlign: 'center',
  },
});

