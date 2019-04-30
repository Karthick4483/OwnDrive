Welcome to the mean stack
The mean stack is intended to provide a simple and fun starting point for cloud native fullstack javascript applications.
MEAN is a set of Open Source components that together, provide an end-to-end framework for building dynamic web applications; starting from the top (code running in the browser) to the bottom (database). The stack is made up of:

MongoDB : Document database – used by your back-end application to store its data as JSON (JavaScript Object Notation) documents
Express (sometimes referred to as Express.js): Back-end web application framework running on top of Node.js
Angular (formerly Angular.js): Front-end web app framework; runs your JavaScript code in the user's browser, allowing your application UI to be dynamic
Node.js : JavaScript runtime environment – lets you implement your application back-end in JavaScript
Pre-requisites
git - Installation guide .
node.js - Download page .
npm - comes with node or download yarn - Download page .
mongodb - Download page .
Installation
git clone https://github.com/linnovate/mean
cd mean
cp .env.example .env
npm install
npm start (for development)
Docker based
git clone https://github.com/linnovate/mean
cd mean
cp .env.example .env
docker-compose up -d
Credits
The MEAN name was coined by Valeri Karpov.
Initial concept and development was done by Amos Haviv and sponsered by Linnovate.
Inspired by the great work of Madhusudhan Srinivasa.

# React-Redux-Saga Boilerplate

[![Build Status](https://travis-ci.org/gilbarbara/react-redux-saga-boilerplate.svg?branch=master)](https://travis-ci.org/gilbarbara/react-redux-saga-boilerplate) [![Dependencies](https://david-dm.org/gilbarbara/react-redux-saga-boilerplate.svg)](https://david-dm.org/gilbarbara/react-redux-saga-boilerplate) [![Maintainability](https://api.codeclimate.com/v1/badges/eb66aa0049fa03acbbf3/maintainability)](https://codeclimate.com/github/gilbarbara/react-redux-saga-boilerplate/maintainability) [![Test Coverage](https://api.codeclimate.com/v1/badges/eb66aa0049fa03acbbf3/test_coverage)](https://codeclimate.com/github/gilbarbara/react-redux-saga-boilerplate/test_coverage)

[Demo](https://redux-saga.react-boilerplate.com/)

### Provides

- react ^16.x
- react-router 4.x
- react-helmet 5.x
- styled-components 4.x
- redux 4.x
- redux-saga 0.16.x
- redux-persist 5.x

### Development

- webpack-dev-server 3.x
- react-hot-loader 4.x
- redux-devtools (with browser plugin)

`npm start`

### Building

- webpack 4.x
- babel 7.x

`npm run build`

### Code Quality

- eslint 5.x
- stylelint 9.x

`npm run lint` / `npm run lint:styles`

### Unit Testing

- jest 23.x
- enzyme 3.x

`npm test`

### End 2 End Testing

- cypress 3.0.x

`npm run test:e2e`
