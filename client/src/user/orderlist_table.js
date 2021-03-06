import React from 'react';

import Table from 'react-bootstrap/Table';
import OrderRow from './order_row';
function OrderListTable(props) {

    return (

        <Table className="pastorders-table">
            <thead>
                <tr>
                    <th style={{ width: '20%' }}>Order Nr.</th>
                    <th style={{ width: '40%' }}>Number of pizzas</th>
                    <th style={{ width: '40%' }}>Price</th>
                </tr>
            </thead>
            <tbody className="orderlist">
                {

                    ((props.orderList !== null) && (props.orderList.length !== 0)) ?

                        props.orderList.map((order) => {
                            return (<OrderRow order={order} context={props.context} />)
                        })
                        :
                        <tr><td></td><td>no past orders found</td><td></td></tr>

                }
            </tbody>

        </Table>

    );
}



export default OrderListTable;