import React, { useState, useEffect, useContext } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import tw from "tailwind-react-native-classnames";
import { loadThemeConfig, getThemeConfig } from "../app/themeConfig";
import { useFocusEffect } from "@react-navigation/native";
import axios from "axios";
import { LanguageContext } from "../app/LanguageContext";
export const assessmentsData = [
  {
    key: "DASS21",
    title: "DASS 21",
    time: "5min",
    description:
      "Understand your mental  being with our quick, insightful assessment.",
    imageUrl:
      "https://plugins.coviu.com/coviu-psychology-assessment-plugin/2.1.1/DASS21.png", // Use a URL or local path if needed
  },
  // Add other assessments as needed
];
// Constants for the translation API
const apiKey = "c4601f1be388488aa7433f305ff71533";
const apiRegion = "australiaeast";

// Translation cache to store translated texts
const translationCache = {};

// Modified translateText function with caching
const translateText = async (text, language) => {
  if (language === "en") return text;

  // Check cache first
  if (translationCache[language] && translationCache[language][text]) {
    return translationCache[language][text];
  }

  // Proceed with translation if not in cache
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

    // Save to cache
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

const AssessmentTab = ({ setView, selectedLanguage, view }) => {
  const [theme, setTheme] = useState({
    colors: {},
    fontSizes: {},
    baseFontSize: 16,
  });
  const textSize = theme.baseFontSize || 16;
  const [translatedAssessments, setTranslatedAssessments] = useState({});

  const [translatedText, setTranslatedText] = useState({
    dassTitle: "DASS 21",
    time: "5min",
    description:
      "Understand your mental well being with our quick, insightful assessment.",
  });

  // Load theme
  useFocusEffect(
    React.useCallback(() => {
      const loadTheme = async () => {
        await loadThemeConfig();
        const config = getThemeConfig();
        setTheme(config || {});
      };
      loadTheme();
    }, [])
  );

  // Load translations based on selected language
  // Load translations for each assessment item
  useEffect(() => {
    const loadTranslations = async () => {
      const translations = {};
      await Promise.all(
        assessmentsData.map(async (assessment) => {
          translations[assessment.key] = {
            title:
              selectedLanguage === "en"
                ? assessment.title
                : await translateText(assessment.title, selectedLanguage),
            time:
              selectedLanguage === "en"
                ? assessment.time
                : await translateText(assessment.time, selectedLanguage),
            description:
              selectedLanguage === "en"
                ? assessment.description
                : await translateText(assessment.description, selectedLanguage),
          };
        })
      );
      setTranslatedAssessments(translations);
    };

    loadTranslations();
  }, [selectedLanguage]);

  return (
    <ScrollView vertical style={tw`flex flex-col w-full`}>
      {view === "DASS21" ? (
        <DASS21Screen selectedLanguage={selectedLanguage} />
      ) : (
        assessmentsData.map((assessment) => (
          <TouchableOpacity
            key={assessment.key}
            style={[
              tw`flex-row p-4 mb-4 items-center`,
              {
                backgroundColor: theme.colors.secondaryBackground || "#FFFFFF",
                borderRadius: 25,
              },
            ]}
            onPress={() => setView(assessment.key)}
          >
            <View style={tw`ml-4`}>
              <View style={tw`flex-row items-center`}>
                <Text
                  style={{
                    color: theme.colors.textPrimary || "black",
                    fontSize: textSize - 2,
                    fontWeight: "600",
                  }}
                >
                  {translatedAssessments[assessment.key]?.title ||
                    assessment.title}
                </Text>
                <View
                  style={{
                    width: 4,
                    height: 4,
                    backgroundColor: theme.colors.textPrimary || "black",
                    borderRadius: 2,
                    marginHorizontal: 8,
                  }}
                />
                <Text
                  style={{
                    color: theme.colors.textSecondary || "#666",
                    fontSize: textSize - 4,
                  }}
                >
                  {translatedAssessments[assessment.key]?.time ||
                    assessment.time}
                </Text>
              </View>
              <Text
                style={{
                  color: theme.colors.textSecondary || "#666",
                  fontSize: textSize - 4,
                  marginTop: 4,
                }}
              >
                {translatedAssessments[assessment.key]?.description ||
                  assessment.description}
              </Text>
            </View>
          </TouchableOpacity>
        ))
      )}
    </ScrollView>
  );
};

export default AssessmentTab;
