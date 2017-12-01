import React, { Component } from 'react';
import { connect } from 'react-redux';
import { history } from './App';
import { firebaseApp } from '../firebase';
import { Link } from 'react-router-dom';

import Header from './Header';

class Release extends Component {
  constructor(props) {
    super(props)

    this.state = {
      clients: [],
      releases: [],
      value: '',
      payment: '',
      plots: '',
      type: null,
      isLoading: false,
      step: 1,
      image: '',
      search: '',
      filteredClients: '',
      selectedClient: null,
      date: {
        month: this.props.match.params.month,
        year: this.props.match.params.year
      }
    }
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
  mudou(event) {
    this.setState({ search: event.target.value });
  }
  setClients(clients) {
    this.setState({
      clients: clients,
      isLoading: false
    }, () => {
      console.log(this.state.clients)
    });
  }
  addRelease(e) {
    const date = {
      month: this.props.match.params.month,
      year: this.props.match.params.year
    }
    const releaseReceita = {
      type: this.state.type,
      paymentType: this.state.payment,
      value: this.state.value,
      client: this.state.selectedClient,
      date: Date.now()
    }
    const releaseDespesa = {
      type: this.state.type,
      paymentType: this.state.payment,
      value: this.state.value,
      date: Date.now()
    }
    this.setState({ isLoading: true })

    if(this.state.type === 'receita') {

      if(this.state.image.files) {
        firebaseApp.database().ref(`${date.month}-${date.year}`).push(releaseReceita).then(releaseRes => {
          firebaseApp.database().ref(`${date.month}-${date.year}/${releaseRes.key}/`).update({ key: releaseRes.key }).then(res => {
            firebaseApp.storage().ref(`${date.month}-${date.year}/${releaseRes.key}/${this.state.image.files[0].name}`).put(this.state.image.files[0]).then(putRes => {
              firebaseApp.database().ref(`${date.month}-${date.year}/${releaseRes.key}/image`).update({
                imageName: putRes.metadata.name,
                imageUrl: putRes.downloadURL
              }).then(res => {
                this.setState({ isLoading: false });
                history.push('/lancamentos');
              }).catch(err => {
                console.error(err);
              });
            }).catch(err => {
              console.error(err);
            });
          }).catch(err => {
            console.error(err);
          });
        }).catch(err => {
          console.log(err);
        });
      } else {
        firebaseApp.database().ref(`${date.month}-${date.year}`).push(releaseReceita).then(releaseRes => {
          firebaseApp.database().ref(`${date.month}-${date.year}/${releaseRes.key}/`).update({ key: releaseRes.key }).then(res => {
            this.setState({ isLoading: false });
            history.push('/lancamentos');
          }).catch(err => {
            console.error(err);
          });
        }).catch(err => {
          console.log(err);
        });
      }

    } else {

      if(this.state.image.files) {
        firebaseApp.database().ref(`${date.month}-${date.year}`).push(releaseDespesa).then(releaseRes => {
          firebaseApp.database().ref(`${date.month}-${date.year}/${releaseRes.key}/`).update({ key: releaseRes.key }).then(res => {
            firebaseApp.storage().ref(`${date.month}-${date.year}/${releaseRes.key}/${this.state.image.files[0].name}`).put(this.state.image.files[0]).then(putRes => {
              firebaseApp.database().ref(`${date.month}-${date.year}/${releaseRes.key}/image`).update({
                imageName: putRes.metadata.name,
                imageUrl: putRes.downloadURL
              }).then(res => {
                this.setState({ isLoading: false });
                history.push('/lancamentos');
              }).catch(err => {
                console.error(err);
              });
            }).catch(err => {
              console.error(err);
            });
          }).catch(err => {
            console.error(err);
          });
        }).catch(err => {
          console.log(err);
        });
      } else {
        firebaseApp.database().ref(`${date.month}-${date.year}`).push(releaseDespesa).then(releaseRes => {
          firebaseApp.database().ref(`${date.month}-${date.year}/${releaseRes.key}/`).update({ key: releaseRes.key }).then(res => {
            this.setState({ isLoading: false });
            history.push('/lancamentos');
          }).catch(err => {
            console.error(err);
          });
        }).catch(err => {
          console.log(err);
        });
      }

    }
  }

  setTypeDespesa() {
    this.setState({
      type: 'despesa',
      step: this.state.step + 1
    })
  }
  setTypeReceita() {
    this.setState({
      type: 'receita',
      step: this.state.step + 1
    })
  }
  nextStep() {
    this.setState({ step: this.state.step + 1 });
  }

  previousStep() {
    this.setState({ step: this.state.step - 1 });
  }

  selectClient(key) {
    firebaseApp.database().ref(`clients/${key}`).once('value').then(snap => {
      const client = snap.val()
      this.setState({
        step: this.state.step + 1,
        selectedClient: client
      }, () => {
        console.log(this.state.selectedClient);
      });
    });
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
      )
    }
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

        {this.state.step === 1 && <div className='container'>
          <div className='row'>
            <div className='col-md-4 offset-md-4'>
              <div className='card'>
                <div className='card-body' style={{padding: '32px'}}>
                  <div>
                    <div className='row' style={{marginBottom: '32px'}}>
                      <div className='col-md-12'>
                        <h4>Passo 1 - Escolha o tipo do seu lançamento</h4>
                      </div>
                    </div>
                    <br />
                    <div className='row'>
                      <div className='col-md-12' align='center'>
                        <button className='btn btn-danger btn-block btn-lg' onClick={this.setTypeDespesa.bind(this)}>Despesa</button>
                      </div>
                    </div>
                    <br />
                    <div className='row'>
                      <div className='col-md-12' align='center'>
                        <button className='btn btn-success btn-block btn-lg' onClick={this.setTypeReceita.bind(this)}>Receita</button>
                      </div>
                    </div>
                    <br />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>}

        {this.state.step === 2 && this.state.type === 'despesa' && <div className='container'>
          <div className='row'>
            <div className='col-md-8 offset-md-2'>
              <div className='card'>
                <div className='card-body'>
                  <h4>Passo 2 - Lançamento(Despesa)</h4>
                  <hr />
                  <div className='row'>
                    <div className='col-md-10 offset-md-1'>
                      <div className="form-group">
                        <div class="form-group">
                          <label for="exampleFormControlSelect1">Tipo de Pagamento</label>
                          <select class="form-control" id="exampleFormControlSelect1" onChange={event => this.setState({ payment: event.target.value })}>
                            <option selected disabled>Selecione um tipo de pagamento</option>
                            <option value='dinheiro'>Dinheiro</option>
                            <option value='debito'>Débito</option>
                            <option value='debito'>Boleto</option>
                            <option value='credito'>Crédito</option>
                            <option value='cheque'>Cheque</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                  {this.state.payment && <div className='row'>
                    <div className='col-md-10 offset-md-1'>
                      <div className="form-group">
                        <label htmlFor="value">Valor da parcela</label>
                        <input type="text" className="form-control" id="value" placeholder="Valor da parcela" onChange={event => this.setState({ value: event.target.value })} />
                      </div>
                    </div>
                  </div>}
                  {this.state.payment === 'credito' && <div className='row'>
                    <div className='col-md-10 offset-md-1'>
                      <div className="form-group">
                        <label htmlFor="plots">Número de parcelas</label>
                        <input type="number" className="form-control" id="plots" placeholder="Parcelas" onChange={event => this.setState({ plots: event.target.value })} />
                      </div>
                    </div>
                  </div>}
                  {this.state.payment === 'cheque' && <div className='row'>
                    <div className='col-md-10 offset-md-1'>
                      <div className="form-group">
                        <label htmlFor="plots">Número de parcelas</label>
                        <input type="number" className="form-control" id="plots" placeholder="Parcelas" onChange={event => this.setState({ plots: event.target.value })} />
                      </div>
                    </div>
                  </div>}
                  <div className='row'>
                    <div className='col-md-10 offset-md-1'>
                      <div className="form-group">
                        <label htmlFor="image">Imagem</label>
                        <input type="file" className="form-control-file" id="image" onChange={event => this.setState({ image: event.target })} />
                      </div>
                    </div>
                  </div>
                  <hr />
                  <div className='row'>
                    <div className='col-sm-12' style={{display: 'flex', justifyContent: 'space-between'}}>
                      <button className='btn btn-primary' onClick={() => this.previousStep()}>Passo Anterior</button>
                      <button className='btn btn-primary' onClick={() => this.addRelease()}>Adicionar Lançamento</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>}

        {this.state.step === 2 && this.state.type === 'receita' && <div>

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
                          <button className='btn btn-primary btn-block' onClick={() => this.selectClient(client.key)}>Selecionar</button>
                        </div>
                      </div>
                      <br />
                    </div>
                  </div>
                </div>
              </div>
            </div>))}
          </div>}

        </div>}

        {this.state.step === 3 && this.state.type === 'receita' && this.state.selectedClient && <div className='container'>
            <div className='row'>
              <div className='col-md-8 offset-md-2'>
                <div className='card'>
                  <div className='card-body'>
                    <h4>Passo 2 - Lançamento(Receita)</h4>
                    <hr />
                    <div className='row'>
                      <div className='col-md-10 offset-md-1'>
                        <div className="form-group">
                          <div class="form-group">
                            <label for="exampleFormControlSelect1">Tipo de Pagamento</label>
                            <select class="form-control" id="exampleFormControlSelect1" onChange={event => this.setState({ payment: event.target.value })}>
                              <option selected disabled>Selecione um tipo de pagamento</option>
                              <option value='dinheiro'>Dinheiro</option>
                              <option value='debito'>Débito</option>
                              <option value='debito'>Boleto</option>
                              <option value='credito'>Crédito</option>
                              <option value='cheque'>Cheque</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                    {this.state.payment && <div className='row'>
                      <div className='col-md-10 offset-md-1'>
                        <div className="form-group">
                          <label htmlFor="value">Valor da parcela</label>
                          <input type="text" className="form-control" id="value" placeholder="Valor da parcela" onChange={event => this.setState({ value: event.target.value })} />
                        </div>
                      </div>
                    </div>}
                    {this.state.payment === 'credito' && <div className='row'>
                      <div className='col-md-10 offset-md-1'>
                        <div className="form-group">
                          <label htmlFor="plots">Número de parcelas</label>
                          <input type="number" className="form-control" id="plots" placeholder="Parcelas" onChange={event => this.setState({ plots: event.target.value })} />
                        </div>
                      </div>
                    </div>}
                    {this.state.payment === 'cheque' && <div className='row'>
                      <div className='col-md-10 offset-md-1'>
                        <div className="form-group">
                          <label htmlFor="plots">Número de parcelas</label>
                          <input type="number" className="form-control" id="plots" placeholder="Parcelas" onChange={event => this.setState({ plots: event.target.value })} />
                        </div>
                      </div>
                    </div>}
                    <div className='row'>
                      <div className='col-md-10 offset-md-1'>
                        <div className="form-group">
                          <label htmlFor="image">Imagem</label>
                          <input type="file" className="form-control-file" id="image" onChange={event => this.setState({ image: event.target })} />
                        </div>
                      </div>
                    </div>
                    <hr />
                    <div className='row'>
                      <div className='col-sm-12' style={{display: 'flex', justifyContent: 'space-between'}}>
                        <button className='btn btn-primary' onClick={() => this.previousStep()}>Passo Anterior</button>
                        <button className='btn btn-primary' onClick={() => this.addRelease()}>Adicionar Lançamento</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
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

export default connect(mapStateToProps, null)(Release);
