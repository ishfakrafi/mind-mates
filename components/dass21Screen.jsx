import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Button,
  StyleSheet,
} from "react-native";
import tw from "tailwind-react-native-classnames";
import { loadThemeConfig, getThemeConfig } from "../app/themeConfig";
import { useFocusEffect } from "@react-navigation/native";
import axios from "axios";
import { router } from "expo-router";
import { useRoute } from "@react-navigation/native"; // Import useRoute
import { db } from "../components/firebase-config"; // Adjust the path based on your project structure
import { collection, addDoc, serverTimestamp } from "firebase/firestore"; // Import Firestore functions

// Constants for the translation API
const apiKey = "c4601f1be388488aa7433f305ff71533";
const apiRegion = "australiaeast";

// Translation cache to store translated texts
const translationCache = {};

// Modified translateText function with caching, consistent with AssessmentTab
const translateText = async (text, language) => {
  if (language === "en") return text;

  // Check cache first
  if (translationCache[language] && translationCache[language][text]) {
    return translationCache[language][text];
  }

  try {
    const response = await axios.post(
      `https://api.cognitive.microsofttranslator.com/translate?api-version=3.0&to=${language}`,
      [{ text }], // Use lowercase "text" as in AssessmentTab
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

const Dass21Screen = ({ selectedLanguage, userEmail }) => {
  const questions = [
    { text: "I found it hard to wind down", subscale: "Stress" },
    { text: "I was aware of dryness of my mouth", subscale: "Anxiety" },
    {
      text: "I couldn't seem to experience any positive feeling at all",
      subscale: "Depression",
    },
    {
      text: "I experienced breathing difficulty (e.g., excessively rapid breathing, breathlessness in the absence of physical exertion)",
      subscale: "Anxiety",
    },
    {
      text: "I found it difficult to work up the initiative to do things",
      subscale: "Depression",
    },
    { text: "I tended to over-react to situations", subscale: "Stress" },
    {
      text: "I experienced trembling (e.g., in the hands)",
      subscale: "Anxiety",
    },
    {
      text: "I felt that I was using a lot of nervous energy",
      subscale: "Stress",
    },
    {
      text: "I was worried about situations in which I might panic and make a fool of myself",
      subscale: "Anxiety",
    },
    {
      text: "I felt that I had nothing to look forward to",
      subscale: "Depression",
    },
    { text: "I found myself getting agitated", subscale: "Stress" },
    { text: "I found it difficult to relax", subscale: "Stress" },
    { text: "I felt down-hearted and blue", subscale: "Depression" },
    {
      text: "I was intolerant of anything that kept me from getting on with what I was doing",
      subscale: "Stress",
    },
    { text: "I felt I was close to panic", subscale: "Anxiety" },
    {
      text: "I was unable to become enthusiastic about anything",
      subscale: "Depression",
    },
    {
      text: "I felt I wasn’t worth much as a person",
      subscale: "Depression",
    },
    { text: "I felt that I was rather touchy", subscale: "Stress" },
    {
      text: "I was aware of the action of my heart in the absence of physical exertion (e.g., sense of heart rate increase, heart missing a beat)",
      subscale: "Anxiety",
    },
    {
      text: "I felt scared without any good reason",
      subscale: "Anxiety",
    },
    { text: "I felt that life was meaningless", subscale: "Depression" },
  ];
  const [theme, setTheme] = useState({
    colors: {},
    fontSizes: {},
    baseFontSize: 16,
  });
  const textSize = theme.baseFontSize || 16;

  const [page, setPage] = useState(1);
  const [answers, setAnswers] = useState({});
  const [translatedText, setTranslatedText] = useState({
    questions: [],
    next: "Next",
    submit: "Submit",
    pageInfo: "Page",
    of: "of",
  });

  // Load theme and translations, consistent with AssessmentTab
  useFocusEffect(
    React.useCallback(() => {
      const loadThemeAndTranslations = async () => {
        await loadThemeConfig();
        const config = getThemeConfig();
        setTheme(config || {});

        const translatedQuestions = await Promise.all(
          questions.map((question) =>
            translateText(question.text, selectedLanguage)
          )
        );

        setTranslatedText({
          questions: translatedQuestions, // Array of translated question texts (strings)
          next: await translateText("Next", selectedLanguage),
          submit: await translateText("Submit", selectedLanguage),
          pageInfo: await translateText("Page", selectedLanguage),
          of: await translateText("of", selectedLanguage),
        });
      };

      loadThemeAndTranslations();
    }, [selectedLanguage])
  );
  const calculateScores = () => {
    let depressionScore = 0;
    let anxietyScore = 0;
    let stressScore = 0;

    // Sum the scores for each subscale
    questions.forEach((question, index) => {
      const response = answers[index] || 0; // Default to 0 if no response
      if (question.subscale === "Depression") {
        depressionScore += response;
      } else if (question.subscale === "Anxiety") {
        anxietyScore += response;
      } else if (question.subscale === "Stress") {
        stressScore += response;
      }
    });

    // Multiply each score by 2
    depressionScore *= 2;
    anxietyScore *= 2;
    stressScore *= 2;

    return { depressionScore, anxietyScore, stressScore };
  };

  const classifySeverity = (score, subscale) => {
    if (subscale === "Depression") {
      if (score >= 28) return "Extremely Severe";
      if (score >= 21) return "Severe";
      if (score >= 14) return "Moderate";
      if (score >= 10) return "Mild";
      return "Normal";
    } else if (subscale === "Anxiety") {
      if (score >= 20) return "Extremely Severe";
      if (score >= 15) return "Severe";
      if (score >= 10) return "Moderate";
      if (score >= 8) return "Mild";
      return "Normal";
    } else if (subscale === "Stress") {
      if (score >= 34) return "Extremely Severe";
      if (score >= 26) return "Severe";
      if (score >= 19) return "Moderate";
      if (score >= 15) return "Mild";
      return "Normal";
    }
  };

  // Answer handling
  const handleAnswer = (questionIndex, answer) => {
    const questionText = questions[questionIndex].text; // Get the question text based on the index

    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionIndex]: answer,
    }));
  };

  const nextPage = () => {
    if (page < 5) {
      setPage(page + 1);
    }
  };

  const saveAssessment = async (userId, results) => {
    try {
      const docRef = await addDoc(collection(db, "assessments"), {
        userId: userId,
        assessmentData: results,
        timestamp: serverTimestamp(),
      });
      console.log("Assessment added with ID: ", docRef.id);
    } catch (error) {
      console.error("Error adding assessment: ", error);
    }
  };

  const submitAssessment = async () => {
    // Check if all questions have been answered
    if (Object.keys(answers).length !== questions.length) {
      alert("Please answer all questions before submitting."); // Alert for incomplete answers
      return; // Exit the function if not all questions are answered
    }
    const { depressionScore, anxietyScore, stressScore } = calculateScores();

    const results = {
      depression: classifySeverity(depressionScore, "Depression"),
      anxiety: classifySeverity(anxietyScore, "Anxiety"),
      stress: classifySeverity(stressScore, "Stress"),
      scores: {
        depression: depressionScore,
        anxiety: anxietyScore,
        stress: stressScore,
      },
    };
    // Ensure `results` is an object and log it

    console.log("Saving assessment data...");
    await saveAssessment(userEmail, results);

    // Navigate to success screen with results
    router.push({
      pathname: "/Dass21Success",
      params: { results: JSON.stringify(results) }, // Explicitly stringify `results`
    });
  };

  // Render each question with translated text
  const renderQuestion = (questionIndex) => (
    <View style={styles.questionContainer} key={questionIndex}>
      <Text style={{ color: theme.colors.textPrimary, fontSize: textSize }}>
        {translatedText.questions[questionIndex - 1] ||
          questions[questionIndex - 1].text}
      </Text>

      <View style={styles.answerRow}>
        {[0, 1, 2, 3].map((value) => (
          <TouchableOpacity
            key={value}
            style={[
              styles.answerButton,
              answers[questionIndex - 1] === value && {
                backgroundColor: theme.colors.accent || "#a5a5ff",
              },
            ]}
            onPress={() => {
              handleAnswer(questionIndex - 1, value); // Pass zero-based index
            }}
          >
            <Text
              style={{
                fontSize: textSize - 4,
                color: theme.colors.textPrimary || "black",
              }}
            >
              {value}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.colors.background || "#fff" },
      ]}
    >
      <Text style={{ color: theme.colors.textSecondary, fontSize: textSize }}>
        {translatedText.pageInfo} {page} {translatedText.of} 5
      </Text>

      {page === 1 && [1, 2, 3, 4, 5].map(renderQuestion)}
      {page === 2 && [6, 7, 8, 9, 10].map(renderQuestion)}
      {page === 3 && [11, 12, 13, 14, 15].map(renderQuestion)}
      {page === 4 && [16, 17, 18, 19, 20].map(renderQuestion)}
      {page === 5 && [21].map(renderQuestion)}

      <View style={styles.buttonContainer}>
        {page > 1 && (
          <TouchableOpacity
            style={[styles.navigationButton, styles.backButton]}
            onPress={() => setPage(page - 1)}
          >
            <Text style={{ color: "#fff", fontSize: textSize }}>
              {translatedText.back || "Back"}
            </Text>
          </TouchableOpacity>
        )}

        {page < 5 ? (
          <TouchableOpacity
            style={[styles.navigationButton, styles.nextButton]}
            onPress={() => setPage(page + 1)}
          >
            <Text style={{ color: "#fff", fontSize: textSize }}>
              {translatedText.next || "Next"}
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.navigationButton, styles.nextButton]}
            onPress={submitAssessment}
          >
            <Text style={{ color: "#fff", fontSize: textSize }}>
              {translatedText.submit || "Submit"}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  questionContainer: {
    marginBottom: 20,
  },
  answerRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
  },
  answerButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  navigationButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 8,
    marginHorizontal: 5,
  },
  backButton: {
    backgroundColor: "#FF6347", // Red for back button
  },
  nextButton: {
    backgroundColor: "#6200EE", // Theme color or default color for next/submit button
  },
});

export default Dass21Screen;
