# ReactGraphQLStore

An online store built using React, GraphQL, Stripe and Strapi, with [Reed Barger's course](https://www.udemy.com/build-an-online-store-with-react-and-graphql-in-90-minutes).

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

Before setting this project up, you will need to fill out the necessary fields in server/config/environments/development/database.json with reference to a MongoDB connection (such as MLab), as well as creating a keys.js file for Stripe with a 'publishableKey' value in client/src/config, and a stripeKey.js file with a 'stripeSecret' value in server/api/order/config.

To get this project up and running, follow these steps:
1) cd ReactGraphQLStore
2) cd server && npm install
3) cd .. && cd client && npm install
4) cd .. && npm run dev

![screen shot 2019-01-01 at 10 58 14](https://user-images.githubusercontent.com/25869284/50572273-379fba80-0db4-11e9-829b-26846569e378.png)

The front page of the store with a logged-in user.