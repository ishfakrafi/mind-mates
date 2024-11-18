import React, { useRef, useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import tw from "tailwind-react-native-classnames";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import TopBar from "../src/TopBar";
import { useFocusEffect } from "@react-navigation/native";
import MoodChart from "../MoodChart";
import { loadThemeConfig, getThemeConfig } from "../themeConfig";
import { auth } from "../../components/firebase-config";
import axios from "axios";
import { assessmentsData } from "../../components/AssessmentTab";
import { activitiesData } from "../../components/ActivityTab";
import { readingsData } from "../../components/ReadingTab";
import DASS21Screen from "../../components/dass21Screen";
import { BoxBreathe } from "../../components/BoxBreathing";
import Reading1 from "../../components/Reading1";
import { LanguageContext } from "../LanguageContext";
import { UserContext } from "../UserContext";

const apiKey = "c4601f1be388488aa7433f305ff71533";
const apiRegion = "australiaeast";

export default function Home() {
  const router = useRouter();

  const { selectedLanguage, setSelectedLanguage } = useContext(LanguageContext);
  const [theme, setTheme] = useState({
    colors: {},
    fontSizes: {},
    baseFontSize: 16,
  });
  const [selectedAssessment, setSelectedAssessment] = useState(null);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [selectedReading, setSelectedReading] = useState(null);
  const textSize = theme.baseFontSize || 16;
  const [view, setView] = useState("home");
  const [translatedAssessments, setTranslatedAssessments] = useState([]);
  const [translatedActivities, setTranslatedActivities] = useState([]);
  const [translatedReadings, setTranslatedReadings] = useState([]);
  const { user } = useContext(UserContext); // Access user details

  useEffect(() => {
    if (user) {
      console.log("User Email:", user.email);
      console.log("User Display Name:", user.displayName);
    } else {
      console.log("User data not available in Progress screen.");
    }
  }, [user]);

  const [translatedText, setTranslatedText] = useState({
    weeklyProgress: "Your Weekly Progress",
    moodPrompt: "How are you feeling today?",
    assessmentsTitle: "Assessments For You",
    exercisesTitle: "Try an Exercise",
    readingsTitle: "Explore Readings",
  });
  const translateTitles = async (items, language) => {
    return await Promise.all(
      items.map(async (item) => {
        if (language === "en" && item.title.includes("DASS")) {
          return { ...item, translatedTitle: item.title };
        }
        const response = await axios.post(
          `https://api.cognitive.microsofttranslator.com/translate?api-version=3.0&to=${language}`,
          [{ text: item.title }],
          {
            headers: {
              "Ocp-Apim-Subscription-Key": apiKey,
              "Ocp-Apim-Subscription-Region": apiRegion,
              "Content-Type": "application/json",
            },
          }
        );
        return {
          ...item,
          translatedTitle:
            response.data[0]?.translations[0]?.text || item.title,
        };
      })
    );
  };
  useEffect(() => {
    const translateAllTitles = async () => {
      const translatedAssessments = await translateTitles(
        assessmentsData,
        selectedLanguage
      );
      const translatedActivities = await translateTitles(
        activitiesData,
        selectedLanguage
      );
      const translatedReadings = await translateTitles(
        readingsData,
        selectedLanguage
      );

      setTranslatedAssessments(translatedAssessments);
      setTranslatedActivities(translatedActivities);
      setTranslatedReadings(translatedReadings);
    };

    translateAllTitles();
  }, [selectedLanguage]);

  const translateText = async (text) => {
    if (selectedLanguage === "en") return text;
    try {
      const response = await axios.post(
        `https://api.cognitive.microsofttranslator.com/translate?api-version=3.0&to=${selectedLanguage}`,
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

  useEffect(() => {
    const loadTranslations = async () => {
      const newTranslatedText = {
        weeklyProgress: await translateText("Your Weekly Progress"),
        moodPrompt: await translateText("How are you feeling today?"),
        assessmentsTitle: await translateText("Assessments For You"),
        exercisesTitle: await translateText("Try an Exercise"),
        readingsTitle: await translateText("Explore Readings"),
      };
      setTranslatedText(newTranslatedText);
    };
    loadTranslations();
  }, [selectedLanguage]);

  useFocusEffect(
    React.useCallback(() => {
      const loadThemeAndUser = async () => {
        await loadThemeConfig();
        const config = getThemeConfig();
        setTheme(config || {});
      };
      loadThemeAndUser();
    }, [])
  );
  const handleSelectReading = (reading) => {
    setSelectedReading(reading);
    setView("readingDetail");
  };
  const handleSelectAssessment = (assessment) => {
    setSelectedAssessment(assessment);
    setView("assessmentDetail");
  };
  const handleSelectActivity = (activity) => {
    setSelectedActivity(activity);
    setView("activityDetail");
  };
  const navigateToPage = (page) => {
    router.push(page);
  };
  const handleMoodPress = (mood) => {
    router.push({
      pathname: "/MoodDetail",
      params: { mood, userEmail: user.email },
    });
  };
  const moods = [
    { icon: "sad-outline", label: "Very Bad", color: "#8B0000" },
    { icon: "sad", label: "Bad", color: "#FF4500" },
    { icon: "ellipse-outline", label: "Neutral", color: "#FFD700" },
    { icon: "happy-outline", label: "Good", color: "#9ACD32" },
    { icon: "happy", label: "Very Good", color: "#006400" },
  ];

  return (
    <ScrollView
      style={[
        tw`flex-1 p-4 py-8`,
        { backgroundColor: theme.colors.background || "#F5F5F5" },
      ]}
    >
      <TopBar
        firstName={user?.displayName?.split(" ")[0] || "Guest"} // Fallback to "Guest" if user is not yet loaded
        selectedLanguage={selectedLanguage}
        setSelectedLanguage={setSelectedLanguage}
      />

      {view === "home" && (
        <>
          <View
            style={[
              tw`flex p-4 rounded-2xl`,
              {
                backgroundColor: theme.colors.background || "#f0f0f0",
                borderBottomWidth: 2,
                borderBottomColor: theme.colors.divider,
              },
            ]}
          >
            <Text
              style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}
            >
              {translatedText.weeklyProgress}
            </Text>
            <TouchableOpacity
              style={[styles.chartContainer, { alignItems: "flex-start" }]}
              onPress={() => router.push("/progress")}
            >
              <View style={{ alignSelf: "flex-start" }}>
                <MoodChart
                  userEmail={user?.email || "guestemail"}
                  style={{ position: "relative", left: -10 }}
                />
              </View>
            </TouchableOpacity>
          </View>

          <View
            style={[
              tw`flex py-4 px-0  rounded-2xl`,
              {
                backgroundColor: theme.colors.background || "#f0f0f0",
                borderBottomWidth: 2,
                borderBottomColor: theme.colors.divider,
              },
            ]}
          >
            <Text
              style={[
                tw`px-4`,
                styles.sectionTitle,
                { color: theme.colors.textPrimary, fontSize: textSize + 4 },
              ]}
            >
              {translatedText.moodPrompt}
            </Text>
            <View>
              <TouchableOpacity
                onPress={() => handleMoodPress("Happy")}
                style={{
                  paddingVertical: 10,
                  paddingHorizontal: 0,
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    flexWrap: "wrap",
                    justifyContent: "flex-start",
                  }}
                >
                  {moods.map((mood, index) => (
                    <View
                      key={index}
                      style={{
                        marginHorizontal: 5,
                        alignItems: "center",
                        width: "15%",
                      }}
                    >
                      <Ionicons name={mood.icon} size={50} color={mood.color} />
                      <Text
                        style={[
                          tw`text-center mt-2 text-sm font-semibold`,
                          { color: mood.color },
                        ]}
                      >
                        {mood.label}
                      </Text>
                    </View>
                  ))}
                </View>
              </TouchableOpacity>
            </View>
          </View>

          <View
            style={[
              tw`flex p-4 rounded-2xl`,
              {
                backgroundColor: theme.colors.background || "#f0f0f0",
                borderBottomWidth: 2,
                borderBottomColor: theme.colors.divider,
              },
            ]}
          >
            <Text
              style={[
                styles.sectionTitle,
                { color: theme.colors.textPrimary, fontSize: textSize + 4 },
              ]}
            >
              {translatedText.assessmentsTitle}
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {translatedAssessments.map((assessment) => (
                <TouchableOpacity
                  key={assessment.key}
                  style={styles.itemContainer}
                  onPress={() => handleSelectAssessment(assessment)}
                >
                  <Image
                    source={{ uri: assessment.imageUrl }}
                    style={styles.itemImage}
                  />
                  <Text
                    style={{
                      fontSize: textSize,
                      color: theme.colors.textSecondary,
                    }}
                  >
                    {assessment.translatedTitle}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View
            style={[
              tw`flex p-4  rounded-2xl`,
              {
                backgroundColor: theme.colors.background || "#f0f0f0",
                borderBottomWidth: 2,
                borderBottomColor: theme.colors.divider,
              },
            ]}
          >
            <Text
              style={[
                styles.sectionTitle,
                { color: theme.colors.textPrimary, fontSize: textSize + 4 },
              ]}
            >
              {translatedText.exercisesTitle}
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {translatedActivities.map((activity) => (
                <TouchableOpacity
                  key={activity.key}
                  style={styles.itemContainer}
                  onPress={() => handleSelectActivity(activity)}
                >
                  <Image
                    source={{ uri: activity.imageUrl }}
                    style={styles.itemImage}
                  />
                  <Text
                    style={{
                      fontSize: textSize,
                      color: theme.colors.textSecondary,
                    }}
                  >
                    {activity.translatedTitle}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View
            style={[
              tw`flex p-4  rounded-2xl`,
              {
                backgroundColor: theme.colors.background || "#f0f0f0",
                borderBottomWidth: 1,
                borderBottomColor: theme.colors.divider,
              },
            ]}
          >
            <Text
              style={[
                styles.sectionTitle,
                { color: theme.colors.textPrimary, fontSize: textSize + 4 },
              ]}
            >
              {translatedText.readingsTitle}
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {translatedReadings.map((reading) => (
                <TouchableOpacity
                  key={reading.key}
                  style={styles.itemContainer}
                  onPress={() => handleSelectReading(reading)}
                >
                  <Image
                    source={{ uri: reading.imageUrl }}
                    style={styles.itemImage}
                  />
                  <Text
                    style={{
                      fontSize: textSize,
                      color: theme.colors.textSecondary,
                    }}
                  >
                    {reading.translatedTitle}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </>
      )}
      {view === "assessmentDetail" && selectedAssessment && (
        <View>
          <TouchableOpacity onPress={() => setView("home")}>
            <Text style={tw`text-blue-500`}>Back</Text>
          </TouchableOpacity>
          <Text style={tw`text-lg font-bold`}>{selectedAssessment.title}</Text>
          <DASS21Screen selectedLanguage={selectedLanguage} />
        </View>
      )}
      {view === "activityDetail" && selectedActivity && (
        <View>
          <TouchableOpacity onPress={() => setView("home")}>
            <Text style={tw`text-blue-500`}>Back</Text>
          </TouchableOpacity>
          <Text style={tw`text-lg font-bold`}>{selectedActivity.title}</Text>
          <BoxBreathe selectedLanguage={selectedLanguage} />
        </View>
      )}
      {view === "readingDetail" && selectedReading && (
        <View>
          <TouchableOpacity onPress={() => setView("home")}>
            <Text style={tw`text-blue-500`}>Back</Text>
          </TouchableOpacity>
          <Text style={tw`text-lg font-bold`}>{selectedReading.title}</Text>
          <Reading1 selectedLanguage={selectedLanguage} />
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginVertical: 10,
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  chartContainer: {
    borderRadius: 20,
    overflow: "hidden",
    height: 150,
    backgroundColor: "#E0F7FA",
    justifyContent: "center",
  },
  itemContainer: {
    width: 80,
    marginRight: 16,
    alignItems: "center",
  },
  itemImage: {
    width: 70,
    height: 70,
    borderRadius: 8,
    marginBottom: 4,
  },
  itemText: {
    fontSize: 12,
    textAlign: "center",
  },
});
