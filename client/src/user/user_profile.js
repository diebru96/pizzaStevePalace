import React from 'react';
import Container from 'react-bootstrap/Container';
import API from './../api/API';
import OrderListTable from './orderlist_table';
import { Redirect } from 'react-router-dom';
import './user.css';
import { AppContext } from '../app_contexts';


class UserProfile extends React.Component {

    constructor(props) {
        super(props);
        this.state = { userId: 0, orderList: [], showList: false, firstShow: true, redirect: false };
    }

    componentDidMount() {
        //setto header piccolo(useful especially when the page is refreshed)
        var appcontext = this.context;
        appcontext.changeHeader(false);
    }

    ///To get orderlist
    getOrders = () => {
        //if(id===-1) the session is expired, so i redirect the user to the login page (SESSIONTIMEDOUT => appcontext.timeout=false), if i have other errors i redirect the user to the home
        API.getOrderList().then((orders) => {
            if (orders.id === -1) {
                this.context.sessionTimedOut();
                this.setState({ orderList: [], redirect: true, showList: false, firstShow: true });
            }
            else
                this.setState({ orderList: orders.orders, showList: true, firstShow: false });
        }).catch((err) => {
            var x = 0;
            if (err.id === -1) {
                x = -1;
                this.context.sessionTimedOut();
            }
            this.setState({ orderList: [], redirect: true, showList: false, firstShow: true });
        });
    }
    render() {
        var appcontext = this.context;
        if (appcontext.timeOut)
            return <Redirect to='/login' />;
        else
            if (this.state.redirect) {
                return <Redirect to='/' />;
            }
            else
                return (
                    <AppContext.Consumer>
                        {(context) => (

                            <Container fluid>

                                <div className="user-background"></div>
                                <p className="user-spacer"></p>
                                <h1 className="user-title">USER PROFILE</h1>
                                <p></p>
                                <div className="user-div">
                                    <td> <img src="./pizza5.jpg" className="user-image"></img> </td>
                                    <td className="h-space"></td>
                                    <td><tr><h4> USERNAME: {context.authUser.username}</h4> </tr><tr> EMAIL: {context.authUser.email}</tr></td>
                                </div>
                                <p className="user-spacer"></p>
                                <div>
                                    {this.state.showList ?
                                        <p className="App-buttonlistorders">
                                            <button onClick={() => { this.setState({ showList: false }) }}>Hide list</button>
                                        </p> :
                                        this.state.firstShow ?
                                            <p className="App-buttonlistorders">
                                                <button onClick={() => { this.getOrders(); }}>Check past order list</button>
                                            </p> :

                                            <p className="App-buttonlistorders">
                                                <button onClick={() => { this.setState({ showList: true }) }}>Show list</button>
                                            </p>
                                    }
                                    <p>
                                        {this.state.showList ?
                                            <>
                                                <OrderListTable orderList={this.state.orderList} context={this.context}></OrderListTable>
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