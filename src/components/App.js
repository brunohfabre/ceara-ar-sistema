import React, { Component } from 'react';
import { Router, Switch, Route, Redirect } from 'react-router-dom';
import createBrowserHistory from 'history/createBrowserHistory';
import { connect } from 'react-redux';
import { db } from '../firebase';

import Login from './Login';
import Home from './Home';
import Resume from './Resume';
import Releases from './Releases';
import Release from './Release';
import Clients from './Clients';
import Client from './Client';
import ViewClient from './ViewClient';

export const history = createBrowserHistory();

class App extends Component {
  render() {
    const PrivateRoute = ({ component: Component, ...rest }) => (
      <Route {...rest} render={props => (
        this.props.user ? (
          <Component {...props}/>
        ) : (
          <Redirect to={{
            pathname: '/login'
          }}/>
        )
      )}/>
    )
    return (
      <Router history={history}>
        <div>
          {this.props.isLoading && <div id='sidenav-overlay'>
            <div className='sidenav-block'>
              <div className="spinner">
                <div className="bounce1"></div>
                <div className="bounce2"></div>
                <div className="bounce3"></div>
              </div>
            </div>
          </div>}
          <Switch>
            <Route path='/login' exact component={Login} />
            <Route path='/' exact component={Home} />
            <PrivateRoute path='/resumo' exact component={Resume} />
            <PrivateRoute path='/lancamentos' exact component={Releases} />
            <PrivateRoute path='/lancamento/:month/:year' exact component={Release} />
            <PrivateRoute path='/clientes' exact component={Clients} />
            <PrivateRoute path='/cliente' exact component={Client} />
            <PrivateRoute path='/cliente/:key' exact component={ViewClient} />
          </Switch>
        </div>
      </Router>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.auth.user,
    isLoading: state.auth.isLoading
  }
}

export default connect(mapStateToProps, null)(App)
