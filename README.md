# LangJam
A state of the art language learning game, built for all the budding linguaphiles out there!

## Steps to reproduce the project
1. Install docker
2. Set ENV variables(in .env file in backend dir):
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
