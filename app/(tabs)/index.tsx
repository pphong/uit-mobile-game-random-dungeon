import Button from "@/components/Button";
import HeroFrames, { HeroStateEnum } from "@/data-sources/heroStateFrames";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  GestureHandlerRootView,
  RectButton,
} from "react-native-gesture-handler";

export default function HomeScreen() {
  const positionX = useRef(new Animated.Value(0)).current;
  const positionY = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;
  const rotate = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  const [visible, setVisible] = useState(true);

  const rotateValue = useRef(0);
  const scaleValue = useRef(1);

  rotate.addListener(({ value }) => {
    rotateValue.current = value;
  });
  scale.addListener(({ value }) => {
    scaleValue.current = value;
  });

  const [xPos, setXPos] = useState(0);
  const [yPos, setYPos] = useState(0);

  // Move left
  const moveLeft = () => {
    const x = xPos - 50;
    setXPos(x);
    Animated.timing(positionX, {
      toValue: x,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  // Move right
  const moveRight = () => {
    const x = xPos + 50;
    setXPos(x);
    Animated.timing(positionX, {
      toValue: x,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  const move = (x: number) => {
    setXPos((prev) => {
      const next = prev + x;
      if (next < 0 || next > 360) {
        return prev;
      }
      return next;
    });
  };

  useEffect(() => {
    Animated.timing(positionX, {
      toValue: xPos,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [xPos]);

  // Jump (move up then down)
  const jump = () => {
    Animated.sequence([
      Animated.timing(positionY, {
        toValue: -100,
        duration: 280,
        useNativeDriver: true,
      }),
      Animated.timing(positionY, {
        toValue: 0,
        duration: 260,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // Reset position, scale, rotate
  const reset = () => {
    Animated.parallel([
      Animated.timing(positionX, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(positionY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(rotate, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
    setVisible(true);
  };

  // Hide / Show
  const toggleVisibility = () => {
    setVisible(!visible);
    Animated.timing(opacity, {
      toValue: visible ? 0 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  // Rotate left
  const rotateLeft = () => {
    Animated.timing(rotate, {
      toValue: rotateValue.current - 45,
      duration: 400,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();
  };

  // Rotate right
  const rotateRight = () => {
    Animated.timing(rotate, {
      toValue: rotateValue.current + 45,
      duration: 400,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();
  };

  // Bigger
  const bigger = () => {
    Animated.timing(scale, {
      toValue: scaleValue.current + 0.2,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  // Smaller
  const smaller = () => {
    Animated.timing(scale, {
      toValue: Math.max(0.2, scaleValue.current - 0.2),
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const rotateInterpolate = rotate.interpolate({
    inputRange: [-360, 360],
    outputRange: ["-360deg", "360deg"],
  });

  // const [attackTrigger, setAttackTrigger] = useState(false);

  // useEffect(() => {
  //   setAttackTrigger(true);
  // }, []);

  const [heroState, setHeroState] = useState(HeroStateEnum.Idle);

  const trigger = (state: HeroStateEnum) => {
    if (state === HeroStateEnum.FJump) {
      jump();
    }
    setHeroState(state);
    if (state !== HeroStateEnum.Idle && state !== HeroStateEnum.Death) {
      setTimeout(() => {
        setHeroState(HeroStateEnum.Idle);
      }, 500);
    }
  };

  const [orientation, setOrientation] = useState<"portrait" | "landscape">(
    "portrait"
  );

  useEffect(() => {
    const update = () => {
      const { width, height } = Dimensions.get("window");
      setOrientation(width > height ? "landscape" : "portrait");
    };

    const subscription = Dimensions.addEventListener("change", update);
    update();

    // cleanup
    return () => {
      subscription.remove();
    };
  }, []);

  const [pressed, setPressed] = useState<any>(null);

  const handlePressIn = (dx: number) => {
    if (pressed) {
      clearInterval(pressed);
      setPressed(null);
    }
    setPressed(setInterval(() => move(dx), 200));
  };

  const handlePressOut = () => {
    if (pressed) {
      clearInterval(pressed);
      setPressed(null);
    }
    console.log("press out");
  };

  const resetState = () => {
    setXPos(0);
    setYPos(0);
    setHeroState(HeroStateEnum.Idle);
  };

  return (
    <>
      <GestureHandlerRootView
        style={orientation === "landscape" ? styles.landscape : styles.portrait}
      >
        <Animated.Image
          source={(HeroFrames[heroState] as any)} // GIF trong thư mục assets
          style={[
            { width: 270, height: 200 },
            styles.charactor,
            {
              opacity,
              transform: [
                { translateX: positionX },
                { translateY: positionY },
                { scale },
                { rotate: rotateInterpolate },
              ],
            },
          ]}
        />
        {/* <View style={[{ width: width / 1.3 }]}>
          <Animated.View
            style={[
              { width: 200, height: 200 },
              styles.charactor,
              {
                opacity,
                transform: [
                  { translateX: positionX },
                  { translateY: positionY },
                  { scale },
                  { rotate: rotateInterpolate },
                ],
              },
            ]}
          >
            <SpriteAnimator
              frames={HeroSpriteFrames[heroState]}
              trigger={heroState}
              duration={100}
              loop={heroState === HeroSpriteStateEnum.Idle ? true : false}
              onEnd={() => handleChangeState(heroState)}
            />
          </Animated.View>
        </View> */}

        <View style={[styles.controllers, styles.borderDash]}>
          <View style={[styles.innerBoder, styles.gap12]}>
            {/* <Button
              customStyle={styles.buttons}
              label="Left"
              onPress={moveLeft}
            ></Button>
            <Button
              customStyle={styles.buttons}
              label="Jump"
              onPress={jump}
            ></Button>
            <Button
              customStyle={styles.buttons}
              label="Right"
              onPress={moveRight}
            ></Button>
            <Button
              customStyle={styles.buttons}
              label="Hide/Show"
              onPress={toggleVisibility}
            ></Button>
            <Button
              customStyle={styles.buttons}
              label="Reset"
              onPress={reset}
            ></Button>
            <Button
              customStyle={styles.buttons}
              label="Rotate L"
              onPress={rotateLeft}
            ></Button>
            <Button
              customStyle={styles.buttons}
              label="Rotate R"
              onPress={rotateRight}
            ></Button> */}
            <Button
              customStyle={styles.buttons}
              label="Reset"
              onPress={resetState}
            ></Button>
            {/* <Button
              customStyle={styles.buttons}
              label="Attack 1"
              onPress={() => trigger(HeroSpriteStateEnum.ATK1)}
            ></Button> */}
            <RectButton
              onPress={() => trigger(HeroStateEnum.ATK1)}
              style={[styles.buttons]}
            >
              <Text>Attack 1</Text>
            </RectButton>
            <RectButton
              onPress={() => trigger(HeroStateEnum.ATK2)}
              style={[styles.buttons]}
            >
              <Text>Attack 2</Text>
            </RectButton>
            {/* <Button
              customStyle={styles.buttons}
              label="Attack 2"
              onPress={() => trigger(HeroSpriteStateEnum.ATK2)}
            ></Button> */}
            <Button
              customStyle={styles.buttons}
              label="Attack 3"
              onPress={() => trigger(HeroStateEnum.ATK3)}
            ></Button>
            <Button
              customStyle={styles.buttons}
              label="Jump"
              onPress={() => trigger(HeroStateEnum.FJump)}
            ></Button>
            <Button
              customStyle={styles.buttons}
              label="Idle"
              onPress={() => trigger(HeroStateEnum.Idle)}
            ></Button>
            <Button
              customStyle={styles.buttons}
              label="Hurt"
              onPress={() => trigger(HeroStateEnum.Hurt)}
            ></Button>
            <Button
              customStyle={styles.buttons}
              label="Death"
              onPress={() => trigger(HeroStateEnum.Death)}
            ></Button>
          </View>
        </View>
        {/* <View style={[styles.movingController]}>
          <Button customStyle={styles.movingButtons} onPress={moveLeft}>
            <IconSymbol size={20} color="#808080" name="left.circle" />
          </Button>
          <Button customStyle={styles.movingButtons} onPress={moveRight}>
            <IconSymbol size={20} color="#808080" name="right.circle" />
          </Button>
          <Pressable
            style={[styles.movingButtons, { backgroundColor: "green" }]}
            onPressIn={() => handlePressIn(-30)}
            onPressOut={handlePressOut}
          >
            <IconSymbol size={50} color="#808080" name="left.circle" />
          </Pressable>
          <Text>{xPos}</Text>
          <Pressable
            style={styles.movingButtons}
            onPressIn={() => handlePressIn(30)}
            onPressOut={handlePressOut}
          >
            <IconSymbol size={50} color="#808080" name="right.circle" />
          </Pressable>
        </View> */}

        {/* <View style={styles.movingController}>
          <Text>{xPos}</Text>
          <TouchableOpacity
            onPressIn={() => handlePressIn(-30)}
            onPressOut={handlePressOut}
            style={styles.movingButtons}
          >
            <IconSymbol size={50} color="#808080" name="left.circle" />
          </TouchableOpacity>

          <TouchableOpacity
            onPressIn={() => handlePressIn(30)}
            onPressOut={handlePressOut}
            style={styles.movingButtons}
          >
            <IconSymbol size={50} color="#808080" name="right.circle" />
          </TouchableOpacity>
        </View> */}
      </GestureHandlerRootView>
    </>
  );
}
const { width, height } = Dimensions.get("window");
const inbound = width - 32;

const styles = StyleSheet.create({
  screen: {
    backgroundColor: "#0b425f",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  charactor: {},
  controllers: {
    height: width < height ? 500 : "auto",
    width: width < height ? inbound : 150,
    padding: 5,
  },
  innerBoder: {
    height: "100%",
    width: "100%",
    borderWidth: 2,
    borderStyle: "dotted",
    borderRadius: 12,
    borderColor: "#337fa8ff",
    padding: 5,
  },
  borderDash: {
    borderWidth: 3,
    borderStyle: "dashed",
    borderRadius: 12,
    borderColor: "#337fa8ff",
  },
  gap12: {
    gap: 12,
  },
  buttons: {
    height: 40,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#32e3abff",
  },
  portrait: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0b425f",
  },
  landscape: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: "#0b425f",
  },
  movingController: {
    position: "absolute",
    bottom: 15,
    left: 15,
    flexDirection: "row",
    gap: 15,
  },
  movingButtons: {
    height: 60,
    width: 60,
    borderRadius: 100,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#7e7e7e5a",
  },
});
