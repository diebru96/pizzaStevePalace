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
        this.state = { userId: 1, pizzaList: [], submitted: false, addForm: 0 };
    }

    getPizzaForms = (options) => {
        let pizzaForms = [];
        for (let i = 0; i < this.state.addForm; i++) {
            pizzaForms.push(
                <PizzaForm options={options} key={i} />
            )
        }
        return pizzaForms;
    }


    render() {
        const animatedComponents = makeAnimated();
        const options = this.props.ingredientList.map((i) => { return { value: i, label: i } });
        var i;
        return (
            <Container fluid>
                <h2>Create your order</h2>
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
                            {this.getPizzaForms(options)}
                        </tbody>
                    </Table> :
                    <p></p>
                }
                <p className="App-buttoncheck">
                    <button onClick={() => { this.setState({ addForm: this.state.addForm + 1 }) }}>Add Pizza</button>
                </p>

            </Container>
        );
    }
}

export default OrderForm;