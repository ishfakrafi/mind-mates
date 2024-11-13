import React, { useEffect, useState } from "react";
import { View, Text, Dimensions, StyleSheet } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { db } from "../components/firebase-config";
import { collection, query, where, getDocs } from "firebase/firestore";

const MoodChart = ({ userEmail }) => {
  const [currentWeekData, setCurrentWeekData] = useState([0, 0, 0, 0, 0, 0, 0]);
  const [historicalAverageData, setHistoricalAverageData] = useState([
    0, 0, 0, 0, 0, 0, 0,
  ]);
  const screenWidth = Dimensions.get("window").width;
  const chartHeight = 220;

  const moodValues = {
    "Very Bad": -2,
    Bad: -1,
    Neutral: 0,
    Good: 1,
    "Very Good": 2,
  };
  const moodEmojis = {
    "-2": "😢", // Very Bad
    "-1": "😕", // Bad
    0: "😐", // Neutral
    1: "🙂", // Good
    2: "😄", // Very Good
  };

  const adjustDayIndex = (sundayBasedIndex) => {
    return sundayBasedIndex === 0 ? 6 : sundayBasedIndex - 1; // Adjusting to Monday as start
  };

  useEffect(() => {
    const fetchMoodData = async () => {
      if (!userEmail) {
        console.error("User email is undefined");
        return;
      }

      try {
        const q = query(
          collection(db, "moodEntries"),
          where("userId", "==", userEmail)
        );
        const querySnapshot = await getDocs(q);

        const today = new Date();
        const startOfWeek = new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate() - today.getDay() + 1 // Adjust to get Monday as the start
        );
        startOfWeek.setHours(0, 0, 0, 0);

        const weekData = Array(7).fill([]); // Create an array for each day of the current week
        const historicalData = Array(7).fill([]);
        querySnapshot.forEach((doc) => {
          const entry = doc.data();
          const entryDate = new Date(entry.timestamp.seconds * 1000);
          const sundayBasedDay = entryDate.getDay();
          const mondayBasedDay = adjustDayIndex(sundayBasedDay);
          if (entryDate >= startOfWeek && entryDate <= today) {
            weekData[mondayBasedDay] = [
              ...(weekData[mondayBasedDay] || []),
              moodValues[entry.mood] || 0,
            ];

            console.log(
              `Current week mood entry for ${entryDate.toDateString()}:`,
              entry.mood,
              `(Mapped to value: ${moodValues[entry.mood] || 0})`
            );
          } else {
            // For entries not in the current week, add them to historical data
            historicalData[mondayBasedDay] = [
              ...(historicalData[mondayBasedDay] || []),
              moodValues[entry.mood] || 0,
            ];

            console.log(
              `Historical mood entry for ${entryDate.toDateString()}:`,
              entry.mood,
              `(Mapped to value: ${moodValues[entry.mood] || 0})`
            );
          }
        });

        const averagedWeekData = weekData.map((dayEntries) => {
          console.log(dayEntries);
          if (dayEntries.length == 0) return null; // Use null to indicate no data
          const sum = dayEntries.reduce((acc, val) => acc + val, 0);
          const avg = sum / dayEntries.length;
          return avg;
        });
        console.log(averagedWeekData);
        // Add dummy values at start and end
        setCurrentWeekData([-2, ...averagedWeekData, 2]);

        // Initialize historical average data with dummy values for testing (modify later for actual data)
        const averagedHistoricalData = historicalData.map((dayEntries) => {
          if (dayEntries.length === 0) return null; // Skip days with no historical entries
          const sum = dayEntries.reduce((acc, val) => acc + val, 0);
          return sum / dayEntries.length; // Average of only days with data
        });

        console.log("Averaged Historical Data:", averagedHistoricalData);
        setHistoricalAverageData([-2, ...averagedHistoricalData, 2]);
      } catch (error) {
        console.error("Error fetching mood data: ", error);
      }
    };

    fetchMoodData();
  }, [userEmail]);

  const data = {
    labels: ["", "M", "T", "W", "T", "F", "S", "S", ""],
    datasets: [
      {
        data: currentWeekData,
        color: (opacity = 1, index) => {
          // Make the dummy data points transparent
          return index === 0 || index === currentWeekData.length - 1
            ? `rgba(0, 0, 0, 0)`
            : `rgba(255, 99, 132, ${opacity})`;
        },
        strokeWidth: (index) =>
          index === 0 || index === currentWeekData.length - 1 ? 0 : 4, // Hide the dummy points by setting strokeWidth to 0
      },
      {
        data: historicalAverageData,
        color: (opacity = 1, index) => {
          return index === 0 || index === historicalAverageData.length - 1
            ? `rgba(0, 0, 0, 0)`
            : `rgba(149, 128, 255, ${opacity})`;
        },
        strokeWidth: (index) =>
          index === 1 || index === historicalAverageData.length - 1 ? 0 : 4,
      },
      {
        data: [2, 2, 2, 2, 2, 2, 2, 2, 2], // Dummy dataset to force Y-axis scaling
        color: () => `rgba(0, 0, 0, 0)`, // Set color to transparent
        strokeWidth: 0, // Make lines invisible
      },
      {
        data: [-2, -2, -2, -2, -2, -2, -2, -2, -2], // Dummy dataset to force Y-axis scaling
        color: () => `rgba(0, 0, 0, 0)`, // Set color to transparent
        strokeWidth: 0, // Make lines invisible
      },
    ],
  };

  const chartConfig = {
    backgroundColor: "#ffffff",
    backgroundGradientFrom: "#ffffff",
    backgroundGradientTo: "#ffffff",
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForLabels: {
      fontSize: 12,
    },
    strokeWidth: 2,
    min: -2,
    max: 2,
    count: 5,
    stepSize: 1,
    formatYLabel: () => "",
    fromZero: false,
  };

  return (
    <View style={styles.container}>
      <View style={styles.legendContainer}>
        <View style={styles.legendItem}>
          <View
            style={[
              styles.legendColor,
              { backgroundColor: "rgb(255, 99, 132)" },
            ]}
          />
          <Text style={styles.legendText}>Current Week</Text>
        </View>
        <View style={styles.legendItem}>
          <View
            style={[
              styles.legendColor,
              { backgroundColor: "rgb(149, 128, 255)" },
            ]}
          />
          <Text style={styles.legendText}>Historical Average</Text>
        </View>
      </View>
      <LineChart
        data={data}
        width={screenWidth - 40}
        height={chartHeight}
        chartConfig={chartConfig}
        bezier
        style={{ marginVertical: 8, borderRadius: 16 }}
        withInnerLines={true}
        fromZero={false}
        segments={4}
      />
      {/* Manual Emoji Legend */}
      <View style={styles.emojiLegendContainer}>
        <View style={styles.emojiLegendItem}>
          <Text style={styles.emoji}>😄</Text>
          <Text style={styles.legendText}>= 2</Text>
        </View>
        <View style={styles.emojiLegendItem}>
          <Text style={styles.emoji}>🙂</Text>
          <Text style={styles.legendText}>= 1</Text>
        </View>
        <View style={styles.emojiLegendItem}>
          <Text style={styles.emoji}>😐</Text>
          <Text style={styles.legendText}>= 0</Text>
        </View>
        <View style={styles.emojiLegendItem}>
          <Text style={styles.emoji}>😕</Text>
          <Text style={styles.legendText}>= -1</Text>
        </View>
        <View style={styles.emojiLegendItem}>
          <Text style={styles.emoji}>😢</Text>
          <Text style={styles.legendText}>= -2</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    padding: 16,
    margin: 10,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  legendContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 16,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 10,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 4,
  },
  legendText: {
    fontSize: 12,
  },
  emojiLegendContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
  },
  emojiLegendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 10,
  },
  emoji: {
    fontSize: 18,
    marginRight: 4,
  },
});

export default MoodChart;
