# Voila Backend Notification Service

- Backend service that sends notifications in a high load seamlessly using message queue (producer/Consumer).
- Built in **NodeJS, ExpressJS, MongoDB, Redis, Bull `distributed message queue`**.
- Client has to just formulate the ca query parameters and producer will add a job to Bull job queue.
- Bull consumer/worker will receive the job and process it seamlessly.
- App has One API endpoint
    - POST `/api/v1/notify` which triggers a notification job to be sent only once based on the entered criteria.

## Running with Docker
- Run application using docker-compose by running `docker-compose up --build`
- Application will take around ~2.5 Minute to generate +1.5 Million records dummy data using `Fake npm package` for testing.` Runs only onetime`.
- App will run on http://localhost:3001.
- Please check App container logs to check the progress.

## Calling API
- Three possible scenarios for calling the API
  - Calling without setting any `Body Params`.
  - Calling with/out setting city name **city** `Body Params`.
  - Calling with/out setting user's name starts with **letter** `Body Params`.
## API Response
- A message to let you know that the Message Queue has received the request and will process it in background


- ### Postman
    - POST `http://localhost:3001/api/v1/notify` and set the optional parameters of request's body
- ### CURL
    - to update the latest quote using curl run `curl -d "city=value1&letter=value2" -X POST http://localhost:3001/api/v1/notify`