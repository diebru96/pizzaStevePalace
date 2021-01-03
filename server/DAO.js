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
        const sql = 'INSERT INTO users(username, email, password) VALUES(?,?,?)';
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

///PIZZAS

exports.pizzaavailability = function () {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM pizzeria';
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            const trainings = rows.map((e) => ({ id: e.id, price_s: e.price_small, price_m: e.price_medium, price_l: e.price_large, daily_s: e.daily_small, daily_m: e.daily_medium, daily_l: e.daily_large, available_s: e.available_small, available_m: e.available_medium, available_l: e.available_large }));
            resolve(trainings);
        });
    });
};

exports.updateAvailability = function (available_s, available_m, available_l) {
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE pizzeria SET available_small=(?), available_medium=(?), available_large=(?)';
        let hash = bcrypt.hashSync(password, 10);
        db.run(sql, [availbable_s, availbable_m, availbable_l], function (err) {
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