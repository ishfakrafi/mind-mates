import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  Animated,
} from "react-native";
import tw from "tailwind-react-native-classnames";

// Get device width and height for responsive layout
const { width } = Dimensions.get("window");

export const BoxBreathe = () => {
  const [step, setStep] = useState(1); // Track which step of breathing the user is on
  const [count, setCount] = useState(4); // To keep track of countdown
  const [isActive, setIsActive] = useState(false); // To check if button is pressed
  const [intervalId, setIntervalId] = useState(null); // Keep track of the interval
  const [isFinished, setIsFinished] = useState(false); // To check if countdown finished
  const progress = useRef(new Animated.Value(100)).current; // Progress for gauge effect
  const [circleColor, setCircleColor] = useState("#f7c0ff"); // Default color

  // Update text based on current step
  const stepsText = [
    {
      header: "Step 1/3",
      subtext:
        "Breathe in, counting to four slowly. Feel the air enter your lungs and hold your breath for step 2.",
    },
    {
      header: "Step 2/3",
      subtext:
        "Press and hold the button and Hold your breath for 4 seconds. Try to avoid inhaling or exhaling for 4 seconds.",
    },
    {
      header: "Step 3/3",
      subtext: "Slowly exhale through your mouth for 4 seconds.",
    },
  ];

  // Function to start countdown and animate gauge
  const startCountdown = () => {
    if (!isActive && !isFinished) {
      setIsActive(true);
      Animated.timing(progress, {
        toValue: 0,
        duration: 4000, // Duration matches the countdown from 4 to 0 (4 seconds)
        useNativeDriver: false,
      }).start();

      let newIntervalId = setInterval(() => {
        setCount((prevCount) => {
          if (prevCount > 1) return prevCount - 1;
          clearInterval(newIntervalId);
          setCircleColor("#4caf50"); // Change to green when countdown is over
          setIsFinished(true); // Countdown has finished
          return 0;
        });
      }, 1000);

      setIntervalId(newIntervalId); // Store interval ID so we can clear it on release
    }
  };

  // Reset the timer when the user stops pressing or proceed to the next step
  const resetCountdown = () => {
    if (isFinished) {
      // When the countdown finishes, advance to the next step
      if (step < 3) {
        setStep(step + 1); // Move to the next step
        setIsActive(false);
        setIsFinished(false);
        setCount(4); // Reset count
        setCircleColor("#f7c0ff"); // Reset color
        Animated.timing(progress, {
          toValue: 100,
          duration: 500,
          useNativeDriver: false,
        }).start();
      } else {
        // If step 3 is complete, show a success message (step 4)
        setStep(4);
      }
    } else {
      setIsActive(false);
      clearInterval(intervalId); // Clear the countdown interval when released
    }
  };

  // Interpolating the gauge based on progress
  const progressInterpolation = progress.interpolate({
    inputRange: [0, 100],
    outputRange: ["0%", "100%"],
  });

  return (
    <View style={tw`flex-1 bg-white w-full h-full`}>
      {/* Main Content */}
      <View style={tw`flex flex-col items-center mt-4`}>
        {/* Header and Subtext */}
        {step < 4 ? (
          <View style={[tw`bg-white rounded-lg p-6`, { width: width * 0.9 }]}>
            <Text
              style={[
                tw`font-bold mb-4 text-center`,
                { fontSize: 30, color: "#4a494b" },
              ]}
            >
              {stepsText[step - 1].header} {/* Dynamic step header */}
            </Text>

            <Text
              style={[
                tw`text-center mt-4`,
                { fontSize: 18, color: "#00000094" },
              ]}
            >
              {stepsText[step - 1].subtext} {/* Dynamic subtext */}
            </Text>
          </View>
        ) : (
          <View style={tw`mt-4`}>
            <Text style={tw`text-lg text-green-500 mb-8 font-bold`}>
              Repeat steps 1 to 3 until you feel re-centered. Congratulations!
              You have completed box breathing.
            </Text>
          </View>
        )}

        {/* Countdown Circle */}
        {step < 4 && (
          <TouchableOpacity
            activeOpacity={0.7}
            onPressIn={startCountdown} // Start countdown on press
            onPressOut={resetCountdown} // Reset countdown on release
            style={[
              tw`rounded-full justify-center items-center mt-6`,
              {
                width: width * 0.7,
                height: width * 0.7,
                backgroundColor: "#fbe5ff",
                borderWidth: 5,
                borderColor: circleColor === "#4caf50" ? "#c5fac8" : "#fbe5ff", // Border changes to green on completion
              },
            ]}
          >
            <View
              style={[
                tw`justify-center items-center`,
                {
                  width: "90%",
                  height: "90%",
                  backgroundColor: circleColor, // Color changes on countdown completion
                  borderRadius: width * 0.35,
                },
              ]}
            >
              <Text
                style={[
                  tw`font-semibold text-white`,
                  {
                    fontSize: width * 0.25, // Dynamically scale text size
                    textAlign: "center",
                    textShadowRadius: 3,
                    textShadowColor: "#aeaff7",
                  },
                ]}
              >
                {count} {/* Display current countdown number */}
              </Text>
            </View>
          </TouchableOpacity>
        )}

        {/* Progress Bar or Restart Button */}
        <View
          style={[tw`mt-4`, { width: "100%", height: 30, overflow: "hidden" }]}
        >
          {step === 4 ? (
            <TouchableOpacity
              style={[
                tw`bg-green-500 justify-center items-center rounded-lg`,
                { height: 30 },
              ]}
              onPress={() => {
                // When "Restart" button is clicked, reset the process
                setStep(1);
                setCount(4);
                setCircleColor("#f7c0ff");
                setIsFinished(false);
                Animated.timing(progress, {
                  toValue: 100,
                  duration: 500,
                  useNativeDriver: false,
                }).start();
              }}
            >
              <Text style={tw`text-white font-bold`}>Restart</Text>
            </TouchableOpacity>
          ) : (
            <Animated.View
              style={[
                tw`bg-purple-800`,
                { height: 30, borderRadius: 3, width: progressInterpolation }, // Animated width
              ]}
            />
          )}
        </View>
      </View>
    </View>
  );
};
