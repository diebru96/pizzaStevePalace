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
        this.state = { id: -1, userId: 1, pizzaList: [], pizzaForms: [], submitted: false, addForm: 0, infos: [], maxS: 1, maxM: 1, maxL: 1, TOTprice: 0 };
    }
    componentDidMount() {
        API.pizzeriaInfos().then((info) => {
            this.setState({ infos: info, maxS: info[0].available_s, maxM: info[0].available_m, maxL: info[0].available_l });
        });
        const ingr = this.props.ingredientList.map((i) => { return { value: i, label: i } });

        this.addPizzaForm(ingr)
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

        const pizza = new Pizza(1, 0, "", false, 4);
        let pizzaList = this.state.pizzaList;
        pizzaList.push({
            id: this.state.addForm,
            value: pizza
        })
        this.setState({ pizzaForms: pizzaForms, addForm: this.state.addForm + 1, pizzaList: pizzaList });
        this.estimateTotalPrice(pizzaList);
        //  return pizzaForms;
    }

    removePizza = (id) => {
        console.log(id);
        let pizzaForms = this.state.pizzaForms;
        const newList = pizzaForms.filter((item) => item.id !== id);
        const newPizzaList = this.state.pizzaList.filter((item) => item.id !== id);

        this.setState({ id: id, pizzaForms: newList, pizzaList: newPizzaList });
        this.estimateTotalPrice(newPizzaList);


    }

    updatePizza = (id, number, size, ingredients, special) => {
        const price = this.estimatePizzaPrice(number, size, special);
        const pizza = new Pizza(number, size, ingredients, special, price);
        const newPizza = {
            id: id,
            value: pizza
        };
        let newPizzaList = this.state.pizzaList.map((item) => {
            if (item.id == id) {
                return newPizza;
            }
            else
                return item;
        });
        //  var tutto = number + " " + size + " " + ingredients + special;
        this.estimateTotalPrice(newPizzaList);
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

    estimateTotalPrice = (newPizzaList) => {
        let prezzo = 0;
        let priceList = newPizzaList.map((pizza) => {
            return pizza.value.price;
        });
        for (var p of priceList) {
            prezzo = prezzo + p;
        }
        this.setState({ TOTprice: prezzo });
    }

    updateAvailability = (number, size) => {
        // this.setState()
    }


    render() {
        const options = this.props.ingredientList.map((i) => { return { value: i, label: i } });
        return (
            <Container fluid>

                <h2>Create your order: {this.state.pizzaList.map((pizza) => { return (pizza.value.price); })}</h2>
                {this.state.addForm > 0 ?
                    <Table>
                        <thead>
                            <tr>
                                <th style={{ width: '15%' }}>N</th>
                                <th style={{ width: '20%' }}>Size</th>
                                <th style={{ width: '45%' }}>Ingredients</th>
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
                    <button >CHECKOUT</button>
                </p>

            </Container>
        );
    }
}

export default OrderForm;