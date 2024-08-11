# DentalGLM Project

This project includes a Node.js backend (`dentalglm-backend`) and a React frontend (`dentalglm-frontend`). Follow the steps below to set up both components.

## Setup Backend

1. **Clone the Repository**

   First, clone the repository to your local machine and navigate to that repository. Then navigate to the dentalglm-backend:
   ```bash
   cd ./dentalglm-backend

2. **Install Dependencies**

   Install the required dependencies by downloading the necessary packages:
   ```bash
   npm install

3. **Create an ENV File**

   In the dentalglm-backend directory, create a .env file and add the following environment variables:
   ```
   MONGO_DB=<your-mongodb-uri>
   JWT_SECRET=<your-jwt-secret>
   GEMINI_API_KEY=<your-gemini-api-key>
   
4. **Start the Backend Server**

   After setting up the environment variables, start the backend server:
   ```bash
   npm start

## Setup Frontend

1. **Navigate to the Frontend Directory**

   Open a new terminal window or tab and navigate to the dentalglm-frontend directory:
   ```bash
   cd ./dentalglm-frontend

2. **Install Frontend Dependencies**

   Install the required npm packages for the React frontend:
   ```bash
   npm install

3. **Start the Frontend Server**

   After installing the packages, start the frontend server:
   ```bash
   npm start

## Access the Application
Once both the backend and frontend servers are running, you can access the application by navigating to the port the frontend is running on using your browser.

  




