import React, { useState } from "react";
import { View, Text, TouchableOpacity, Button, StyleSheet } from "react-native";

const Dass21Screen = () => {
  const [page, setPage] = useState(1); // Track which page the user is on
  const [answers, setAnswers] = useState({}); // Track answers for each question

  // handle answer selection
  const handleAnswer = (questionIndex, answer) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionIndex]: answer,
    }));
  };

  // if page < 5, go to the next page
  const nextPage = () => {
    if (page < 5) {
      setPage(page + 1);
    }
  };

  // Function to handle submission information
  const submitAssessment = () => {
    alert("Assessment Submitted");
    console.log("User Answers:", answers);
  };

  const renderQuestion = (questionIndex, questionText) => (
    <View style={styles.questionContainer} key={questionIndex}>
      <Text>{questionText}</Text>
      <View style={styles.answerRow}>
        {[0, 1, 2, 3].map((value) => (
          <TouchableOpacity
            key={value}
            style={[
              styles.answerButton,
              answers[questionIndex] === value && styles.selectedButton,
            ]}
            onPress={() => handleAnswer(questionIndex, value)}
          >
            <Text style={styles.answerText}>{value}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.pageInfo}>Page {page} of 5</Text>

      {/* Page 1 Questions */}
      {page === 1 && (
        <>
          {renderQuestion(1, "I found it hard to wind down")}
          {renderQuestion(2, "I was aware of dryness of my mouth")}
          {renderQuestion(
            3,
            "I couldn't seem to experience any positive feeling at all"
          )}
          {renderQuestion(
            4,
            "I experienced breathing difficulty (e.g., excessively rapid breathing, breathlessness in the absence of physical exertion)"
          )}
          {renderQuestion(
            5,
            "I found it difficult to work up the initiative to do things"
          )}
        </>
      )}

      {/* Page 2 Questions */}
      {page === 2 && (
        <>
          {renderQuestion(6, "I tended to over-react to situations")}
          {renderQuestion(7, "I experienced trembling (e.g., in the hands)")}
          {renderQuestion(8, "I felt that I was using a lot of nervous energy")}
          {renderQuestion(
            9,
            "I was worried about situations in which I might panic and make a fool of myself"
          )}
          {renderQuestion(10, "I felt that I had nothing to look forward to")}
        </>
      )}

      {/* Page 3 Questions */}
      {page === 3 && (
        <>
          {renderQuestion(11, "I found myself getting agitated")}
          {renderQuestion(12, "I found it difficult to relax")}
          {renderQuestion(13, "I felt down-hearted and blue")}
          {renderQuestion(
            14,
            "I was intolerant of anything that kept me from getting on with what I was doing"
          )}
          {renderQuestion(15, "I felt I was close to panic")}
        </>
      )}

      {/* Page 4 Questions */}
      {page === 4 && (
        <>
          {renderQuestion(
            16,
            "I was unable to become enthusiastic about anything"
          )}
          {renderQuestion(17, "I felt I wasn’t worth much as a person")}
          {renderQuestion(18, "I felt that I was rather touchy")}
          {renderQuestion(
            19,
            "I was aware of the action of my heart in the absence of physical exertion (e.g., sense of heart rate increase, heart missing a beat)"
          )}
          {renderQuestion(20, "I felt scared without any good reason")}
        </>
      )}

      {/* Page 5 Questions */}
      {page === 5 && (
        <>{renderQuestion(21, "I felt that life was meaningless")}</>
      )}

      <View style={styles.buttonContainer}>
        {/* Navigate to the next page */}
        {page < 5 ? (
          <Button title="Next" onPress={nextPage} />
        ) : (
          <Button title="Submit" onPress={submitAssessment} />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  pageInfo: {
    fontSize: 16,
    marginBottom: 20,
    color: "gray",
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
  selectedButton: {
    backgroundColor: "#a5a5ff",
  },
  answerText: {
    fontSize: 16,
  },
  buttonContainer: {
    marginTop: 20,
  },
});

export default Dass21Screen;
