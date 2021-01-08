class Order {
    constructor(id_user, price, tot_pizza, tot_s, tot_m, tot_l, pizzas) {

        this.id_user = id_user;
        this.tot_pizza = tot_pizza;
        this.price = price;
        this.tot_s = tot_s;
        this.tot_m = tot_m;
        this.tot_l = tot_l;
        this.pizzas = pizzas;
    }
    toJson = () => {
        return ({ id_user: this.id_user, tot_pizza: this.tot_pizza, price: this.price, tot_s: this.tot_s, tot_m: this.tot_m, tot_l: this.tot_l, pizzas: this.pizzas });
    }
}

module.exports = Order;