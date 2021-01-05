class Order {
    constructor(id_user, price, tot_pizza, tot_s, tot_m, tot_l) {

        this.id_user = id_user;
        this.tot_pizza = tot_pizza;
        this.price = price;
        this.tot_s = tot_s;
        this.tot_m = tot_m;
        this.tot_l = tot_l;

    }
}

module.exports = Order;