import Button from "@/components/Button";
import Character from "@/components/Character";
import { IconSymbol } from "@/components/ui/IconSymbol";
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
import { CalculatePower } from "@/utils/common.util";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "axios";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width, height } = Dimensions.get("window");
const BASE_URL =
  process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:8080/api/v1";

export default function MainScreen() {
  const [heroState, setHeroState] = useState(EntityStateEnum.Idle);
  const [dungeon, setDungeon] = useState(5);
  const [username, setUsername] = useState(AsyncStorage.getItem("name"));

  const [power, setPower] = useState<any>(100000);
  const [itemPower, setItemPower] = useState<any>(0);
  const [data, setData] = useState([]);
  const [equipment, setEquipment] = useState<any>(null);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const [hero, setHero] = useState<EntityNameEnum>(EntityNameEnum.hero);
  const [selectedHero, setSelectedHero] = useState<number>(0);

  useFocusEffect(
    useCallback(() => {
      getHeroPower();
      getInventory();
      getEquipment();
      setUsername(AsyncStorage.getItem("name"));
    }, [])
  );

  useEffect(() => {
    getHeroPower();
    getInventory();
    getEquipment();
  }, []);

  useEffect(() => {
    setItemPower(CalculatePower(equipment));
  }, [equipment]);

  const getInventory = async () => {
    const token = await AsyncStorage.getItem("accessToken");
    try {
      const res = await axios.get(BASE_URL + "/inventory", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setData(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const getHeroPower = async () => {
    const token = await AsyncStorage.getItem("accessToken");
    try {
      const res = await axios.get(BASE_URL + "/scores", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const { point } = res.data;
      setPower(point ?? 0);
    } catch (error) {
      console.error(error);
    }
  };

  const getEquipment = async () => {
    const token = await AsyncStorage.getItem("accessToken");
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

  const nextHero = () => {
    const states = Object.values(EntityNameEnum);
    const seleted = selectedHero < states.length - 1 ? selectedHero + 1 : 0;
    setHero(EntityNameEnum[states[seleted]]);
    setSelectedHero(seleted);
  };

  const preHero = () => {
    const states = Object.values(EntityNameEnum);
    const seleted = selectedHero > 0 ? selectedHero - 1 : states.length - 1;
    setHero(EntityNameEnum[states[seleted]]);
    setSelectedHero(seleted);
  };

  const play = () => {
    router.push({
      pathname: "/(games)/battle",
      params: { hero: hero },
    });
  };

  const postEquipment = async (
    isUnequip: boolean = false,
    newEquipment?: any
  ) => {
    const token = await AsyncStorage.getItem("accessToken");
    let body = {
      head:
        selectedItem?.item.category === InventoryCategoryEnum.head
          ? selectedItem._id
          : equipment?.head?._id,
      body:
        selectedItem?.item.category === InventoryCategoryEnum.body
          ? selectedItem._id
          : equipment?.body?._id,
      leg:
        selectedItem?.item.category === InventoryCategoryEnum.leg
          ? selectedItem._id
          : equipment?.leg?._id,
      shield:
        selectedItem?.item.category === InventoryCategoryEnum.shield
          ? selectedItem._id
          : equipment?.shield?._id,
      weapon:
        selectedItem?.item.category === InventoryCategoryEnum.weapon
          ? selectedItem._id
          : equipment?.weapon?._id,
      jewelry:
        selectedItem?.item.category === InventoryCategoryEnum.jewelry
          ? selectedItem._id
          : equipment?.jewelry?._id,
    };
    if (isUnequip) {
      Object.keys(newEquipment).forEach((e: any) => {
        if (newEquipment[e]?._id) {
          newEquipment[e] = newEquipment[e]._id;
        }
      });
      body = newEquipment;
    }

    try {
      const res = await axios.post(BASE_URL + "/equipment", body, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res && res.data) {
        getEquipment();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const unequip = (itemPosition: InventoryCategoryEnum) => {
    switch (itemPosition) {
      case InventoryCategoryEnum.body:
        postEquipment(true, { ...equipment, body: null });
        break;
      case InventoryCategoryEnum.head:
        postEquipment(true, { ...equipment, head: null });
        break;
      case InventoryCategoryEnum.jewelry:
        postEquipment(true, { ...equipment, jewelry: null });
        break;
      case InventoryCategoryEnum.leg:
        postEquipment(true, { ...equipment, leg: null });
        break;
      case InventoryCategoryEnum.shield:
        postEquipment(true, { ...equipment, shield: null });
        break;
      case InventoryCategoryEnum.weapon:
        postEquipment(true, { ...equipment, weapon: null });
        break;
      default:
        break;
    }
  };

  const equip = () => {
    console.log("equip");
    postEquipment();
  };

  const renderItem = ({ item, index }: any) => {
    return (
      <>
        <TouchableOpacity onPress={() => setSelectedItem(item)}>
          <View style={[styles.inventorySlot]}>
            <Image
              source={
                item.item.category !== "Gem"
                  ? InventoryAssets?.[
                      item.item.category as InventoryCategoryEnum
                    ]?.[item.item.name as keyof typeof InventoryAssets] ?? null
                  : GemAssets?.[item.item.name as GemNameEnum]
              }
              style={[styles.itemImg]}
            />
          </View>
        </TouchableOpacity>
      </>
    );
  };

  return (
    <>
      <View style={styles.container}>
        <Image
          style={[
            width > height
              ? styles.backgroundImage
              : styles.backgroundPortrailImage,
          ]}
          source={dungeonBackground[dungeon]}
          resizeMode="cover"
        ></Image>
        <View>
          <Character
            name={EntityName[hero]}
            isMain={true}
            characterFrames={EntityInventory[hero]}
            characterState={heroState}
            width={200}
            height={165}
            nameColor={"#dfe6a8ff"}
          />
          <View style={[styles.heroSelection]}>
            <Button customStyle={[styles.selectButton]} onPress={preHero}>
              <IconSymbol size={28} name="left.circle" color={"#a1a1a1ff"} />
            </Button>
            <Button customStyle={[styles.selectButton]} onPress={nextHero}>
              <IconSymbol size={28} name="right.circle" color={"#a1a1a1ff"} />
            </Button>
          </View>
          <Text style={[styles.pixelText, { fontSize: 12 }]}>
            Power:{" "}
            <Text style={[styles.pixelPowerText]}>
              {power !== -1 ? power + itemPower : "??????"}
            </Text>
          </Text>
          <Text
            style={[styles.pixelText, { fontSize: 26, color: "#cececeff" }]}
          >
            {username}
          </Text>
        </View>
        <View style={styles.inventory}>
          <FlatList
            data={data}
            renderItem={renderItem}
            keyExtractor={(item: any) => item._id}
            numColumns={5}
            contentContainerStyle={styles.list}
            scrollEnabled={true}
          />
        </View>
        {selectedItem && (
          <View style={styles.itemDetailContainer}>
            <View style={[styles.inventorySlot]}>
              <Image
                source={
                  selectedItem.item.category !== "Gem"
                    ? InventoryAssets?.[
                        selectedItem.item.category as InventoryCategoryEnum
                      ]?.[
                        selectedItem.item.name as keyof typeof InventoryAssets
                      ] ?? null
                    : GemAssets?.[selectedItem.item.name as GemNameEnum]
                }
                style={[styles.itemImg]}
              />
            </View>
            {selectedItem.item.category !== "Gem" && (
              <>
                <Text style={[styles.pixelText, { fontSize: 12 }]}>
                  ATK:{" "}
                  <Text
                    style={[
                      styles.pixelText,
                      { fontSize: 12, color: "#970000ff" },
                    ]}
                  >
                    {selectedItem.atk}
                  </Text>
                </Text>
                <Text style={[styles.pixelText, { fontSize: 12 }]}>
                  DEF:{" "}
                  <Text
                    style={[
                      styles.pixelText,
                      { fontSize: 12, color: "#474747ff" },
                    ]}
                  >
                    {selectedItem.def}
                  </Text>
                </Text>
                <Text style={[styles.pixelText, { fontSize: 12 }]}>
                  HP:{" "}
                  <Text
                    style={[
                      styles.pixelText,
                      { fontSize: 12, color: "#0023bdff" },
                    ]}
                  >
                    {selectedItem.hp}
                  </Text>
                </Text>
              </>
            )}
            {selectedItem.item.category === "Gem" && (
              <>
                <Text style={[styles.pixelText, { fontSize: 12 }]}>
                  Rare:{" "}
                  <Text
                    style={[
                      styles.pixelText,
                      { fontSize: 12, color: "#7200afff" },
                    ]}
                  >
                    {(selectedItem.levelType ?? 0) +
                      (selectedItem.levelColor ?? 0)}
                  </Text>
                </Text>
              </>
            )}
            <Text style={[styles.pixelText, { fontSize: 12 }]}>
              LK:{" "}
              <Text
                style={[styles.pixelText, { fontSize: 12, color: "#38d726ff" }]}
              >
                {selectedItem.lucky}
              </Text>
            </Text>
            {selectedItem.item.category !== "Gem" && (
              <Button
                customStyle={[
                  {
                    flex: 1,
                    flexDirection: "row",
                    width: 60,
                    backgroundColor: "#7c2fa6ff",
                  },
                ]}
                onPress={equip}
              >
                <Text
                  style={[
                    styles.pixelText,
                    { fontStyle: "italic", color: "#ffffffff", fontSize: 8 },
                  ]}
                >
                  Equip
                </Text>
              </Button>
            )}
          </View>
        )}
        <View style={styles.equipmentList}>
          <TouchableOpacity
            onPress={() => unequip(InventoryCategoryEnum.weapon)}
          >
            <View style={[styles.inventorySlot]}>
              <Image
                source={
                  InventoryAssets?.[InventoryCategoryEnum.weapon]?.[
                    equipment?.weapon?.item
                      ?.name as keyof typeof InventoryAssets
                  ] ?? null
                }
                style={[styles.itemImg]}
              />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => unequip(InventoryCategoryEnum.shield)}
          >
            <View style={[styles.inventorySlot]}>
              <Image
                source={
                  InventoryAssets?.[InventoryCategoryEnum.shield]?.[
                    equipment?.shield?.item
                      ?.name as keyof typeof InventoryAssets
                  ] ?? null
                }
                style={[styles.itemImg]}
              />
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => unequip(InventoryCategoryEnum.head)}>
            <View style={[styles.inventorySlot]}>
              <Image
                source={
                  InventoryAssets?.[InventoryCategoryEnum.head]?.[
                    equipment?.head?.item?.name as keyof typeof InventoryAssets
                  ] ?? null
                }
                style={[styles.itemImg]}
              />
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => unequip(InventoryCategoryEnum.body)}>
            <View style={[styles.inventorySlot]}>
              <Image
                source={
                  InventoryAssets?.[InventoryCategoryEnum.body]?.[
                    equipment?.body?.item?.name as keyof typeof InventoryAssets
                  ] ?? null
                }
                style={[styles.itemImg]}
              />
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => unequip(InventoryCategoryEnum.leg)}>
            <View style={[styles.inventorySlot]}>
              <Image
                source={
                  InventoryAssets?.[InventoryCategoryEnum.leg]?.[
                    equipment?.leg?.item?.name as keyof typeof InventoryAssets
                  ] ?? null
                }
                style={[styles.itemImg]}
              />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => unequip(InventoryCategoryEnum.jewelry)}
          >
            <View style={[styles.inventorySlot]}>
              <Image
                source={
                  InventoryAssets?.[InventoryCategoryEnum.jewelry]?.[
                    equipment?.jewelry?.item
                      ?.name as keyof typeof InventoryAssets
                  ] ?? null
                }
                style={[styles.itemImg]}
              />
            </View>
          </TouchableOpacity>
        </View>
        <Button
          customStyle={[
            {
              flex: 1,
              flexDirection: "row",
              width: 150,
              backgroundColor: "#a81010ff",
              top: 150,
              left: 70,
              position: "absolute",
            },
          ]}
          onPress={play}
        >
          <Text
            style={[
              styles.pixelText,
              { fontStyle: "italic", color: "#c1c1c1ff" },
            ]}
          >
            Goooo!
          </Text>
          <IconSymbol size={16} name="right.circle" color={"#c1c1c1ff"} />
        </Button>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
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
    textShadowColor: "rgba(93, 93, 93, 1)",
    textShadowOffset: { width: 0.7, height: 0.7 },
    textShadowRadius: 0.7,
  },
  pixelPowerText: {
    fontFamily: "PressStart2P",
    fontSize: 24,
    color: "#7b1818ff",
    fontStyle: "italic",
    textShadowColor: "rgba(93, 93, 93, 1)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 0.7,
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
  backgroundImage: {
    position: "absolute",
    width: 932,
    bottom: 0,
    opacity: 0.4,
  },
  backgroundPortrailImage: {
    position: "absolute",
    height: 932,
    width: 430,
  },
  heroSelection: {
    position: "absolute",
    flex: 1,
    flexDirection: "row",
    gap: 170,
    top: 50,
  },
  selectButton: {
    width: 35,
    minHeight: 50,
  },
  inventory: {
    position: "absolute",
    backgroundColor: "#c46f00ff",
    borderRadius: 15,
    width: width > height ? 340 : 650,
    top: 10,
    right: 50,
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
  itemDetailContainer: {
    position: "absolute",
    backgroundColor: "#c46f00ff",
    borderRadius: 15,
    width: width > height ? 340 : 650,
    top: 250,
    right: 50,
    flex: 1,
    flexDirection: "row",
    padding: 7,
    alignItems: "center",
  },
  equipmentList: {
    position: "absolute",
    backgroundColor: "#9e9e9eff",
    borderRadius: 15,
    gap: 12,
    flex: 1,
    flexDirection: "row",
    padding: 7,
    top: 10,
    left: 50,
  },
  list: {
    gap: 12,
    maxHeight: width > height ? 225 : 650,
    maxWidth: width > height ? 600 : 400,
    padding: 20,
  },
  itemImg: {
    width: 36,
    height: 36,
  },
});
