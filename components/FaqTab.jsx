import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import tw from "tailwind-react-native-classnames";

const faqData = [
  {
    question: "What is mental health?",
    answer:
      "Mental health includes our emotional, psychological, and social well-being. It affects how we think, feel, and act.",
  },
  {
    question: "How do I know if I need help?",
    answer:
      "If you experience prolonged periods of sadness, anxiety, or stress, or if these feelings interfere with your daily life, you may benefit from talking to a professional.",
  },
  {
    question: "What is the DASS 21 assessment?",
    answer:
      "The DASS 21 is a set of three self-report scales designed to measure the emotional states of depression, anxiety, and stress.",
  },
  {
    question: "Can meditation help with anxiety?",
    answer:
      "Yes, meditation and mindfulness practices can help reduce stress and anxiety by promoting relaxation and awareness.",
  },
  {
    question: "What is anxiety?",
    answer:
      "Anxiety is a feeling of worry, nervousness, or unease about something with an uncertain outcome. It’s a normal emotion, but it can become problematic when it interferes with daily life.",
  },
  {
    question: "How can I reduce stress on a daily basis?",
    answer:
      "You can reduce stress by practicing mindfulness, engaging in physical activity, getting enough sleep, and talking to someone you trust about what you're experiencing.",
  },
  {
    question: "How does exercise impact mental health?",
    answer:
      "Regular exercise can help reduce feelings of anxiety and depression by releasing endorphins, the brain's natural feel-good chemicals. It also helps improve sleep, which can positively affect your mental health.",
  },
  {
    question: "What are some common signs of depression?",
    answer:
      "Common signs of depression include persistent sadness, loss of interest in activities, changes in appetite, sleep disturbances, fatigue, and difficulty concentrating.",
  },
  {
    question: "Is it normal to feel anxious from time to time?",
    answer:
      "Yes, it is normal to feel anxious in certain situations, such as before a big event or decision. However, if anxiety becomes overwhelming or persistent, it may be helpful to speak with a mental health professional.",
  },
  {
    question: "How does breathing exercise help with stress?",
    answer:
      "Deep breathing exercises activate the parasympathetic nervous system, which helps to calm the mind and reduce stress by lowering the heart rate and promoting relaxation.",
  },
  {
    question: "What is mindfulness?",
    answer:
      "Mindfulness is the practice of being fully present and engaged in the current moment, without judgment. It can help reduce stress and improve overall well-being by encouraging a more focused and calm mind.",
  },
  {
    question: "Can poor sleep affect mental health?",
    answer:
      "Yes, poor sleep can negatively impact your mental health, leading to irritability, difficulty concentrating, and increased stress. Ensuring you get enough restful sleep is essential for maintaining good mental health.",
  },
  {
    question: "What are common triggers for anxiety?",
    answer:
      "Common triggers for anxiety include work-related stress, financial concerns, relationship issues, health problems, and major life changes. Identifying your triggers can help you better manage anxiety.",
  },
  {
    question: "Can mental health improve over time?",
    answer:
      "Yes, with the right support and self-care strategies, mental health can improve over time. This may involve therapy, medication, lifestyle changes, or a combination of approaches.",
  },
  {
    question: "How can I help a friend who is struggling with mental health?",
    answer:
      "Offer support by listening without judgment, encouraging them to seek professional help, and reminding them that they're not alone. Small gestures of kindness and check-ins can make a big difference.",
  },
  {
    question: "Is it normal to feel overwhelmed sometimes?",
    answer:
      "Yes, it's normal to feel overwhelmed, especially during stressful periods. If the feeling persists, it can be helpful to practice self-care, set boundaries, and seek professional help if necessary.",
  },
];

const FaqTab = () => {
  const [expandedIndex, setExpandedIndex] = useState(null);

  const toggleExpand = (index) => {
    if (expandedIndex === index) {
      setExpandedIndex(null); // Collapse if clicked again
    } else {
      setExpandedIndex(index); // Expand the clicked question
    }
  };

  return (
    <ScrollView vertical style={tw`flex flex-col w-full`}>
      {faqData.map((faq, index) => (
        <View
          key={index}
          style={[tw`bg-white p-4 mb-4 rounded-[25px]`, { borderRadius: "25" }]}
        >
          <TouchableOpacity onPress={() => toggleExpand(index)}>
            <View style={tw`flex-row justify-between items-center`}>
              <Text style={tw`text-black font-semibold text-sm`}>
                {faq.question}
              </Text>
              <Text style={tw`text-black font-bold`}>
                {expandedIndex === index ? "-" : "+"}
              </Text>
            </View>
          </TouchableOpacity>

          {expandedIndex === index && (
            <View style={tw`mt-2`}>
              <Text style={tw`text-gray-500 text-sm`}>{faq.answer}</Text>
            </View>
          )}
        </View>
      ))}
    </ScrollView>
  );
};

export default FaqTab;
