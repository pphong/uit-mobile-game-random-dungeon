import Button from "@/components/Button";
import Character from "@/components/Character";
import dungeonBackground from "@/data-sources/dungeonBackground";
import HeroFrames, { HeroStateEnum } from "@/data-sources/heroStateFrames";
import { useEffect, useState } from "react";
import { Dimensions, Image, StyleSheet, Text, View } from "react-native";

export default function HomeScreen() {
  // const [attackTrigger, setAttackTrigger] = useState(false);

  // useEffect(() => {
  //   setAttackTrigger(true);
  // }, []);

  const [heroState, setHeroState] = useState(HeroStateEnum.Idle);
  const [enemyState, setEnemyState] = useState(HeroStateEnum.Idle);
  const [heroMaxHP, setHeroMaxHP] = useState(100);
  const [enemyMaxHP, setEnemyMaxHP] = useState(200);
  const [heroHP, setHeroHP] = useState(heroMaxHP);
  const [enemyHP, setEnemyHP] = useState(enemyMaxHP);
  const [heroHurtHP, setHeroHurtHP] = useState<any>(null);
  const [enemyHurtHP, setEnemyHurtHP] = useState<any>(null);
  const [turn, setTurn] = useState<"user" | "bot">("user");
  const [result, setResult] = useState<"win" | "lose" | null>(null);
  const [quote, setQuote] = useState(Math.floor(Math.random() * 3));
  const [dungeon, setDungeon] = useState(Math.floor(Math.random() * 4));

  const triggerHero = (action: "ATK" | "HEAL") => {
    let state = HeroStateEnum.Idle;
    if (action === "ATK") {
      const atk = [HeroStateEnum.ATK1, HeroStateEnum.ATK2, HeroStateEnum.ATK3];
      state = atk[Math.floor(Math.random() * atk.length)];
    }

    if (action === "HEAL") {
      state = HeroStateEnum.Idle;
    }

    if (heroHP > 0) {
      setHeroState(state);
    } else {
      return;
    }
    const hurting =
      Number((Math.random() * 100).toFixed(2)) * (action === "HEAL" ? 1 : -1);

    if (state.includes("ATK") || action === "HEAL") {
      if (enemyHP + hurting < 0) {
        setEnemyHP(0);
        setEnemyState(HeroStateEnum.Death);
      } else if (enemyHP + hurting < enemyMaxHP) {
        setEnemyHP((pre) => pre + hurting);
        setEnemyHurtHP(hurting);
        if (hurting < 0) {
          setEnemyState(HeroStateEnum.Hurt);
        }
      } else {
        setEnemyHP(enemyMaxHP);
        setEnemyState(HeroStateEnum.Idle);
      }
    }

    if (state !== HeroStateEnum.Idle && state !== HeroStateEnum.Death) {
      setTimeout(() => {
        setHeroState(HeroStateEnum.Idle);
      }, 500);
    }

    if (enemyState !== HeroStateEnum.Death && enemyHP + hurting > 0) {
      setTimeout(() => {
        setEnemyState(HeroStateEnum.Idle);
      }, 500);
    }

    if (action === "ATK") {
      setTurn("bot");
    } else {
      setTurn("user");
    }
  };

  const triggerEnemy = (action: "ATK" | "HEAL") => {
    let state = HeroStateEnum.Idle;
    if (action === "ATK") {
      const atk = [HeroStateEnum.ATK1, HeroStateEnum.ATK2, HeroStateEnum.ATK3];
      state = atk[Math.floor(Math.random() * atk.length)];
    }

    if (action === "HEAL") {
      state = HeroStateEnum.Idle;
    }

    if (enemyHP > 0) {
      setEnemyState(state);
    } else {
      return;
    }
    const hurting =
      Number((Math.random() * 100).toFixed(2)) * (action === "HEAL" ? 1 : -1);

    if (state.includes("ATK") || action === "HEAL") {
      if (heroHP + hurting < 0) {
        setHeroHP(0);
        setHeroState(HeroStateEnum.Death);
      } else if (heroHP + hurting < heroMaxHP) {
        setHeroHP((pre) => pre + hurting);
        setHeroHurtHP(hurting);
        if (hurting < 0) {
          setHeroState(HeroStateEnum.Hurt);
        }
      } else {
        setHeroHP(heroMaxHP);
        setHeroState(HeroStateEnum.Idle);
      }
    }

    if (state !== HeroStateEnum.Idle && state !== HeroStateEnum.Death) {
      setTimeout(() => {
        setEnemyState(HeroStateEnum.Idle);
      }, 500);
    }

    if (heroState !== HeroStateEnum.Death && heroHP + hurting > 0) {
      setTimeout(() => {
        setHeroState(HeroStateEnum.Idle);
      }, 500);
    }

    if (action === "ATK") {
      setTurn("user");
    } else {
      setTurn("bot");
    }
  };

  useEffect(() => {
    if (turn === "bot" && enemyHP > 0) {
      const timer = setTimeout(() => {
        const act = ["ATK", "HEAL"];
        const a = act[Math.floor(Math.random() * act.length)] as "ATK" | "HEAL";
        if (a === "ATK") {
          triggerEnemy(a);
        } else {
          triggerHero(a);
        }
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [turn]);

  useEffect(() => {
    if (enemyHP === 0) {
      setResult("win");
    } else if (heroHP === 0) {
      setResult("lose");
    }
    console.log({ enemyHP, heroHP });
  }, [enemyHP, heroHP]);

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

  return (
    <>
      <Image
        style={[
          width > height
            ? styles.backgroundImage
            : styles.backgroundPortrailImage,
        ]}
        source={dungeonBackground[dungeon]}
        resizeMode="cover"
      ></Image>
      <div style={styles.landscape}>
        <>
          <Character
            name={"Hero 1"}
            isMain={true}
            characterFrames={HeroFrames}
            characterState={heroState}
            currentHP={heroHP}
            totalHP={heroMaxHP}
            missingHP={heroHurtHP}
            width={200}
            height={130}
            nameColor={'#dfe6a8ff'}
          />
          <Character
            name={"Hero 2"}
            isMain={false}
            characterFrames={HeroFrames}
            characterState={enemyState}
            currentHP={enemyHP}
            totalHP={enemyMaxHP}
            missingHP={enemyHurtHP}
            width={200}
            height={130}
            nameColor={'#d9692cff'}
          />

          <View
            style={[
              result == null
                ? styles.randomControllers
                : result === "win"
                ? styles.winBanner
                : styles.lostBanner,
            ]}
          >
            {result == null && (
              <>
                <Button
                  customStyle={[styles.randomButtonsLeft]}
                  label="Random Attack"
                  onPress={() => triggerHero("ATK")}
                  disabled={turn === "bot"}
                  backgroundColor={
                    turn === "user" && heroHP !== 0 ? "#e34646ff" : "#747474ff"
                  }
                ></Button>
                <Button
                  customStyle={[styles.randomButtonsRight]}
                  label="Random Heal"
                  onPress={() => triggerEnemy("HEAL")}
                  disabled={turn === "bot" || heroHP === 0}
                  backgroundColor={
                    turn === "user" && heroHP !== 0 ? "#149f2dff" : "#747474ff"
                  }
                ></Button>
              </>
            )}

            {result === "win" && (
              <View>
                {quote === 0 && (
                  <Text style={[styles.pixelText, styles.winText]}>
                    What a fierce battle!
                  </Text>
                )}
                {quote === 1 && (
                  <Text style={[styles.pixelText, styles.winText]}>
                    Victory is mine!
                  </Text>
                )}
                {quote === 2 && (
                  <Text style={[styles.pixelText, styles.winText]}>
                    We will never give up
                  </Text>
                )}
              </View>
            )}

            {result === "lose" && (
              <View>
                {quote === 0 && (
                  <Text style={[styles.pixelText, styles.lostText]}>
                    It is a disgrace
                  </Text>
                )}
                {quote === 1 && (
                  <Text style={[styles.pixelText, styles.lostText]}>
                    I will revenge!
                  </Text>
                )}
                {quote === 2 && (
                  <Text style={[styles.pixelText, styles.lostText]}>
                    Lost? I will never accept this!
                  </Text>
                )}
              </View>
            )}
          </View>
        </>
      </div>
    </>
  );
}
const { width, height } = Dimensions.get("window");
const inbound = width - 32;

const styles = StyleSheet.create({
  portrait: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0b425f",
  },
  landscape: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: "#1686c2ff",
    gap: width > height ? "20%" : "10%",
  },
  pixelText: {
    fontFamily: "PressStart2P",
    fontSize: 28,
    textShadowColor: "rgba(93, 93, 93, 1)",
    textShadowOffset: { width: 0.7, height: 0.7 },
    textShadowRadius: 0.7,
  },
  randomControllers: {
    position: "absolute",
    padding: 5,
    flexDirection: "row",
    gap: 2,
    bottom: 14,
  },
  randomButtonsLeft: {
    width: 70,
    minHeight: 80,
    borderTopLeftRadius: 100,
    borderBottomLeftRadius: 100,
  },
  randomButtonsRight: {
    width: 70,
    minHeight: 80,
    borderTopRightRadius: 100,
    borderBottomRightRadius: 100,
  },
  winText: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#fdf917ff",
    textShadowColor: "#e3e2a0ff",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  lostText: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#000000ff",
    textShadowColor: "#a92a2aff",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  winBanner: {
    position: "absolute",
    backgroundColor: "#404300b0",
    width: width > height ? 932 : 430,
    height: width > height ? 430 : 932,
    alignItems: "center",
    justifyContent: "center",
  },
  lostBanner: {
    position: "absolute",
    backgroundColor: "#9b8181d4",
    width: width > height ? 932 : 430,
    height: width > height ? 430 : 932,
    alignItems: "center",
    justifyContent: "center",
  },
  backgroundImage: {
    position: "absolute",
    width: 932,
    bottom: 0
  },
  backgroundPortrailImage: {
    position: "absolute",
    height: 932,
    width: 430,
  },
});
