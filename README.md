# LangJam

A state of the art language learning game, built for all the budding linguaphiles out there!
LangJam is an innovative platform designed to make learning technical subjects and coding fun, accessible, and effective for people of all walks of life. Whether you're a seasoned developer looking to expand your skill set or a beginner eager to dive into the world of programming, LangJam has something for you.

## Features

### Learning Hierarchy

Our structured approach to learning ensures that you can progress from broad categories to specific quizzes seamlessly. Start by exploring **broad language categories**, dive deeper into **specific subjects within each category**, explore **detailed topics**, and finally, **test your knowledge with quizzes**.

**The hierarchy is as follows: Categories -> Subjects -> Topics -> Quizzes**

### AI-Generated Quiz Creation

Powered by advanced artificial intelligence, LangJam offers an AI-generated quiz creation feature for admins. This feature allows admins to effortlessly create quizzes tailored to specific topics and subjects, ensuring a dynamic and engaging learning experience for users.

### AI Chatbot Powered by Gemini

Need help solving quiz questions or understanding complex topics? Our AI chatbot, powered by Gemini, is here to assist you every step of the way. Get instant explanations, clarifications, and guidance to enhance your learning journey.

### Real-time Feedback

Receive real-time feedback on your quiz performance, allowing you to track your progress and identify areas for improvement. With our intuitive feedback system, you'll always know where you stand and how you can enhance your skills.

### Leaderboard

Stay motivated and track your progress with our leaderboard feature. Compete with friends, colleagues, and fellow learners, climb the ranks, and celebrate your achievements as you master new subjects and topics.

### Customizable Learning Experience

Tailor your learning experience to suit your preferences with LangJam's customizable features. Admins have the option to create their own questions or utilize the auto-generated questions feature. Users can also add notes as they learn, ensuring a personalized and effective learning journey.

## Steps to reproduce the project
1. Install docker
2. Set ENV variables(in .env file in backend dir): <br />
NOTE:You may modify the PORT and CLIENT_URL depending on the port/endpoint on which your frontend and backend are running.
```
GOOGLE_API_KEY
MONGO_PW
PORT=3000  
JWT_KEY
JWT_VERIFY_KEY
JWT_ADMIN_KEY
CLIENT_URL=localhost:5173
# GMAIL_USERNAME
# GMAIL_PASSWORD
GEMINI_KEY
REDIS_PASSWORD
REDIS_URI
```
3. Run the below command
```bash
sudo docker-compose down && sudo docker-compose up --build
```

## Get Started

Ready to embark on your learning journey with LangJam? Simply sign up for an account, explore our wide range of subjects and topics, and start learning at your own pace. Whether you're a beginner or an experienced coder, LangJam has everything you need to take your skills to the next level.

Join LangJam today and unlock a world of knowledge, innovation, and endless possibilities. Happy learning!

