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
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';


// onChange={(values) => this.setValues(values)}

class PizzaForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = { number: 1, ingredients: "", ingredients2: "", special: false, pizzaType: [{ value: 0, label: "S" }], type: 0, submitted: false, val: [], val2: [], maxS: 1, maxM: 1, maxL: 1, checkedDivided: false, checkedSauce: true };
        this.onChange = this.onChange.bind(this);
        this.onChange2 = this.onChange2.bind(this);
        this.onChangeType = this.onChangeType.bind(this);

    }

    componentDidMount() {
        this.setState({ maxS: this.props.maxS, maxM: this.props.maxM, maxL: this.props.maxL })

    }

    onChange = (option, { action }) => {
        let ingredients = "";
        let ingredients2 = "";
        if (action === "remove-value") {
            if (option === null) {
                option = [];
            }
            if ((this.state.type === 0 && option.length <= 2) || (this.state.type === 1 && option.length <= 3) || (this.state.type === 2 && this.state.checkedDivided && option.length <= 3) || (this.state.type === 2 && !this.state.checkedDivided && option.length <= 6)) {
                let special = false;
                const ingr = option.map((i) => { return (i.label) });

                /// PROBABILMENTE DA TOGLIERE QUESTO SETTAGGIO A VUOTO DI VAL2 O TROVARE MODO PER FORZARE SEAFOOD
                let val2 = this.state.val2;
                for (var i of ingr) {
                    ingredients = ingredients + i + " ";
                    /*        if (i === "seafood") {
                             special = true;
                             val2.push({
                                 value: "seafood",
                                 label: "seafood"
                             });
                         }*/
                }
                this.setState({ val: option, ingredients: ingredients, special: special, val2: val2 });
                this.props.updatePizza(this.props.id, this.state.number, this.state.type, ingredients, special, this.state.checkedSauce, this.state.ingredients2);
            }
        }
        else
            if ((this.state.type == 0 && option.length <= 2) || (this.state.type === 1 && option.length <= 3) || (this.state.type === 2 && this.state.checkedDivided && option.length <= 3) || (this.state.type === 2 && !this.state.checkedDivided && option.length <= 6)) {
                let special = false;
                const ingr = option.map((i) => { return (i.label) });
                /// PROBABILMENTE DA TOGLIERE QUESTO SETTAGGIO A VUOTO DI VAL2 O TROVARE MODO PER FORZARE SEAFOOD
                let val2 = this.state.val2;
                for (var i of ingr) {
                    ingredients = ingredients + i + " ";
                    if (i === "seafood") {
                        special = true;
                        /*    val2.push({
                                value: "seafood",
                                label: "seafood",
                                isFixed: true
                            }); */
                    }
                }
                /// SE LA PIZZA DIVISA IN 2 faccio update anche con ingredienti2
                if (this.state.type === 2 && this.state.checkedDivided) {
                    ingredients2 = this.state.ingredients2;
                }

                this.setState({ val: option, ingredients: ingredients, ingredients2: ingredients2, special: special, val2: val2 });
                this.props.updatePizza(this.props.id, this.state.number, this.state.type, ingredients, special, this.state.checkedSauce, ingredients2);
            }

    };

    onChange2 = (option, { action }) => {
        let ingredients2 = "";
        if (action === "remove-value") {
            if (option === null) {
                option = [];
            }
            if (option.length <= 3) {
                const ingr2 = option.map((i) => { return (i.label) });
                for (var i of ingr2) {
                    ingredients2 = ingredients2 + i + " ";
                }
                this.setState({ val2: option, ingredients2: ingredients2 });
                this.props.updatePizza(this.props.id, this.state.number, this.state.type, this.state.ingredients, this.state.special, this.state.checkedSauce, ingredients2);
            }
        }
        else
            if (option.length <= 3) {
                const ingr2 = option.map((i) => { return (i.label) });
                for (var i of ingr2) {
                    ingredients2 = ingredients2 + i + " ";
                }
                this.setState({ val2: option, ingredients2: ingredients2 });
                this.props.updatePizza(this.props.id, this.state.number, this.state.type, this.state.ingredients, this.state.special, this.state.checkedSauce, ingredients2);
            }
    };


    onChangeType = (option, { action }) => {
        var type;
        var number = this.state.number;
        var val = this.state.val;
        var val2 = this.state.val2;
        var ingr = this.state.ingredients;
        var ingr2 = this.state.ingredients2;
        var special = this.state.special;
        if (option.value != null) {
            type = option.value;
            if (type == 0 && number > this.state.maxS)
                number = this.state.maxS;
            if (type == 1 && number > this.state.maxM)
                number = this.state.maxM;
            if (type == 2 && number > this.state.maxL)
                number = this.state.maxL;

            if (type < this.state.type) {
                val = [];
                val2 = [];
                ingr = "";
                ingr2 = "";
                special = false;
            }
        }
        else
            type = 0;
        this.setState({ pizzaType: option, action: action, type: type, number: number, val: val, val2: val2, ingredients: ingr, special: special, ingredients2: ingr2 });
        this.props.updatePizza(this.props.id, number, type, ingr, special, this.state.checkedSauce, ingr2);
    };

    handleCheckDividedChange = (event) => {
        var ingr2 = this.state.ingredients2;
        if (!event.target.checked) {
            ingr2 = "";
        }
        this.setState({ checkedDivided: event.target.checked, ingredients2: ingr2 });
        this.props.updatePizza(this.props.id, this.state.number, this.state.type, this.state.ingredients, this.state.special, this.state.checkedSauce, ingr2);

    };
    handleCheckSauceChange = (event) => {
        this.setState({ checkedSauce: event.target.checked });
        this.props.updatePizza(this.props.id, this.state.number, this.state.type, this.state.ingredients, this.state.special, event.target.checked, this.state.ingredients2);
    };


    buttonMore = () => {
        if ((this.state.type == 0 && this.state.number < this.state.maxS) || (this.state.type == 1 && this.state.number < this.state.maxM) || (this.state.type == 2 && this.state.number < this.state.maxL)) {
            var n = this.state.number + 1;
            this.setState({ number: n })
            this.props.updatePizza(this.props.id, n, this.state.type, this.state.ingredients, this.state.special, this.state.checkedSauce, this.state.ingredients2);
        }
    }
    buttonLess = () => {
        if (this.state.number > 1) {
            var n = this.state.number - 1;
            this.setState({ number: n })
            this.props.updatePizza(this.props.id, n, this.state.type, this.state.ingredients, this.state.special, this.state.checkedSauce, this.state.ingredients2);
        }
    }




    render() {
        const animatedComponents = makeAnimated();
        const options = this.props.options;
        const options2 = options.filter((item) => item.label !== "seafood");
        const id = this.props.id;
        const optionSize = [{ value: 0, label: "S" }, { value: 1, label: "M" }, { value: 2, label: "L" }];
        return (
            <tr><td><Row><h5>x {this.state.number} </h5>
                <tr>
                    <button onClick={() => this.buttonMore()}>^</button>
                </tr>
                <tr>
                    <button onClick={() => this.buttonLess()}>v</button>
                </tr>
            </Row>
            </td>
                <td>
                    <Select
                        value={this.state.pizzaType[0]}
                        options={optionSize}
                        onChange={this.onChangeType}
                    />
                    {this.state.type === 2 ?

                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={this.state.checkedDivided}
                                    onChange={this.handleCheckDividedChange}
                                    name="checkedB"
                                    color="green"
                                />
                            }
                            label="divided"
                        />

                        :
                        <></>
                    }

                </td>
                {(this.state.type == 2 && this.state.checkedDivided) ?
                    this.getLargePizzaSelectDivided(animatedComponents, options, options2)
                    :
                    this.getPizzaSelect(animatedComponents, options)
                }
                <td>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={this.state.checkedSauce}
                                onChange={this.handleCheckSauceChange}
                                name="sauce"
                                color='red'
                            />
                        }

                    />
                </td>
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

    getLargePizzaSelectDivided = (animatedComponents, options, options2) => {
        return (<td className="double-td"> <td><Select
            closeMenuOnSelect={false}
            components={animatedComponents}
            value={this.state.val}
            onChange={this.onChange}
            isMulti
            // isClearable={this.state.value.some(v => !v.isFixed)}
            options={options} /> </td>

            <td className="double-td"><Select
                closeMenuOnSelect={false}
                components={animatedComponents}
                value={this.state.val2}
                onChange={this.onChange2}
                isMulti
                //isClearable={this.state.val2.some(v => !v.isFixed)}
                options={options2} /> </td>
        </td>
        );
    }
}
export default PizzaForm;