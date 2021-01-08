class Pizza {
    constructor(number, type, ingredients, seafood, price, ingredients2) {

        this.number = number;
        this.type = type;
        this.price = price;
        this.ingredients = ingredients;
        this.seafood = seafood;
        this.ingredients2 = ingredients2 || "";
    }

    toJson = () => {
        return ({ number: this.number, type: this.type, price: this.price, ingredients: this.ingredients, seafood: this.seafood, ingredients2: this.ingredients2 });
    }
}

module.exports = Pizza;