# MindMates Mobile App 🚀

A mental health and wellness mobile application built using **React Native** and **Expo**. Designed to help users track their mood, complete assessments like DASS21, and explore curated readings. The app offers seamless login, multilingual support, and push notifications, creating an engaging and personalized experience.

---
# Download the Android App

🎉 First Release: You can download the APK file for the Mind Mates app from the link below:

👉 [**Download Mind Mates v1.0.0-beta**](https://github.com/ishfakrafi/mind-mates/releases/tag/v1.0.0-beta)


## ✨ Features

- 📊 **Mood Tracking**: Log your daily moods and track your progress over time.
- 📄 **Journaling**: Write your thoughts and feelings in a personal journal.
- 📝 **DASS21 Assessment**: Measure Depression, Anxiety, and Stress levels with the scientifically validated DASS21 assessment.
- 🧘 **Exercises**: Guided exercises for mindfulness and relaxation.
- 📚 **Readings**: Explore curated articles to improve mental well-being.
- 🔔 **Notifications**: Gentle reminders to check in with your mental health.

---

## 🛠️ Tech Stack

- **Framework**: React Native (Expo)
- **Backend**: Firebase Firestore for authentication, user data and notifications
- **APIs**: WordPress REST API for dynamic content and Azure Translator API for real-time content translation into multiple languages
- **Notifications**: Expo Push Notifications

---

## ⚙️ Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/mindmates-app.git
   ```
2. Navigate to the project directory:
   ```bash
   cd mindmates-app
   ```
   Install dependencies:
3. ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npx expo start
   ```

## 🌟 How It Works
1. Mood Tracking:
- Log how you're feeling every day.
- Get insights into your emotional patterns over time.
2. Journaling:
- Write freely about your day.
- All entries are securely stored in Firebase Firestore.
3. Explore Readings:
- Dynamic content is fetched from WordPress.
- Provides relevant and curated articles.
4. DASS21 Assessment:
- Answer preset questions.
- Self assessment on your Depression, Anxiety and Stress levels.

# API Integration
## WordPress REST API
- Articles and readings are dynamically fetched using the WordPress REST API.
-URL: https://mindmates.adventcom.co/wp-json/wp/v2/posts
## Firebase
- Authentication: Google Sign-In and Email Login
- Database: Firestore for user data and logs
- Push Notifications: Expo Notifications API
## Azure
- Real-time translation: To tailor content to user's native language


## 🤝 Contributors
- App Development: Ishfak Bin Munsur and Linda Hu
- Background research, analysis and literature review: Linda Hu, Diana Innocent, and Liyue Zhang
