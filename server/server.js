const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const jwtexpr = require('express-jwt');

const DAO = require('./DAO');
const morgan = require('morgan');
const PORT = 3001;
const app = express();

const jwtSecret = 'somerandomaccesstoken';
const BASEURI = '/api';
const expireTime = 700;
const authErrorObj = { id: -1, 'param': 'Server', 'msg': 'Authorization error' };
const cookieParser = require('cookie-parser');

app.use(bodyParser.json());
app.use(morgan('tiny'));



//GET AVAILABILITY PIZZA
app.get(BASEURI + '/availability', (req, res) => {
    DAO.pizzaavailability().then((v) => res.json(v));
});



//SIGNUP (MEMORIZZO HASH IN DB)
app.post('/api/signup', (req, res) => {
    const name = req.body.username;
    const email = req.body.email;
    const password = req.body.password;


    DAO.addUser(name, email, password)
        .then((id) => res.status(201).json({ "id": id }))
        .catch((err) => {
            res.status(500).json({ errors: [{ 'param': 'Server', 'msg': err }], })
        });
});


///AUTENTICAZIONE I METODI DOPO LOGIN RICHIEDONO AUTH
app.post(BASEURI + '/login', (req, res) => {
    // read username and password from request body
    const email = req.body.email;
    const password = req.body.password;
    // filter user from the users array by username and password
    DAO.loginUser(email).then((user) => {
        if (user != null) {

            if (DAO.checkPassword(password, user)) {
                console.log("CHECK PASSWORD OK, user hash :" + user.hash);
                const accessToken = jwt.sign({ userauth: user.id }, jwtSecret, { expiresIn: '20m' });
                res.cookie('token', accessToken, { httpOnly: true, sameSite: true, maxAge: 1000 * expireTime });
                res.json({ username: user.username, email: user.email });
                res.end();

            } else {
                res.status(401).json({ errorid: 1, message: "password errata" });
            }

        }
        else {
            res.status(400).json({ errorid: 0, message: "email non valida" });

        }
    }).catch(

        // Delay response when wrong user/pass is sent to avoid fast guessing attempts
        (err) => {
            new Promise((resolve) => { setTimeout(resolve, 1000) }).then(() => res.status(401).json({ errorid: 0, message: "email non valida" }))
        });
});



app.use(cookieParser());

app.post(BASEURI + '/logout', (req, res) => {
    res.clearCookie('token').end();
});

app.use(
    jwtexpr({
        secret: jwtSecret,
        getToken: req => req.cookies.token,
        algorithms: ['sha1', 'RS256', 'HS256'],
    })
);

// To return a better object in case of errors
app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        res.status(401).json({ id: -1, errtype: "Authorization error", errorText: "Your login session is expired, please retry to login" });
    }
});

////AUTHENTICATED REST ENDPOINTS
app.get(BASEURI + '/user', (req, res) => {
    const userid = req.user.userauth;
    DAO.getUserById(userid)
        .then((user) => {
            res.json({ id: userid, username: user.username, email: user.email });
        }).catch(
            (err) => {
                res.status(401).json(authErrorObj);
            }
        );
});

//CREATE ORDER

app.post(BASEURI + '/order', (req, res) => {
    if (!req.body.order) {
        res.status(401).json({ id: -1, error: err, errorText: "Your login session is expired, please retry to login" });
        res.end();
    }
    const order = req.body.order;
    const pizzas = order.pizzas;
    const userid = req.user.userauth;
    DAO.pizzaavailability().then((v) => {
        if ((order.tot_s <= v[0].available_s) && (order.tot_m <= v[0].available_m) && (order.tot_l <= v[0].available_l)) {
            const s = v[0].available_s - order.tot_s;
            const m = v[0].available_m - order.tot_m;
            const l = v[0].available_l - order.tot_l;
            DAO.createOrder(userid, order).then((id) => {
                pizzas.map((pizza) => {
                    DAO.createPizza(id, pizza).then((id) => {
                    });
                });
                res.status(201).json({ id: id });
                DAO.updateAvailability(s, m, l);
            });
        }
        else {
            res.status(404).json({ id: 0, s: v[0].available_s, m: v[0].available_m, l: v[0].available_l });
        }
    });

});



//GET PIZZA
app.get(BASEURI + '/pizzaorder/:id', (req, res) => {
    DAO.getPizzaInOrder(req.params.id).then((pizzas) => res.json({ id: 1, pizzas: pizzas }));
});


//GET ORDERS
app.get(BASEURI + '/orderlist', (req, res) => {
    DAO.getListOrders(req.user.userauth).then((orders) => res.json({ id: 1, orders: orders }));
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}/`));