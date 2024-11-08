import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Ionicons } from "@expo/vector-icons";
import MoodChart from "../MoodChart";
import tw from "tailwind-react-native-classnames";
import TopBar from "../src/TopBar";
import dayjs from "dayjs";

const screenWidth = Dimensions.get("window").width;

export default function Progress() {
  const [selectedPeriod, setSelectedPeriod] = useState("Week");
  const [firstName, setFirstName] = useState("User");
  const [selectedLanguage, setSelectedLanguage] = useState("en");

  // State for date picker
  const [selectedDate, setSelectedDate] = useState(dayjs());

  // Sample data
  const moodSummary = [
    {
      label: "Neutral",
      percentage: "65%",
      moodIcon: "happy-outline",
      color: "#FFD700",
      description: "Balanced and steady.",
    },
    {
      label: "Happy",
      percentage: "15%",
      moodIcon: "happy",
      color: "#9ACD32",
      description: "Joyful and energized.",
    },
    {
      label: "Activity Completed",
      percentage: "12",
      moodIcon: "checkmark-circle",
      color: "#9ACD32",
      description: "Boosted mood with activities.",
    },
    {
      label: "Improvement",
      percentage: "10%",
      moodIcon: "trending-up-outline",
      color: "#9ACD32",
      description: "Positive changes noticed.",
    },
  ];

  const dass21Results = [
    { date: "2024-11-01", result: "Mild" },
    { date: "2024-11-15", result: "Normal" },
    { date: "2024-10-10", result: "Severe" },
  ];

  const moodHistory = [
    {
      date: "2024-11-01",
      mood: "Neutral",
      description: "Regular day at work. Felt monotonous.",
      color: "#FFD700",
    },
    {
      date: "2024-11-02",
      mood: "Happy",
      description: "Spent evening with family, relaxed.",
      color: "#9ACD32",
    },
  ];

  // Filtered results based on selected date
  const filteredDass21Results = dass21Results.filter((entry) =>
    dayjs(entry.date).isSame(selectedDate, "month")
  );

  const filteredMoodHistory = moodHistory.filter((entry) =>
    dayjs(entry.date).isSame(selectedDate, "month")
  );

  useEffect(() => {
    setSelectedDate(dayjs());
  }, []);

  const handleDateChange = (month, year) => {
    setSelectedDate(dayjs(`${year}-${month + 1}-01`));
  };

  return (
    <ScrollView style={tw`flex-1 bg-white pb-16`}>
      <TopBar
        firstName={firstName}
        selectedLanguage={selectedLanguage}
        setSelectedLanguage={setSelectedLanguage}
      />

      {/* Profile Greeting */}
      <Text style={tw`text-gray-500 p-4`}>
        Here’s a quick overview of your progress.
      </Text>
      <Text style={tw`text-lg font-bold px-4 mb-4`}>Mood Chart</Text>

      {/* Mood Chart */}
      <MoodChart />

      {/* Tabs for Monthly/Weekly */}
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

      {/* Mood Summary in 2x2 Grid Layout */}
      <View style={tw`flex-row flex-wrap justify-between p-4`}>
        {moodSummary.map((summary, index) => (
          <View
            key={index}
            style={[
              {
                width: "48%", // 2 items per row
                marginBottom: 10,
                padding: 16,
                backgroundColor: summary.color,
              },
              tw`justify-center items-start`,
            ]}
          >
            <View style={tw`flex-row items-center mb-1`}>
              <Ionicons name={summary.moodIcon} size={24} color="#FFFFFF" />
              <Text style={tw`ml-2 text-white font-bold text-lg`}>
                {summary.percentage}
              </Text>
            </View>
            <Text style={tw`text-white font-bold`}>{summary.label}</Text>
            <Text style={tw`text-white text-sm`}>{summary.description}</Text>
          </View>
        ))}
      </View>
      {/* Date Picker */}
      <View style={tw`p-4`}>
        <Text style={tw`text-lg font-bold`}>Select Month</Text>
        <View style={tw`flex-row mt-2`}>
          <Picker
            selectedValue={selectedDate.month()}
            style={{ flex: 1 }}
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
            style={{ flex: 1 }}
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
        <Text style={tw`text-lg font-bold mb-4`}>DASS21 Results</Text>
        {filteredDass21Results.length > 0 ? (
          filteredDass21Results.map((entry, index) => (
            <View key={index} style={tw`flex-row items-center mb-2`}>
              <Text style={tw`text-gray-800 font-bold mr-2`}>
                {dayjs(entry.date).format("DD MMM YYYY")}:
              </Text>
              <Text style={tw`text-gray-500`}>{entry.result}</Text>
            </View>
          ))
        ) : (
          <Text style={tw`text-gray-500`}>No results for this month.</Text>
        )}
      </View>

      {/* Mood History */}
      <View style={tw`mt-4 px-4`}>
        <Text style={tw`text-lg font-bold mb-4`}>Mood History</Text>
        {filteredMoodHistory.length > 0 ? (
          filteredMoodHistory.map((entry, index) => (
            <View key={index} style={tw`flex-row items-center mb-4`}>
              <View
                style={[
                  tw`w-10 h-10 rounded-full justify-center items-center`,
                  { backgroundColor: entry.color },
                ]}
              >
                <Text style={tw`text-white font-bold`}>
                  {dayjs(entry.date).format("DD")}
                </Text>
              </View>
              <View style={tw`ml-4 flex-1`}>
                <Text style={tw`font-bold`}>{entry.mood}</Text>
                <Text numberOfLines={1} style={tw`text-gray-500`}>
                  {entry.description}
                </Text>
              </View>
            </View>
          ))
        ) : (
          <Text style={tw`text-gray-500`}>No entries for this month.</Text>
        )}
      </View>
    </ScrollView>
  );
}
