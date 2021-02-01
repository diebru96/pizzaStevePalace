# Exam #4: "Pizza"
## Student: s267806 BRUNO DIEGO 

## React client application routes

- Route `/`: Home, main page accessible to everyone(auth or not), contains the list of ingredients and the pizza availability (if requested). A navigator is provided to scroll to ingredients (`/#menu`) and  to availability(`/#availability`) in this 2nd case the availability is automatically requested.
- Route `/login`: login page, a react form with 2 fields (email and password)
- Route `/signup`: signup page, a react form with 3 fields (username, email and password)
- Route `/order`: The page to create and submit your order. It is a table in which you can add as many pizza form as you wish with an add button. The single pizza forms will allow you to select the size, the number of pizzas, the ingredients and if you want tomato or not. A total price is shown and costantly updated, and red writings advertise you if you are selecting to many pizzas for a given size. An error dialogue is shown whenever there is a server error or you missed something important to submit your order.
- Route `/userprofile`: The page with the user datas. An image with username and password is provided, and if the user wants he can check the list of past orders. This list display an order per row. By clicking on the order a detailed view with all the pizzas ordered for the given order is provided.

## REST API server
### not authenticated  
- POST `/api/login` : the email is used to search the corresponding user, if it is found an hash is calculated on the password and compared to the one in the db.
  - request body content: email, password
  - response body content: in case of success username and password are returned, else an error with 2 different ids for wrong email and wrong password.
- POST `/api/signup` : used to register new users (only the hash of the password is memorized in the DB)
  - request parameters and request body content: the request body contains name, email and password
  - response body content: the id of the user is returned
- GET `/api/availability` : used to get info about number of pizza available and prices.
  - request parameters : none
  - response body content : all the fields of table pizzeria(id, price_s, price_m, price_l, dialy_s, daily_m, daily_l, available_s, availbale_m, available_l)
### authenticated  
- GET `/api/user` : used to check if the session is stil valid and the user il logged in
  - request parameters: none, the id of the user is extracted from the cookie (if session still ok) 
  - response body content: id, username, email
- POST `/api/order` : before the order is created a check is done on the availability
  - request parameters and request body content : the body of the req contains the whole order(total price, total number of pizzas, discount bool,total number of S, total number of M, total number of L and the list of pizzas), once the order is created, the id is taken and used to create all the pizzas
  - response body content: if there are not enough pizzas an error is returned with id=0 and the availability of the pizzas per size, else the id of the order is returned and the availability is updated.
- GET `/api/orderlist`
  - request parameters: none, the id of the user is extracted from the cookie 
  - response body content: a response id =1 in case of success and a list of orders (id, tot_pizza, price, discount)  
- GET `/api/pizzaorder/:id`
  - request parameters : id of the order
  - response body content: a response id =1 in case of success and a list of pizzas (content of table pizza) 



## Server database

- Table `user` - contains id username email password
- Table `pizza` - contains id_pizza, id_order(external key to table pizza_order), number, ingredients, seafood(bool), type, price, second_ingredients(if set to "" or null pizza is not split into halves), sauce(default value to 1(true))
- Table `pizza_order` - contains id_order, id_user(external key to table user), price, tot_pizza, discount, tot_s, tot_m, tot_l
- Table `pizzeria` - contains id, price_small, price_medium, price_large, daily_small(total number of available pizza for the day), daily_medium, daily_large, available_small, available_medium, available_large

## Main React Components

- `AvailabilityTable` (in `availability.js`): react table to show availability and price of pizzas. Take the pizzeria infos as prop.
- `Navbar` (in `App.js`): Navbar used to naigate between pages, since it contains all the links. It changes look when the screen is scrolled and changes content when the user navigate to a new route.
- `Image` (in `image_wobble.js`): Image that start an animation when clicked.
- `PizzaDialogue` (in `App.js`): Dialogue that shows when the pizzas are ready. It is triggered by a timeout. Take a title and the 2 part of the messagge displayed as parameters.
- `OrderOkDialogue` (in `App.js`): Dialogue shown when the order is uccessful.  Take a title and a messagge as parameters.
- `UserProfile` (in `user/user_profile.js`): Used to display user datas and the orderlisttable when the "check past orderlist" button is clicked.
- `OrderListTable` (in `user/orderlist_table.js`): Table to display the orders, it displays only order number, number of pizzas and price of the order. Take as prop the orderlist.
- `OrderRow` (in `user/order_row.js`):Row of the table OrderListTable. When tapped it retrive the pizzas of the given order and shows a detailed view of the order content.
- `LoginForm` (in `auth/login_form.js`): Login form, it has an email and a password formgroups. Take as props the login function and a message (displayed when you want to order without being logged in), and take from the context the authError that shows the user if password or email are incorrect.
- `OrderForm` (in `order/order_form.js`):Form to create the pizza order. On the component did mount the pizza availability is checked. A plus button allow to add a new PizzaForm. It contains a list of PizzaForms and a list of Pizza. 
A total price is updated and displayed. Red errors about availability issues are displayed (so taht the user do not order an amount of pizza greater than the available one (checked at the form opening)). There is aninfo button that opens a toast. During checkout(checkout button) some requirements, such as at least 1 ingredient per pizza, seafood constraint and availability, are checked before the order is forwarded to the server.
- `ErrorDialogue` and `LocalErrorDialogue` (in `order/order_form.js`): Similar to OrderOkDialogue but displayed for errors. Local errors found during the final check for LocalErrorDialogue and server errors for ErrorDialogue (not enough pizzas, not authorized, general errors).
- `PizzaForm` (in `order/order_form.js`):Is a row of OrderForm. It has 2 main react-select components (3 when large pizza is splitted), a checkbox for the tomato and a conter for the number of pizza you want to order. A trash icon can be used to remove the pizza from the order and a checkbox "divided" shown when large pizza is selected can be used to split the pizza in 2 halves. Take as props the id of the form(useful to remove it), a key(for univocity), the options for the react-selects(the ingredients), the max number of S, M and L selectable, the update pizza function and the remove pizza function. Every time something is changed (size, ingredients, tomato or number) the updatePizza function is called and update the list of pizzas in OrderForm.



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
### username, email, password (email and password required to login)
* diego, die@die.it, password (2 orders)
* s267806, diebru96@gmail.com, diebru (1 order)
* test, test@test.it, test (2 orders)
* giovanni, giovanni@gmail.com, giovanni
* giorgio, giorgio@gmail.com, giorgio
