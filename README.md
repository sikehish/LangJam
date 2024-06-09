![image](https://github.com/sikehish/LangJam/assets/118361679/9843242e-8366-4a07-9ffd-7f72a9c5b38b)# LangJam

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
## Features
### Home
![image](https://github.com/sikehish/LangJam/assets/118361679/d5d092d6-7783-445d-ac5a-796f86ef9d5b)
![image](https://github.com/sikehish/LangJam/assets/118361679/821e47f6-a510-4e91-bb6a-9d27fe77d76d)
![image](https://github.com/sikehish/LangJam/assets/118361679/b15f13b3-55b2-4a32-9ebd-8b23427d2c88)

### Login/Signup:
![image](https://github.com/sikehish/LangJam/assets/118361679/8f1fecd6-19c7-48bf-a468-57529cd0d4e2)
![image](https://github.com/sikehish/LangJam/assets/118361679/16f68cbc-2d97-4ebf-a774-c40577dffd73)

### Categories:
![image](https://github.com/sikehish/LangJam/assets/118361679/ae4bf5f7-faa6-4b63-a5ed-f3c075c524b3)
![image](https://github.com/sikehish/LangJam/assets/118361679/b49353e4-ff97-46c8-b86a-cb9fd149bf9f)

### Quizzes
![image](https://github.com/sikehish/LangJam/assets/118361679/0c7e07c2-9f36-43b2-8a35-a3305dd31c4d)
![image](https://github.com/sikehish/LangJam/assets/118361679/70a4daa2-f925-43bf-bae1-7a03e64b4e71)
![image](https://github.com/sikehish/LangJam/assets/118361679/3b6739a0-2f23-4fcc-b01c-fda84c17914f)

### Note Taking:
![image](https://github.com/sikehish/LangJam/assets/118361679/68090b4a-e8e5-4737-b7fd-50bba7b95975)
 
 ### LangBot:
![image](https://github.com/sikehish/LangJam/assets/118361679/d2db62f5-14b3-43bc-840e-d9086a698054)

### Notes Section:
![image](https://github.com/sikehish/LangJam/assets/118361679/fc1b0079-786a-41ea-9cbb-1f9c78b620a4)

### Leaderboard:
![image](https://github.com/sikehish/LangJam/assets/118361679/1b6ce4fe-01e4-4a14-87fb-6a69bb4da0d2)

### Profile Section:

![image](https://github.com/sikehish/LangJam/assets/118361679/c9b9ce84-80e4-47b8-8381-2ad13a734615)

### Admin Login:
![image](https://github.com/sikehish/LangJam/assets/118361679/45f05d9e-99db-487c-9ddd-d070934c8202)

### Admin Dashboard:
![image](https://github.com/sikehish/LangJam/assets/118361679/0d947f5d-af3d-4856-8355-9b4253ce5883)

### Creating New Category:
![image](https://github.com/sikehish/LangJam/assets/118361679/1a569bb5-2c68-4521-85b6-f521d5fd696f)
![image](https://github.com/sikehish/LangJam/assets/118361679/0691bfdd-d14f-4c96-852b-e052dc6c9529)

### Step-by-Step Process for Manual Quiz Creation
![image](https://github.com/sikehish/LangJam/assets/118361679/813288d6-2080-4ff3-9eeb-91b6aa9bf2d3)
![image](https://github.com/sikehish/LangJam/assets/118361679/231e8c29-7156-4bf4-95f6-a26903b312c6)


## Get Started

Ready to embark on your learning journey with LangJam? Simply sign up for an account, explore our wide range of subjects and topics, and start learning at your own pace. Whether you're a beginner or an experienced coder, LangJam has everything you need to take your skills to the next level.

Join LangJam today and unlock a world of knowledge, innovation, and endless possibilities. Happy learning!

