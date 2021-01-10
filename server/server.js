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
const expireTime = 300;
const authErrorObj = { errors: [{ 'param': 'Server', 'msg': 'Authorization error' }] };
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

/*DEVO POI SPOSTARLO SOTTO AUTH !!!*/
//CREATE ORDER

app.post(BASEURI + '/order', (req, res) => {
    console.log("ENTRO IN POST CREATE ORDER");
    const order = req.body.order;
    const pizzas = order.pizzas;
    console.log(" USER ORDER " + order.id_user);
    DAO.pizzaavailability().then((v) => {
        console.log("FATTO CHECK SU PIZZA AVAILABILITY");

        if ((order.tot_s <= v[0].available_s) && (order.tot_m <= v[0].available_m) && (order.tot_l <= v[0].available_l)) {
            const s = v[0].available_s - order.tot_s;
            const m = v[0].available_m - order.tot_m;
            const l = v[0].available_l - order.tot_l;
            console.log("L:" + l + " M:" + m + " S:" + s + "ORDER TOtS:" + order.tot_s);
            DAO.createOrder(order).then((id) => {
                console.log("CREATO ORDINE CON ID " + id);
                pizzas.map((pizza) => {
                    DAO.createPizza(id, pizza).then((id) => {
                        console.log("CREATA PIZZA CON ID " + id);

                    });
                });
                res.status(201).json({ "id": id });
                DAO.updateAvailability(s, m, l);
            });
        }
        else {
            console.log("ERRORE 404");
            ///AGGIUNGERE CASISTICA ERRORE
            res.status(401);
        }
    });

});



///AUTENTICAZIONE I METODI DOPO LOGIN RICHIEDONO AUTH
app.post(BASEURI + '/login', (req, res) => {
    // read username and password from request body
    const { email, password } = req.body;

    // filter user from the users array by username and password
    DAO.loginUser(email).then((user) => {

        if (user != null) {

            if (DAO.checkPassword(password, user)) {

                const accessToken = jwt.sign({ userauth: user.id }, jwtSecret, { expiresIn: '20m' });
                const userreturn = { username: user.username };
                const auth = { accessToken: accessToken, refreshToken: refreshToken }
                res.cookie('token', accessToken, { httpOnly: true, sameSite: true, maxAge: 1000 * expireTime });

                res.json(userreturn);
                res.end();

            } else {
                res.json({ username: "PASSWORD ERRATA" });
            }

        }
    }).catch(

        // Delay response when wrong user/pass is sent to avoid fast guessing attempts
        (err) => {
            new Promise((resolve) => { setTimeout(resolve, 1000) }).then(() => res.status(401).json(authErrorObj))
        });
});



app.use(cookieParser());
app.post('/api/logout', (req, res) => {
    res.clearCookie('token').end();
});

app.use(
    jwtexpr({
        secret: jwtSecret,
        getToken: req => req.cookies.token,
        algorithms: ['sha1', 'RS256', 'HS256'],
    })
);


app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}/`));