import React from 'react';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import Select from "react-select";
import makeAnimated from 'react-select/animated';
import trash from 'bootstrap-icons/icons/trash.svg';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';



class PizzaForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = { options: "", number: 1, ingredients: "", ingredients2: "", special: false, pizzaType: [{ value: 0, label: "S" }], type: 0, submitted: false, val: [], val2: [], maxS: 1, maxM: 1, maxL: 1, checkedDivided: false, checkedSauce: true, infosplit: false };
        this.onChange = this.onChange.bind(this);
        this.onChange2 = this.onChange2.bind(this);
        this.onChangeType = this.onChangeType.bind(this);

    }

    componentDidMount() {
        this.setState({ options: this.props.options, maxS: this.props.maxS, maxM: this.props.maxM, maxL: this.props.maxL })

    }

    /***HANDLING SELECT CHANGES *****/
    ///handlig basic select/select ingredients1 changes 
    onChange = (option, { action }) => {
        let ingredients = "";
        let ingredients2 = "";

        if (action === "clear") {
            if (option === null) {
                option = [];
            }
        }
        if (action === "remove-value") {
            if (option === null) {
                option = [];
            }
        }
        if ((this.state.type === 0 && option.length <= 2) || (this.state.type === 1 && option.length <= 3) || (this.state.type === 2 && this.state.checkedDivided && option.length <= 3) || (this.state.type === 2 && !this.state.checkedDivided && option.length <= 6)) {
            let special = false;
            const ingr = option.map((i) => { return (i.label) });
            /// PROBABILMENTE DA TOGLIERE QUESTO SETTAGGIO A VUOTO DI VAL2 O TROVARE MODO PER FORZARE SEAFOOD
            let val2 = this.state.val2;
            for (var i of ingr) {
                ingredients = ingredients + i + " ";
                if (i === "seafood")
                    special = true;
            }
            /// SE LA PIZZA DIVISA IN 2 faccio update anche con ingredienti2
            if (this.state.type === 2 && this.state.checkedDivided) {
                ingredients2 = this.state.ingredients2;
            }

            this.setState({ val: option, ingredients: ingredients, ingredients2: ingredients2, special: special, val2: val2 });
            this.props.updatePizza(this.props.id, this.state.number, this.state.type, ingredients, special, this.state.checkedSauce, ingredients2);
        }

    };

    ///handlig select ingredients2 changes 
    onChange2 = (option, { action }) => {
        let ingredients2 = "";

        if (action === "clear") {
            if (option === null) {
                option = [];
                this.triggerSplitInfoMessage(true);
            }
        }
        if (action === "remove-value") {
            if (option === null) {
                option = [];
            }
        }
        if (option.length <= 3) {

            if (option.length > 0) {
                this.triggerSplitInfoMessage(false);
            }
            else {
                this.triggerSplitInfoMessage(true);
            }
            const ingr2 = option.map((i) => { return (i.label) });
            for (var i of ingr2) {
                ingredients2 = ingredients2 + i + " ";
            }
            this.setState({ val2: option, ingredients2: ingredients2 });
            this.props.updatePizza(this.props.id, this.state.number, this.state.type, this.state.ingredients, this.state.special, this.state.checkedSauce, ingredients2);
        }
    };

    ///handling type changes(check on availability and seafood)
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
            if (type === 0 && number > this.state.maxS) {
                if (this.state.maxS > 0)
                    number = this.state.maxS;
                else
                    number = 1;
            }
            if (type === 1 && number > this.state.maxM) {
                if (this.state.maxM > 0)
                    number = this.state.maxM;
                else
                    number = 1;
            }
            if (type === 2 && number > this.state.maxL) {
                if (this.state.maxL > 0)
                    number = this.state.maxL;
                else
                    number = 1;
            }

            if (type < this.state.type) {
                val = [];
                val2 = [];
                ingr = "";
                ingr2 = "";
                special = false;
            }
            ////I make seafoods availables when i choose L pizzas
            var tempOptions;
            if (type === 2) {
                tempOptions = this.state.options.map((o) => { if (o.label !== "seafood") return o; else return { value: "seafood", label: "seafood", isDisabled: false } })
                if (this.state.checkedDivided && this.state.ingredients2 === "") {
                    this.triggerSplitInfoMessage(true);
                }
            }
            else {
                tempOptions = this.state.options.map((o) => { if (o.label !== "seafood") return o; else return { value: "seafood", label: "seafood", isDisabled: true } })
            }

        }
        else
            type = 0;
        this.setState({ options: tempOptions, pizzaType: option, action: action, type: type, number: number, val: val, val2: val2, ingredients: ingr, special: special, ingredients2: ingr2 });
        this.props.updatePizza(this.props.id, number, type, ingr, special, this.state.checkedSauce, ingr2);
    };
    /**************/

    /*******HANDLE CHECKBOXES ******/
    ///large pizza splitted
    handleCheckDividedChange = (event) => {
        var ingr2 = this.state.ingredients2;
        var ingr1 = this.state.ingredients1;
        var val1 = this.state.val;
        if (!event.target.checked) {
            ingr2 = "";
            this.triggerSplitInfoMessage(false);
        }
        else {
            val1 = [];
            ingr1 = "";
            var j = 0;
            for (var i of this.state.val) {
                if (j < 3) {
                    val1.push(i);
                    ingr1 = ingr1 + i.label + " ";
                    j++;
                }
            }
            this.triggerSplitInfoMessage(true);
        }
        this.setState({ checkedDivided: event.target.checked, ingredients2: ingr2, ingredients: ingr1, val: val1 });
        this.props.updatePizza(this.props.id, this.state.number, this.state.type, ingr1, this.state.special, this.state.checkedSauce, ingr2);

    };
    ///tomato checkbox   
    handleCheckSauceChange = (event) => {
        this.setState({ checkedSauce: event.target.checked });
        this.props.updatePizza(this.props.id, this.state.number, this.state.type, this.state.ingredients, this.state.special, event.target.checked, this.state.ingredients2);
    };

    /***********/

    ///info message about splitted pizza
    triggerSplitInfoMessage = (v) => {
        this.setState({ infosplit: v })
    }

    /****BUTTONS FOR CHANGE NUMBER (little checks to avoid non sense numbers)**** */
    buttonMore = () => {
        if ((this.state.type === 0 && this.state.number < this.state.maxS) || (this.state.type === 1 && this.state.number < this.state.maxM) || (this.state.type === 2 && this.state.number < this.state.maxL)) {
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
    /*****************/



    render() {
        const animatedComponents = makeAnimated();
        const id = this.props.id;
        const optionSize = [{ value: 0, label: "S" }, { value: 1, label: "M" }, { value: 2, label: "L" }];
        return (
            <tr><td><Row><h5>x {this.state.number} </h5>
                <tr>
                    <Button variant="outline-dark" size="sm" className="darkbutton" onClick={() => this.buttonLess()}>-</Button>
                </tr>
                <tr>
                    <Button variant="outline-dark" size="sm" className="darkbutton2" onClick={() => this.buttonMore()}>+</Button>
                </tr>
            </Row>
            </td>
                <td>
                    <Select
                        styles={style}
                        value={this.state.pizzaType[0]}
                        options={optionSize}
                        onChange={this.onChangeType}

                    />
                    {this.state.type === 2 &&

                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={this.state.checkedDivided}
                                    onChange={this.handleCheckDividedChange}
                                    name="checkedB"
                                    color="dark"
                                />
                            }
                            label="divided"
                        />
                    }

                </td>
                {(this.state.type === 2 && this.state.checkedDivided) ?
                    <>
                        {
                            this.getLargePizzaSelectDivided(animatedComponents)
                        }

                    </>

                    :
                    this.getPizzaSelect(animatedComponents)
                }
                <td>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={this.state.checkedSauce}
                                onChange={this.handleCheckSauceChange}
                                name="sauce"
                                color="dark"
                            />
                        }

                    />
                </td>
                <td><img onClick={() => this.props.removePizza(id)} src={trash} alt='delete' /></td>
            </tr>

        );
    }
    /******SELECTS *****/
    /// single pizza
    getPizzaSelect = (animatedComponents) => {

        return (<td><Select
            styles={style}
            closeMenuOnSelect={false}
            components={animatedComponents}
            value={this.state.val}
            onChange={this.onChange}
            isMulti
            className="basic-multi-select"
            classNamePrefix="select"
            options={this.state.options} /></td>
        );
    }
    //splitted pizza
    getLargePizzaSelectDivided = (animatedComponents) => {
        return (<td className="double-td"> <td><Select
            styles={style}
            closeMenuOnSelect={false}
            components={animatedComponents}
            value={this.state.val}
            onChange={this.onChange}
            isMulti
            options={this.state.options} /> </td>

            <td className="double-td"><Select
                styles={style}
                closeMenuOnSelect={false}
                components={animatedComponents}
                value={this.state.val2}
                onChange={this.onChange2}
                isMulti
                options={this.state.options} /> </td>

            {
                this.state.infosplit &&
                <h7 className="infosplitmessage"><tr>If no ingredients selected in the second half, this pizza will be considered as not splitted</tr></h7>
            }

        </td>
        );
    }
}

///To change style of the selects
const style = {
    option: (provided, state) => ({
        ...provided,
        color: state.isDisabled ? 'grey' : state.isSelected ? 'white' : 'black',
        backgroundColor: state.isDisabled ? 'rgba(194, 187, 179, 0.35)' : state.isSelected ? '#cda45e' : state.isFocused ? '#cda45e4f' : 'transparent',

    }),
    control: (base, state) => ({
        ...base,
        // borderWidth: state.isFocused ? "5px" : "1px",
        borderColor: state.isFocused ? "#cda45e" : " rgba(158, 158, 158, 0.801)",
        boxShadow: state.isFocused && "1px 1px 2px 1px  #cda45ebb",
        "&:hover": {
            borderColor: state.isFocused && "#cda45e"
        }
    })
};
export default PizzaForm;