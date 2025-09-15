import Button from "@/components/Button";
import Character from "@/components/Character";
import dungeonBackground from "@/data-sources/dungeonBackground";
import EntityInventory, {
  EntityName,
  EntityNameEnum,
} from "@/data-sources/entityInventory";
import { EntityStateEnum } from "@/data-sources/entityState";
import { GemAssets, GemNameEnum } from "@/data-sources/itemGem";
import {
  InventoryAssets,
  InventoryCategoryEnum,
} from "@/data-sources/itemInventory";
import { CalculateItemProp, CalculateLv } from "@/utils/common.util";
import axios from "axios";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Dimensions, Image, StyleSheet, Text, View } from "react-native";

const BASE_URL =
  process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:8080/api/v1";

export default function BattleScreen() {
  const { hero } = useLocalSearchParams();

  const [lvWeigth, setLvWeigth] = useState<number>(
    Math.floor(Math.random() * 100 * 1000)
  );

  const [dungeonLv, setDungeonLv] = useState<number>(CalculateLv(lvWeigth));
  const [equipment, setEquipment] = useState<any>(null);
  const [equipmentPower, setEquipmentPower] = useState<{
    atk: number;
    def: number;
    hp: number;
    luck: number;
  }>({ atk: 0, def: 0, hp: 0, luck: 0 });
  const [heroState, setHeroState] = useState(EntityStateEnum.Idle);
  const [enemyState, setEnemyState] = useState(EntityStateEnum.Idle);
  const [heroPower, setHeroPower] = useState(0);
  const [heroMaxHP, setHeroMaxHP] = useState(
    100 + heroPower + equipmentPower.hp
  );
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

  const [dropItems, setDropItems] = useState<any>([]);

  useEffect(() => {
    const state = Object.values(EntityNameEnum);
    setEnemy(EntityNameEnum[state[Math.floor(Math.random() * state.length)]]);
    getHeroPower();
    getEquipment();
  }, []);

  useEffect(() => {
    setEquipmentPower({
      atk: CalculateItemProp(equipment, "atk"),
      def: CalculateItemProp(equipment, "def"),
      hp: CalculateItemProp(equipment, "hp"),
      luck: CalculateItemProp(equipment, "luck"),
    });
  }, [equipment]);

  useEffect(() => {
    setHeroMaxHP(100 + heroPower + equipmentPower.hp);
    setHeroHP(heroMaxHP);
  }, [equipmentPower]);

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
    setDropItems([]);
    const token = localStorage.getItem("accessToken");
    const diffScore = Math.floor(
      10 - ((heroMaxHP + heroPower) * 100) / enemyMaxHP / 10
    );
    try {
      const res = await axios.post(BASE_URL + "/inventory/victory", null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          master: diffScore,
        },
      });
      setDropItems(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const reset = () => {
    getHeroPower();
    getEquipment();
    const state = Object.values(EntityNameEnum);
    setEnemy(EntityNameEnum[state[Math.floor(Math.random() * state.length)]]);
    setLvWeigth(Math.floor(Math.random() * 100 * 1000));
    const lv = CalculateLv(lvWeigth);
    setDungeonLv(lv);
    setHeroState(EntityStateEnum.Idle);
    setEnemyState(EntityStateEnum.Idle);
    setHeroMaxHP(100 + heroPower + equipmentPower.hp);
    setEnemyMaxHP(lv);
    setHeroHP(heroMaxHP);
    setEnemyHP(lv);
    setTurn("user");
    setResult(null);
    setQuote(Math.floor(Math.random() * 3));
    setDungeon(Math.floor(Math.random() * 3));
    setDropItems([]);
  };

  const home = () => {
    router.push("/(games)/main");
  };

  const getEquipment = async () => {
    const token = localStorage.getItem("accessToken");
    try {
      const res = await axios.get(BASE_URL + "/equipment", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setEquipment(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const onHeroAction = (action: "ATK" | "HEAL") => {
    let state = EntityStateEnum.Idle;
    if (action === "ATK") {
      const atk = [
        EntityStateEnum.ATK1,
        EntityStateEnum.ATK2,
        EntityStateEnum.ATK3,
      ];
      state = atk[Math.floor(Math.random() * atk.length)];
      setHeroState(state);

      let hurting =
        Number((Math.random() * (100 + heroPower)).toFixed(2)) +
        equipmentPower.atk;
      if (hurting < 0) {
        hurting = 0;
      }

      if (enemyHP - hurting < 0) {
        setEnemyHP(0);
        setEnemyState(EntityStateEnum.Death);
      } else {
        setEnemyHP((pre) => pre - hurting);
        setEnemyHurtHP(hurting > 0 ? hurting * -1 : "-0");
        setEnemyState(EntityStateEnum.Hurt);
      }

      if (enemyState !== EntityStateEnum.Death && enemyHP + hurting > 0) {
        setTimeout(() => {
          setEnemyState(EntityStateEnum.Idle);
        }, 500);
      }

      if (state !== EntityStateEnum.Death && state !== EntityStateEnum.Idle) {
        setTimeout(() => {
          setHeroState(EntityStateEnum.Idle);
        }, 500);
      }
    }

    if (action === "HEAL") {
      if (heroHP < 0) {
        return;
      }

      const healing = Number((Math.random() * (100 + heroPower)).toFixed(2));
      setHeroHurtHP(healing);
      if (heroHP + healing < heroMaxHP) {
        setHeroHP((pre) => pre + healing);
      } else {
        setHeroHP(heroMaxHP);
      }
    }

    setTurn("bot");
  };

  const onEnemyAction = (action: "ATK" | "HEAL") => {
    const baseDmg = dungeonLv / 4;
    const critical = Math.floor(Math.random() * 3) + 1;
    let state = EntityStateEnum.Idle;
    if (action === "ATK") {
      const atk = [
        EntityStateEnum.ATK1,
        EntityStateEnum.ATK2,
        EntityStateEnum.ATK3,
      ];
      state = atk[Math.floor(Math.random() * atk.length)];
      setEnemyState(state);

      const hurting =
        Number((Math.random() * baseDmg).toFixed(2)) * critical -
        equipmentPower.def;

      if (heroHP - hurting < 0) {
        setHeroHP(0);
        setHeroState(EntityStateEnum.Death);
      } else {
        setHeroHP((pre) => pre - hurting);
        setHeroHurtHP(hurting * -1);
        setHeroState(EntityStateEnum.Hurt);
      }

      if (heroState !== EntityStateEnum.Death && heroHP + hurting > 0) {
        setTimeout(() => {
          setHeroState(EntityStateEnum.Idle);
        }, 500);
      }

      if (state !== EntityStateEnum.Death && state !== EntityStateEnum.Idle) {
        setTimeout(() => {
          setEnemyState(EntityStateEnum.Idle);
        }, 500);
      }
    }

    if (action === "HEAL") {
      if (enemyHP < 0) {
        return;
      }

      const healing = Number((Math.random() * baseDmg).toFixed(2)) * critical;
      setEnemyHurtHP(healing);
      if (enemyHP + healing < enemyMaxHP) {
        setEnemyHP((pre) => pre + healing);
      } else {
        setEnemyHP(enemyMaxHP);
      }
    }

    setTurn("user");
  };

  useEffect(() => {
    if (turn === "bot" && enemyHP > 0) {
      const timer = setTimeout(() => {
        const act = ["ATK", "HEAL"];
        const a = act[Math.floor(Math.random() * act.length)] as "ATK" | "HEAL";
        if (a === "ATK") {
          onEnemyAction(a);
        } else {
          onEnemyAction(a);
        }
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [turn]);

  useEffect(() => {
    if (enemyHP === 0 && result == null) {
      setResult("win");
      onVictory();
    } else if (heroHP === 0 && result == null) {
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
                  onPress={() => onHeroAction("ATK")}
                  disabled={turn === "bot"}
                  backgroundColor={
                    turn === "user" && heroHP !== 0 ? "#e34646ff" : "#747474ff"
                  }
                ></Button>
                <Button
                  customStyle={[styles.randomButtonsRight]}
                  label="Random Heal"
                  onPress={() => onHeroAction("HEAL")}
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
                    // flex: 1,
                    flexDirection: "column",
                    gap: 12,
                    // top: width > height ? height / 3 : height / 2,
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
                <Text style={[styles.pixelText, { fontSize: 15, maxWidth: width * 0.7  }]}>
                  (Your items have been sent to inventory, please check them
                  when you return.)
                </Text>
                <View style={styles.dropList}>
                  {dropItems.map((item: any, index: number) => (
                    <View key={index} style={[styles.inventorySlot]}>
                      <Image
                        source={
                          item.item.category !== "Gem"
                            ? InventoryAssets?.[
                                item.item.category as InventoryCategoryEnum
                              ]?.[
                                item.item.name as keyof typeof InventoryAssets
                              ] ?? null
                            : GemAssets?.[item.item.name as GemNameEnum]
                        }
                        style={[styles.itemImg]}
                      />
                    </View>
                  ))}
                </View>
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

          {result == null && (
            <View style={[styles.turnBar]}>
              <View
                style={[
                  {
                    backgroundColor: "#1da102ff",
                    boxShadow: "#0d4b00ff 0px 6px 3px",
                    borderWidth: 2,
                    borderColor: "#387e2aff",
                    padding: 5,
                    borderRadius: 5,
                    opacity: turn === "user" ? 0.6 : 0,
                  },
                ]}
              >
                <Text
                  style={[styles.pixelText, { fontSize: 8, color: "#fff" }]}
                >
                  Your turn
                </Text>
              </View>
              <View
                style={[
                  {
                    backgroundColor: "#a10202ff",
                    boxShadow: "#4b0000ff 0px 6px 3px",
                    borderWidth: 2,
                    borderColor: "#7e2a2aff",
                    padding: 5,
                    borderRadius: 5,
                    opacity: turn === "bot" ? 0.6 : 0,
                  },
                ]}
              >
                <Text
                  style={[styles.pixelText, { fontSize: 8, color: "#fff" }]}
                >
                  Enemy turn
                </Text>
              </View>
            </View>
          )}
        </>
      </div>
    </>
  );
}
const { width, height } = Dimensions.get("window");

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
  turnBar: {
    position: "absolute",
    bottom: 50,
    width: width - 100,
    justifyContent: "space-between",
    flex: 1,
    flexDirection: "row",
  },
  dropList: {
    backgroundColor: "#d4c354ff",
    borderRadius: 15,
    gap: 12,
    flex: 1,
    flexDirection: "row",
    padding: 7,
    maxHeight: 66,
    minHeight: 66
  },
  inventorySlot: {
    borderWidth: 2,
    borderStyle: "solid",
    borderColor: "#472d08ff",
    borderRadius: 3,
    padding: 5,
    width: 50,
    height: 50,
    marginLeft: 5,
    marginRight: 5,
  },
  itemImg: {
    width: 36,
    height: 36,
  },
});
