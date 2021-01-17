import React from 'react';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table'

import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import Toast from 'react-bootstrap/Toast';
import { Redirect, Link } from 'react-router-dom';
import API from './../api/API';
import Pizza from './pizza';

import Order from './order';
import Select from "react-select";
import makeAnimated from 'react-select/animated';
import PizzaForm from './pizza_form'
//DIALOGUE
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import './order.css'
import { AppContext } from '../app_contexts';

class OrderForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = { id: -1, userId: 1, pizzaList: [], pizzaForms: [], submitted: false, addForm: 0, infos: [], maxS: 1, maxM: 1, maxL: 1, TOTprice: 0, ordered: false, current_s: 1, current_m: 0, current_l: 0, discount: 0, numberOfPizzaError: false, allowTransaction: true, errorMessage: "", openErrorDialogue: false, openLocalErrorDialogue: false, returnErrorMessage: "", toLogin: false, timeOut: false, show: false };
    }
    componentDidMount() {
        var appcontext = this.context;
        appcontext.changeHeader(false);
        const ingr = this.props.ingredientList.map((i) => { return { value: i, label: i } });
        API.pizzeriaInfos().then((info) => {
            this.setState({ infos: info, maxS: info[0].available_s, maxM: info[0].available_m, maxL: info[0].available_l });
            this.addPizzaForm(ingr);

        });

    }

    addPizzaForm = (options) => {
        let pizzaForms = this.state.pizzaForms;

        pizzaForms.push({
            id: this.state.addForm,
            value: <PizzaForm options={options}
                id={this.state.addForm}
                key={this.state.addForm}
                maxS={this.state.maxS}
                maxM={this.state.maxM}
                maxL={this.state.maxL}
                updatePizza={this.updatePizza}
                removePizza={this.removePizza}
            />
        }
        )

        const pizza = new Pizza(1, 0, "", false, 4, 1);
        let pizzaList = this.state.pizzaList;
        pizzaList.push({
            id: this.state.addForm,
            value: pizza
        })
        this.setState({ pizzaForms: pizzaForms, addForm: this.state.addForm + 1, pizzaList: pizzaList });
        this.estimateTotalPriceAndNumber(pizzaList);
        //  return pizzaForms;
    }

    removePizza = (id) => {
        console.log(id);
        let pizzaForms = this.state.pizzaForms;
        const newList = pizzaForms.filter((item) => item.id !== id);
        const newPizzaList = this.state.pizzaList.filter((item) => item.id !== id);
        this.setState({ id: id, pizzaForms: newList, pizzaList: newPizzaList });
        this.estimateTotalPriceAndNumber(newPizzaList);
    }

    updatePizza = (id, number, size, ingredients, special, sauce, ingredients2) => {
        const price = this.estimatePizzaPrice(number, size, special);
        let newPizza;
        /*   if (ingredients2 === "" || size != 2) {
               //PIZZA UNICA
               const pizza = new Pizza(number, size, ingredients, special, price, sauce);
               newPizza = {
                   id: id,
                   value: pizza
               };
        }*/
        //       else {
        /// SE LA PIZZA E' DIVISA IN 2
        const pizza = new Pizza(number, size, ingredients, special, price, sauce, ingredients2);
        newPizza = {
            id: id,
            value: pizza
        };
        //     }
        let newPizzaList = this.state.pizzaList.map((item) => {
            if (item.id == id) {
                return newPizza;
            }
            else
                return item;
        });
        //  var tutto = number + " " + size + " " + ingredients + special;
        this.estimateTotalPriceAndNumber(newPizzaList);
        this.setState({ pizzaList: newPizzaList });
    }

    estimatePizzaPrice = (number, size, special) => {
        let standardPrice = 0;
        switch (size) {
            case 0:
                standardPrice = 4;
                break;
            case 1:
                standardPrice = 6;
                break;
            case 2:
                standardPrice = 10;
                break;

        }
        let price = number * standardPrice;

        if (special)
            price = price + (price / 5);
        return price;
    }

    estimateTotalPriceAndNumber = (newPizzaList) => {
        let prezzo = 0;
        let current_s = 0;
        let current_m = 0;
        let current_l = 0;
        let priceList = newPizzaList.map((pizza) => {
            if (pizza.value.type === 0) {
                current_s = current_s + pizza.value.number;
            }
            if (pizza.value.type === 1) {
                current_m = current_m + pizza.value.number;
            }
            if (pizza.value.type === 2) {
                current_l = current_l + pizza.value.number;
            }
            return pizza.value.price;
        });

        for (var p of priceList) {
            prezzo = prezzo + p;
        }
        var discount = false;
        if ((current_s + current_m + current_l) >= 3) {
            prezzo = prezzo - prezzo / 10;
            discount = true;
        }

        this.setState({ TOTprice: prezzo, current_s: current_s, current_m: current_m, current_l: current_l, discount: discount });
        this.checkAvailability(current_s, current_m, current_l);
    }

    checkAvailability = (s, m, l) => {
        let allow = true;
        let error = false;
        if (s > this.state.maxS || m > this.state.maxM || l > this.state.maxL) {
            allow = false;
            error = true;
        }
        this.setState({ allowTransaction: allow, numberOfPizzaError: error });


    }

    finalCheck = () => {
        if (!this.state.allowTransaction) {
            this.setState({ errorMessage: "Too many pizzas selected" });
            return false;
        }

        else {
            var empty = false;
            var seafoodError = false;
            this.state.pizzaList.map((pizza) => {
                if (pizza.value.ingredients === "") {
                    empty = true;
                }
                else
                    if (pizza.value.ingredients2 !== "") {
                        if ((!(pizza.value.ingredients2.includes("seafood") && pizza.value.ingredients2.includes("seafood"))) || (!((!pizza.value.ingredients2.includes("seafood")) && (!pizza.value.ingredients2.includes("seafood"))))) {
                            seafoodError = true;
                        }
                    }
            });
            if (empty) {
                this.setState({ errorMessage: "Each pizza should have at least 1 ingredient" });
                return false;
            }
            else {
                if (seafoodError) {
                    this.setState({ errorMessage: "Splitted pizzas should have seafood in both halves" });
                    return false;
                }
                else
                    return true;
            }
        }
    }
    checkOut = () => {
        if (this.finalCheck()) {
            ///BISOGNA AGGIUNGERE TUTTI I CHECK SU INGREDIENTI E CONFORMITA'
            let pizzas = this.state.pizzaList.map((pizza) => { return pizza.value.toJson() });
            const totPizzas = this.state.current_l + this.state.current_m + this.state.current_s;
            //AGGIUNGERE CONTA S M L

            var order = new Order(this.state.userId, this.state.TOTprice, totPizzas, this.state.current_s, this.state.current_m, this.state.current_l, pizzas, this.state.discount);
            var orderJson = order.toJson();
            API.createOrder(orderJson).then((id) => {
                if (id) {
                    this.props.triggerPizzaReady();
                    var appcontext = this.context;
                    appcontext.changeHeader(true);
                    this.setState({ ordered: true });
                }
            }).catch((err) => {
                if (err.id === 0) {
                    this.setState({ openErrorDialogue: true, maxS: err.s, maxM: err.m, maxL: err.l, numberOfPizzaError: true, returnErrorMessage: "Sorry not enough available pizzas", });
                }
                else
                    if (err.id === -1) {
                        this.context.sessionTimedOut();
                        this.setState({ openErrorDialogue: true, returnErrorMessage: err.errorText, timeOut: true });
                    }
                    else
                        this.setState({ openErrorDialogue: true, returnErrorMessage: "ERROR UNKNOWN" });


            });
        }
        else {
            this.setState({ openLocalErrorDialogue: true });
        }
    }

    render() {
        var appcontext = this.context;
        const options = this.props.ingredientList.map((i) => { return { value: i, label: i } });
        if (this.state.toLogin || appcontext.timeOut) {
            return <Redirect to='/login' />;
        }
        else
            if (this.state.ordered) {
                return <Redirect to='/' />;
            }
            else
                return (

                    <Container fluid>
                        {this.ErrorDialogue()}
                        {this.LocalErrorDialogue()}
                        <h2 className="text-title">Create your order:</h2> <Button className="infobutton" variant="dark" onClick={() => { this.toggleShow(true) }}>?</Button>
                        {this.getToast()}
                        {this.state.numberOfPizzaError &&
                            <h6 className="error-message">
                                <tr>The number of pizzas you slected is not available.</tr>
                                {(this.state.current_s > this.state.maxS) &&
                                    <tr>Available Small Pizzas: {this.state.maxS},        Amount selected: {this.state.current_s}</tr>}
                                {(this.state.current_m > this.state.maxM) &&
                                    <tr><td>Available Medium Pizzas: {this.state.maxM}</td><p className="error-td"></p><td> Amount selected: {this.state.current_m}</td></tr>}
                                {(this.state.current_l > this.state.maxL) &&
                                    <tr><td>Available Large Pizzas: {this.state.maxL}</td><p className="error-td"></p><td> Amount selected: {this.state.current_l}</td></tr>}
                            </h6>
                        }

                        {this.state.addForm > 0 ?
                            <Table>
                                <thead>
                                    <tr>
                                        <th style={{ width: '15%' }}>N</th>
                                        <th style={{ width: '20%' }}>Size</th>
                                        <th style={{ width: '43%' }}>Ingredients</th>
                                        <th style={{ width: '7%' }}> Sauce </th>
                                        <th style={{ width: '15%' }}>Actions</th>

                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.pizzaForms.map((pizza) => { return pizza.value })}
                                </tbody>
                            </Table> :
                            <p></p>
                        }

                        <h5 className="App-price">Total: {this.state.TOTprice}$</h5>
                        <p className="App-buttonAdd">
                            <button onClick={() => { this.addPizzaForm(options) }}>+</button>
                        </p>
                        <p className="App-buttoncheckout">
                            <button onClick={this.checkOut}>CHECKOUT</button>
                        </p>

                    </Container>

                );
    }

    ErrorDialogue = () => {
        return (
            <div>

                <Dialog
                    open={this.state.openErrorDialogue}
                    keepMounted
                    aria-labelledby="alert-dialog-slide-title"
                    aria-describedby="alert-dialog-slide-description"
                >
                    <DialogTitle id="alert-dialog-slide-title">{"Order Error"}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-slide-description">
                            <tr>{this.state.returnErrorMessage}</tr>
                            <tr>Correct your order and try again</tr>
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => {
                            this.setState({ openErrorDialogue: false, toLogin: this.state.timeOut });
                        }} variant="danger">
                            OK
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }

    LocalErrorDialogue = () => {
        return (
            <div>

                <Dialog
                    open={this.state.openLocalErrorDialogue}
                    keepMounted
                    aria-labelledby="alert-dialog-slide-title"
                    aria-describedby="alert-dialog-slide-description"
                >
                    <DialogTitle id="alert-dialog-slide-title">{"Cannot submit the order"}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-slide-description">
                            <tr>{this.state.errorMessage}</tr>
                            <tr>Correct your order and try again</tr>
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => this.setState({ openLocalErrorDialogue: false })} variant="danger">
                            OK
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }

    toggleShow = (value) => {
        this.setState({ show: value });
    }
    getToast = () => {
        return <Toast
            style={{
                position: 'absolute',
                top: 115,
                right: 280,
                zIndex: 99
            }}
            show={this.state.show}
            onClose={() => { this.toggleShow(false) }}
            delay={7000} autohide
        >

            <Toast.Header>
                <strong className="mr-auto">Info about your order</strong>
            </Toast.Header>
            <Toast.Body className="Toast-body"><tr>You can select a maximum of 2 ingredients for S pizzas, of 3 for M , of 6 for L.</tr>
                <tr>If you select a splitted pizza you have 3 ingredients for each half, but if you want seafood you need to select it for both halves.</tr>
            </Toast.Body>
        </Toast>
    }
}

OrderForm.contextType = AppContext; // TO ACCESS CONTEXT VALUES WITH THIS

export default OrderForm;