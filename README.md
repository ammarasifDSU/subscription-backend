### Getting Started
To get started with the backend API, follow the steps below:

1. Clone this repository to your local machine.

2. Install the required dependencies by running the following command in the project root:

### `npm install`

3. Set up the database configurations:

    * For PostgreSQL, create a database and update the config/dbconnection.js file with the correct database credentials.
    * For MongoDB, make sure you have MongoDB installed and running. Update the config/dbconnection.js file with the MongoDB connection URI.

4. Start the backend server by running the following command:

### `npm start`

The API should now be running on http://localhost:3001.

### Available Scripts
In the project directory, you can run the following scripts:

`npm start`
Starts the backend server in production mode.

`npm run dev`
Starts the backend server in development mode using Nodemon, which automatically restarts the server when code changes are detected.

### API Endpoints
The API provides the following endpoints:

1. Unprotected APIs
    POST /login: Authenticate the user and generate an authorization token. (Payload: JSON)
    POST /register: Register a new user. (Payload: JSON)
    POST /statistics: Fetch statistics data like total users, total subscriptions, total successful subscriptions, and total failed subscriptions. (No authentication required)
    POST /logout: Logging out the user. (No authentication required)
2. Protected APIs
    POST /subscribe: Subscribe the authenticated user to a service. (Payload: JSON)
    POST /unsubscribe: Unsubscribe the authenticated user from a service. (Payload: JSON)
    POST /services: Fetch the list of available services. (Authentication required)
    POST /subscription-callback: Receive subscription notifications/callbacks from the Partner. (Payload: JSON, Example payload not provided as it will be sent by the Partner)
    POST /unsubscription-callback: Receive unsubscription notifications/callbacks from the Partner. (Payload: JSON, Example payload not provided as it will be sent by the Partner)

### How to Test the API
To test the API, you can use tools like Postman or cURL to make HTTP requests to the API endpoints.

For unprotected APIs, simply send the required payload (if any) in the request body and check the response.

For protected APIs, you will need to obtain an authorization token by registering a new user and then using the login API to get the token. Add the token to the request header for protected API requests.

### Technologies Used
Node.js
Express.js
PostgreSQL
MongoDB
