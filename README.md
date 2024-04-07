
# Guidewheel Assignment

This project is a full-stack web application to analyse Pump Data of a Machine for a given day via CSV file.  This project is divided into frontend and backend sections, each with its own set of dependencies and setup instructions. The application showcases a React-based frontend and an Express-based backend.

## Getting Started

To get this application running on your local machine, follow the setup instructions for both the frontend and the backend parts below.

### Prerequisites

- Node.js and npm installed
- Any of the popular IDE

### Tech Stack Used

- **Frontend**:
1. React: For building the user interface.
2. D3.js librabry: For data visualizations.

- **Backend**:
1. Node.js: The runtime environment for running JavaScript on the server.
2. Express: For handling HTTP requests and serving the backend API.
3. SQLite: Database to store parsed CSV data.

### Setup Backend

1. Navigate to the `backend` directory from the project root:
   ```bash
   cd backend
   ```
2. Install the dependencies:
   ```bash
   npm install
   ```
3. Start the backend server:
   ```bash
   node server.js
   ```
   The server will start, and you should see a message indicating it's listening on a specified port.

### Setup Frontend

1. Navigate to the `frontend` directory from the project root:
   ```bash
   cd frontend
   ```
2. Install the dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```
   This command will launch the React application in your default browser.

## Project Structure

- **Frontend**:
  - `src`: Source code for the React application.
- **Backend**:
  - `data`: Data files or scripts (if applicable).
  - `routes`: Express routes.
  - `server.js`: Entry point for the backend server.

## Additional Information

- By default React runs on port 3000 and Express on 5000.

