# TODO HIVE Backend

Welcome to the backend repository of TODO HIVE, a robust MERN-based task management system. This repository serves as the backend implementation, providing essential functionalities to support task management, user authentication, and administrative features.

## Features

- **User Authentication:** Implement secure user authentication to ensure data privacy.
- **Admin Dashboard:** Facilitate administrative capabilities for efficient task oversight.
- **API Integration:** Communicate with the frontend to manage tasks and user interactions.

## Getting Started

1. **Clone the Repository:**
    ```
    git clone https://github.com/Salf1-Sabit/Todo-App-II-server-.git
    ```

2. **Install Dependencies:**
    ```
    cd Todo-App-II-server-
    npm install
    ```

3. **Set Up Environment Variables:**
    - Create a `.env` file based on `.env.example` and add necessary configurations.

4. **Run the Server:**
    ```
    npm start
    ```

## API Endpoints

- **Authentication:**
    - `/login`: POST - User login endpoint.
    - `/register`: POST - User registration endpoint.

- **Users Management:**
    - `/api/getallusers`: GET - Get all the users.
    - `/api/updateuser`: PATCH - Update an existing user.
      
- **Tasks Management:**
    - `/api/gettodo`: GET - Retrieve tasks.
    - `/api/tasks/create`: POST - Create a new task.
    - `/api/updatetodo`: PATCH - Update an existing task.
    - `/api/deletetodo/:_id`: DELETE - Delete a task.
