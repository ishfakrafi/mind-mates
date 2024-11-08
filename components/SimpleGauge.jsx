import React from "react";
import { View } from "react-native";
import Svg, { Circle, G, Text as SvgText } from "react-native-svg";

const CustomGauge = ({ value, label }) => {
  // Calculate the strokeDasharray based on the value
  const radius = 50; // Radius of the gauge circle
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 42) * circumference; // Calculate the offset based on value (42 is the max)

  // Determine color based on value and label
  let color;
  if (label === "DEPRESSION") {
    if (value < 10) color = "#5BE12C"; // Green for normal
    else if (value < 14) color = "#F5CD19"; // Yellow for mild
    else if (value < 21) color = "#F58B19"; // Orange for moderate
    else if (value < 28) color = "#EA4228"; // Red for severe
    else color = "#A80000"; // Dark red for extremely severe
  } else if (label === "ANXIETY") {
    if (value < 8) color = "#5BE12C"; // Green for normal
    else if (value < 10) color = "#F5CD19"; // Yellow for mild
    else if (value < 15) color = "#F58B19"; // Orange for moderate
    else if (value < 20) color = "#EA4228"; // Red for severe
    else color = "#A80000"; // Dark red for extremely severe
  } else if (label === "STRESS") {
    if (value < 15) color = "#5BE12C"; // Green for normal
    else if (value < 19) color = "#F5CD19"; // Yellow for mild
    else if (value < 26) color = "#F58B19"; // Orange for moderate
    else if (value < 34) color = "#EA4228"; // Red for severe
    else color = "#A80000"; // Dark red for extremely severe
  }

  return (
    <View style={{ alignItems: "center", justifyContent: "center" }}>
      <Svg width={150} height={150}>
        <G rotation="-90" origin="75, 75">
          {/* Background Circle */}
          <Circle
            cx="75"
            cy="75"
            r={radius}
            stroke="#e0e0e0"
            strokeWidth="10"
            fill="none"
          />
          {/* Foreground Circle (Gauge) */}
          <Circle
            cx="75"
            cy="75"
            r={radius}
            stroke={color}
            strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            fill="none"
          />
        </G>
        {/* Centered Text */}
        <SvgText
          x="75"
          y="75"
          textAnchor="middle"
          alignmentBaseline="middle"
          fontSize="14"
          fill="#000"
          fontWeight="bold"
        >
          {label} {/* Display the label passed as a prop */}
        </SvgText>
      </Svg>
    </View>
  );
};

export default CustomGauge;
