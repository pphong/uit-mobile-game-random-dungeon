import Button from "@/components/Button";
import Input from "@/components/Input";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "axios";
import { router } from "expo-router";
import { useState } from "react";
import { Dimensions, Image, StyleSheet, Text, View } from "react-native";

const VERSION = process.env.EXPO_PUBLIC_VERSION;
const BASE_URL =
  process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:8080/api/v1";
const { width, height } = Dimensions.get("window");

export default function LoginScreen() {
  const backgroundImage = require("@/assets/background/banner-game-3.png");
  const backgroundPortrailImage = require("@/assets/background/banner-game-3.png");

  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");

  const login = async () => {
    try {
      const res = await axios.post(BASE_URL + "/users/signin", {
        email: email,
        password: pwd,
      });
      const userData = res.data;
      await AsyncStorage.setItem("userData", JSON.stringify(userData));
      const { token, user } = res.data;
      await AsyncStorage.setItem("accessToken", token);
      await AsyncStorage.setItem("name", user?.name );
    } catch (error) {
      console.error(error);
    }
    router.push("/(games)/main");
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
            inputAccessoryViewID="email"
            placeHolder="E-mail"
            value={email}
            setText={setEmail}
          ></Input>
          <Input
            customStyle={styles.inputCustom}
            secureTextEntry={true}
            inputAccessoryViewID="pwd"
            placeHolder="Password"
            value={pwd}
            setText={setPwd}
          ></Input>
          <Button
            customStyle={[
              width > height ? styles.startBtn : styles.startBtnPortrail,
            ]}
            buttonTextStyle={[{ fontSize: 25, color: "#7e0000ff" }]}
            label="Go go go!"
            onPress={login}
          ></Button>
        </View>
        <View style={[styles.footer]}>
          <Text style={[styles.pixelText, { color: "#555555ff" }]}>
            Copyright © 2025 - Pham-Brotherhood
          </Text>
          <Text style={[styles.pixelText, { color: "#555555ff" }]}>
            {VERSION}
          </Text>
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
