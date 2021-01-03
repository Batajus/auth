# Auth

This project contains a client and server application for a default user authentication and registration, whereby the authorization is realised with JSON Web Tokens. 

The idea of the project is to provide a basic user authentication for a defined number of features/projects, which an admin user can add. So it shouldn't be required anymore to implement a user authentication for each project.

## Client and Server
The client consists of Angular in the currently latest version and the backend uses Express and MongoDB as database.

### Client
To start the client you need to install the packages first with

    npm install

After that you can start the client with 

    npm start

### Server
You also need to install the packages here

    npm install

And then you can run the server with

    npm start

### Database
For setting up the datase you need to install MongoDB regarding their tutorial. And after finishing the tutorial you need to add a database with the name `auth`.