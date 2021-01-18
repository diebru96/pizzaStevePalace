import React from 'react';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import { Redirect, Link } from 'react-router-dom';
import API from './../api/API';
import { AppContext } from '../app_contexts';

class OrderRow extends React.Component {

    constructor(props) {
        super(props);
        this.state = ({ showPizza: false, pizzalist: [], showArrow: false, arrowdown: true, firstTime: true });
    }


    ListPizzas = (pizzas) => {
        if (pizzas === "")
            return <li>error getting pizzas</li>
        return pizzas.sort((a, b) => (a.type - b.type)).map((pizza) => {
            var type = "S";
            switch (pizza.type) {
                case 0:
                    type = "S";
                    break;
                case 1:
                    type = "M";
                    break;
                case 2:
                    type = "L";
                    break;
            }
            return (
                <li>
                    <td>{pizza.number} {type}</td>
                    {(pizza.second_ingredients === "") ?
                        (pizza.sauce) ?
                            <td>{pizza.ingredients}</td> :
                            <><td>{pizza.ingredients}</td><td>NO sauce</td></>
                        :
                        (pizza.sauce) ?
                            <><td>{pizza.ingredients} |</td>  <td>{pizza.second_ingredients}</td></> :
                            <><td>{pizza.ingredients} |</td>  <td>{pizza.second_ingredients}</td> <td>NO Sauce</td></>
                    }
                    <td>{pizza.price}$</td>
                </li>);
        });

    }

    getPizzaList = () => {
        if (!this.state.showPizza) {
            if (this.state.firstTime) {
                API.getPizzasInOrder(this.props.order.id_order).then((pizzas) => {
                    if (pizzas.id === -1) {
                        this.context.sessionTimedOut();
                        this.setState({ pizzalist: "", firstTime: true });
                    }
                    else {
                        var pizzalist = (<ul>{this.ListPizzas(pizzas.pizzas)}</ul>);
                        this.setState({ pizzalist: pizzalist, showPizza: false, firstTime: false, showPizza: true });
                    }
                }).catch((err) => {
                    if (err.id === -1) {
                        this.context.sessionTimedOut();
                    }
                    this.setState({ pizzalist: "", firstTime: true });
                });
            }
            else
                this.setState({ showPizza: true });

        }
        else {
            this.setState({ showPizza: false });
        }

    }

    render() {
        const order = this.props.order;

        return (
            <>
                <tr onClick={() => { this.getPizzaList(); this.setState({ arrowdown: !this.state.arrowdown }) }} onMouseOver={() => this.setState({ showArrow: true })} onMouseOut={() => this.setState({ showArrow: false })}>
                    <td>{order.id_order}</td>
                    {this.state.showArrow ?
                        <td >x {order.tot_pizza} pizzas <span className={this.state.arrowdown ? "arrow-down" : "arrow-up"}></span></td>
                        :
                        <td>x {order.tot_pizza} pizzas</td>
                    }
                    <td>{order.price}$</td>

                </tr>
                <td></td>
                <td>
                    {this.state.showPizza ?
                        <>
                            {this.state.pizzalist}
                        </>
                        :
                        <></>
                    }
                </td>
                <td></td>
            </>

        );
    }

}
OrderRow.contextType = AppContext;
export default OrderRow;