const APIURL = 'http://localhost:3000/api';

async function pizzeriaInfos() {
    const response = await fetch(APIURL + '/availability');
    const json = await response.json();
    return json;
}

///USER AUTH
async function isAuthenticated() {
    let url = "/user";
    const response = await fetch(APIURL + url);
    const userJson = await response.json();
    if (response.ok) {
        return userJson;
    } else {
        let err = { status: response.status, errObj: userJson };
        throw err;  // An object with the error coming from the server
    }
}
async function userLogin(email, password) {
    return new Promise((resolve, reject) => {
        fetch(APIURL + '/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: email, password: password }),
        }).then((response) => {
            if (response.ok) {
                response.json().then((user) => {
                    resolve(user);
                });
            } else {
                // analyze the cause of error
                response.json()
                    .then((obj) => { reject(obj); }) // error msg in the response body
                    .catch((err) => { reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) }); // something else
            }
        }).catch((err) => { reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) }); // connection errors
    });
}

async function addUser(username, email, password) {
    return new Promise((resolve, reject) => {
        fetch(APIURL + '/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username: username, email: email, password: password }),
        }).then((response) => {
            if (response.ok) {
                response.json().then((user) => {
                    resolve(user);
                });
            } else {
                // analyze the cause of error
                response.json()
                    .then((obj) => { reject(obj); }) // error msg in the response body
                    .catch((err) => { reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) }); // something else
            }
        }).catch((err) => { reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) }); // connection errors
    });
}


async function userLogout() {
    return new Promise((resolve, reject) => {
        fetch(APIURL + '/logout', {
            method: 'POST',
        }).then((response) => {
            if (response.ok) {
                resolve(null);
            } else {
                // analyze the cause of error
                response.json()
                    .then((obj) => { reject(obj); }) // error msg in the response body
                    .catch((err) => { reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) }); // something else
            }
        });
    });
}

/// CREAZIONE PIZZA ED ORDINE
async function createOrder(order) {
    return new Promise((resolve, reject) => {
        fetch(APIURL + '/order', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ order: order }),
        }).then((response) => {
            if (response.ok) {
                response.json().then((id) => {
                    resolve(id);
                });
            } else {
                // analyze the cause of error
                response.json()
                    .then((obj) => { reject(obj); }) // error msg in the response body
                    .catch((err) => { reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) }); // something else
            }
        }).catch((err) => { reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) }); // connection errors
    });
}



async function getOrderList() {
    const response = await fetch(APIURL + `/orderlist`);
    const json = await response.json();
    return json;
}

async function getPizzasInOrder(order_id) {
    const response = await fetch(APIURL + `/pizzaorder/${order_id}`);
    const json = await response.json();
    return json;
}


export default { addUser, userLogin, userLogout, pizzeriaInfos, isAuthenticated, getOrderList, createOrder, getPizzasInOrder };