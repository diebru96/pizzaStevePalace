class Order {
    constructor(id_order, price, tot_pizza, tot_s, tot_m, tot_l, pizzas, discount) {

        this.id_order = id_order;
        this.tot_pizza = tot_pizza;
        this.price = price;
        this.tot_s = tot_s;
        this.tot_m = tot_m;
        this.tot_l = tot_l;
        this.pizzas = pizzas;
        this.discount = discount;
    }
    toJson = () => {
        return ({ id_order: this.id_order, tot_pizza: this.tot_pizza, price: this.price, tot_s: this.tot_s, tot_m: this.tot_m, tot_l: this.tot_l, pizzas: this.pizzas, discount: this.discount });
    }
}

module.exports = Order;