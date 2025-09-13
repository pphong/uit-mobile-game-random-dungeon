import Button from "@/components/Button";
import Character from "@/components/Character";
import dungeonBackground from "@/data-sources/dungeonBackground";
import EntityInventory, {
  EntityName,
  EntityNameEnum,
} from "@/data-sources/entityInventory";
import { EntityStateEnum } from "@/data-sources/entityState";
import { CalculateLv } from "@/utils/common.util";
import axios from "axios";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Dimensions, Image, StyleSheet, Text, View } from "react-native";

const BASE_URL = "http://localhost:8080/api/v1";

export default function BattleScreen() {
  const { hero } = useLocalSearchParams();

  const [lvWeigth, setLvWeigth] = useState<number>(
    Math.floor(Math.random() * 100 * 1000)
  );

  const [dungeonLv, setDungeonLv] = useState<number>(CalculateLv(lvWeigth));
  const [heroState, setHeroState] = useState(EntityStateEnum.Idle);
  const [enemyState, setEnemyState] = useState(EntityStateEnum.Idle);
  const [heroPower, setHeroPower] = useState(0);
  const [heroMaxHP, setHeroMaxHP] = useState(100 + heroPower);
  const [enemyMaxHP, setEnemyMaxHP] = useState(dungeonLv);
  const [heroHP, setHeroHP] = useState(heroMaxHP);
  const [enemyHP, setEnemyHP] = useState(enemyMaxHP);
  const [heroHurtHP, setHeroHurtHP] = useState<any>(null);
  const [enemyHurtHP, setEnemyHurtHP] = useState<any>(null);
  const [turn, setTurn] = useState<"user" | "bot">("user");
  const [result, setResult] = useState<"win" | "lose" | null>(null);
  const [quote, setQuote] = useState(Math.floor(Math.random() * 3));
  const [dungeon, setDungeon] = useState(Math.floor(Math.random() * 4));
  const [enemy, setEnemy] = useState(EntityNameEnum.hero);

  useEffect(() => {
    const state = Object.values(EntityNameEnum);
    setEnemy(EntityNameEnum[state[Math.floor(Math.random() * state.length)]]);
    getHeroPower();
  }, []);

  const getHeroPower = async () => {
    const token = localStorage.getItem("accessToken");
    try {
      const res = await axios.get(BASE_URL + "/scores", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const { point } = res.data;
      setHeroPower(point ?? 0);
    } catch (error) {
      console.error(error);
    }
  };

  const onVictory = async () => {
    const token = localStorage.getItem("accessToken");
    const diffScore = Math.floor(10 - ((((heroMaxHP + heroPower) * 100)/ enemyMaxHP) / 10));
    try {
      const res = await axios.post(
        BASE_URL + "/inventory/victory",
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            master: diffScore,
          },
        }
      );
      const { point } = res.data;
      setHeroPower(point ?? 0);
    } catch (error) {
      console.error(error);
    }
  };

  const reset = () => {
    getHeroPower();
    const state = Object.values(EntityNameEnum);
    setEnemy(EntityNameEnum[state[Math.floor(Math.random() * state.length)]]);
    setLvWeigth(Math.floor(Math.random() * 100 * 1000));
    const lv = CalculateLv(lvWeigth);
    setDungeonLv(lv);
    setHeroState(EntityStateEnum.Idle);
    setEnemyState(EntityStateEnum.Idle);
    setHeroMaxHP(100 + heroPower);
    setEnemyMaxHP(lv);
    setHeroHP(heroMaxHP);
    setEnemyHP(lv);
    setTurn("user");
    setResult(null);
    setQuote(Math.floor(Math.random() * 3));
    setDungeon(Math.floor(Math.random() * 3));
  };

  const home = () => {
    router.push("/(games)/main");
  };

  const triggerHero = (action: "ATK" | "HEAL") => {
    let state = EntityStateEnum.Idle;
    if (action === "ATK") {
      const atk = [
        EntityStateEnum.ATK1,
        EntityStateEnum.ATK2,
        EntityStateEnum.ATK3,
      ];
      state = atk[Math.floor(Math.random() * atk.length)];
    }

    if (action === "HEAL") {
      state = EntityStateEnum.Idle;
    }

    if (heroHP > 0) {
      setHeroState(state);
    } else {
      return;
    }
    const hurting =
      Number((Math.random() * (100 + heroPower)).toFixed(2)) *
      (action === "HEAL" ? 1 : -1);
    console.log({ heroPower });

    if (state.includes("ATK") || action === "HEAL") {
      if (enemyHP + hurting < 0) {
        setEnemyHP(0);
        setEnemyState(EntityStateEnum.Death);
      } else if (enemyHP + hurting < enemyMaxHP) {
        setEnemyHP((pre) => pre + hurting);
        setEnemyHurtHP(hurting);
        if (hurting < 0) {
          setEnemyState(EntityStateEnum.Hurt);
        }
      } else {
        setEnemyHP(enemyMaxHP);
        setEnemyState(EntityStateEnum.Idle);
      }
    }

    if (state !== EntityStateEnum.Idle && state !== EntityStateEnum.Death) {
      setTimeout(() => {
        setHeroState(EntityStateEnum.Idle);
      }, 500);
    }

    if (enemyState !== EntityStateEnum.Death && enemyHP + hurting > 0) {
      setTimeout(() => {
        setEnemyState(EntityStateEnum.Idle);
      }, 500);
    }

    if (action === "ATK") {
      setTurn("bot");
    } else {
      setTurn("user");
    }
  };

  const triggerEnemy = (action: "ATK" | "HEAL") => {
    let state = EntityStateEnum.Idle;
    if (action === "ATK") {
      const atk = [
        EntityStateEnum.ATK1,
        EntityStateEnum.ATK2,
        EntityStateEnum.ATK3,
      ];
      state = atk[Math.floor(Math.random() * atk.length)];
    }

    if (action === "HEAL") {
      state = EntityStateEnum.Idle;
    }

    if (enemyHP > 0) {
      setEnemyState(state);
    } else {
      return;
    }

    const baseDmg = dungeonLv / 4;
    const critical = Math.floor(Math.random() * 3) + 1;
    const hurting =
      Number((Math.random() * baseDmg).toFixed(2)) *
      (action === "HEAL" ? 1 : -1) *
      critical;

    if (state.includes("ATK") || action === "HEAL") {
      if (heroHP + hurting < 0) {
        setHeroHP(0);
        setHeroState(EntityStateEnum.Death);
      } else if (heroHP + hurting < heroMaxHP) {
        setHeroHP((pre) => pre + hurting);
        setHeroHurtHP(hurting);
        if (hurting < 0) {
          setHeroState(EntityStateEnum.Hurt);
        }
      } else {
        setHeroHP(heroMaxHP);
        setHeroState(EntityStateEnum.Idle);
      }
    }

    if (state !== EntityStateEnum.Idle && state !== EntityStateEnum.Death) {
      setTimeout(() => {
        setEnemyState(EntityStateEnum.Idle);
      }, 500);
    }

    if (heroState !== EntityStateEnum.Death && heroHP + hurting > 0) {
      setTimeout(() => {
        setHeroState(EntityStateEnum.Idle);
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
      onVictory();
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

  useFocusEffect(
    useCallback(() => {
      reset();
    }, [])
  );

  const getDungeonLv = () => {
    if (dungeonLv < 1000) {
      return dungeonLv;
    } else {
      if (dungeonLv < 99999) {
        return "D";
      }
      if (dungeonLv < 499999) {
        return "C";
      }
      if (dungeonLv < 999999) {
        return "B";
      }
      if (dungeonLv < 4999999) {
        return "A";
      }
      if (dungeonLv < 10 * 19999999) {
        return "S";
      }
      if (dungeonLv < 45 * 44999999) {
        return "S+";
      }
      if (dungeonLv <= 50 * 50000000) {
        return "SSS";
      }
    }
  };

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
        <Text
          style={[
            styles.pixelText,
            {
              position: "absolute",
              color: "#fff",
              top: width > height ? height / 10 : height / 7,
              left: width > height ? width / 2.7 : width / 5,
            },
          ]}
        >
          Dungeon {getDungeonLv()}
        </Text>
        <>
          <Character
            name={EntityName[hero as keyof typeof EntityName]}
            isMain={true}
            characterFrames={EntityInventory[hero as keyof typeof EntityName]}
            characterState={heroState}
            currentHP={heroHP}
            totalHP={heroMaxHP}
            missingHP={heroHurtHP}
            width={200}
            height={130}
            nameColor={"#dfe6a8ff"}
          />
          <Character
            name={EntityName[enemy as keyof typeof EntityName]}
            isMain={false}
            characterFrames={EntityInventory[enemy as keyof typeof EntityName]}
            characterState={enemyState}
            currentHP={enemyHP}
            totalHP={enemyMaxHP}
            missingHP={enemyHurtHP}
            width={200}
            height={130}
            nameColor={"#d9692cff"}
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
              <View
                style={[
                  {
                    flex: 1,
                    flexDirection: "column",
                    gap: 12,
                    top: width > height ? height / 3 : height / 2,
                  },
                ]}
              >
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
                <View style={[{ flex: 1, flexDirection: "column", gap: 12 }]}>
                  <Button
                    customStyle={[{ minHeight: 30 }]}
                    label="It's a long day, need some rest!"
                    onPress={home}
                    backgroundColor={"#56ae94ff"}
                  ></Button>
                  <Button
                    customStyle={[{ minHeight: 30 }]}
                    label="Bring me another one!"
                    onPress={reset}
                    backgroundColor={"#008131ff"}
                  ></Button>
                </View>
                <Text style={[styles.pixelText, { fontSize: 15 }]}>
                  (Your items have been sent to inventory, please check them
                  when you return.)
                </Text>
              </View>
            )}

            {result === "lose" && (
              <View
                style={[
                  {
                    flex: 1,
                    flexDirection: "column",
                    gap: 12,
                    top: width > height ? height / 3 : height / 2,
                  },
                ]}
              >
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
                <View style={[{ flex: 1, flexDirection: "column", gap: 12 }]}>
                  <Button
                    customStyle={[{ minHeight: 30 }]}
                    label="I forgot my equiments! Let's get some!"
                    onPress={home}
                    backgroundColor={"#56ae94ff"}
                  ></Button>
                  <Button
                    customStyle={[{ minHeight: 30 }]}
                    label="It's not me, just the illution, let's try another one!"
                    onPress={reset}
                    backgroundColor={"#ff7070ff"}
                  ></Button>
                </View>
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
    bottom: 0,
  },
  backgroundPortrailImage: {
    position: "absolute",
    height: 932,
    width: 430,
  },
});
