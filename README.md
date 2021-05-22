# Computer Store Backend

Backend with Express, MongoDB and MercadoPago for Computer Store ecommerce.

## Getting started

 1. Install dependencies with `yarn`
	 + `$ yarn`
 2.  Create `.env` file and set the required environment variables
```
# Mongo DB connection URI.
MONGO_DB_URI=
# Secret key for JsonWebTokens.
JWT_SECRET=
# JSON credentials in a string format. Can use JSON.stringify() to get it.
FIREBASE_CREDENTIALS_JSON=
```
3. Run the app in development mode
	+ `$ yarn dev`

## Scripts

 - `$ yarn start` : run the app in production mode
 - `$ yarn dev` : run the app in development mode
 - `$ yarn build` : compile the project using babel
 - `$ yarn clean` : remove the build directory
 - `$ yarn test` : run tests using jest
 - `$ yarn test:silent` : run tests without app console logs
 - `$ yarn test:detailed` : run tests with all console logs
 - `$ yarn test:watch` : run tests and keep watching

## Environment variables

Create `.env` file to set the environment variables

```
# Custom port to run the app
PORT=

# Custom port to run the tests
PORT_TEST=

# Mongo DB connection URI.
MONGO_DB_URI=

# Test Mongo DB connection URI
MONGO_DB_URI_TEST=

# Secret key for JsonWebTokens.
JWT_SECRET=

# JSON credentials in a string format. Can use JSON.stringify() to get it.
FIREBASE_CREDENTIALS_JSON=
```