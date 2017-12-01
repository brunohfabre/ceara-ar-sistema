import React, { Component } from 'react';
import { connect } from 'react-redux';
import { firebaseApp } from '../firebase';
import { Link } from 'react-router-dom';

import Header from './Header';

class ViewClient extends Component {
  constructor(props) {
    super(props);

    this.state = {
      client: ''
    }
  }
  componentDidMount() {
    firebaseApp.database().ref(`clients/${this.props.match.params.key}`).once('value').then(snap => {
      this.setState({
        client: snap.val()
      });
    });
  }
  render() {
    return (
      <div>
        <Header currentUser={this.props.user} />
        <div className='container'>
          <div className='row'>
            <div className='col-md-12'>
              <Link className='btn btn-primary' to='/lancamentos'>Voltar</Link>
            </div>
          </div>
          <br />
          <div className='row'>
            <div className='col-md-12'>
              {this.state.client && <div className='card'>
                <div className='card-body'>
                  <div className='container-fluid' key={this.state.client.name}>
                    <div className='row'>
                      <div className='col-md-8'>
                        <h5><b>Informaçoes do cliente</b></h5>
                      </div>
                      <div className='col-md-4'>
                        <h5><b>Informaçoes do veículo</b></h5>
                      </div>
                    </div>
                    <hr />
                    <div className='row'>
                      <div className='col-md-4'>
                        <p><b>Nome: </b>{this.state.client.name}</p>
                        <p><b>CPF: </b>{this.state.client.cpf}</p>
                        <p><b>Telefone: </b>{this.state.client.phone}</p>
                      </div>
                      <div className='col-md-4'>
                        <p><b>CEP: </b>{this.state.client.cep}</p>
                        <p><b>Rua: </b>{this.state.client.logradouro}</p>
                        <p><b>Número: </b>{this.state.client.number}</p>
                        <p><b>Bairro: </b>{this.state.client.bairro}</p>
                        {!this.state.client.complement === '' && <p><b>Complemento: </b>{this.state.client.complement}</p>}
                        <p><b>Cidade: </b>{this.state.client.localidade}</p>
                        <p><b>Estado: </b>{this.state.client.uf}</p>
                      </div>
                      <div className='col-md-4'>
                        <p><b>Marca: </b>{this.state.client.brand}</p>
                        <p><b>Modelo: </b>{this.state.client.model}</p>
                        <p><b>Ano: </b>{this.state.client.age}</p>
                        <p><b>Placa: </b>{this.state.client.board}</p>
                      </div>
                    </div>
                    <hr />
                    {this.state.client.images && <div className='row'>
                      {Object.keys(this.state.client.images).map(key => {
                        const image = this.state.client.images[key];
                        return (
                          <div className='col-sm-6 col-md-2' key={key}>
                            <a href={image.imageUrl} target='blank'>
                              <img className=' img-fluid' src={image.imageUrl} />
                            </a>
                          </div>
                        )
                      })}
                    </div>}
                  </div>
                </div>
              </div>}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.auth.user
  }
}

export default connect(mapStateToProps, null)(ViewClient);
