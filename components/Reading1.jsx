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

const Reading1 = ({ selectedLanguage }) => {
  const [theme, setTheme] = useState({
    colors: {},
    fontSizes: {},
    baseFontSize: 16,
  });
  const textSize = theme.baseFontSize || 16;

  const [translatedText, setTranslatedText] = useState({
    title: "Mental Health Awareness",
    description:
      "Discover the importance of mental health and how it impacts every aspect of life.",
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
              ? "Mental Health Awareness"
              : await translateText(
                  "Mental Health Awareness",
                  selectedLanguage
                ),
          description: await translateText(
            "Discover the importance of mental health and how it impacts every aspect of life.",
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
    const url = "https://www.beyondblue.org.au/";
    Linking.openURL(url);
  };

  return (
    <ScrollView
      contentContainerStyle={[
        tw`p-4`,
        { backgroundColor: theme.colors.background || "#FFF" },
      ]}
    >
      <View style={styles.container}>
        {/* Image */}
        <Image
          source={{
            uri: "https://www.beyondblue.org.au/images/default-source/mental-health-awareness.jpg",
          }}
          style={styles.image}
        />

        {/* Logo */}
        <Image
          source={{
            uri: "https://www.beyondblue.org.au/images/default-source/logo.png",
          }}
          style={styles.logo}
        />

        {/* Title */}
        <Text
          style={[
            styles.title,
            {
              color: theme.colors.textPrimary || "black",
              fontSize: textSize + 4,
            },
          ]}
        >
          {translatedText.title}
        </Text>

        {/* Description */}
        <Text
          style={[
            styles.description,
            { color: theme.colors.textSecondary || "gray", fontSize: textSize },
          ]}
        >
          {translatedText.description}
        </Text>

        {/* Button */}
        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: theme.colors.accent || "#6200EE" },
          ]}
          onPress={openResource}
        >
          <Text
            style={{
              color: theme.colors.cswhite || "#FFF",
              fontSize: textSize,
            }}
          >
            {translatedText.button}
          </Text>
        </TouchableOpacity>
      </View>
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
    textAlign: "center",
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
