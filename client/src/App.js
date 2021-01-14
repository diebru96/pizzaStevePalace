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
import { AppContext } from './app_contexts';
//DIALOGUE
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { ingredients: ["olives", "ham", "bacon", "mushrooms", "egg", "artichokes", "seafood", "chips", "vegetables"], pizzeriaInfos: [], username: "", userlogged: false, showInfos: false, homeHeader: true, message: "", authUser: { username: "die", email: "fresco", showPopUp: false }, pizzaReady: false, orderOk: false, available_s: 10, available_m: 8, available_l: 6 };
  }

  componentDidMount() {
    //CHECK AUTH
    API.isAuthenticated().then(
      (user) => {
        this.setState({ authUser: user, userlogged: true, username: user.username });
      }
    ).catch((err) => {
      this.setState({ authUser: {}, authErr: err.errorObj });
      // this.props.history.push("/login");
    });
  }

  getpizzeriaInfo = () => {
    API.pizzeriaInfos().then((infos) => {
      this.setState({ pizzeriaInfos: infos, showInfos: true, available_s: infos[0].available_s, available_m: infos[0].available_m, available_l: infos[0].available_l });
    });
  }

  login = (email, password) => {
    API.userLogin(email, password).then(
      (user) => {
        this.setState({ username: user.username, userlogged: true });
      }
    ).catch(
      (errorObj) => {
        const err0 = errorObj.errors[0];
        this.setState({ authErr: err0 });
      }
    );
  }

  triggerPizzaReady = () => {
    this.triggerOrderOk();
    setTimeout(() => { this.setState({ pizzaReady: true, orderOk: false }) }, 5000);
  }
  triggerOrderOk = () => {
    this.setState({ orderOk: true })
  }



  ///PER ERRORI LOGIN
  handleErrors(err) {
    if (err) {
      if (err.status && err.status === 401) {
        this.setState({ authErr: err.errorObj });
        this.props.history.push("/login");
      }
    }
  }

  changeAvailability = (s, m, l) => {
    this.setState({ available_s: s, available_m: m, available_l: l })
  }


  render() {
    const value = {
      authUser: this.state.authUser,
      authErr: this.state.authErr,
      available_s: this.state.available_s,
      available_m: this.state.available_m,
      available_l: this.state.available_l,
      changeAvailability: this.changeAvailability
    }
    return (
      <AppContext.Provider value={value}>
        <Router>

          <header className={this.state.homeHeader ? "App-header" : "App-header2"}>

            <nav class="nav-menu">

              <h3 className="App-titleBar"> <Link to="/" onClick={() => this.setState({ homeHeader: true })}><h3 className="App-titleBar"> Pizza Steve Palace</h3></Link></h3>
              <ul>
                <li class="active"><a href="/" onClick={() => this.setState({ homeHeader: true })}>Home</a></li>
                {this.state.homeHeader && <>
                  <li><a href="#menu">Ingredients</a></li>
                  <li><a href="#availability">Availability</a></li>
                </>
                }
                <li class="book-a-table"><Link to={this.state.userlogged ? "/order" : "/login"} onClick={() => this.setState({ homeHeader: false, message: "You need to login to make your order" })}>Create an order</Link></li>
                {this.state.userlogged ?
                  (
                    <><li class="book-a-table"><Link to="/userprofile" onClick={() => this.setState({ homeHeader: false })}>USERNAME:{this.state.username}</Link></li>
                      <li><Link to="/" onClick={() => { this.setState({ homeHeader: true, userlogged: false, username: "" }); API.userLogout(); }}>LOGOUT</Link></li></>
                  ) :
                  (<>
                    <li class="book-a-table"><Link to="/login" onClick={() => this.setState({ homeHeader: false, message: "" })}>LOGIN</Link></li>
                    <li class="book-a-table"><Link to="/signup">SIGN UP</Link></li>
                  </>
                  )
                }
              </ul>

            </nav>
            {this.state.homeHeader &&
              <>
                <h1>Pizza Steve Palace</h1>
                <img src="./pizzalogo.png" className="App-logo" alt="logo" />
              </>

            }

          </header>
          {this.OrderOkDialogue("Your order has been accepted", "You will be notified when it is ready.")}
          {this.PizzaDialogue("Your pizzas are ready", "Hi" + this.state.username, "You can collect your pizzas at Pizza Steve Palace.")}
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
              <LoginForm message={this.state.message} login={this.login}></LoginForm>
            </Route>
            <Route path="/signup">
              <SignUpForm></SignUpForm>
            </Route>

            <Route path="/order">
              <OrderForm ingredientList={this.state.ingredients} triggerPizzaReady={this.triggerPizzaReady}></OrderForm>
            </Route>

            <Route path="/userprofile">
              <UserProfile></UserProfile>
            </Route>
          </Switch>
        </Router>
      </AppContext.Provider>
    );
  }

  PizzaDialogue = (title, message1, message2) => {
    return (
      <div>

        <Dialog
          open={this.state.pizzaReady}
          TransitionComponent={Transition}
          keepMounted
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle id="alert-dialog-slide-title">{title}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
              <tr>{message1}</tr>
              <tr>{message2}</tr>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => this.setState({ pizzaReady: false })} color="primary">
              OK
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }

  OrderOkDialogue = (title, message) => {
    return (
      <div>

        <Dialog
          open={this.state.orderOk}
          TransitionComponent={Transition}
          keepMounted
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle id="alert-dialog-slide-title">{title}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
              <tr>{message}</tr>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => this.setState({ orderOk: false })} color="primary">
              OK
                    </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }

}


const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default App;
