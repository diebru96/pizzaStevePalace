import React from 'react';
import Image from './classi_abbellimento/image_wobble';
import Table from 'react-bootstrap/Table';
import './App.css';
import API from './api/API';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import LoginForm from './auth/login_form';
import OrderForm from './order/order_form';
import UserProfile from './user/user_profile';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { ingredients: ["olives", "ham", "bacon", "mushrooms", "egg", "artichokes", "seafood", "chips", "vegetables"], pizzeriaInfos: [], username: "", userlogged: false };
  }

  componentDidMount() {
    API.pizzeriaInfos().then((infos) => {
      this.setState({ pizzeriaInfos: infos });
    });

  }

  render() {
    return (

      <Router>
        <Switch>
          <Route exact path="/">
            <div className="App">
              <header className="App-header">

                <nav class="nav-menu">

                  <h3 className="App-titleBar"> Pizza Steve Palace</h3>
                  <ul>
                    <li class="active"><a href="/">Home</a></li>
                    <li><a href="#menu">Ingredients</a></li>
                    <li><a href="#events">Availability</a></li>
                    <li class="book-a-table"><Link to="/order">Create an order</Link></li>
                    {this.state.userlogged ?
                      (
                        <><li class="book-a-table"><Link to="/userprofile">USERNAME:{this.state.username}</Link></li>
                          <li><Link to="/logout">LOGOUT</Link></li></>
                      ) :
                      <li class="book-a-table"><Link to="/login">LOGIN</Link></li>
                    }
                  </ul>

                </nav>

                <h1>Pizza Steve Palace</h1>
                <img src="./pizzalogo.png" className="App-logo" alt="logo" />

              </header>
              <body>
                <section id="menu">
                  <h2 className="App-title">List of Ingredients</h2>

                  <table className="App-table">
                    <thead>

                      <tr>
                        <th style={{ width: '50%' }}></th>
                        <th style={{ width: '50%' }}></th>
                      </tr>
                    </thead>
                    <tbody>
                      <td><Image /></td>
                      <td>
                        {this.state.ingredients.map((i) => { return <tr>{i}</tr>; })}
                      </td>

                    </tbody>
                  </table>

                  <p className="App-buttoncheck">
                    <button onClick={() => { }}>Check availability</button>
                  </p>

                  {this.state.pizzeriaInfos.map((info) => {
                    return (<Table bordered className="App-table">
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
                    </Table>)
                  })}

                  <p>


                  </p>

                </section>
              </body>
            </div>
          </Route>
          <Route path="/login">
            <LoginForm></LoginForm>
          </Route>

          <Route path="/order">
            <OrderForm></OrderForm>
          </Route>

          <Route path="/userprofile">
            <UserProfile></UserProfile>
          </Route>
        </Switch>
      </Router>
    );
  }
}

export default App;
