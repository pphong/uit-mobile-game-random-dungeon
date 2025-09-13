import Button from "@/components/Button";
import Input from "@/components/Input";
import { router } from "expo-router";
import { Dimensions, Image, StyleSheet, Text, View } from "react-native";

const { width, height } = Dimensions.get("window");

export default function LoginScreen() {
  const backgroundImage = require("@/assets/background/banner-game-3.png");
  const backgroundPortrailImage = require("@/assets/background/banner-game-3.png");

  const setName = () => {
    router.push('/(games)/main');
  };

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
        <View style={[styles.form]}>
          <Input
            customStyle={styles.inputCustom}
            inputAccessoryViewID="name"
            placeHolder="Name"
          ></Input>
          <Button
            customStyle={[
              width > height ? styles.startBtn : styles.startBtnPortrail,
            ]}
            buttonTextStyle={[{ fontSize: 20, color: "#7e0000ff" }]}
            label="This is my name for now!"
            onPress={setName}
          ></Button>
        </View>
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
    width: 400,
    minHeight: 50,
    backgroundColor: "#ffc831ff",
  },
  startBtnPortrail: {
    width: 300,
    minHeight: 50,
    backgroundColor: "#ffc831ff",
  },
  form: {
    flex: 1,
    flexDirection: "column",
    gap: 20,
    alignItems: "center",
    top: width > height ? height / 4 : height / 2.7,
  },
  inputCustom: {
    fontSize: 15,
    minHeight: 40,
    width: width > height ? width / 2.5 : width / 1.2,
  },
});
