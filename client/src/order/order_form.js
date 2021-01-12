import React from 'react';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table'

import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import { Redirect, Link } from 'react-router-dom';
import API from './../api/API';
import Pizza from './pizza';

import Order from './order';
import Select from "react-select";
import makeAnimated from 'react-select/animated';
import PizzaForm from './pizza_form'
import './order.css'
// onChange={(values) => this.setValues(values)}

class OrderForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = { id: -1, userId: 1, pizzaList: [], pizzaForms: [], submitted: false, addForm: 0, infos: [], maxS: 1, maxM: 1, maxL: 1, TOTprice: 0, ordered: false, current_s: 1, current_m: 0, current_l: 0, discount: 0 };
    }
    componentDidMount() {
        const ingr = this.props.ingredientList.map((i) => { return { value: i, label: i } });
        API.pizzeriaInfos().then((info) => {
            this.setState({ infos: info, maxS: info[0].available_s, maxM: info[0].available_m, maxL: info[0].available_l });
            this.addPizzaForm(ingr);

        });
    }

    componentDidMount() {
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


        this.updateAvailability(number, size);
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
    }

    updateAvailability = (number, size) => {
        // this.setState()
    }

    checkOut = () => {
        ///BISOGNA AGGIUNGERE TUTTI I CHECK SU INGREDIENTI E CONFORMITA'
        let pizzas = this.state.pizzaList.map((pizza) => { return pizza.value.toJson() });
        const totPizzas = this.state.current_l + this.state.current_m + this.state.current_s;
        //AGGIUNGERE CONTA S M L
        var order = new Order(this.state.userId, this.state.TOTprice, totPizzas, this.state.current_s, this.state.current_m, this.state.current_l, pizzas, this.state.discount);
        var orderJson = order.toJson();
        API.createOrder(orderJson).then((id) => {
            this.setState({ ordered: true });
        });

    }

    render() {
        const options = this.props.ingredientList.map((i) => { return { value: i, label: i } });
        if (this.state.ordered) {
            return <Redirect to='/' />;
        }
        else
            return (
                <Container fluid>

                    <h2>Create your order: S: {this.state.current_s}, M: {this.state.current_m}, L: {this.state.current_l}</h2>
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
                    <p className="App-buttoncheck">
                        <button onClick={() => { this.addPizzaForm(options) }}>+</button>
                    </p>
                    <p className="App-buttoncheckout">
                        <button onClick={this.checkOut}>CHECKOUT</button>
                    </p>

                </Container>
            );
    }
}

export default OrderForm;