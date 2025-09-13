import { useFonts } from "expo-font";
import { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import HudBar from "./HudBar";
import TextPopup from "./TextPopup";

type CharacterProps = {
  name?: string;
  isMain: boolean;
  children?: React.ReactNode;
  characterState?: any;
  characterFrames: any;
  currentHP: number;
  totalHP: number;
  missingHP?: number;
  width?: number;
  height?: number;
  nameColor?: string;
};

const Character: React.FC<CharacterProps> = ({
  name,
  isMain,
  children,
  characterFrames,
  characterState,
  currentHP,
  totalHP,
  missingHP,
  width,
  height,
  nameColor
}) => {
  const [fontsLoaded] = useFonts({
    PressStart2P: require("@/assets/fonts/PressStart2P-Regular.ttf"),
  });
  const positionX = useRef(new Animated.Value(0)).current;
  const positionY = useRef(new Animated.Value(0)).current;
  const scaleX = useRef(new Animated.Value(isMain ? 1 : -1)).current;

  const attack = () => {
    Animated.sequence([
      Animated.timing(positionX, {
        toValue: 250 * (isMain ? 1 : -1),
        duration: 280,
        useNativeDriver: true,
      }),
      Animated.timing(positionX, {
        toValue: 0,
        duration: 260,
        useNativeDriver: true,
      }),
    ]).start();
  };

  useEffect(() => {
    if (characterState.includes("ATK")) {
      attack();
    }
  }, [characterState]);

  return (
    <View
      style={[
        {
          position: "relative",
        },
      ]}
    >
      <View
        style={[
          {
            position: "absolute",
            top: 100,
            left: isMain ? 15 : 150,
          },
        ]}
      >
        {missingHP && (
          <TextPopup
            color={missingHP < 0 ? "#c20000ff" : "#0c923bff"}
            value={missingHP}
          ></TextPopup>
        )}
      </View>
      <Animated.View
        style={[
          styles.bounder,
          {
            transform: [{ translateX: positionX }, { translateY: positionY }],
          },
        ]}
      >
        <Text style={[styles.pixelText, { marginBottom: 10, color: nameColor ? nameColor : '#000' }]}>{name}</Text>
        <HudBar name={"HP"} current={currentHP} total={totalHP}></HudBar>
        <Animated.Image
          source={characterFrames[characterState]} // GIF trong thư mục assets
          style={[
            { width: width? width : 270, height: height? height: 200 },
            styles.charactor,
            {
              transform: [{ scaleX }],
            },
          ]}
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  charactor: {},
  pixelText: {
    fontFamily: "PressStart2P",
    fontSize: 12,
    textShadowColor: "rgba(93, 93, 93, 1)",
    textShadowOffset: { width: 0.7, height: 0.7 },
    textShadowRadius: 0.7,
  },
  bounder: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    maxWidth: 250,
  },
});

export default Character;
