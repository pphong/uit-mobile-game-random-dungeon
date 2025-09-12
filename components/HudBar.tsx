import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

type HudBarProps = {
  name?: string;
  total: number;
  current: number;
};

const HudBar: React.FC<HudBarProps> = ({ name, total, current }) => {
  const [value, setValue] = useState(100);

  useEffect(() => {
    setValue(current / (total / 100));
  }, [current]);

  return (
    <>
      <View>
        <View style={[styles.container]}>
          {Array.from({ length: 100 }).map((_, i) => (
            <View
              key={i}
              style={[
                styles.segment,
                { backgroundColor: i < value ? "#e53935" : "#ccc" },
              ]}
            />
          ))}
        </View>
        <Text style={[styles.pixelText]}>
          {name} {value > 0 ? value.toFixed(2) : 0}%
        </Text>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    maxWidth: 150,
  },
  segment: {
    flex: 1,
    height: 20,
    width: 12,
    borderColor: "#000",
    borderTopWidth: 0.1,
    borderBottomWidth: 0.1,
  },
  pixelText: {
    fontFamily: "PressStart2P",
    fontSize: 8,
    position: "absolute",
    top: 6,
    left: 6,
    textShadowColor: "rgba(93, 93, 93, 1)",
    textShadowOffset: { width: 0.7, height: 0.7 },
    textShadowRadius: 0.7,
  },
});

export default HudBar;
