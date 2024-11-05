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

const Dass21Screen = ({ selectedLanguage }) => {
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

        const questions = [
          "I found it hard to wind down",
          "I was aware of dryness of my mouth",
          "I couldn't seem to experience any positive feeling at all",
          "I experienced breathing difficulty (e.g., excessively rapid breathing, breathlessness in the absence of physical exertion)",
          "I found it difficult to work up the initiative to do things",
          "I tended to over-react to situations",
          "I experienced trembling (e.g., in the hands)",
          "I felt that I was using a lot of nervous energy",
          "I was worried about situations in which I might panic and make a fool of myself",
          "I felt that I had nothing to look forward to",
          "I found myself getting agitated",
          "I found it difficult to relax",
          "I felt down-hearted and blue",
          "I was intolerant of anything that kept me from getting on with what I was doing",
          "I felt I was close to panic",
          "I was unable to become enthusiastic about anything",
          "I felt I wasn’t worth much as a person",
          "I felt that I was rather touchy",
          "I was aware of the action of my heart in the absence of physical exertion (e.g., sense of heart rate increase, heart missing a beat)",
          "I felt scared without any good reason",
          "I felt that life was meaningless",
        ];

        const translatedQuestions = await Promise.all(
          questions.map((question) => translateText(question, selectedLanguage))
        );

        setTranslatedText({
          questions: translatedQuestions,
          next: await translateText("Next", selectedLanguage),
          submit: await translateText("Submit", selectedLanguage),
          pageInfo: await translateText("Page", selectedLanguage),
          of: await translateText("of", selectedLanguage),
        });
      };

      loadThemeAndTranslations();
    }, [selectedLanguage])
  );

  // Answer handling
  const handleAnswer = (questionIndex, answer) => {
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

  const submitAssessment = () => {
    alert(translatedText.submit + " " + "Assessment Submitted");
    console.log("User Answers:", answers);
  };

  // Render each question with translated text
  const renderQuestion = (questionIndex) => (
    <View style={styles.questionContainer} key={questionIndex}>
      <Text style={{ color: theme.colors.textPrimary, fontSize: textSize }}>
        {translatedText.questions[questionIndex - 1]}
      </Text>
      <View style={styles.answerRow}>
        {[0, 1, 2, 3].map((value) => (
          <TouchableOpacity
            key={value}
            style={[
              styles.answerButton,
              answers[questionIndex] === value && {
                backgroundColor: theme.colors.accent || "#a5a5ff",
              },
            ]}
            onPress={() => handleAnswer(questionIndex, value)}
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
        {page < 5 ? (
          <Button title={translatedText.next} onPress={nextPage} />
        ) : (
          <Button title={translatedText.submit} onPress={submitAssessment} />
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
    marginTop: 20,
  },
});

export default Dass21Screen;
