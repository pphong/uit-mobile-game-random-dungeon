import Button from "@/components/Button";
import Character from "@/components/Character";
import { IconSymbol } from "@/components/ui/IconSymbol";
import dungeonBackground from "@/data-sources/dungeonBackground";
import EntityInventory, {
  EntityName,
  EntityNameEnum,
} from "@/data-sources/entityInventory";
import { EntityStateEnum } from "@/data-sources/entityState";
import { router } from "expo-router";
import { useState } from "react";
import { Dimensions, Image, StyleSheet, Text, View } from "react-native";
const { width, height } = Dimensions.get("window");

export default function MainScreen() {
  const [heroState, setHeroState] = useState(EntityStateEnum.Idle);
  const [dungeon, setDungeon] = useState(5);

  const [power, setPower] = useState(100000);
  const [data, setData] = useState([]);

  const [hero, setHero] = useState<EntityNameEnum>(EntityNameEnum.hero);
  const [selectedHero, setSelectedHero] = useState<number>(0);

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

  const renderItem = ({ item, index }: any) => {
    return (
      <>
        <View style={styles.inventorySlot}>
          <View
            style={[
              {
                borderWidth: 3,
                borderStyle: "dashed",
                borderColor: "#840808ff",
                borderRadius: 30,
                padding: 5,
              },
            ]}
          >
            {/* <Image
              source={rankIcons[index < 17 ? index : 17]}
              style={[styles.rankImg]}
            /> */}
          </View>
          <Text style={[styles.pixelText, { flex: 1 }]}>{item.name}</Text>
          <Text style={[styles.pixelText, { flex: 1 }]}>{item.score}</Text>
        </View>
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
    opacity: 0.4
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
  inventory: {},
  inventorySlot: {},
  list: {
    gap: 12,
    maxHeight: width > height ? 250 : 650,
    maxWidth: width > height ? 600 : 400,
    paddingLeft: 5,
    paddingRight: 5,
  },
});
