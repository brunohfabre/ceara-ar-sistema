import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { getClients } from '../actions';
import { firebaseApp } from '../firebase';
import SearchInput, {createFilter} from 'react-search-input';

import Header from './Header';

const KEYS_TO_FILTERS = ['name', 'cpf', 'logradouro']

class Clients extends Component {
  constructor(props) {
    super(props);

    this.state = {
      clients: [],
      isLoading: true,
      search: '',
      filteredClients: ''
    }

    this.searchUpdated = this.searchUpdated.bind(this)
  }
  searchUpdated (term) {
    this.setState({searchTerm: term})
  }
  componentDidMount() {
    firebaseApp.database().ref('clients').on('value', snap => {
      if(snap.val()) {
        let clients = [];
        snap.forEach(client => {
          clients.push(client.val());
        });
        this.setClients(clients);
      } else {
        this.setClients(null);
      }
    });
  }
  setClients(clients) {
    this.setState({
      clients: clients,
      isLoading: false
    }, () => {
      console.log(this.state.clients)
    });
  }
  removeClient(clientKey) {
    firebaseApp.database().ref(`clients/${clientKey}/`).once('value').then(snapshot => {
      const client = snapshot.val();

      if(client.images) {
        Object.keys(client.images).map(key => {
          const image = client.images[key];
          firebaseApp.storage().ref(`clients/${clientKey}/${image.imageName}/`).delete()
        });
      }

      firebaseApp.database().ref(`clients/${clientKey}/`).remove();
    })
  }

  mudou(event) {
    this.setState({ search: event.target.value });
  }

  render() {
    let filteredClients = '';
    if(this.state.clients) {
    filteredClients = this.state.clients.filter(
      (client) => {
        if(client.name.toLowerCase().indexOf(this.state.search.toLowerCase()) !== -1) {
          return this
        }
        if(client.cpf.toLowerCase().indexOf(this.state.search.toLowerCase()) !== -1) {
          return this
        }
        if(client.phone.toLowerCase().indexOf(this.state.search.toLowerCase()) !== -1) {
          return this
        }
        if(client.cep.toLowerCase().indexOf(this.state.search.toLowerCase()) !== -1) {
          return this
        }
        if(client.logradouro.toLowerCase().indexOf(this.state.search.toLowerCase()) !== -1) {
          return this
        }
        if(client.number.toLowerCase().indexOf(this.state.search.toLowerCase()) !== -1) {
          return this
        }
        if(client.bairro.toLowerCase().indexOf(this.state.search.toLowerCase()) !== -1) {
          return this
        }
        if(client.complement.toLowerCase().indexOf(this.state.search.toLowerCase()) !== -1) {
          return this
        }
        if(client.localidade.toLowerCase().indexOf(this.state.search.toLowerCase()) !== -1) {
          return this
        }
        if(client.uf.toLowerCase().indexOf(this.state.search.toLowerCase()) !== -1) {
          return this
        }
        if(client.brand.toLowerCase().indexOf(this.state.search.toLowerCase()) !== -1) {
          return this
        }
        if(client.age.toLowerCase().indexOf(this.state.search.toLowerCase()) !== -1) {
          return this
        }
        if(client.model.toLowerCase().indexOf(this.state.search.toLowerCase()) !== -1) {
          return this
        }
        if(client.board.toLowerCase().indexOf(this.state.search.toLowerCase()) !== -1) {
          return this
        }
      }
    )}
    return (
      <div>
        {this.state.isLoading && <div id='sidenav-overlay'>
          <div className='sidenav-block'>
            <div className="spinner">
              <div className="bounce1"></div>
              <div className="bounce2"></div>
              <div className="bounce3"></div>
            </div>
          </div>
        </div>}
        <Header currentUser={this.props.user} />
        <Link to='/cliente' className='btn btn-primary btn-add-release'>adicionar</Link>

        {!this.state.clients && <div className='container'>
          <div className='row'>
            <div className='col-md-12'>
              <div className='card'>
                <div className='card-body'>
                  <p>Nenhum cliente cadastrado.</p>
                </div>
              </div>
            </div>
          </div>
        </div>}

        {this.state.clients && <div className='container' style={{marginBottom: '16px'}}>
          <div className='row'>
            <div className='col-md-12'>
              <input type='text' className='form-control' onChange={event => this.mudou(event)} placeholder='Pesquisar'/>
            </div>
          </div>
          {filteredClients.map(client => (<div className='row' style={{marginTop: '16px'}} key={client.cpf}>
            <div className='col-md-12'>
              <div className='card'>
                <div className='card-body'>
                  <div className='container-fluid' key={client.name}>
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
                        <p><b>Nome: </b>{client.name}</p>
                        <p><b>CPF: </b>{client.cpf}</p>
                        <p><b>Telefone: </b>{client.phone}</p>
                      </div>
                      <div className='col-md-4'>
                        <p><b>CEP: </b>{client.cep}</p>
                        <p><b>Rua: </b>{client.logradouro}</p>
                        <p><b>Número: </b>{client.number}</p>
                        <p><b>Bairro: </b>{client.bairro}</p>
                        {!client.complement === '' && <p><b>Complemento: </b>{client.complement}</p>}
                        <p><b>Cidade: </b>{client.localidade}</p>
                        <p><b>Estado: </b>{client.uf}</p>
                      </div>
                      <div className='col-md-4'>
                        <p><b>Marca: </b>{client.brand}</p>
                        <p><b>Modelo: </b>{client.model}</p>
                        <p><b>Ano: </b>{client.age}</p>
                        <p><b>Placa: </b>{client.board}</p>
                      </div>
                    </div>
                    <hr />
                    {client.images && <div className='row'>
                      {Object.keys(client.images).map(key => {
                        const image = client.images[key];
                        return (
                          <div className='col-sm-6 col-md-2' key={key}>
                            <a href={image.imageUrl} target='blank'>
                              <img className=' img-fluid' src={image.imageUrl} />
                            </a>
                          </div>
                        )
                      })}
                    </div>}
                    <br />
                    <div className='row'>
                      <div className='col-md-12'>
                        <button className='btn btn-danger' onClick={() => this.removeClient(client.key)}>remover</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>))}
        </div>}
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.auth.user
  }
}

export default connect(mapStateToProps, null )(Clients);
