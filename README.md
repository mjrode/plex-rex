# What2Watch2Night

[What2Watch2Night](https://what2watch2night.herokuapp.com/) is a free open source application to help Plex users find new movies and TV shows. Movies and TV shows are recommended to you based on your current Plex watching habits.

[View Demo](https://streamable.com/ghkbb)

_This is still in development. If you would like to help contribute feel free to check out any of the open issues._

## Setup and install

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system

## Installing
Clone the repository

`git clone git@github.com:mjrode/WhatToWatch.git`

 cd into the new directory

 `cd WhatToWatch`

## Server (run from the root directory)

Install dependencies

 `npm install`

Install npx to easily run migrations
`npm install -g npx`


Create database, test database, and run the migrations
`npx sequelize db:create`
`NODE_ENV=test npx sequelize db:create`
`npm run db:reset`

## Prerequisites
* **Required Keys**
  #### Rename `example.env` to `.env` and update the test tokens with your tokens


  [Google OAuth 2.0](https://developers.google.com/identity/protocols/OAuth2)
  * `GOOGLE_CLIENT_ID`
  * `GOOGLE_CLIENT_SECRET`

  [cookie-session](https://www.npmjs.com/package/cookie-session)
    * `COOKIE_KEY`

  [Express Port (optional)](https://expressjs.com)
    * `PORT` _defaults to 8080 if no value is provided_

  [The Movie DB](https://developers.themoviedb.org/3/getting-started)
    * `MOVIE_API_KEY`

  [TasteDive](https://tastedive.com/read/api)
    * `TDAW_API_TOKEN`

## Running the tests
  `npm test`

# Client (run from WhatToWatch/client)
  ## install dependencies
  `npm install`

## Run application 
Concurrently run the frontend and backend servers

`npm run dev`

## Built With
* [Node](www.example.com)
* [React](www.example.com)