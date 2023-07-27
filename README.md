## Overview

A beer delivery app. This is a fullstack project and the final project for graduation at [Trybe](https://www.betrybe.com/)

The app consists in a fully implemented system where there are 3 main users group:

- Customer: Can register, login, shop for drinks, add to cart and checkout by giving the delivery address
- Seller: Receives the sale info and accepts it, prepares it and then dispatches it while changing the sale status in the meanwhile
- Admin: Registers new sellers in the system and manage their access

## Technologies

- Frontend: ReactJS, Axios, Context API
- Backend: ExpressJS, MySQL, Sequelize, Docker

The project also implements authentication with Json Web Tokens and User Role Authorization

Validation and error handling with express middlewares

Full CRUD operations and MVC architecture

Tested with testing tools such as Chai/ChaiHttp, Sinon and Mocha

## How to use

You'll need NodeJS version 16+ installed to run this project. You can install it here [Install Node](https://nodejs.org/en)

Clone this repo into your machine with the command `git clone git@github.com:QZBrainon/deliveryApp.git`

Navigate to the newly created directory with `cd deliveryApp` and run `npm install`

Then, if you don't want to configure environment variables, start a docker container using the docker-compose file

If you dont have docker installed and you're a Linux user, follow this installation guide [Docker Guide](https://docs.docker.com/engine/install/ubuntu/)

Also, you'll need to install [Docker Compose](https://docs.docker.com.zh.xy2401.com/v17.12/compose/install/)

With docker installed, navigate to the back-end directory with `cd back-end` and run `npm install`

Then run the command `docker-compose up -d`. This will start a MySQL container, binding it on port 3306. The password is `password`

At last, run `npm run dev`. If everything went right, you'll see the message: 'Api rodando na porta 3001' in your console

Now go back to the root directory with `cd ..` and enter front-end with `cd front-end`

Run `npm install` and once it's finished, run `npm start`

This will start the frontend and you should be able to see the website on your broswer on `localhost:3000`

## Disclaimer

This project stylization is a work in progress, therefore there's very little to none styles applied.

There will be incremental styling implementations using [MaterialUI](https://mui.com/)

If you'd like to contribute with styling, please feel free to fork and open a pull request.
