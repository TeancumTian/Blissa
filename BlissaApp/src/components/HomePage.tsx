import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import Header from './Header';
import WelcomeCard from './WelcomeCard';
import LogSection from './LogSection';
import FeatureCards from './FeatureCards';
import BottomNavigation from './BottomNavigation';

export default function HomePage() {
  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Header />
        <WelcomeCard />
        <LogSection />
        <FeatureCards />
      </ScrollView>
      <BottomNavigation />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
});

