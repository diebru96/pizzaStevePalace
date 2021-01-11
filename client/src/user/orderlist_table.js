import React from 'react';

import Table from 'react-bootstrap/Table';
import OrderRow from './order_row';
function OrderListTable(props) {
    {
        const orderList = [{ id_order: 1, TOTpizzas: 10, TOTprice: 50, pizzas: [{ type: "L", number: 2, ingredients: "cibo per gatti", sauce: false, price: 4, second_ingredients: "tonno cipolla" }, { type: "M", number: 4, ingredients: "cibo per gatti", sauce: true, price: 4, second_ingredients: "" }, { type: "L", number: 2, ingredients: "cibo per gatti", sauce: false, price: 4, second_ingredients: "" }] },
        { id_order: 2, TOTpizzas: 4, TOTprice: 30, pizzas: [{ type: "S", number: 5, ingredients: "cibo per gatti", sauce: true, price: 4, second_ingredients: "" }] },
        ];
        // props.orderList;
        return (

            <Table bordered className="App-table">
                <thead>
                    <tr>
                        <th style={{ width: '20%' }}>Order Nr.</th>
                        <th style={{ width: '40%' }}>Number</th>
                        <th style={{ width: '40%' }}>Price</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        orderList.map((order) => {
                            return (<OrderRow order={order} />)
                        })
                    }
                </tbody>
            </Table>

        );
    }
}


export default OrderListTable;