import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Linking,
} from "react-native";
import tw from "tailwind-react-native-classnames";
import { loadThemeConfig, getThemeConfig } from "../app/themeConfig";
import { useFocusEffect } from "@react-navigation/native";
import axios from "axios";
import RenderHtml from "react-native-render-html";

// Constants for the translation API and caching
const apiKey = "c4601f1be388488aa7433f305ff71533";
const apiRegion = "australiaeast";
const translationCache = {};

const translateText = async (text, language) => {
  if (language === "en") return text;

  if (translationCache[language] && translationCache[language][text]) {
    return translationCache[language][text];
  }

  try {
    const response = await axios.post(
      `https://api.cognitive.microsofttranslator.com/translate?api-version=3.0&to=${language}`,
      [{ text }],
      {
        headers: {
          "Ocp-Apim-Subscription-Key": apiKey,
          "Ocp-Apim-Subscription-Region": apiRegion,
          "Content-Type": "application/json",
        },
      }
    );

    const translatedText = response.data[0]?.translations[0]?.text || text;

    if (!translationCache[language]) {
      translationCache[language] = {};
    }
    translationCache[language][text] = translatedText;

    return translatedText;
  } catch (error) {
    console.error("Error translating text:", error);
    return text;
  }
};

const Reading1 = ({ post, selectedLanguage }) => {
  if (!post) return null;
  console.log("Final Post Data in Reading1:", post);
  console.log("HTML Content to Render:", post.content);
  const [theme, setTheme] = useState({
    colors: {},
    fontSizes: {},
    baseFontSize: 16,
  });
  const textSize = theme.baseFontSize || 16;

  const [translatedText, setTranslatedText] = useState({
    title: "What is Anxiety?",
    description:
      "Anxiety is more than just stress or worry. It's a persistent feeling of unease that doesn’t go away and may affect daily life.\nAnxiety is common in Australia, affecting 1 in 4 people at some stage in their lives.\nSigns and Symptoms of Anxiety\nCommon symptoms include:\nPersistent worry\nDifficulty calming down\nFatigue, muscle tension, sleep issues\nTrouble concentrating\nThese symptoms develop over time and can make it challenging to cope.",

    button: "Read More",
  });

  useFocusEffect(
    React.useCallback(() => {
      const loadThemeAndTranslations = async () => {
        await loadThemeConfig();
        const config = getThemeConfig();
        setTheme(config || {});

        const newTranslatedText = {
          title:
            selectedLanguage === "en"
              ? "What is Anxiety?"
              : await translateText("What is Anxiety?", selectedLanguage),
          description: await translateText(
            "What is Anxiety?\nAnxiety is more than just stress or worry. It's a persistent feeling of unease that doesn’t go away and may affect daily life.\nAnxiety is common in Australia, affecting 1 in 4 people at some stage in their lives.\nSigns and Symptoms of Anxiety\nCommon symptoms include:\nPersistent worry\nDifficulty calming down\nFatigue, muscle tension, sleep issues\nTrouble concentrating\nThese symptoms develop over time and can make it challenging to cope.",
            selectedLanguage
          ),
          button: await translateText("Read More", selectedLanguage),
        };

        setTranslatedText(newTranslatedText);
      };

      loadThemeAndTranslations();
    }, [selectedLanguage])
  );

  const openResource = () => {
    const url = "https://www.beyondblue.org.au/mental-health/anxiety";
    Linking.openURL(url);
  };

  return (
    <ScrollView style={tw`p-4 pb-12`}>
      {/* Title */}
      <Text style={[tw`text-2xl font-bold mb-2`, { color: "#333" }]}>
        {post.title}
      </Text>

      {/* Tag */}
      <Text style={[tw`text-sm font-semibold mb-4`, { color: "#888" }]}>
        {post.tag}
      </Text>

      {/* Image */}
      {post.imageUrl && (
        <Image
          source={{ uri: post.imageUrl }}
          style={[{ width: "100%", height: 200, borderRadius: 10 }, tw`mb-4`]}
          resizeMode="cover"
        />
      )}

      {/* Source */}
      <Text style={[tw`text-sm mb-4`, { color: "#888" }]}>
        Source: {post.source}
      </Text>

      {/* Content */}
      <RenderHtml
        contentWidth={400} // Adjust based on screen width
        source={{ html: post.content }}
        tagsStyles={{
          p: { marginBottom: 10, color: "#333", fontSize: 16 },
          ul: { paddingLeft: 20, marginBottom: 10 },
          li: { marginBottom: 5, fontSize: 16, color: "#333" },
          a: { color: "#1E90FF", textDecorationLine: "underline" },
        }}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    padding: 20,
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  logo: {
    width: 80,
    height: 80,
    resizeMode: "contain",
    marginBottom: 20,
  },
  title: {
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  description: {
    textAlign: "left",
    marginBottom: 20,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: "center",
  },
});

export default Reading1;
