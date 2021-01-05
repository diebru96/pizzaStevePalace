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

// onChange={(values) => this.setValues(values)}

class PizzaForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = { pizzaType: 0, submitted: false, value: [{ value: "x", label: "x" }] };
    }

    _handleChange = ({ target: { name, value } }) => {
        this.setState({ [name]: value })
    }


    onChangeType(value, { action, removedValue }) {
        switch (action) {
            case 'remove-value':
            case 'pop-value':
                if (removedValue.isFixed) {
                    return;
                }
                break;
            case 'clear':
                // value = colourOptions.filter(v => v.isFixed);
                break;
        }
        this.setState({ value: value });
    }

    render() {
        const animatedComponents = makeAnimated();
        const options = this.props.options;
        const optionSize = [{ value: 0, label: "S" }, { value: 1, label: "M" }, { value: 2, label: "L" }];
        return (
            <tr><td> {this.state.value.map((x) => {
                return x.label;
            })}</td>
                <td> <Select
                    options={optionSize}
                    onChange={this.onChangeType}
                /> </td>
                {this.state.pizzaType == 2 ?
                    <td> <td><Select
                        closeMenuOnSelect={false}
                        components={animatedComponents}
                        value={this.state.value}
                        onChange={this._handleChange}
                        isMulti
                        // isClearable={this.state.value.some(v => !v.isFixed)}
                        options={options} /> </td>

                        <td><Select
                            closeMenuOnSelect={false}
                            components={animatedComponents}
                            value={this.state.value}
                            onChange={this._handleChange}
                            isMulti
                            // isClearable={this.state.value.some(v => !v.isFixed)}
                            options={options} /> </td>
                    </td> :
                    <td><Select
                        closeMenuOnSelect={false}
                        components={animatedComponents}
                        value={this.state.value}
                        onChange={this._handleChange}
                        isMulti
                        // isClearable={this.state.value.some(v => !v.isFixed)}
                        options={options} /> </td>

                }
                <td>X</td>
            </tr>

        );
    }
}
export default PizzaForm;