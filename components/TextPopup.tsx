import React, { useEffect, useRef, useState } from "react";
import { Animated, StyleSheet, Text } from "react-native";

interface TextPopupProp {
  value: number;
  color: string;
  onFinish?: () => void;
}

const TextPopup: React.FC<TextPopupProp> = ({ value, color, onFinish }) => {
  const opacity = useRef(new Animated.Value(1)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const textColor = color;
  const [valueText, setValueText] = useState<any>(null);

  useEffect(() => {
    setValueText(value);
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: -40,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => reset());
  }, [value]);

  const reset = () => {
    setValueText(null);
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 0,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 0,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <Animated.Text
      style={[
        styles.text,
        { color: textColor },
        {
          opacity: opacity,
          transform: [{ translateY: translateY }],
        },
      ]}
    >
      {valueText && (
        <Text style={[{ flex: 1 }]}>
          {valueText > 0 ? "+" : ""}
          {valueText}
        </Text>
      )}
    </Animated.Text>
  );
};

const styles = StyleSheet.create({
  text: {
    position: "absolute",
    fontFamily: "PressStart2P",
    fontSize: 16,
    fontWeight: "bold",
    textShadowColor: "black",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});

export default TextPopup;
