import Color from "color";
import { useRef } from "react";
import { Animated, StyleProp, StyleSheet, TextStyle, TouchableOpacity, ViewStyle } from "react-native";
import { Text } from "react-native-gesture-handler";

type ButtonProps = {
  label?: string;
  children?: React.ReactNode;
  customStyle?: StyleProp<ViewStyle> | undefined;
  buttonTextStyle?: StyleProp<TextStyle>;
  onPress?: () => void;
  disabled?: boolean;
  backgroundColor?: string;
};

const Button: React.FC<ButtonProps> = ({
  label,
  children,
  customStyle,
  buttonTextStyle,
  onPress,
  disabled,
  backgroundColor,
}) => {
  const shadowColor = Color(backgroundColor).darken(0.6).hex();
  const borderColor = Color(backgroundColor).darken(0.85).alpha(0.7).hexa();
  const positionY = useRef(new Animated.Value(0)).current;

  const onBtnPress = () => {
    Animated.sequence([
      Animated.timing(positionY, {
        toValue: 8,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(positionY, {
        toValue: 0,
        duration: 50,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <>
      <Animated.View
        style={[
          {
            transform: [{ translateY: positionY }],
          },
        ]}
      >
        <TouchableOpacity
          style={[
            styles.button,
            customStyle,
            {
              backgroundColor: backgroundColor,
              boxShadow: `${shadowColor} 0px 6px 3px`,
              borderWidth: 2,
              borderColor: borderColor,
            },
          ]}
          onPress={() => {
            if (onPress) onPress();
            onBtnPress();
          }}
          disabled={disabled}
        >
          {label ? <Text style={[styles.text, buttonTextStyle]}>{label}</Text> : children}
        </TouchableOpacity>
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 3,
    minHeight: 20,
    minWidth: 20,
    borderRadius: 6,
    backgroundColor: "#C4E1E6",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontFamily: "PressStart2P",
    fontSize: 10,
    textShadowColor: "rgba(93, 93, 93, 1)",
    textShadowOffset: { width: 0.7, height: 0.7 },
    textShadowRadius: 0.7,
    textAlign: "center",
  },
});

export default Button;
