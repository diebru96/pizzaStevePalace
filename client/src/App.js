import React from 'react';
import Image from './classi_abbellimento/image_wobble';
import Button from 'react-bootstrap/Button';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import './App.css';
import API from './api/API';
import {
  // BrowserRouter as Router,
  withRouter,
  Switch,
  Route,
  Link,
} from "react-router-dom";
import LoginForm from './auth/login_form';
import OrderForm from './order/order_form';
import UserProfile from './user/user_profile';
import AvailabilityTable from './availability';
import SignUpForm from './auth/signup'
import { AppContext } from './app_contexts';
//DIALOGUE
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';

window.onscroll = function () { scrollFunction() };

///SCROLL FUNCTION TO CHANGE HEADER ON SCROLL
function scrollFunction() {
  ///when scrolled more than 80
  if (document.body.scrollTop > 80 || document.documentElement.scrollTop > 80) {
    document.getElementById("navbar").style.padding = "1vh";
    document.getElementById("navbar").style.backgroundColor = ` #1a1814`;
    document.getElementById("logo").style.height = "8.5vh";
    document.getElementById("logo").style.marginLeft = "150px";

  } else {
    ///when at top
    document.getElementById("navbar").style.padding = "1vh";
    document.getElementById("navbar").style.backgroundColor = `#1a181488`;
    document.getElementById("logo").style.height = "20vh";
    document.getElementById("logo").style.marginLeft = "90px";

  }
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { ingredients: ["olives", "ham", "bacon", "mushrooms", "egg", "artichokes", "seafood", "chips", "vegetables"], pizzeriaInfos: [], username: "", userlogged: false, showInfos: false, homeHeader: true, message: "", authUser: {}, pizzaReady: false, orderOk: false, available_s: 10, available_m: 8, available_l: 6, timeOut: false, authErr: "" };
  }


  componentDidMount() {
    this.checkAuth();
  }

  ///GET INFOS (passed to availability table)  
  getpizzeriaInfo = () => {
    API.pizzeriaInfos().then((infos) => {
      this.setState({ pizzeriaInfos: infos, showInfos: true, available_s: infos[0].available_s, available_m: infos[0].available_m, available_l: infos[0].available_l });
    });
  }

  /***AUTH FUNCTIONS ****/
  //CHECK AUTH VALIDITY
  checkAuth = () => {
    API.isAuthenticated().then(
      (user) => {
        this.setState({ authUser: user, userlogged: true, username: user.username, timeOut: false });
      }
    ).catch((err) => {
      //Timeout è per switchare pagina da order e user
      this.setState({ authUser: {}, userlogged: false, username: "", timeOut: true });
      // this.props.history.push("/login");
    });
  }
  ///LOGIN
  login = (email, password) => {
    API.userLogin(email, password).then(
      (user) => {
        this.setState({ authUser: user, username: user.username, userlogged: true, timeOut: false, homeHeader: true });
      }
    ).catch(
      (err) => {
        this.handleErrors(err);
      }
    );
  }
  ///PER ERRORI LOGIN
  handleErrors(err) {
    if (err) {
      ///case 0 EMAIL non esistente
      ///case 1 PASSWORD ERRATA
      if (err.errorid === 0 || err.errorid === 1) {
        this.setState({ authErr: err.message });
        ///push back to login
        this.props.history.push("/login");
      }
    }
  }

  ///  IF session is timed out i update state and context  
  sessionTimedOut = () => {
    this.setState({ userlogged: false, username: "", authUser: {}, timeOut: true });
  }
  /**********/



  /*POP UP ORDINAZIONE******/
  ///ordine accettato
  triggerOrderOk = () => {
    this.setState({ orderOk: true })
  }
  ///ordine pronto
  triggerPizzaReady = () => {
    this.triggerOrderOk();
    setTimeout(() => { this.setState({ pizzaReady: true, orderOk: false }) }, 5000);
  }
  /*****************/


  ///CHANGE HEADER TYPE (TRUE: home header with image and whole page, FALSE: small header)
  changeHeader = (value) => {
    this.setState({ homeHeader: value })
  }




  render() {
    ///CONTEXT VALUES
    const value = {
      authUser: this.state.authUser,
      authErr: this.state.authErr,
      homeHeader: this.state.homeHeader,
      userLogged: this.state.userlogged,
      timeOut: this.state.timeOut,
      sessionTimedOut: this.sessionTimedOut,
      changeHeader: this.changeHeader
    }

    return (
      <AppContext.Provider value={value}>

        <header className={this.state.homeHeader ? "App-header" : "App-header2"}>

          <Navbar id="navbar" className="nav-menu" collapseOnSelect expand="lg" fixed="top" variant="dark" >
            <img id="logo" src="./pizzalogo.png" className="App-logo" alt="logo" />

            <Navbar.Brand className="App-titleBar"> <Link to="/" onClick={() => { this.setState({ homeHeader: true }); this.checkAuth(); }}><h3 className="App-titleBar"> Pizza Steve Palace</h3></Link></Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
              {this.state.homeHeader &&
                <Nav className="mr-auto">
                  <li class="active"><a href="/" onClick={() => this.setState({ homeHeader: true })}> Home </a></li>
                  <li><a href="#menu"> Ingredients </a></li>
                  <li><a href="#availability" onClick={() => { this.getpizzeriaInfo() }}> Availability </a></li>
                </Nav>}
              <Nav className="navright">
                <li class="book-a-table"><Link to={this.state.userlogged ? "/order" : "/login"} onClick={() => this.setState({ homeHeader: false, message: "You need to login to make your order" })}>Create an order</Link></li>
                {this.state.userlogged ?
                  (
                    <><li class="book-a-table"><Link to="/userprofile" onClick={() => this.setState({ homeHeader: false })}>USERNAME:{this.state.username}</Link></li>
                      <li class="logout"><Link to="/" onClick={() => { this.setState({ homeHeader: true, userlogged: false, username: "", authUser: {} }); API.userLogout(); }}>LOGOUT</Link></li></>
                  ) :
                  (<>
                    <li class="book-a-table"><Link to="/login" onClick={() => this.setState({ message: "" })}>LOGIN</Link></li>
                    <li class="book-a-table"><Link to="/signup">SIGN UP</Link></li>
                  </>
                  )
                }
              </Nav>
            </Navbar.Collapse>

          </Navbar>


          {this.state.homeHeader &&
            <>
              <h1 className="App-h1">Pizza Steve Palace</h1>
            </>

          }

        </header>
        {this.OrderOkDialogue("Your order has been accepted", "You will be notified when it is ready.")}
        {this.PizzaDialogue("Your pizzas are ready", "Hi " + this.state.authUser.email + ".", "You can collect your pizzas at Pizza Steve Palace.")}
        <Switch>
          <Route exact path="/">
            <div className="App">

              <body className="App-body">

                <section id="menu" className="App-menu">
                  <div>
                    <p class="center">
                      <p className="App-spacer"></p>
                      <h2 className="App-title">List of Ingredients</h2>
                      <p className="App-spacer2"> </p>
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
                            <h5 className="App-ingredients"> {this.state.ingredients.map((i) => { if (i === "seafood") return <tr>{i} (only on L with +20% price)</tr>; else return <tr>{i}</tr>; })}</h5>
                          </td>

                        </tbody>
                      </table>

                    </p>
                  </div>
                  <p className="App-changesection1"></p>

                </section>
                <section id="availability" className="App-availability">
                  <p className="App-changesection2"></p>

                  <div>
                    <p className="App-spacer"></p>
                    <h2 className="App-av-desc">We produce a limited amount of pizzas everyday to guarantee the best product possible to our clients.</h2>
                    <p className="App-spacer3"></p>

                    {this.state.showInfos &&
                      <>
                        <AvailabilityTable pizzeriaInfos={this.state.pizzeriaInfos}></AvailabilityTable>
                        <button className="App-buttonhide" onClick={() => { this.setState({ showInfos: false }) }}>HIDE</button>
                        <p></p>
                        <h4 className="h4bottom">Buy 3 pizzas and get a 10% discount</h4>
                      </>
                    }
                    <p className="App-spacer4"></p>
                    <p className="App-buttoncheck">
                      <button onClick={() => { this.getpizzeriaInfo();/* document.getElementById('availability').scrollIntoView();*/ }}>Check availability</button>
                    </p>

                    <p>

                    </p>
                  </div>
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

      </AppContext.Provider>
    );
  }

  /******DIALOGUES******/
  ///dialogue for pizza ready to pick up
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
            <Button variant="success" onClick={() => this.setState({ pizzaReady: false })}>
              OK
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }

  ///dialogue for order ok
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
            <Button variant="success" onClick={() => this.setState({ orderOk: false })} >
              OK
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
  /********/
}


const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default withRouter(App);
