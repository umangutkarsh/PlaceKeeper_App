# PlaceKeeper_App <img src="https://static-00.iconduck.com/assets.00/location-indicator-red-emoji-1330x2048-pfre7pru.png" height="40px" width = "28px"/>

[![Mongo Badge](http://img.shields.io/badge/Database%20-MongoDB-darkgreen?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)
&emsp;
[![Express Badge](http://img.shields.io/badge/Server%20-Express-black?style=for-the-badge&logo=express)](https://expressjs.com/)
&emsp;
[![Reactjs Badge](http://img.shields.io/badge/Client%20-React-blue?style=for-the-badge&logo=react)](https://reactjs.org/)
&emsp;
[![Node Badge](http://img.shields.io/badge/Backend%20-Node-green?style=for-the-badge&logo=node.js)](https://nodejs.org/en/)
&emsp;


## Overview
An app to manage places and their users using the MERN-Stack (MongoDB-database, ExpressJS-server, ReactJS-client, NodeJS-backend). Also 'Mongoose' is used to create data models.

[![Mongoose Badge](https://img.shields.io/badge/Mongoose-800?logo=mongoose&logoColor=fff&style=for-the-badge)](https://mongoosejs.com/)
<br>

![placeKeeper](https://github.com/umangutkarsh/PlaceKeeper_App/assets/95426993/7ba6a9b5-2848-4f4d-bd53-22cf110d9bb4)



In this application, users can create and add new places to their account, and edit the information, delete the place from the database and view the place on Google maps.

## Contents
* [Features](https://github.com/umangutkarsh/PlaceKeeper_App/tree/main#features)
* [Configured Functionalities](https://github.com/umangutkarsh/PlaceKeeper_App/tree/main#configured-functionalities)
* [Work in Progress](https://github.com/umangutkarsh/PlaceKeeper_App/tree/main#work-in-progress)
* [Learn More](https://github.com/umangutkarsh/PlaceKeeper_App/tree/main#learn-more)

<br />



### Features
* 🔒 Authentication (Login, Logout and Register)
* 👨‍💻 Profile management
* 🖊️ Edit and delete places
* 📍 View the places on map
* ➕ Add new Places to user accounts
* 📱 Mobile Responsive

<br />

### Configured Functionalities
* Frontend (React.JS)
  * Starting Setup, Pages and Routes
  * Added a UserList Page/Component
  * Added a UserItem Component
  * Styling app and more Components
  * Presentatioanl and Stateful components
  * Added MainHeader and NavLinks
  * Implemented basic desktop and mobile navigation
  * Understanding of ReactDOM portals - Handled the Drawer state, Animated the side-drawer
  * Rendered UserPlaces and used dynamic Route segments
  * Route Params
  * Added custom buttons
  * Added a Modal
  * Rendered a Map with Google Maps (to be worked upon)
  * Added custom form-input component, Managed state in the Input component, Added input validation
  * Shared input values and added multiple inputs
  * Managed form-wide state
  * Finished Add-Place form
  * Worked on UpdatePlace form
  * Adjusted input-component
  * Created custom-form hook (useForm)
  * Worked on Deletion warning
  * Added 'Auth' page and 'Login' form
  * Added Signup + 'Switch-mode button'
  * Added AuthContext for App-Wide state management
  * Listening to Context-Changes
  * Adding Authenticated and un-Authenticated routes
  * AuthContext usage incorporating the LOGOUT functionality
  * Confirmation modal for LOGOUT handling event.

* Backend (Node.js and Express.js)
  * Implemented basic routing
  * Added place-specific routes
  * GET a place by user ID
  * Error handling, adding own Error Modal
  * Added controllers
  * Added POST route and using POSTMAN
  * Error handling for unsupported routes
  * Added patch routes to update places
  * DELETE places
  * Setup user routes (Signup, Login, Get users)
  * Validating API input (Request bodies)
  * Used Google's Geocoding API (to be worked upon)

* Database (MongoDB and Mongoose)
  * Connecting backend to mongoDB
  * Creating the place schema and model
  * Creating and storing documents in the database
  * GET places by placeID
  * Update and Delete places
  * Users and Places relation establishment
  * Creating user model
  * Using the User model for signup
  * Adding the User login
  * Getting users
  * Adding relation between places and users
  * Create places and add it to the users - Transactions and Sessions
  * Deleting places and removing it from the User
 
* Connecting Frontend to Backend:
  * Sending POST Request to the backend - fetch() api is used
  * Handled CORS (Cross-origin resource sharing) errors.
  * Worked on Error handling
  * Sending Login Request
  * Getting users with GET request
  * Created custon Http hook
  * Using Http hook to GET users
  * Adding places using the POST request
  * Loading places by user ID
  * Update and Delete Places
  * Worked on Authorization
 
<br />


### Work in Progress
* Google Maps API not working correctly, need to fix that
* Dark Mode
* Fix minor bugs
* Host the App on Heroku

<br />


### Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn how to setup a local MongoDB instance for testing, check out how to [Connect to MongoDB](https://docs.mongodb.com/guides/server/drivers/).

To learn React, check out the [React documentation](https://reactjs.org/).

<br />

### The main take-away of this project is that every component (form buttons, inputs, to custom error handlers, and custom hooks) is custom made and not pre-defined.
