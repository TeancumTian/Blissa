import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

export default function Header() {
  return (
    <View style={styles.header}>
      <View>
        <Text style={styles.title}>BLISSA</Text>
        <Text style={styles.subtitle}>Simplify Skincare</Text>
      </View>
      <Image
        source={{ uri: '/placeholder.svg' }}
        style={styles.profileImage}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1B4B43',
  },
  subtitle: {
    fontSize: 18,
    color: '#1B4B43',
    opacity: 0.8,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
});

