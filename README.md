# Exam #4: "Pizza"
## Student: s267806 BRUNO DIEGO 

## React client application routes

- Route `/`: Home
- Route `/login`: login
- Route `/signup`: page content and purpose, param specification
- Route `/order`: page content and purpose, param specification
- Route `/userprofile`: page content and purpose, param specification

## REST API server
### not authenticated  
- POST `/api/login`
  - request parameters and request body content
  - response body content
- POST `/api/signup`
  - request parameters and request body content
  - response body content  
- GET `/api/availability`
  - request parameters
  - response body content
### authenticated  
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

## Screenshot!
![pizzascreen1](https://user-images.githubusercontent.com/37414945/104959950-96542300-59d3-11eb-9c02-97684ce65f2c.PNG)

![pizzascreen2](https://user-images.githubusercontent.com/37414945/104960181-04004f00-59d4-11eb-86e9-159dfcf8d6f6.PNG)

![pizzascreen3](https://user-images.githubusercontent.com/37414945/104960188-06fb3f80-59d4-11eb-9e6d-6ee23700ce8c.PNG)

![pizzascreen4](https://user-images.githubusercontent.com/37414945/104960193-0bbff380-59d4-11eb-93ed-86a8f48e0545.PNG)

![pizzascreen5](https://user-images.githubusercontent.com/37414945/104960157-f945ba00-59d3-11eb-831c-b73ed76f12db.PNG)

![pizzascreen6](https://user-images.githubusercontent.com/37414945/104960160-fa76e700-59d3-11eb-8456-d7d9929b42e8.PNG)

![pizzascreen7](https://user-images.githubusercontent.com/37414945/104960168-fe0a6e00-59d3-11eb-84a9-8b1268a9f1c0.PNG)

![pizzascreenerrorform](https://user-images.githubusercontent.com/37414945/104960173-ff3b9b00-59d3-11eb-8651-95f38a707e5a.PNG)

![pizzascreensuccesspopup](https://user-images.githubusercontent.com/37414945/104960174-006cc800-59d4-11eb-8bbf-5e02006e661f.PNG)





## Test users

* username, password
* username, password
* username, password (frequent customer)
* username, password
* username, password (frequent customer)
