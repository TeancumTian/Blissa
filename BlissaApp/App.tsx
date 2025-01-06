import { StatusBar } from "expo-status-bar";
import { SafeAreaView, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import HomePage from "./src/components/HomePage";

export default function App() {
  return (
    <LinearGradient
      colors={["#FFE4E1", "#E6E6FA", "#98FB98"]}
      style={styles.container}
    >
      <StatusBar style="dark" />
      <SafeAreaView style={styles.safeArea}>
        <HomePage />
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
});
