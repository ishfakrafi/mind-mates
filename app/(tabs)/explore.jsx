import React, { useState } from "react";
import {
  View,
  ScrollView,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import SearchBar from "../../components/SearchBar";
import TopBar from "../src/TopBar";
import tw from "tailwind-react-native-classnames";
import AssessmentTab from "../../components/AssessmentTab";
import ActivityTab from "../../components/ActivityTab";
import ReadingTab from "../../components/ReadingTab";
import FaqTab from "../../components/FaqTab";
import DASS21Screen from "../../components/dass21Screen";
import { BoxBreathe } from "../../components/BoxBreathing";

export default function ExploreScreen() {
  const [selectedTab, setSelectedTab] = useState("Assessment");
  const [view, setView] = useState("default"); // To track if it's full-page view

  // Function to render content based on the selected tab or full-screen view
  const renderTabContent = () => {
    if (view === "DASS21") {
      return (
        <View style={tw`flex-1`}>
          <View style={tw`flex-row justify-between p-8 bg-white`}>
            <Text style={tw`font-bold text-lg`}>Assessment: DASS 21</Text>
            <TouchableOpacity onPress={() => setView("default")}>
              <Text style={tw`text-blue-500`}>Close</Text>
            </TouchableOpacity>
          </View>
          <DASS21Screen />
        </View>
      );
    }
    if (view === "Box") {
      return (
        <View style={tw`flex-1`}>
          <View style={tw`flex-row justify-between p-4 bg-white`}>
            <Text style={tw`font-bold text-lg`}>Activity: Box Breathing</Text>
            <TouchableOpacity onPress={() => setView("default")}>
              <Text style={tw`text-blue-500`}>Close</Text>
            </TouchableOpacity>
          </View>
          <BoxBreathe />
        </View>
      );
    }

    switch (selectedTab) {
      case "Assessment":
        return <AssessmentTab setView={setView} />; // Pass setView to switch to full-screen
      case "Activity":
        return <ActivityTab setView={setView} />;
      case "Reading":
        return <ReadingTab />;
      case "Faq":
        return <FaqTab />;
      default:
        return <AssessmentTab setView={setView} />; // Default to AssessmentTab
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ScrollView style={tw`flex-1`} contentContainerStyle={tw`flex-col gap-4`}>
        {view === "default" && (
          <>
            <TopBar />
            <SearchBar />
            <View
              style={[
                tw`flex flex-row w-full mt-8 items-start justify-end gap-4 px-6 py-2 rounded-[10px]`,
                { backgroundColor: "#fcdae8" },
                { borderRadius: 30 },
              ]}
            >
              <Image
                source={require("../../assets/images/Sitting.png")}
                style={[tw`w-[135px] h-[193px]`, { marginTop: -20 }]}
              />
              <View style={tw`flex flex-col w-[216px] bg-[#fddae9] p-4`}>
                <View
                  style={[
                    tw`flex flex-col bg-white p-4 rounded-[15px]`,
                    { borderRadius: 15 },
                  ]}
                >
                  <Text
                    style={[tw`font-semibold text-xs`, { color: "#0c7c5b" }]}
                  >
                    Mood Boosters
                  </Text>

                  <View style={tw`flex-row justify-between`}>
                    <Text
                      style={[
                        tw`font-semibold`,
                        { color: "#373737" },
                        { fontSize: "10px" },
                      ]}
                    >
                      Activity: Breathe
                    </Text>
                    <Text
                      style={[
                        tw`font-semibold`,
                        { color: "#0ad89a" },
                        { fontSize: "10px" },
                      ]}
                    >
                      +2%
                    </Text>
                  </View>
                  <View style={tw`flex-row justify-between`}>
                    <Text
                      style={[
                        tw`font-semibold`,
                        { color: "#373737" },
                        { fontSize: "10px" },
                      ]}
                    >
                      Activity: Meditation
                    </Text>
                    <Text
                      style={[
                        tw`font-semibold`,
                        { color: "#0ad89a" },
                        { fontSize: "10px" },
                      ]}
                    >
                      +4%
                    </Text>
                  </View>
                  <View style={tw`flex-row justify-between`}>
                    <Text
                      style={[
                        tw`font-semibold`,
                        { color: "#373737" },
                        { fontSize: "10px" },
                      ]}
                    >
                      Reading: Mental Wellness
                    </Text>
                    <Text
                      style={[
                        tw`font-semibold`,
                        { color: "#0ad89a" },
                        { fontSize: "10px" },
                      ]}
                    >
                      +6%
                    </Text>
                  </View>
                </View>

                <View
                  style={[
                    tw`flex flex-col bg-white p-4 mt-4 rounded-[15px]`,
                    { borderRadius: 15 },
                  ]}
                >
                  <View style={tw`flex flex-row justify-between`}>
                    <Text style={tw`font-semibold text-black text-xs`}>
                      Mood Optimization
                    </Text>
                    <Text
                      style={[
                        tw`font-semibold`,
                        { color: "#0ad89a" },
                        { fontSize: "10px" },
                      ]}
                    >
                      60%
                    </Text>
                  </View>
                  <View style={tw`bg-gray-300 rounded-[10px] h-2 mt-2`}>
                    <View
                      style={tw`bg-[#b488fb] h-full w-[80%] rounded-[10px]`}
                    />
                  </View>
                </View>
              </View>
            </View>

            <View
              style={tw`flex flex-col w-full items-start justify-end gap-4`}
            >
              <View
                style={tw`flex flex-row w-full items-center justify-around p-4 rounded-[10px]`}
              >
                <TouchableOpacity
                  style={[
                    tw`w-[91px] h-8 bg-primary px-4 rounded-xl items-center justify-center`,
                    selectedTab === "Assessment"
                      ? { backgroundColor: "#ac7afd" }
                      : { backgroundColor: "#f0f0f0" },
                  ]}
                  onPress={() => setSelectedTab("Assessment")}
                >
                  <Text
                    style={tw`text-xs font-semibold ${
                      selectedTab === "Assessment"
                        ? "text-white"
                        : "text-gray-500"
                    }`}
                  >
                    Assessment
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    tw`w-[66px] h-8 bg-white px-4 rounded-xl items-center justify-center`,
                    selectedTab === "Activity"
                      ? { backgroundColor: "#ac7afd" }
                      : { backgroundColor: "#f0f0f0" },
                  ]}
                  onPress={() => setSelectedTab("Activity")}
                >
                  <Text
                    style={tw`text-xs font-semibold ${
                      selectedTab === "Activity"
                        ? "text-white"
                        : "text-gray-500"
                    }`}
                  >
                    Activity
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    tw`w-[66px] h-8 bg-white px-4 rounded-xl items-center justify-center`,
                    selectedTab === "Reading"
                      ? { backgroundColor: "#ac7afd" }
                      : { backgroundColor: "#f0f0f0" },
                  ]}
                  onPress={() => setSelectedTab("Reading")}
                >
                  <Text
                    style={tw`text-xs font-semibold ${
                      selectedTab === "Reading" ? "text-white" : "text-gray-500"
                    }`}
                  >
                    Reading
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    tw`w-[46px] h-8 bg-white px-4 rounded-xl items-center justify-center`,
                    selectedTab === "Faq"
                      ? { backgroundColor: "#ac7afd" }
                      : { backgroundColor: "#f0f0f0" },
                  ]}
                  onPress={() => setSelectedTab("Faq")}
                >
                  <Text
                    style={tw`text-xs font-semibold ${
                      selectedTab === "Faq" ? "text-white" : "text-gray-500"
                    }`}
                  >
                    Faq
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </>
        )}
        {renderTabContent()}
      </ScrollView>
    </GestureHandlerRootView>
  );
}
