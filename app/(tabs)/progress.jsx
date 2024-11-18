import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Modal,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Ionicons } from "@expo/vector-icons";
import MoodChart from "../MoodChart";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import tw from "tailwind-react-native-classnames";
import TopBar from "../src/TopBar";
import dayjs from "dayjs";
import { loadThemeConfig, getThemeConfig } from "../themeConfig";
import { auth } from "../../components/firebase-config";
import axios from "axios";
import { db } from "../../components/firebase-config"; // Adjust the path based on your project structure
import { collection, query, where, getDocs } from "firebase/firestore"; // Import Firestore functions
import AsyncStorage from "@react-native-async-storage/async-storage";
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
const screenWidth = Dimensions.get("window").width;

export default function Progress() {
  const [selectedPeriod, setSelectedPeriod] = useState("Week");
  const router = useRouter();
  const [firstName, setFirstName] = useState("Users");
  const [topMoods, setTopMoods] = useState([]);
  const [moodSummary, setMoodSummary] = useState([]);

  const [moodHistory, setMoodHistory] = useState([]);
  const [dass21Results, setDass21Results] = useState([]);
  const { selectedLanguage, setSelectedLanguage } = useContext(LanguageContext);
  const [activityCount, setActivityCount] = useState(0);
  const [improvementText, setImprovementText] = useState("Not enough data.");
  const [improvementColor, setImprovementColor] = useState("#D3D3D3"); // Grey for no data
  const [theme, setTheme] = useState({
    colors: {},
    fontSizes: {},
    baseFontSize: 16,
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const textSize = theme.baseFontSize || 16;
  const [loading, setLoading] = useState(true);
  const [translatedText, setTranslatedText] = useState({
    moodChartTitle: "Mood Chart",
    selectMonth: "Select Month",
    dass21Results: "DASS21 Results",
    moodHistory: "Mood History",
    noData: "No data available",
    depression: "Depression",
    anxiety: "anxiety",
    stress: "stress",
  });
  // In your existing useFocusEffect:
  const { user } = useContext(UserContext); // Access user details

  useEffect(() => {
    if (user) {
      console.log("User Email:", user.email);
      console.log("User Display Name:", user.displayName);
    } else {
      console.log("User data not available in Progress screen.");
    }
  }, [user]);
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

  useEffect(() => {
    const fetchMoodHistory = async () => {
      try {
        const q = query(
          collection(db, "moodEntries"),
          where("userId", "==", user.email)
        );
        const querySnapshot = await getDocs(q);
        const moodEntries = await Promise.all(
          querySnapshot.docs.map(async (doc) => {
            const data = doc.data();
            return {
              ...data,
              mood1: data.mood,
              mood: await translateText(data.mood, selectedLanguage),
              reasons: await Promise.all(
                data.reasons.map((reason) =>
                  translateText(reason, selectedLanguage)
                )
              ),
              journal: await translateText(data.journal, selectedLanguage),

              id: doc.id,
            };
          })
        );
        setMoodHistory(moodEntries);
        console.log(moodEntries);
        calculateTopMoodsAndImprovement(moodEntries);
      } catch (error) {
        console.error("Error fetching mood history: ", error);
      }
    };

    const fetchDass21Results = async () => {
      try {
        const q = query(
          collection(db, "assessments"),
          where("userId", "==", user.email)
        );
        const querySnapshot = await getDocs(q);
        const dass21Entries = await Promise.all(
          querySnapshot.docs.map(async (doc) => {
            const data = doc.data();

            const depressionEnglish = data.assessmentData.depression;
            const anxietyEnglish = data.assessmentData.anxiety;
            const stressEnglish = data.assessmentData.stress;

            return {
              ...data,
              assessmentData: {
                ...data.assessmentData,
                depression: [
                  depressionEnglish,
                  await translateText(depressionEnglish, selectedLanguage),
                ],
                anxiety: [
                  anxietyEnglish,
                  await translateText(anxietyEnglish, selectedLanguage),
                ],
                stress: [
                  stressEnglish,
                  await translateText(stressEnglish, selectedLanguage),
                ],
              },
              id: doc.id,
            };
          })
        );

        setDass21Results(dass21Entries);
        console.log("DASS21 Entries with Tuples:", dass21Entries);
        console.log("DASS21", dass21Entries);
      } catch (error) {
        console.error("Error fetching DASS21 results: ", error);
      }
    };

    if (user.email) {
      fetchMoodHistory();
      fetchDass21Results();
    }
  }, [user.email, selectedLanguage]);
  useEffect(() => {
    const loadUITranslations = async () => {
      const translations = {
        moodChartTitle: await translateText("Mood Chart", selectedLanguage),
        selectMonth: await translateText("Select Month", selectedLanguage),
        dass21Results: await translateText("DASS21 Results", selectedLanguage),
        moodHistory: await translateText("Mood History", selectedLanguage),
        noData: await translateText("No data available", selectedLanguage),
      };
      setTranslatedText(translations);
    };

    loadUITranslations();
  }, [selectedLanguage]);
  const calculateTopMoodsAndImprovement = (moodEntries) => {
    const moodCounts = moodEntries.reduce((acc, entry) => {
      acc[entry.mood] = (acc[entry.mood] || 0) + 1;
      return acc;
    }, {});

    const sortedMoods = Object.entries(moodCounts)
      .sort(([, a], [, b]) => b - a) // Sort by count
      .slice(0, 2); // Get top 2 moods
    console.log("Top Moods:", sortedMoods);

    setTopMoods(sortedMoods);

    // Calculate improvement logic (example)
    const currentWeekMoods = moodEntries.filter((entry) => {
      return dayjs(entry.date).isSame(dayjs(), "week");
    });

    const lastWeekMoods = moodEntries.filter((entry) => {
      return dayjs(entry.date).isSame(dayjs().subtract(1, "week"), "week");
    });

    const currentWeekAverage = currentWeekMoods.length
      ? currentWeekMoods.reduce((acc, entry) => acc + entry.moodValue, 0) /
        currentWeekMoods.length
      : 0;

    const lastWeekAverage = lastWeekMoods.length
      ? lastWeekMoods.reduce((acc, entry) => acc + entry.moodValue, 0) /
        lastWeekMoods.length
      : 0;

    if (currentWeekAverage > lastWeekAverage) {
      setImprovementText("Improvement");
      setImprovementColor("#9ACD32"); // Green
    } else if (currentWeekAverage < lastWeekAverage) {
      setImprovementText("Decline");
      setImprovementColor("#FF4500"); // Red
    } else {
      setImprovementText("No change");
      setImprovementColor("#808080"); // Yellow
    }

    // Update UI for top moods
    setMoodSummary([
      {
        label: topMoods[0][0], // Top mood name
        percentage: `${((topMoods[0][1] / moodEntries.length) * 100).toFixed(
          2
        )}%`,
        color: moodColors[topMoods[0][0]],
      },
      {
        label: topMoods[1][0], // Second top mood name
        percentage: `${((topMoods[1][1] / moodEntries.length) * 100).toFixed(
          2
        )}%`,
        color: moodColors[topMoods[1][0]],
      },
      {
        label: activityCount,
        description: "Activity Completed",
        color: "#6200EE", // Brand color for activity
      },
      {
        label: improvementText,
        description: "Positive changes noticed.",
        color: improvementColor,
      },
    ]);

    console.log("Top Moods:", topMoods);
    // Use topMoods to update the relevant state or UI
  };

  // State for date picker
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const moodColors = {
    "Very Bad": "#8B0000", // Dark Red
    Bad: "#FF4500", // Orange Red
    Neutral: "#FFD700", // Gold
    Good: "#9ACD32", // Yellow Green
    "Very Good": "#006400", // Dark Green
  };

  // Sample data

  const severityColors = {
    Normal: { icon: "ellipse", color: "green" },
    Mild: { icon: "ellipse", color: "yellow" },
    Moderate: { icon: "ellipse", color: "orange" },
    Severe: { icon: "ellipse", color: "red" },
    "Extremely Severe": { icon: "ellipse", color: "darkred" },
  };

  // Filtered results based on selected date
  const filteredDass21Results = dass21Results.filter((entry) =>
    dayjs(entry.date).isSame(selectedDate, "month")
  );

  const filteredMoodHistory = moodHistory.filter((entry) =>
    dayjs(entry.date).isSame(selectedDate, "month")
  );
  const sortedMoodHistory = filteredMoodHistory.sort((b, a) => {
    return a.timestamp.seconds - b.timestamp.seconds;
  });

  useEffect(() => {
    setSelectedDate(dayjs());
  }, []);

  const handleDateChange = (month, year) => {
    setSelectedDate(dayjs(`${year}-${month + 1}-01`));
  };
  console.log("Mood History to Render:", moodHistory);
  return (
    <ScrollView
      style={[
        tw`flex-1  pb-16 py-8`,
        { backgroundColor: theme.colors.background || "#FFFFFF" },
      ]}
    >
      <TopBar
        firstName={user.displayName?.split(" ")[0]}
        selectedLanguage={selectedLanguage}
        setSelectedLanguage={setSelectedLanguage}
      />

      {/* Profile Greeting */}

      <Text
        style={[
          tw`text-lg font-bold px-4 my-2`,
          (style = {
            fontSize: textSize,
            fontWeight: "bold",
            color: theme.colors.heading,
          }),
        ]}
      >
        {translatedText.moodChartTitle}
      </Text>

      {/* Mood Chart */}
      <MoodChart userEmail={user.email} />
      {/*
      {/* Tabs for Monthly/Weekly //
      <View style={tw`flex-row my-4 px-4`}>
        {["Week", "Month"].map((period) => (
          <TouchableOpacity
            key={period}
            onPress={() => setSelectedPeriod(period)}
            style={[
              tw`flex-1 py-1 border-2`,
              {
                borderColor: selectedPeriod === period ? "#6200EE" : "#EAEAEA",
                backgroundColor:
                  selectedPeriod === period ? "#6200EE" : "#EAEAEA",
              },
            ]}
          >
            
            <Text
              style={[
                tw`text-center text-lg font-bold`,
                {
                  color: selectedPeriod === period ? "#FFFFFF" : "#333",
                },
              ]}
            >
              {period}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Mood Summary Cards - 2x2 Grid //
      <View style={tw`flex-row flex-wrap justify-between p-4`}>
        {moodSummary.map((summary, index) => (
          <View
            key={index}
            style={[
              tw` m-2 rounded-lg p-4`,
              { backgroundColor: summary.color, height: 120, width: "45%" }, // Adjust width to fit 2 cards in a row with some margin
            ]}
          >
            <Text style={tw`text-lg font-bold`}>{summary.percentage}</Text>
            <Text>{summary.label}</Text>
            {summary.description && <Text>{summary.description}</Text>}
          </View>
        ))}
      </View>
      {/* Date Picker */}
      <View style={tw`p-4`}>
        <Text
          style={[
            tw`text-lg font-bold`,
            (style = {
              fontSize: textSize,
              fontWeight: "bold",
              color: theme.colors.heading,
            }),
          ]}
        >
          {translatedText.selectMonth}
        </Text>
        <View style={tw`flex-row mt-2`}>
          <Picker
            selectedValue={selectedDate.month()}
            style={{ flex: 1, color: theme.colors.heading }}
            onValueChange={(itemValue) =>
              handleDateChange(itemValue, selectedDate.year())
            }
          >
            {Array.from({ length: 12 }, (_, i) => (
              <Picker.Item
                label={dayjs().month(i).format("MMMM")}
                value={i}
                key={i}
              />
            ))}
          </Picker>
          <Picker
            selectedValue={selectedDate.year()}
            style={{ flex: 1, color: theme.colors.heading }}
            onValueChange={(itemValue) =>
              handleDateChange(selectedDate.month(), itemValue)
            }
          >
            {Array.from({ length: 5 }, (_, i) => (
              <Picker.Item
                label={`${dayjs().year() - i}`}
                value={dayjs().year() - i}
                key={i}
              />
            ))}
          </Picker>
        </View>
      </View>

      {/* DASS21 Results */}
      <View style={tw`mt-4 px-4`}>
        <Text
          style={[
            tw`text-lg font-bold mb-4`,
            { fontSize: textSize, color: theme.colors.heading },
          ]}
        >
          {translatedText.dass21Results}
        </Text>
        {filteredDass21Results.length > 0 ? (
          filteredDass21Results.map((entry, index) => (
            <View key={index} style={tw`mb-4 border-b border-gray-300 pb-2`}>
              <Text
                style={[
                  tw`font-bold`,
                  { fontSize: textSize, color: theme.colors.textPrimary },
                ]}
              >
                {dayjs(entry.timestamp.toDate()).format("DD MMM YYYY")}{" "}
                {/* Assuming timestamp is a Firestore Timestamp object */}
              </Text>
              <View style={tw`flex-row justify-start`}>
                <Ionicons
                  name={
                    severityColors[entry.assessmentData.depression[0]]?.icon
                  }
                  size={16}
                  paddingRight={5}
                  color={
                    severityColors[entry.assessmentData.depression[0]]?.color
                  }
                />
                <Text
                  style={[
                    tw`text-gray-500`,
                    { fontSize: textSize, color: theme.colors.textPrimary },
                  ]}
                >
                  Depression: {entry.assessmentData.depression[1]}{" "}
                  {/* Access the nested value */}
                </Text>
              </View>
              <View style={tw`flex-row justify-start`}>
                <Ionicons
                  name={severityColors[entry.assessmentData.anxiety[0]]?.icon}
                  size={16}
                  paddingRight={5}
                  color={severityColors[entry.assessmentData.anxiety[0]]?.color}
                />
                <Text
                  style={[
                    tw`text-gray-500`,
                    { fontSize: textSize, color: theme.colors.textPrimary },
                  ]}
                >
                  Anxiety: {entry.assessmentData.anxiety[1]}{" "}
                  {/* Access the nested value */}
                </Text>
              </View>
              <View style={tw`flex-row justify-start`}>
                <Ionicons
                  name={severityColors[entry.assessmentData.stress[0]]?.icon}
                  size={16}
                  paddingRight={5}
                  color={severityColors[entry.assessmentData.stress[0]]?.color}
                />
                <Text
                  style={[
                    tw`text-gray-500`,
                    { fontSize: textSize, color: theme.colors.textPrimary },
                  ]}
                >
                  Stress: {entry.assessmentData.stress[1]}{" "}
                  {/* Access the nested value */}
                </Text>
              </View>
            </View>
          ))
        ) : (
          <Text style={tw`text-gray-500`}>No results for this month.</Text>
        )}
      </View>

      {/* Mood History */}
      <View style={tw`mt-4 px-4`}>
        <Text
          style={[
            tw`text-lg font-bold mb-4`,
            { fontSize: textSize, color: theme.colors.heading },
          ]}
        >
          {translatedText.moodHistory}
        </Text>
        {sortedMoodHistory.length > 0 ? (
          sortedMoodHistory.map((entry, index) => (
            <TouchableOpacity
              key={index}
              style={tw`flex-row items-center mb-4 border-b border-gray-300 pb-2`} // Added border and padding
              onPress={() => {
                setSelectedEntry(entry);
                setModalVisible(true);
                console.log("Selected Entry:", entry); // Log the clicked entry directly
              }}
            >
              <View
                style={[
                  tw`w-10 h-10 rounded-full justify-center items-center`,
                  { backgroundColor: moodColors[entry.mood1] },
                ]}
              >
                <Text style={tw`text-white font-bold`}>
                  {dayjs(new Date(entry.timestamp.seconds * 1000)).format("DD")}
                </Text>
              </View>
              <View style={tw`ml-4 flex-1`}>
                <Text
                  style={[
                    tw`font-bold`,
                    { fontSize: textSize, color: theme.colors.heading },
                  ]}
                >
                  {entry.mood}
                </Text>
                <Text
                  numberOfLines={1}
                  style={[
                    tw`text-gray-500`,
                    { fontSize: textSize, color: theme.colors.textSecondary },
                  ]}
                >
                  {entry.reasons.join(", ")} {/* Display reasons */}
                </Text>
                <Text numberOfLines={1} style={tw`text-gray-500`}>
                  {entry.description}
                </Text>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={tw`text-gray-500`}>No entries for this month.</Text>
        )}
      </View>

      {/* Modal for Mood Entry Details */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View
          style={tw`flex-1 justify-end items-center bg-black bg-opacity-50`}
        >
          <View
            style={[
              tw`p-6 rounded-t-lg`,
              {
                backgroundColor: "#FFF8DC",
                minHeight: "50%",
                minWidth: "100%",
              },
            ]}
          >
            {selectedEntry && (
              <>
                <Text style={tw`text-lg font-bold`}>{selectedEntry.mood}</Text>
                <Text style={tw`text-gray-700 mb-4`}>
                  {selectedEntry.description}
                </Text>
                <Text style={tw`text-gray-500`}>
                  Reasons: {selectedEntry.reasons.join(", ")}
                </Text>
                <Text style={tw`text-gray-500`}>
                  Journal:{" "}
                  {selectedEntry.journal
                    ? selectedEntry.journal
                    : "No journal entry."}
                </Text>
                {/* Ensure journal is a field in the entry */}
                <TouchableOpacity
                  style={tw`mt-4 bg-blue-500 p-3 rounded`}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={tw`text-white text-center`}>Close</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}
