import Button from "@/components/Button";
import Character from "@/components/Character";
import { IconSymbol } from "@/components/ui/IconSymbol";
import dungeonBackground from "@/data-sources/dungeonBackground";
import EntityInventory, {
  EntityName,
  EntityNameEnum,
} from "@/data-sources/entityInventory";
import { EntityStateEnum } from "@/data-sources/entityState";
import {
  InventoryAssets,
  InventoryCategoryEnum,
} from "@/data-sources/itemInventory";
import axios from "axios";
import { router } from "expo-router";
import { useEffect, useState } from "react";
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

const BASE_URL = "http://localhost:8080/api/v1";

export default function MainScreen() {
  const [heroState, setHeroState] = useState(EntityStateEnum.Idle);
  const [dungeon, setDungeon] = useState(5);

  const [power, setPower] = useState(100000);
  const [data, setData] = useState([]);
  const [equipment, setEquipment] = useState([
    {
      _id: "68c5f28426251e8d0aca44e2",
      item: {
        _id: "68c599904a515b2c0826d087",
        name: "Cursed_Relic",
        category: "Weapon",
      },
      atk: -523,
      def: 624,
      hp: -22,
      user: "68c5eb725ad6300fb2c9e018",
      lucky: 1,
    },
    {
      _id: "68c5f28426251e8d0aca44e2",
      item: {
        _id: "68c599904a515b2c0826d087",
        name: "Cursed_Relic",
        category: "Weapon",
      },
      atk: -523,
      def: 624,
      hp: -22,
      user: "68c5eb725ad6300fb2c9e018",
      lucky: 1,
    },
    {
      _id: "68c5f28426251e8d0aca44e2",
      item: {
        _id: "68c599904a515b2c0826d087",
        name: "Cursed_Relic",
        category: "Weapon",
      },
      atk: -523,
      def: 624,
      hp: -22,
      user: "68c5eb725ad6300fb2c9e018",
      lucky: 1,
    },
    {
      _id: "68c5f28426251e8d0aca44e2",
      item: {
        _id: "68c599904a515b2c0826d087",
        name: "Cursed_Relic",
        category: "Weapon",
      },
      atk: -523,
      def: 624,
      hp: -22,
      user: "68c5eb725ad6300fb2c9e018",
      lucky: 1,
    },
  ]);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const [hero, setHero] = useState<EntityNameEnum>(EntityNameEnum.hero);
  const [selectedHero, setSelectedHero] = useState<number>(0);

  useEffect(() => {
    getInventory();
  }, []);

  const getInventory = async () => {
    const token = localStorage.getItem("accessToken");
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

  const equip = () => {
    console.log("equip");
  };

  const renderItem = ({ item, index }: any) => {
    return (
      <>
        <TouchableOpacity onPress={() => setSelectedItem(item)}>
          <View style={[styles.inventorySlot]}>
            <Image
              source={
                InventoryAssets?.[
                  item.item.category as InventoryCategoryEnum
                ]?.[item.item.name as keyof typeof InventoryAssets] ??
                InventoryAssets["Weapon"]["Ancient"]
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
            Power: <Text style={[styles.pixelPowerText]}>{"??????"}</Text>
          </Text>
        </View>
        <View style={styles.inventory}>
          <FlatList
            data={data}
            renderItem={renderItem}
            keyExtractor={(item: any) => item.id}
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
                  InventoryAssets?.[
                    selectedItem.item.category as InventoryCategoryEnum
                  ]?.[selectedItem.item.name as keyof typeof InventoryAssets] ??
                  InventoryAssets["Weapon"]["Ancient"]
                }
                style={[styles.itemImg]}
              />
            </View>
            <Text style={[styles.pixelText, { fontSize: 12 }]}>
              ATK:{" "}
              <Text
                style={[styles.pixelText, { fontSize: 12, color: "#970000ff" }]}
              >
                {selectedItem.atk}
              </Text>
            </Text>
            <Text style={[styles.pixelText, { fontSize: 12 }]}>
              DEF:{" "}
              <Text
                style={[styles.pixelText, { fontSize: 12, color: "#474747ff" }]}
              >
                {selectedItem.def}
              </Text>
            </Text>
            <Text style={[styles.pixelText, { fontSize: 12 }]}>
              HP:{" "}
              <Text
                style={[styles.pixelText, { fontSize: 12, color: "#0023bdff" }]}
              >
                {selectedItem.hp}
              </Text>
            </Text>
            <Text style={[styles.pixelText, { fontSize: 12 }]}>
              LK:{" "}
              <Text
                style={[styles.pixelText, { fontSize: 12, color: "#38d726ff" }]}
              >
                {selectedItem.lucky}
              </Text>
            </Text>
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
          </View>
        )}
        <View style={styles.inventory}>
          {/* <FlatList
            data={data}
            renderItem={renderItem}
            keyExtractor={(item: any) => item.id}
            numColumns={5}
            contentContainerStyle={styles.list}
            scrollEnabled={true}
          /> */}
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
    top: 20,
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
  equipment: {},
  list: {
    gap: 12,
    maxHeight: width > height ? 220 : 650,
    maxWidth: width > height ? 600 : 400,
    padding: 20,
  },
  itemImg: {
    width: 36,
    height: 36,
  },
});
