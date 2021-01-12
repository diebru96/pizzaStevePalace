class Pizza {
    constructor(id, number, type, ingredients, seafood, price, sauce, ingredients2) {
        this.id = id;
        this.number = number;
        this.type = type;
        this.price = price;
        this.ingredients = ingredients;
        this.seafood = seafood;
        this.sauce = sauce;
        this.ingredients2 = ingredients2 || "";
    }

    toJson = () => {
        return ({ id: this.id, number: this.number, type: this.type, price: this.price, ingredients: this.ingredients, seafood: this.seafood, sauce: this.sauce, ingredients2: this.ingredients2 });
    }
}

module.exports = Pizza;