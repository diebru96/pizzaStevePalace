import React from 'react';

import Table from 'react-bootstrap/Table';
import './App.css'
function AvailabilityTable(props) {
    {
        const info = props.pizzeriaInfos[0];
        return (

            <Table bordered className="App-table">
                <thead>
                    <tr>
                        <th style={{ width: '20%' }}>Size </th>

                        <th style={{ width: '40%' }}>Available </th>
                        <th style={{ width: '40%' }}>Price</th>
                    </tr>
                </thead>
                <tbody>
                    <tr><td> S </td><td> {info.available_s} </td><td>{info.price_s}$</td></tr>
                    <tr><td> M </td><td> {info.available_m} </td><td>{info.price_m}$</td></tr>
                    <tr><td> L </td><td> {info.available_l} </td><td>{info.price_l}$</td></tr>
                </tbody>
            </Table>

        );
    }
}


export default AvailabilityTable;