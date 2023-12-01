# DogWalk API

## About

DogWalk is an API developed to connect dog owners and dog walkers in their local communities. The API aims to foster a sense of camaraderie among dog owners and make dog walking a more enjoyable and social experience. It provides features for managing users, dogs and walks. It also uses hardware API's for notifications and managing users position tracking.
Enabling dog owners to easily find and connect with other dog walkers in their vicinity.

## Members

- [Dorasamy Ryan](https://github.com/tupidix)
- [Marques Meliciano Patrick](https://github.com/PatrickMarques24)
- [Martins Quinteiros Miguel](https://github.com/quinteirosm)

## Features

DogWalk offers several key features to facilitate dog walking connections:

- **User Management**: Create, update, and manage user profiles, including user credentials, contact information, and preferences.

- **Dog Management**: Register, update, and manage dog profiles, including dog name, breed, age, and temperament.

- **Dog Rivalry**: You can register other dogs as ennemies, thus they won't be able to join you and you'll receive a notification if they're closer to you while walking your dog.

- **Walk Management**: Create, schedule, and manage dog walks, specifying location, duration, and availability.

- **Location-Based Matching**: Find dog walkers and walks in the user's vicinity, using geolocation features.

- **Walk Joining**: Dog owners can join available walks or request to join unscheduled walks.

- **Real-Time Communication**: Dog owners and walkers can communicate directly through in-app messaging.

- **Walk History**: Track and view past walks for each user and dog.

## How to Use

To utilize the DogWalk API, follow these steps:

1. **Installation**:

   - Clone the repository: `git clone https://github.com/YourRepository/DogWalk.git`
   - Install dependencies: `npm install`

2. **Configuration**:

   - Configure your database and environment variables in the `config/` directory.

3. **Starting the API**:

   - Launch the API using `npm start` or `node bin/start.js`.

4. **Usage**:
   - Utilize an API client like Postman or cURL to interact with the API.
   - Refer to the API documentation (OpenAPI specification) for detailed information on available routes, methods, and expected responses.

## WebSocket

To receive notifications from the DogWalk API, connect to our WebSocket at "ws://dogwalkapi.onrender.com" on Postman. Notifications are triggered when a route is created or when a user joins a route.

## API Documentation

Once the API is running, the documentation can be accessed via the API docs URL: [localhost:3000/api-docs](http://localhost:3000/api-docs), offering an interactive interface to explore and test the API's endpoints.

Production documentation URL : [dogwalkapi.onrender.com/api-docs/](https://dogwalkapi.onrender.com/api-docs/).

## Tests

Unit and integration tests are available in the `tests/` directory. You can run them with `npm run test` to ensure the quality and reliability of the API.

## License

This project is licensed under the MIT License.
