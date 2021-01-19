'use strict';

const sqlite = require('sqlite3');
const bcrypt = require('bcrypt');
const User = require('./user');


const db = new sqlite.Database('./db/pizza.sqlite', (err) => {
    if (err) throw err;
});

///USER
const createUser = function (row) {
    const id = row.id;
    const name = row.username;
    const email = row.email;
    const hash = row.password;

    return new User(id, name, email, hash);
}
exports.addUser = function (username, email, password) {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO user(username, email, password) VALUES(?,?,?)';
        let hash = bcrypt.hashSync(password, 10);
        db.run(sql, [username, email, hash], function (err) {
            if (err) {
                console.log(err);
                reject(err);
            }
            else {
                console.log(this.lastID);
                resolve(this.lastID);
            }
        });
    });
};

exports.loginUser = function (email) {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM user WHERE email = ?"
        db.all(sql, [email], (err, rows) => {
            if (err)
                reject(err);
            else if (rows.length === 0)
                resolve(undefined);
            else {
                const user = createUser(rows[0]);
                resolve(user);
            }
        });
    });
};

exports.checkPassword = function (password, user) {
    return bcrypt.compareSync(password, user.hash);
};

exports.getUserById = function (id) {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM user WHERE id = ?"
        db.all(sql, [id], (err, rows) => {
            if (err)
                reject(err);
            else if (rows.length === 0)
                resolve(undefined);
            else {
                const user = createUser(rows[0]);
                resolve(user);
            }
        });
    });
};


///PIZZAS AVAILABILITY

exports.pizzaavailability = function () {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM pizzeria';
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            const infos = rows.map((e) => ({ id: e.id, price_s: e.price_small, price_m: e.price_medium, price_l: e.price_large, daily_s: e.daily_small, daily_m: e.daily_medium, daily_l: e.daily_large, available_s: e.available_small, available_m: e.available_medium, available_l: e.available_large }));
            resolve(infos);
        });
    });
};

exports.updateAvailability = function (available_s, available_m, available_l) {
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE pizzeria SET available_small=(?), available_medium=(?), available_large=(?) WHERE id=1'; //Aggiungere where id=1 ?
        db.run(sql, [available_s, available_m, available_l], function (err) {
            if (err) {
                console.log(err);
                reject(err);
            }
            else {
                console.log(this.lastID);
                resolve(this.lastID);
            }
        });
    });
};

//PIZZA ORDER
exports.createOrder = function (userid, order) {
    console.log("entrato in DAO.createorder");
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO pizza_order(id_user, price, tot_pizza, discount, tot_s, tot_m, tot_l) VALUES(?,?,?,?,?,?,?)';
        db.run(sql, [userid, order.price, order.tot_pizza, order.discount, order.tot_s, order.tot_m, order.tot_l], function (err) {
            if (err) {
                console.log(err);
                reject(err);
            }
            else {
                console.log(this.lastID);
                resolve(this.lastID);
            }
        });
    });
};

exports.createPizza = function (idOrder, pizza) {
    return new Promise((resolve, reject) => {
        if (pizza.ingredients2 === "") {
            const sql = 'INSERT INTO pizza(id_order, number, ingredients, seafood, type, price, second_ingredients, sauce) VALUES(?,?,?,?,?,?,?,?)';
            db.run(sql, [idOrder, pizza.number, pizza.ingredients, pizza.seafood, pizza.type, pizza.price, null, pizza.sauce], function (err) {
                if (err) {
                    console.log(err);
                    reject(err);
                }
                else {
                    console.log(this.lastID);
                    resolve(this.lastID);
                }
            });
        }
        else {
            const sql = 'INSERT INTO pizza(id_order, number, ingredients, seafood, type, price, second_ingredients, sauce) VALUES(?,?,?,?,?,?,?, ?)';
            db.run(sql, [idOrder, pizza.number, pizza.ingredients, pizza.seafood, pizza.type, pizza.price, pizza.ingredients2, pizza.sauce], function (err) {
                if (err) {
                    console.log(err);
                    reject(err);
                }
                else {
                    console.log(this.lastID);
                    resolve(this.lastID);
                }
            });
        }
    });
};

exports.getListOrders = function (id) {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM pizza_order WHERE id_user=(?)';
        db.all(sql, [id], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }

            const orders = rows.map((order) => ({ id_order: order.id_order, tot_pizza: order.tot_pizza, price: order.price, discount: order.discount }));
            resolve(orders);
        });
    });
};

exports.getPizzaInOrder = function (id_order) {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM pizza WHERE id_order=(?)';
        db.all(sql, [id_order], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            const pizzas = rows.map((e) => ({ pizza_id: e.id, number: e.number, type: e.type, ingredients: e.ingredients, seafood: e.seafood, price: e.price, sauce: e.sauce, second_ingredients: (e.second_ingredients || "") }));
            resolve(pizzas);
        });

    });
};