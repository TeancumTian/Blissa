import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import BottomNavigation from "./BottomNavigation";

export default function PlaceholderPage() {
  const navigation = useNavigation();

  return (
    <LinearGradient
      colors={["#FFE4E1", "#E6E6FA", "#98FB98"]}
      style={styles.container}
    >
      <View style={styles.content}>
        <View style={styles.card}>
          <View style={styles.messageContainer}>
            <Text style={styles.title}>Whoops!</Text>
            <Text style={styles.subtitle}>
              This Page Is Not{"\n"}Quite Ready Yet.
            </Text>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <LinearGradient
                colors={["#FFB6C1", "#98FB98"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.button}
              >
                <Text style={styles.buttonText}>Go Back</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
          <Image
            source={{ uri: "/placeholder.svg" }}
            style={styles.image}
            resizeMode="cover"
          />
        </View>
      </View>
      <BottomNavigation />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  card: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 30,
    overflow: "hidden",
  },
  messageContainer: {
    position: "absolute",
    top: 40,
    left: 20,
    zIndex: 1,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#164032",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: "#164032",
    opacity: 0.8,
    marginBottom: 20,
    lineHeight: 24,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
  },
  buttonText: {
    color: "#164032",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  image: {
    width: "100%",
    height: "100%",
  },
});
