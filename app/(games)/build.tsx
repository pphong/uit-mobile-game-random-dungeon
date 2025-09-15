import Button from "@/components/Button";
import dungeonBackground from "@/data-sources/dungeonBackground";
import { EntityStateEnum } from "@/data-sources/entityState";
import { GemAssets, GemNameEnum } from "@/data-sources/itemGem";
import {
  InventoryAssets,
  InventoryCategoryEnum,
} from "@/data-sources/itemInventory";
import axios from "axios";
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
const BASE_URL =
  process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:8080/api/v1";

export default function MainScreen() {
  const [heroState, setHeroState] = useState(EntityStateEnum.Idle);
  const [dungeon, setDungeon] = useState(6);
  const [username, setUsername] = useState(localStorage.getItem("name"));

  const [power, setPower] = useState<any>(100000);
  const [heroItems, setHeroItems] = useState([]);
  const [heroGems, setHeroGems] = useState([]);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [selectedGem, setSelectedGem] = useState<any>(null);

  useEffect(() => {
    getInventoryItems();
    getInventoryGems();
  }, []);

  const getInventoryItems = async () => {
    const token = localStorage.getItem("accessToken");
    try {
      const res = await axios.get(BASE_URL + "/inventory/not-gem", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setHeroItems(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const getInventoryGems = async () => {
    const token = localStorage.getItem("accessToken");
    try {
      const res = await axios.get(BASE_URL + "/inventory/gem", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setHeroGems(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const postMosaic = async () => {
    if (!selectedItem || !selectedGem) {
      return;
    }

    const token = localStorage.getItem("accessToken");
    let body = {
      gemId: selectedGem._id,
    };

    try {
      const res = await axios.post(
        BASE_URL + `/inventory/${selectedItem._id}/mosaic`,
        body,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res && res.data) {
        setSelectedItem(res.data);
        setSelectedGem(null);
        getInventoryItems();
        getInventoryGems();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const renderItem = ({ item, index }: any) => {
    return (
      <>
        <TouchableOpacity
          onPress={() => {
            if (item.item.category !== "Gem") {
              setSelectedItem(item);
            } else {
              setSelectedGem(item);
            }
          }}
        >
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
        <View style={[{ position: "absolute", top: 50, left: 50, zIndex: 1 }]}>
          <Text
            style={[
              styles.pixelText,
              { fontSize: 26, fontStyle: "italic", color: "#232323ff" },
            ]}
          >
            Blacksmith house
          </Text>
        </View>
        <Image
          style={[
            width > height
              ? styles.backgroundImage
              : styles.backgroundPortrailImage,
          ]}
          source={dungeonBackground[dungeon]}
          resizeMode="cover"
        ></Image>
        <View></View>
        <View style={styles.inventory}>
          <FlatList
            data={heroItems}
            renderItem={renderItem}
            keyExtractor={(item: any) => item._id}
            numColumns={5}
            contentContainerStyle={styles.list}
            scrollEnabled={true}
          />
        </View>
        <View style={styles.inventoryGem}>
          <FlatList
            data={heroGems}
            renderItem={renderItem}
            keyExtractor={(item: any) => item._id}
            numColumns={5}
            contentContainerStyle={styles.list}
            scrollEnabled={true}
          />
        </View>
        <View style={styles.itemDetailContainer}>
          {selectedItem && (
            <>
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
              <Text style={[styles.pixelText, { fontSize: 12 }]}>
                LK:{" "}
                <Text
                  style={[
                    styles.pixelText,
                    { fontSize: 12, color: "#38d726ff" },
                  ]}
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
                      backgroundColor: "#d54d4dff",
                      marginRight: "auto",
                    },
                  ]}
                  onPress={() => setSelectedItem(null)}
                >
                  <Text
                    style={[
                      styles.pixelText,
                      { fontStyle: "italic", color: "#ffffffff", fontSize: 8 },
                    ]}
                  >
                    Remove
                  </Text>
                </Button>
              )}
            </>
          )}
          {!selectedItem && (
            <>
              <Text
                style={[
                  styles.pixelText,
                  { fontStyle: "italic", color: "#555" },
                ]}
              >
                Select an Item
              </Text>
            </>
          )}
        </View>

        <View style={styles.gemDetailContainer}>
          {selectedGem && (
            <>
              <View style={[styles.inventorySlot]}>
                <Image
                  source={
                    selectedGem.item.category !== "Gem"
                      ? InventoryAssets?.[
                          selectedGem.item.category as InventoryCategoryEnum
                        ]?.[
                          selectedGem.item.name as keyof typeof InventoryAssets
                        ] ?? null
                      : GemAssets?.[selectedGem.item.name as GemNameEnum]
                  }
                  style={[styles.itemImg]}
                />
              </View>
              <>
                <Text style={[styles.pixelText, { fontSize: 12 }]}>
                  Rare:{" "}
                  <Text
                    style={[
                      styles.pixelText,
                      { fontSize: 12, color: "#7200afff" },
                    ]}
                  >
                    {(selectedGem.levelType ?? 0) +
                      (selectedGem.levelColor ?? 0)}
                  </Text>
                </Text>
              </>
              <Text style={[styles.pixelText, { fontSize: 12 }]}>
                LK:{" "}
                <Text
                  style={[
                    styles.pixelText,
                    { fontSize: 12, color: "#38d726ff" },
                  ]}
                >
                  {selectedGem.lucky}
                </Text>
              </Text>
              <View style={[{ marginLeft: 'auto' }]}>
                <Button
                  customStyle={[
                    {
                      flex: 1,
                      flexDirection: "row",
                      width: 60,
                      backgroundColor: "#d54d4dff",
                    },
                  ]}
                  onPress={() => setSelectedGem(null)}
                >
                  <Text
                    style={[
                      styles.pixelText,
                      { fontStyle: "italic", color: "#ffffffff", fontSize: 8 },
                    ]}
                  >
                    Remove
                  </Text>
                </Button>
              </View>
            </>
          )}
          {!selectedGem && (
            <>
              <Text
                style={[
                  styles.pixelText,
                  { fontStyle: "italic", color: "#555" },
                ]}
              >
                Select a Gem
              </Text>
            </>
          )}
        </View>

        <View style={[{ position: "absolute", left: 50, bottom: 70 }]}>
          <Button
            customStyle={[
              {
                flex: 1,
                flexDirection: "row",
                width: 200,
                backgroundColor:
                  selectedGem && selectedItem ? "#934dd5ff" : "#888888ff",
              },
            ]}
            onPress={postMosaic}
            disabled={!selectedGem || !selectedItem}
          >
            <Text
              style={[
                styles.pixelText,
                {
                  fontStyle: "italic",
                  color: "#ffffffff",
                  fontSize: 8,
                  lineHeight: 20,
                },
              ]}
            >
              Just make it shine!
            </Text>
          </Button>
        </View>
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
    backgroundColor: "#97b679ff",
    borderRadius: 15,
    width: width > height ? 340 : 650,
    top: 22,
    right: 50,
  },
  inventoryGem: {
    position: "absolute",
    backgroundColor: "#81a09eff",
    borderRadius: 15,
    width: width > height ? 340 : 650,
    top: 182,
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
    backgroundColor: "#97b679ff",
    borderRadius: 15,
    width: width > height ? 340 : 650,
    top: 100,
    left: 50,
    flex: 1,
    flexDirection: "row",
    padding: 7,
    alignItems: "center",
    minHeight: 66,
    gap: 5,
  },
  gemDetailContainer: {
    position: "absolute",
    backgroundColor: "#81a09eff",
    borderRadius: 15,
    width: width > height ? 340 : 650,
    top: 180,
    left: 50,
    flex: 1,
    flexDirection: "row",
    padding: 7,
    alignItems: "center",
    minHeight: 66,
    gap: 5,
  },
  list: {
    gap: 12,
    maxHeight: width > height ? 150 : 650,
    maxWidth: width > height ? 600 : 400,
    padding: 20,
  },
  itemImg: {
    width: 36,
    height: 36,
  },
});
