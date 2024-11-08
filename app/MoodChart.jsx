import React from "react";
import { View, Text, Dimensions, StyleSheet } from "react-native";
import { LineChart } from "react-native-chart-kit";

const MoodChart = () => {
  const currentWeekData = {
    Monday: 2,
    Tuesday: 4,
    Wednesday: 4,
    Thursday: 3,
    Friday: 1,
    Saturday: 1,
    Sunday: 2,
  };

  const historicalAverages = {
    Monday: 3,
    Tuesday: 4,
    Wednesday: 3,
    Thursday: 4,
    Friday: 4,
    Saturday: 3,
    Sunday: 4,
  };

  const screenWidth = Dimensions.get("window").width;
  const chartHeight = 220; // Height for calculating emoji positions

  const data = {
    labels: ["M", "T", "W", "T", "F", "S", "S"],
    datasets: [
      {
        data: [1, ...Object.values(currentWeekData), 1],
        color: (opacity = 1) => `rgba(255, 99, 132, ${opacity})`,
        strokeWidth: 4,
      },
      {
        data: [1, ...Object.values(historicalAverages), 1],
        color: (opacity = 1) => `rgba(149, 128, 255, ${opacity})`,
        strokeWidth: 4,
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
    min: 1,
    max: 5,
    count: 5,
    stepSize: 1,
  };

  // Emoji mapping for mood levels
  const moodEmojis = {
    1: "😢", // Sad
    2: "😕", // Slightly Upset
    3: "😐", // Neutral
    4: "🙂", // Happy
    5: "😄", // Very Happy
  };

  // Calculate segment height for positioning emojis
  const segmentHeight = chartHeight / 5;

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
      <View style={styles.chartContainer}>
        <LineChart
          data={data}
          width={screenWidth - 40}
          height={chartHeight}
          chartConfig={chartConfig}
          bezier
          style={{
            marginVertical: 8,
            borderRadius: 16,
          }}
          withInnerLines={true}
          withOuterLines={true}
          withDots={false} // Skip the dots
          withShadow={false}
          segments={4}
          withVerticalLabels={true} // Keep x-axis labels
          withHorizontalLabels={false} // Hide y-axis numeric labels
        />
        {/* Custom Emoji Y-axis Labels */}
        <View style={[styles.emojiYAxisContainer, { height: chartHeight }]}>
          {Object.keys(moodEmojis)
            .reverse()
            .map((key, index) => (
              <Text
                key={index}
                style={[
                  styles.emojiLabel,
                  { top: index * segmentHeight - 8 }, // Adjust emoji position
                ]}
              >
                {moodEmojis[key]}
              </Text>
            ))}
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
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  chartContainer: {
    alignItems: "center",
    position: "relative",
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
  emojiYAxisContainer: {
    position: "absolute",
    top: 20,
    left: 20, // Position to the left of the chart
    justifyContent: "flex-start",
  },
  emojiLabel: {
    position: "absolute",
    left: 0,
    fontSize: 16,
  },
});

export default MoodChart;
