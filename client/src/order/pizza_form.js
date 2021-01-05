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
import trash from 'bootstrap-icons/icons/trash.svg';


// onChange={(values) => this.setValues(values)}

class PizzaForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = { number: 1, pizzaType: [{ value: 0, label: "S" }], type: 0, submitted: false, val: "", val2: "", maxS: 1, maxM: 1, maxL: 1 };
        this.onChange = this.onChange.bind(this);
        this.onChange2 = this.onChange2.bind(this);
        this.onChangeType = this.onChangeType.bind(this);

    }

    componentDidMount() {
        this.setState({ maxS: this.props.maxS, maxM: this.props.maxM, maxL: this.props.maxL })

    }

    onChange = (option, { action }) => {

        this.setState({ val: option, action: action });
    };
    onChange2 = (option, { action }) => {

        this.setState({ val2: option, action: action });
    };


    onChangeType = (option, { action }) => {
        var type;
        var number = this.state.number;
        if (option.value != null) {
            type = option.value;
            if (type == 0 && number > this.state.maxS)
                number = this.state.maxS;
            if (type == 1 && number > this.state.maxM)
                number = this.state.maxM;
            if (type == 2 && number > this.state.maxL)
                number = this.state.maxL;
        }
        else
            type = 0;
        this.setState({ pizzaType: option, action: action, type: type, number: number });

    };


    buttonMore = () => {
        if ((this.state.type == 0 && this.state.number < this.state.maxS) || (this.state.type == 1 && this.state.number < this.state.maxM) || (this.state.type == 2 && this.state.number < this.state.maxL))
            this.setState({ number: this.state.number + 1 })
    }
    buttonLess = () => {
        if (this.state.number > 1)
            this.setState({ number: this.state.number - 1 })
    }
    buttonRemove = () => {
    }



    render() {
        const animatedComponents = makeAnimated();
        const options = this.props.options;
        const id = this.props.id;
        const optionSize = [{ value: 0, label: "S" }, { value: 1, label: "M" }, { value: 2, label: "L" }];
        return (
            <tr><td><Row> x {this.state.number}
                <tr>
                    <button onClick={() => this.buttonMore()}>^</button>
                </tr>
                <tr>
                    <button onClick={() => this.buttonLess()}>v</button>
                </tr>
            </Row>
            </td>
                <td> <Select
                    value={this.state.pizzaType[0]}
                    options={optionSize}
                    onChange={this.onChangeType}
                /> </td>
                {this.state.type == 2 ?
                    this.getLargePizzaSelect(animatedComponents, options)
                    :
                    this.getPizzaSelect(animatedComponents, options)

                }
                <td><img onClick={() => this.props.removePizza(id)} src={trash} alt='delete' /></td>
            </tr>

        );
    }

    getPizzaSelect = (animatedComponents, options) => {
        return (<td><Select
            closeMenuOnSelect={false}
            components={animatedComponents}
            value={this.state.val}
            onChange={this.onChange}
            isMulti
            // isClearable={this.state.value.some(v => !v.isFixed)}
            options={options} /></td>
        );
    }

    getLargePizzaSelect = (animatedComponents, options) => {
        return (<td className="double-td"> <td><Select
            closeMenuOnSelect={false}
            components={animatedComponents}
            value={this.state.val}
            onChange={this.onChange}
            isMulti
            // isClearable={this.state.value.some(v => !v.isFixed)}
            options={options} /> </td>

            <td><Select
                closeMenuOnSelect={false}
                components={animatedComponents}
                value={this.state.val2}
                onChange={this.onChange2}
                isMulti
                // isClearable={this.state.value.some(v => !v.isFixed)}
                options={options} /> </td>
        </td>
        );
    }
}
export default PizzaForm;