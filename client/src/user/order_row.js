import React from 'react';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import { Redirect, Link } from 'react-router-dom';
import API from './../api/API';

class OrderRow extends React.Component {

    constructor(props) {
        super(props);
        this.state = ({ showPizza: false });
    }

    componentDidMount() {
        var pizzalist = (<ul>{this.ListPizzas(this.props.order)}</ul>);
        this.setState({ pizzalist: pizzalist, showPizza: false });
    }

    ListPizzas = (order) => {

        return order.pizzas.map((pizza) => {
            return (
                <li>
                    <td>{pizza.number} {pizza.type}</td>
                    {(pizza.second_ingredients === "") ?
                        (pizza.sauce) ?
                            <td>{pizza.ingredients}</td> :
                            <><td>{pizza.ingredients}</td><td>NO sauce</td></>
                        :
                        (pizza.sauce) ?
                            <><td>{pizza.ingredients}</td>  <td>{pizza.second_ingredients}</td></> :
                            <><td>{pizza.ingredients}</td>  <td>{pizza.second_ingredients}</td> <td>NO Sauce</td></>
                    }
                    <td>{pizza.price}</td>
                </li>);
        });

    }

    render() {
        const order = this.props.order;
        return (
            <>
                <tr>
                    <td>{order.id_order}</td>
                    <td>{order.TOTpizzas} </td>
                    <td>{order.TOTprice}$</td>

                </tr>
                <td></td>
                <td>
                    {this.state.showPizza ?
                        <>
                            {this.state.pizzalist}
                            <p className="App-buttoncheck">
                                <button onClick={() => { this.setState({ showPizza: false }) }}>-</button>
                            </p>
                        </>
                        :
                        <p className="App-buttoncheck">
                            <button onClick={() => { this.setState({ showPizza: true }) }}>+</button>
                        </p>
                    }
                </td>
            </>

        );
    }

}
export default OrderRow;