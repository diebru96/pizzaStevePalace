# Exam #4: "Pizza"
## Student: s267806 BRUNO DIEGO 

## React client application routes

- Route `/`: Home
- Route `/login`: login
- Route `/signup`: page content and purpose, param specification
- Route `/order`: page content and purpose, param specification
- Route `/userprofile`: page content and purpose, param specification

## REST API server
# not authenticated  
- POST `/api/login`
  - request parameters and request body content
  - response body content
- POST `/api/signup`
  - request parameters and request body content
  - response body content  
- GET `/api/availability`
  - request parameters
  - response body content
# authenticated  
- GET `/api/user`
  - request parameters and request body content
  - response body content
- POST `/api/order`
  - request parameters and request body content
  - response body content
- GET `/api//orderlist`
  - request parameters and request body content
  - response body content  
- GET `/api//pizzaorder/:id`
  - request parameters and request body content
  - response body content



## Server database

- Table `user` - contains id username email password
- Table `pizza` - contains id_pizza, id_order(external key to table pizza_order), number, ingredients, seafood(bool), type, price, second_ingredients(if set to "" or null pizza is not split into halves), sauce(default value to 1(true))
- Table `pizza_order` - contains id_order, id_user(external key to table user), price, tot_pizza, discount, tot_s, tot_m, tot_l
- Table `pizzeria` - contains id, price_small, price_medium, price_large, daily_small(total number of available pizza for the day), daily_medium, daily_large, available_small, available_medium, available_large

## Main React Components

- `ListOfSomething` (in `List.js`): component purpose and main functionality
- `GreatButton` (in `GreatButton.js`): component purpose and main functionality
- ...

(only _main_ components, minor ones may be skipped)

## Screenshot

![image](./img_screen/pizzascreen1.png)

## Test users

* username, password
* username, password
* username, password (frequent customer)
* username, password
* username, password (frequent customer)
