import Button from "@/components/Button";
import { router } from "expo-router";
import { Dimensions, Image, StyleSheet, Text, View } from "react-native";

const { width, height } = Dimensions.get("window");

export default function HomeScreen() {
  const backgroundImage = require("@/assets/background/banner-game.jpg");
  const backgroundPortrailImage = require("@/assets/background/banner-game-2.jpg");

  const login = () => {
    router.push('/(auths)/login');
  }

  return (
    <>
      <Image
        style={[
          width > height
            ? styles.backgroundImage
            : styles.backgroundPortrailImage,
        ]}
        source={width > height ? backgroundImage : backgroundPortrailImage}
        resizeMode="cover"
      ></Image>

      <View style={[styles.container]}>
        <Button
          customStyle={[
            width > height ? styles.startBtn : styles.startBtnPortrail,
          ]}
          buttonTextStyle={[{ fontSize: 25, color: "#7e0000ff" }]}
          label="Adventure time!"
          onPress={login}
        ></Button>
        <View style={[styles.footer]}>
          <Text style={[styles.pixelText, { color: "#555555ff" }]}>
            Copyright © 2025 - Pham-Brotherhood
          </Text>
          <Text style={[styles.pixelText, { color: "#555555ff" }]}>v1.2.0</Text>
        </View>
      </View>
    </>
  );
}
const styles = StyleSheet.create({
  backgroundImage: {
    position: "absolute",
    height: 430,
    width: 932,
  },
  backgroundPortrailImage: {
    position: "absolute",
    height: 932,
    width: 430,
  },
  container: {
    padding: 15,
  },
  footer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    width: width - 30,
    position: "fixed",
    bottom: 15,
    zIndex: -1,
  },
  pixelText: {
    fontFamily: "PressStart2P",
    fontSize: 8,
    textShadowColor: "rgba(93, 93, 93, 1)",
    textShadowOffset: { width: 0.7, height: 0.7 },
    textShadowRadius: 0.7,
  },
  startBtn: {
    width: 300,
    minHeight: 50,
    backgroundColor: "#ffc831ff",
    position: "absolute",
    left: width / 3,
    top: height / 1.7,
  },
  startBtnPortrail: {
    width: 300,
    minHeight: 50,
    backgroundColor: "#ffc831ff",
    position: "absolute",
    left: width / 8,
    top: height / 1.7,
  },
});
