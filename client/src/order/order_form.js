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

// onChange={(values) => this.setValues(values)}

class OrderForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = { id: -1, userId: 1, pizzaList: [], pizzaForms: [], submitted: false, addForm: 0, infos: [], maxS: 1, maxM: 1, maxL: 1 };
    }
    componentDidMount() {
        API.pizzeriaInfos().then((info) => {
            this.setState({ infos: info, maxS: info[0].available_s, maxM: info[0].available_m, maxL: info[0].available_l });
        })
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
                removePizza={this.removePizza} />
        }
        )

        this.setState({ pizzaForms: pizzaForms, addForm: this.state.addForm + 1 });
        return pizzaForms;
    }

    removePizza = (id) => {
        console.log(id);
        let pizzaForms = this.state.pizzaForms;
        const newList = pizzaForms.filter((item) => item.id !== id);
        this.setState({ id: id, pizzaForms: newList });

    }

    updateAvailability = () => {

    }

    render() {
        const options = this.props.ingredientList.map((i) => { return { value: i, label: i } });
        var i;
        return (
            <Container fluid>
                <h2>Create your order {this.state.id}</h2>
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
                <p className="App-buttoncheck">
                    <button onClick={() => { this.addPizzaForm(options) }}>Add Pizza</button>
                </p>

            </Container>
        );
    }
}

export default OrderForm;