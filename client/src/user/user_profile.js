import React from 'react';
import Container from 'react-bootstrap/Container';
import API from './../api/API';
import OrderListTable from './orderlist_table';
import './user.css';

class UserProfile extends React.Component {

    constructor(props) {
        super(props);
        this.state = { userId: 0, orderList: [], showList: false };
    }

    getOrders = () => {
        /*
        API.getOrderList().then((orders) => {
            this.setState({ orderList: orders, showList: true });
        });*/
        this.setState({ showList: true });
    }
    render() {
        return (
            <Container fluid>
                <h1>USER PROFILE</h1>
                <div>
                    <td> <img src="./pizza1.jpg" className="user-image"></img> </td>
                    <td><tr><h4> USERNAME: es. Diebru</h4> </tr><tr> EMAIL: es. Diebru96@gmail.com </tr></td>
                </div>
                <div>
                    <p className="App-buttoncheck">
                        <button onClick={() => { this.getOrders(); }}>Check order list</button>
                    </p>
                    <p>
                        {this.state.showList ?
                            <>
                                <OrderListTable orderList={this.state.orderList}></OrderListTable>
                                <button className="App-buttonhide" onClick={() => { this.setState({ showList: false }) }}>HIDE</button>
                            </> :
                            <p className="App-placeholder"></p>
                        }
                    </p>
                </div>
            </Container>
        );
    }
}
export default UserProfile;