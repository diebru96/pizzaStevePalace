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
import AvailabilityTable from './availability';
import SignUpForm from './auth/signup'
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { ingredients: ["olives", "ham", "bacon", "mushrooms", "egg", "artichokes", "seafood", "chips", "vegetables"], pizzeriaInfos: [], username: "", userlogged: true, showInfos: false, homeHeader: true };
  }

  componentDidMount() {
    this.setState({ homeHeader: true });
  }

  getpizzeriaInfo = () => {
    API.pizzeriaInfos().then((infos) => {
      this.setState({ pizzeriaInfos: infos, showInfos: true });
    });
  }
  render() {
    const greeting = 'Welcome to React';
    return (

      <Router>

        <header className={this.state.homeHeader ? "App-header" : "App-header2"}>

          <nav class="nav-menu">

            <h3 className="App-titleBar"> <Link to="/" onClick={() => this.setState({ homeHeader: true })}><h3 className="App-titleBar"> Pizza Steve Palace</h3></Link></h3>
            <ul>
              <li class="active"><a href="/" onClick={() => this.setState({ homeHeader: true })}>Home</a></li>
              {this.state.homeHeader ? <>
                <li><a href="#menu">Ingredients</a></li>
                <li><a href="#availability">Availability</a></li>
              </> :
                <></>}
              <li class="book-a-table"><Link to="/order" onClick={() => this.setState({ homeHeader: false })}>Create an order</Link></li>
              {this.state.userlogged ?
                (
                  <><li class="book-a-table"><Link to="/userprofile" onClick={() => this.setState({ homeHeader: false })}>USERNAME:{this.state.username}</Link></li>
                    <li><Link to="/logout">LOGOUT</Link></li></>
                ) :
                (<>
                  <li class="book-a-table"><Link to="/login" onClick={() => this.setState({ homeHeader: false })}>LOGIN</Link></li>
                  <li class="book-a-table"><Link to="/signup">SIGN UP</Link></li>
                </>
                )
              }
            </ul>

          </nav>
          {this.state.homeHeader ?
            <>
              <h1>Pizza Steve Palace</h1>
              <img src="./pizzalogo.png" className="App-logo" alt="logo" />
            </>
            :
            <></>}

        </header>

        <Switch>
          <Route exact path="/">
            <div className="App">

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
                </section>
                <section id="availability">
                  <p className="App-buttoncheck">
                    <button onClick={() => { this.getpizzeriaInfo(); document.getElementById('availability').scrollIntoView(); }}>Check availability</button>
                  </p>
                  {this.state.showInfos ?
                    <>
                      <AvailabilityTable pizzeriaInfos={this.state.pizzeriaInfos}></AvailabilityTable>
                      <button className="App-buttonhide" onClick={() => { this.setState({ showInfos: false }) }}>HIDE</button>
                    </> :
                    <p className="App-placeholder"></p>
                  }
                  <p>
                  </p>
                </section>
              </body>
            </div>
          </Route>
          <Route path="/login">
            <LoginForm></LoginForm>
          </Route>
          <Route path="/signup">
            <SignUpForm></SignUpForm>
          </Route>

          <Route path="/order">
            <OrderForm ingredientList={this.state.ingredients}></OrderForm>
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
