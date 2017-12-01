import React, { Component } from 'react';
import { firebaseApp } from '../firebase';
import { connect } from 'react-redux';
import { signIn } from '../actions'

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: ''
    }
  }

  render() {
    return (
      <div className='container'>
        <div className='row login-page align-items-center'>
          <div className='col-sm-12 col-md-4 offset-md-4'>
            <div className='card login-card'>
              <div className='card-body'>
                <h4 className='card-title'>
                  Login
                </h4>
                <hr />
                <br />
                <form onSubmit={(e) => this.props.signIn(this.state.email, this.state.password, e)}>
                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input type="email" className="form-control" id="email" placeholder="Email" onChange={event => this.setState({email: event.target.value})} />
                  </div>
                  <div className="form-group">
                    <label htmlFor="password">Senha</label>
                    <input type="password" className="form-control" id="password" placeholder="Senha" onChange={event => this.setState({password: event.target.value})} />
                  </div>
                  <div className='form-group' align='right'>
                    <button type="submit" className="btn btn-primary">Entrar</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(null, { signIn })(Login);
