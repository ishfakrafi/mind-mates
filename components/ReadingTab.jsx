import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import tw from "tailwind-react-native-classnames";
import { loadThemeConfig, getThemeConfig } from "../app/themeConfig";
import { useFocusEffect } from "@react-navigation/native";
import axios from "axios";

// Constants for the translation API
const apiKey = "c4601f1be388488aa7433f305ff71533";
const apiRegion = "australiaeast";

// Translation cache to store translated texts
const translationCache = {};

// Define and export readings data
export const readingsData = [
  {
    key: "anxiety",
    title: "What is Anxiety?",
    tag: "Mental Health",
    source: "Mindful Living",
    imageUrl:
      "https://i2-prod.getsurrey.co.uk/incoming/article30240076.ece/ALTERNATES/s615/1_GettyImages-1403986369.jpg",
  },
  {
    key: "design2021",
    title: "My Creative Collection of 2021 Design",
    tag: "Design",
    source: "Laurance",
    imageUrl:
      "https://i2-prod.getsurrey.co.uk/incoming/article30240076.ece/ALTERNATES/s615/1_GettyImages-1403986369.jpg",
  },
  // Add more readings as needed
];

// Modified translateText function with caching
const translateText = async (text, language) => {
  if (language === "en") return text;

  // Check cache first
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

// Your existing ReadingTab component
const ReadingTab = ({
  setView,
  selectedLanguage,
  setSelectedTab,
  setSelectedPost,
}) => {
  const [theme, setTheme] = useState({
    colors: {},
    fontSizes: {},
    baseFontSize: 16,
  });
  const textSize = theme.baseFontSize || 16;
  const [readingsData, setReadingsData] = useState([]);

  const [translatedText, setTranslatedText] = useState({
    title: "Reading 1",
    time: "5min",
    description: "Understand your mental well-being with a brief overview.",
    close: "close",
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
  useEffect(() => {
    const loadTranslations = async () => {
      const newTranslatedText = {
        title:
          selectedLanguage === "en"
            ? "What is anxiety?"
            : await translateText("What is anxiety?", selectedLanguage),
        time:
          selectedLanguage === "en"
            ? "50min"
            : await translateText("5min", selectedLanguage),
        close:
          selectedLanguage === "en"
            ? "Close"
            : await translateText("Close", selectedLanguage),
        description: await translateText(
          "Understand your mental well-being with a brief overview.",
          selectedLanguage
        ),
      };
      setTranslatedText(newTranslatedText);
    };

    loadTranslations();
  }, [selectedLanguage]);

  useEffect(() => {
    const fetchReadings = async () => {
      try {
        const response = await axios.get(
          "https://mindmates.adventcom.co/wp-json/wp/v2/posts"
        );
        console.log("Raw WordPress Data:", response.data); // Log the raw data from WordPress API
        const posts = await Promise.all(
          response.data.map(async (post) => {
            // Extract category and source (tag) from `class_list`
            const categoryClass = post.class_list.find((cls) =>
              cls.startsWith("category-")
            );
            const tagClass = post.class_list.find((cls) =>
              cls.startsWith("tag-")
            );

            const category = categoryClass
              ? categoryClass.replace("category-", "")
              : "General";
            const source = tagClass
              ? tagClass.replace("tag-", "")
              : "WordPress Source";

            // Fetch the featured image URL if available
            let imageUrl = "https://via.placeholder.com/80"; // Default placeholder
            if (post.featured_media) {
              try {
                const mediaResponse = await axios.get(
                  `https://mindmates.adventcom.co/wp-json/wp/v2/media/${post.featured_media}`
                );
                imageUrl = mediaResponse.data.source_url || imageUrl;
              } catch (error) {
                console.error(
                  `Error fetching image for post ${post.id}:`,
                  error
                );
              }
            }

            return {
              key: post.id.toString(),
              title: post.title.rendered,
              tag: category,
              source: source,
              imageUrl: imageUrl,
              content: post.content.rendered,
            };
          })
        );

        setReadingsData(posts);
        console.log("Mapped Readings Data:", posts); // Log the mapped data structure for verification
      } catch (error) {
        console.error("Error fetching data from WordPress:", error);
      }
    };

    fetchReadings();
  }, []);

  return (
    <ScrollView vertical style={tw`flex pb-12 flex-col w-full`}>
      {/* Back Button */}

      <TouchableOpacity
        onPress={() => {
          setSelectedTab("Assessment"); // Set tab back to Assessment
          setView("default"); // Reset view to ExploreScreen
        }}
        style={tw`flex-row items-center p-4`}
      >
        <Text style={{ color: theme.colors.accent || "#6200EE" }}>
          {translatedText.close}
        </Text>
      </TouchableOpacity>
      {readingsData.map((reading) => (
        <TouchableOpacity
          key={reading.key}
          style={[
            tw`flex-row px-4 mx-4 pb-0 mb-4 rounded-xl`,
            { backgroundColor: theme.colors.background || "#FFFFFF" },
            {
              shadowColor: "#000",
              shadowOpacity: 0.8,
              shadowRadius: 1,
              elevation: 2,
            },
          ]}
          onPress={() => {
            setSelectedPost(reading); // Set the selected post data
            setView("READING1"); // Navigate to Reading1 view
          }} // Update this as per your navigation
        >
          {/* Image */}
          <Image
            source={{ uri: reading.imageUrl }}
            style={[{ width: 80, height: 80, borderRadius: 10 }]}
          />

          {/* Text Section */}
          <View style={tw`ml-4 flex-1`}>
            {/* Tag */}
            <Text
              style={[
                tw`text-xs font-semibold my-1`,
                { color: theme.colors.accent || "#888" },
              ]}
            >
              {reading.tag}
            </Text>

            {/* Title */}
            <Text
              style={[
                tw`text-lg font-bold mb-0`,
                { color: theme.colors.textPrimary || "#333" },
              ]}
            >
              {reading.title}
            </Text>

            {/* Source */}
            <Text
              style={[
                tw`text-sm mb-2`,
                { color: theme.colors.textSecondary || "#666" },
              ]}
            >
              {reading.source}
            </Text>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

export default ReadingTab;
