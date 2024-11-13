import React, { useRef, useState, useEffect, useContext } from "react";
import { View, ScrollView, Text, Image, TouchableOpacity } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import SearchBar from "../../components/SearchBar";
import TopBar from "../src/TopBar";
import tw from "tailwind-react-native-classnames";
import AssessmentTab from "../../components/AssessmentTab";
import ActivityTab from "../../components/ActivityTab";
import ReadingTab from "../../components/ReadingTab";
import FaqTab from "../../components/FaqTab";
import DASS21Screen from "../../components/dass21Screen";
import Reading1 from "../../components/Reading1";
import { BoxBreathe } from "../../components/BoxBreathing";
import { useFocusEffect } from "@react-navigation/native";
import { loadThemeConfig, getThemeConfig } from "../themeConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { auth } from "../../components/firebase-config";
import axios from "axios";
import { LanguageContext } from "../LanguageContext";
import { UserContext } from "../UserContext";

const apiKey = "c4601f1be388488aa7433f305ff71533";
const apiRegion = "australiaeast";

// Function to translate text using Azure Translator API
const translateText = async (text, language) => {
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
    return response.data[0]?.translations[0]?.text || text;
  } catch (error) {
    console.error("Error translating text:", error);
    return text;
  }
};

export default function ExploreScreen() {
  const [selectedTab, setSelectedTab] = useState("Assessment");
  const [view, setView] = useState("default");

  const [userEmail, setUserEmail] = useState("");
  const { selectedLanguage, setSelectedLanguage } = useContext(LanguageContext);
  const [theme, setTheme] = useState({
    colors: {},
    fontSizes: {},
    baseFontSize: 16,
  });
  // Refs for each tab to scroll to the correct item
  const assessmentRef = useRef(null);
  const activityRef = useRef(null);
  const readingRef = useRef(null);
  const faqRef = useRef(null);
  const { user } = useContext(UserContext); // Access user details

  useEffect(() => {
    if (user) {
      console.log("User Email:", user.email);
      console.log("User Display Name:", user.displayName);
    } else {
      console.log("User data not available in Progress screen.");
    }
  }, [user]);

  // In ExploreScreen.js

  const handleSelectSuggestion = (item) => {
    if (item.id === "DASS21") {
      setSelectedTab("Assessment"); // Switch to the relevant tab if necessary
      setView("DASS21"); // Open the DASS21 component
    } else if (item.id === "Box Breathing") {
      setSelectedTab("Activity"); // Switch to the relevant tab if necessary
      setView("Box"); // Open the Box Breathing component
    } else if (item.id === "Reading1") {
      setSelectedTab("Reading"); // Switch to the Reading tab if necessary
      setView("Reading1"); // Open the Reading1 component
    } else if (item.id.startsWith("FAQ")) {
      setSelectedTab("Faq"); // Switch to the FAQ tab if necessary
      // You can add more logic here if needed to open specific FAQs
    }
  };

  const textSize = theme.baseFontSize || 16;
  const originalQuotes = [
    "Believe in yourself!",
    "You are stronger than you think.",
    "One step at a time.",
    "Progress, not perfection.",
    "Every day is a new beginning.",
  ];

  const [currentQuote, setCurrentQuote] = useState("");
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [typing, setTyping] = useState(true);
  const [translatedText, setTranslatedText] = useState({
    assessment: "Assessment",
    activity: "Activity",
    reading: "Reading",
    faq: "Faq",
    motivationalQuotes: originalQuotes,
    close: "Close",
    assessmentTitle: "Assessment: .DASS. 21",
    readingTitle: "Reading: What is anxiety?",
    boxTitle: "Activity: Box Breathing",
  });

  useEffect(() => {
    let typingInterval;
    let deleteInterval;

    if (
      typing &&
      currentQuote.length < translatedText.motivationalQuotes[quoteIndex].length
    ) {
      typingInterval = setInterval(() => {
        setCurrentQuote(
          (prev) =>
            prev + translatedText.motivationalQuotes[quoteIndex][prev.length]
        );
      }, 100);
    } else if (!typing && currentQuote.length > 0) {
      deleteInterval = setInterval(() => {
        setCurrentQuote((prev) => prev.slice(0, -1));
      }, 50);
    } else if (
      typing &&
      currentQuote.length ===
        translatedText.motivationalQuotes[quoteIndex].length
    ) {
      setTimeout(() => setTyping(false), 2000); // Pause before deleting
    } else if (!typing && currentQuote.length === 0) {
      setQuoteIndex(
        (prevIndex) =>
          (prevIndex + 1) % translatedText.motivationalQuotes.length
      ); // Move to next quote
      setTyping(true);
    }

    return () => {
      clearInterval(typingInterval);
      clearInterval(deleteInterval);
    };
  }, [typing, currentQuote, quoteIndex, translatedText]);

  useFocusEffect(
    React.useCallback(() => {
      const loadThemeAndUserFromCache = async () => {
        await loadThemeConfig();
        const config = getThemeConfig();
        setTheme(config || {});
      };

      loadThemeAndUserFromCache();
    }, [])
  );

  // Load translations whenever the language is changed
  useEffect(() => {
    const loadTranslations = async () => {
      const newTranslatedText = {
        assessment: await translateText("Assessment", selectedLanguage),
        activity: await translateText("Activity", selectedLanguage),
        reading: await translateText("Reading", selectedLanguage),
        faq: await translateText("Faq", selectedLanguage),
        close: await translateText("Close", selectedLanguage),
        assessmentTitle: await translateText(
          "Assessment: .DASS. 21",
          selectedLanguage
        ),
        boxTitle: await translateText(
          "Activity: Box Breathing",
          selectedLanguage
        ),
        readingTitle: await translateText(
          "Reading: What is anxiety?",
          selectedLanguage
        ),
      };

      const translatedQuotes = await Promise.all(
        originalQuotes.map((quote) => translateText(quote, selectedLanguage))
      );
      newTranslatedText.motivationalQuotes = translatedQuotes;

      setTranslatedText(newTranslatedText);
    };

    loadTranslations();
  }, [selectedLanguage]);

  const renderTabContent = () => {
    if (view === "DASS21") {
      return (
        <View style={tw`flex-1`}>
          <View
            style={[
              tw`flex-row justify-between p-8`,
              { backgroundColor: theme.colors.background || "#FFFFFF" },
            ]}
          >
            <Text
              style={[
                tw`font-bold`,
                {
                  fontSize: textSize + 2,
                  color: theme.colors.textPrimary || "#333",
                },
              ]}
            >
              {translatedText.assessmentTitle}
            </Text>
            <TouchableOpacity onPress={() => setView("default")}>
              <Text style={{ color: theme.colors.accent || "#6200EE" }}>
                {translatedText.close}
              </Text>
            </TouchableOpacity>
          </View>
          <DASS21Screen
            selectedLanguage={selectedLanguage}
            userEmail={userEmail}
          />
        </View>
      );
    }
    if (view === "READING1") {
      return (
        <View style={tw`flex-1`}>
          <View
            style={[
              tw`flex-row justify-between p-8`,
              { backgroundColor: theme.colors.background || "#FFFFFF" },
            ]}
          >
            <Text
              style={[
                tw`font-bold`,
                {
                  fontSize: textSize + 2,
                  color: theme.colors.textPrimary || "#333",
                },
              ]}
            >
              {translatedText.readingTitle}
            </Text>
            <TouchableOpacity onPress={() => setView("default")}>
              <Text style={{ color: theme.colors.accent || "#6200EE" }}>
                {translatedText.close}
              </Text>
            </TouchableOpacity>
          </View>
          <Reading1 selectedLanguage={selectedLanguage} />
        </View>
      );
    }
    if (view === "Box") {
      return (
        <View style={tw`flex-1`}>
          <View
            style={[
              tw`flex-row justify-between p-4`,
              { backgroundColor: theme.colors.background || "#FFFFFF" },
            ]}
          >
            <Text
              style={[
                tw`font-bold`,
                {
                  fontSize: textSize + 2,
                  color: theme.colors.textPrimary || "#333",
                },
              ]}
            >
              {translatedText.boxTitle}
            </Text>
            <TouchableOpacity onPress={() => setView("default")}>
              <Text style={{ color: theme.colors.accent || "#6200EE" }}>
                {translatedText.close}
              </Text>
            </TouchableOpacity>
          </View>
          <BoxBreathe />
        </View>
      );
    }

    switch (selectedTab) {
      case "Assessment":
        return (
          <AssessmentTab
            setView={setView}
            view={view}
            selectedLanguage={selectedLanguage}
            setSelectedLanguage={setSelectedLanguage}
          />
        );
      case "Activity":
        return (
          <ActivityTab
            setView={setView}
            selectedLanguage={selectedLanguage}
            setSelectedLanguage={setSelectedLanguage}
          />
        );
      case "Reading":
        return (
          <ReadingTab
            setView={setView}
            selectedLanguage={selectedLanguage}
            setSelectedLanguage={setSelectedLanguage}
          />
        );
      case "Faq":
        return (
          <FaqTab
            setView={setView}
            selectedLanguage={selectedLanguage}
            setSelectedLanguage={setSelectedLanguage}
          />
        );
      default:
        return <AssessmentTab setView={setView} />;
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ScrollView
        style={[
          tw`flex-1`,
          { backgroundColor: theme.colors.background || "#FFFFFF" },
        ]}
        contentContainerStyle={tw`flex-col`}
      >
        {view === "default" && (
          <>
            <TopBar
              firstName={user.displayName?.split(" ")[0]}
              selectedLanguage={selectedLanguage}
              setSelectedLanguage={setSelectedLanguage}
            />
            <SearchBar onSelectSuggestion={handleSelectSuggestion} />

            <View
              style={[
                tw`flex flex-row w-full mt-8 items-start justify-end px-6 py-2`,
                {
                  backgroundColor: "#fcdae8" || "#fcdae8",
                  borderRadius: 30,
                },
              ]}
            >
              <Image
                source={require("../../assets/images/Sitting.png")}
                style={[{ marginTop: -20 }]}
              />

              <View style={[tw`p-4`, { width: 180, alignSelf: "flex-start" }]}>
                <Text
                  style={{
                    color: "#2C2C2E" || "#333",
                    fontSize: textSize,
                    textAlign: "center",
                  }}
                  numberOfLines={3} // Limit to 3 lines to avoid overflow
                >
                  {currentQuote ||
                    translatedText.motivationalQuotes[quoteIndex]}
                </Text>
              </View>
            </View>

            <View style={tw`flex flex-col w-full items-start justify-end`}>
              <View
                style={tw`flex flex-row w-full items-center justify-around p-4`}
              >
                {["Assessment", "Activity", "Reading", "Faq"].map(
                  (tab, index) => (
                    <TouchableOpacity
                      key={tab}
                      style={[
                        tw`h-8 px-4 rounded-xl items-center justify-center`,
                        selectedTab === tab
                          ? {
                              backgroundColor: theme.colors.accent || "#ac7afd",
                            }
                          : {
                              backgroundColor:
                                theme.colors.background || "#f0f0f0",
                            },
                      ]}
                      onPress={() => setSelectedTab(tab)}
                    >
                      <Text
                        style={[
                          tw`text-xs font-semibold`,
                          {
                            color:
                              selectedTab === tab
                                ? theme.colors.cswhite
                                : theme.colors.textSecondary,
                          },
                        ]}
                      >
                        {translatedText[tab.toLowerCase()]}
                      </Text>
                    </TouchableOpacity>
                  )
                )}
              </View>
            </View>
          </>
        )}
        {renderTabContent()}
      </ScrollView>
    </GestureHandlerRootView>
  );
}
