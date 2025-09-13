import rankIcons from "@/data-sources/rankIcons";
import { useEffect, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function LeaderboardScreen() {
  const backgroundImage = require("@/assets/background/banner-game-4.jpg");
  const backgroundPortrailImage = require("@/assets/background/banner-game-3.png");
  const [data, setData] = useState<any>([]);
  const getData = async () => {
    try {
      setData([
        { name: "Pham Phong", score: "24550034" },
        {
          name: "Pham Cao Hung",
          score: "24550015",
        },
      ]);
    } catch (error) {
      console.error(error);
    }
  };

  const renderItem = ({ item, index }: any) => {
    return (
      <>
        <View style={styles.rankItem}>
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
            <Image
              source={rankIcons[index < 17 ? index : 17]}
              style={[styles.rankImg]}
            />
          </View>
          <Text style={[styles.pixelText, { flex: 1 }]}>{item.name}</Text>
          <Text style={[styles.pixelText, { flex: 1 }]}>{item.score}</Text>
        </View>
      </>
    );
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <Image
        style={[
          width > height
            ? styles.backgroundImage
            : styles.backgroundPortrailImage,
        ]}
        source={width > height ? backgroundImage : backgroundPortrailImage}
        resizeMode="cover"
      ></Image>
      <View style={styles.container}>
        <View style={{ alignItems: "center", marginBottom: 15 }}>
          <Text style={[styles.pixelText, styles.title, { marginBottom: 15 }]}>
            Legend Board
          </Text>
          <View>
            <View
              style={[
                styles.rankItem,
                { marginBottom: 15, backgroundColor: "#c4c4c4ff" },
              ]}
            >
              <Text style={[{ flex: 1 }]}> </Text>
              <Text
                style={[
                  styles.pixelText,
                  { flex: 1, fontSize: 11, fontWeight: "bold" },
                ]}
              >
                Name
              </Text>
              <Text
                style={[
                  styles.pixelText,
                  { flex: 2, fontSize: 11, fontWeight: "bold" },
                ]}
              >
                Student ID
              </Text>
            </View>
            <FlatList
              data={data}
              renderItem={renderItem}
              keyExtractor={(item: any) => item.id}
              numColumns={1}
              contentContainerStyle={styles.list}
              scrollEnabled={true}
            />
          </View>
        </View>
      </View>
    </>
  );
}
const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    // backgroundColor: "#555",
  },
  board: {},
  pixelText: {
    fontFamily: "PressStart2P",
    textShadowColor: "rgba(93, 93, 93, 1)",
    textShadowOffset: { width: 0.7, height: 0.7 },
    textShadowRadius: 0.7,
  },
  title: {
    fontSize: 22,
    color: "#ff0000ff",
    textShadowColor: "#350000",
    textShadowOffset: { width: 4, height: 2 },
    textShadowRadius: 1,
  },
  rankItem: {
    flex: 1,
    flexDirection: "row",
    gap: 30,
    height: 50,
    backgroundColor: "#d0bb7eff",
    borderWidth: 2,
    borderStyle: "solid",
    borderColor: "#350000",
    padding: 5,
    borderRadius: 10,
    boxShadow: "#2e2816ff 3px 6px 2px",
    alignItems: "center",
  },
  rankImg: {
    width: 50,
    height: 50,
  },
  list: {
    gap: 12,
    maxHeight: width > height ? 250 : 650,
    maxWidth: width > height ? 600 : 400,
    paddingLeft: 5,
    paddingRight: 5,
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
