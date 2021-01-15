import React from 'react';
import Container from 'react-bootstrap/Container';
import API from './../api/API';
import OrderListTable from './orderlist_table';
import './user.css';
import { AppContext } from '../app_contexts';


class UserProfile extends React.Component {

    constructor(props) {
        super(props);
        this.state = { userId: 0, orderList: [], showList: false, firstShow: true };
    }

    componentDidMount() {
        var appcontext = this.context;
        appcontext.changeHeader(false);
    }

    getOrders = () => {
        API.getOrderList().then((orders) => {
            this.setState({ orderList: orders, showList: true, firstShow: false });
        });
    }
    render() {
        return (
            <AppContext.Consumer>
                {(context) => (
                    <Container fluid>
                        <h1>USER PROFILE</h1>
                        <div>
                            <td> <img src="./pizza1.jpg" className="user-image"></img> </td>
                            <td><tr><h4> USERNAME: {context.authUser.username}</h4> </tr><tr> EMAIL: {context.authUser.email}</tr></td>
                        </div>
                        <div>
                            {this.state.showList ?
                                <p className="App-buttoncheck">
                                    <button onClick={() => { this.setState({ showList: false }) }}>Hide list</button>
                                </p> :
                                this.state.firstShow ?
                                    <p className="App-buttoncheck">
                                        <button onClick={() => { this.getOrders(); }}>Check order list</button>
                                    </p> :

                                    <p className="App-buttoncheck">
                                        <button onClick={() => { this.setState({ showList: true }) }}>Show list</button>
                                    </p>
                            }
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
                )}
            </AppContext.Consumer>
        );
    }
}
UserProfile.contextType = AppContext; // TO ACCESS CONTEXT VALUES WITH THIS
export default UserProfile;