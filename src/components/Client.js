import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { firebaseApp, db } from '../firebase';
import { history } from './App';
import Inputmask from 'inputmask';

import Header from './Header';

class Client extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isLoading: false,

      name: '',
      cpf: '',
      phone: '',
      number: '',
      complement: '',
      brand: '',
      age: '',
      model: '',
      board: '',
      cep: '',
      logradouro: '',
      bairro: '',
      localidade: '',
      uf: '',
      images: ''
    }

    this.images = this.images.bind(this)
  }
  componentDidMount() {
    var cpfInput = document.getElementById("cpf");

    var cpfMask = new Inputmask("999.999.999-**");
    cpfMask.mask(cpfInput);

    var phoneInput = document.getElementById("phone");

    var phoneMask = new Inputmask( "(9{2}) 9{9}" ).mask(phoneInput);

    var cepInput = document.getElementById("cep");

    var cepMask = new Inputmask("99999-999");
    cepMask.mask(cepInput);

    var boardInput = document.getElementById("board");

    var boardMask = new Inputmask("aaa-9999");
    boardMask.mask(boardInput);
  }

  changeCep(event) {
    axios.get(`https://viacep.com.br/ws/${event.target.value}/json/`).then(res => {
      this.setState({
        cep: res.data.cep,
        logradouro: res.data.logradouro,
        bairro: res.data.bairro,
        localidade: res.data.localidade,
        uf: res.data.uf,
      });
    }).catch(err => {
      console.log('api cep error: ', err);
    });
  }

  _addClient(event) {
    const client = {
      name: this.state.name,
      cpf: this.state.cpf,
      phone: this.state.phone,
      number: this.state.number,
      complement: this.state.complement,
      brand: this.state.brand,
      age: this.state.age,
      model: this.state.model,
      board: this.state.board,
      cep: this.state.cep,
      logradouro: this.state.logradouro,
      bairro: this.state.bairro,
      localidade: this.state.localidade,
      uf: this.state.uf,
    }

    this.setState({ isLoading: true });

    if(this.state.images.files) {

      firebaseApp.database().ref('clients').push(client).then(clientRes => {
        firebaseApp.database().ref(`clients/${clientRes.key}/`).update({ key: clientRes.key }).then(res => {
          Object.keys(this.state.images.files).map(key => {
            firebaseApp.storage().ref(`clients/${clientRes.key}/${this.state.images.files[key].name}`).put(this.state.images.files[key]).then(putRes => {
              firebaseApp.database().ref(`clients/${clientRes.key}/images`).push({
                imageName: putRes.metadata.name,
                imageUrl: putRes.downloadURL
              });
            });
          });

          this.setState({ isLoading: false });
          history.push('/clientes');
        })
      }).catch(err => {
        console.error(err);
      });

    } else {

      firebaseApp.database().ref('clients').push(client).then(clientRes => {
        firebaseApp.database().ref(`clients/${clientRes.key}/`).update({ key: clientRes.key }).then(res => {
          this.setState({ isLoading: false });
          history.push('/clientes');
        })
      }).catch(err => {
        console.error(err);
      });

    }



    // db.collection('clients').add(client).then(clientRes => {
    //   db.collection(`clients`).doc(clientRes.id).set({
    //     id: clientRes.id
    //   }, { merge: true }).then(() => {
    //     Object.keys(this.state.images.files).map(key => {
    //       firebaseApp.storage().ref(`clients/${clientRes.id}/${this.state.images.files[key].name}`).put(this.state.images.files[key]).then(putRes => {
    //         db.collection(`clients/${clientRes.id}/images`).add({
    //           imageName: putRes.metadata.name,
    //           imageUrl: putRes.downloadURL
    //         });
    //       });
    //     });
    //     this.setState({ isLoading: false });
    //     history.push('/clientes');
    //   });
    // }).catch(err => {
    //   console.log(err)
    // })

    event.preventDefault();
  }

  images() {
    console.log('01')
    Object.keys(this.state.images.files).map(key => {
      console.log(this.state.images.files[key])
    })
    console.log('02')
  }

  render() {
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

        <div className='container'>
          <div className='row'>
            <div className='col-md-10 offset-md-1'>
              <div className='card' style={{marginBottom: '16px'}}>
                <div className='card-body'>
                  <div className='card-title'>
                    <h3>Informaçoes do cliente</h3>
                  </div>
                  <hr />
                  <form onSubmit={event => this._addClient(event)}>
                    <div className='row'>
                      <div className="form-group col-md-8">
                        <label htmlFor="name">Nome</label>
                        <input type="text" className="form-control" id="name" placeholder="Nome" onChange={event => this.setState({ name: event.target.value })} required />
                      </div>
                      <div className="form-group col-md-4">
                        <label htmlFor="cpf">CPF</label>
                        <input type="text" className="form-control" id="cpf" placeholder="CPF" onChange={event => this.setState({ cpf: event.target.value })} required />
                      </div>
                    </div>
                    <div className='row'>
                      <div className="form-group col-md-6">
                        <label htmlFor="phone">Telefone</label>
                        <input type="text" className="form-control" id="phone" placeholder="Telefone" onChange={event => this.setState({ phone: event.target.value })} required />
                      </div>
                      <div className="form-group col-md-6">
                        <label htmlFor="cep">CEP</label>
                        <input type="text" className="form-control" id="cep" placeholder="CEP" onChange={event => this.changeCep(event)} required />
                      </div>
                    </div>
                    <div className='row'>
                      <div className="form-group col-md-6">
                        <label htmlFor="street">Rua</label>
                        <input type="text" className="form-control" id="street" placeholder="Rua" value={this.state.logradouro} onChange={event => this.setState({ logradouro: event.target.value })} required disabled />
                      </div>
                      <div className="form-group col-md-6">
                        <label htmlFor="number">Número</label>
                        <input type="text" className="form-control" id="number" placeholder="Número" onChange={event => this.setState({ number: event.target.value })} required />
                      </div>
                    </div>
                    <div className='row'>
                      <div className="form-group col-md-6">
                        <label htmlFor="neighborhood">Bairro</label>
                        <input type="text" className="form-control" id="neighborhood" placeholder="Bairro" value={this.state.bairro} onChange={event => this.setState({ bairro: event.target.value })} required disabled />
                      </div>
                      <div className="form-group col-md-6">
                        <label htmlFor="complement">Complemento</label>
                        <input type="text" className="form-control" id="complement" placeholder="Complemento" onChange={event => this.setState({ complement: event.target.value })} />
                      </div>
                    </div>
                    <div className='row'>
                      <div className="form-group col-md-6">
                        <label htmlFor="city">Cidade</label>
                        <input type="text" className="form-control" id="city" placeholder="Cidade" value={this.state.localidade} onChange={event => this.setState({ localidade: event.target.value })} required disabled />
                      </div>
                      <div className="form-group col-md-6">
                        <label htmlFor="state">Estado</label>
                        <input type="text" className="form-control" id="state" placeholder="Estado" value={this.state.uf} onChange={event => this.setState({ uf: event.target.value })} required disabled />
                      </div>
                    </div>
                    <br />

                  <div className='card-title'>
                    <h3>Informaçoes do veículo</h3>
                  </div>
                  <hr />
                    <div className='row'>
                      <div className="form-group col-md-6">
                        <label htmlFor="brand">Marca</label>
                        <input type="text" className="form-control" id="brand" placeholder="Marca" onChange={event => this.setState({ brand: event.target.value })} required />
                      </div>
                      <div className="form-group col-md-6">
                        <label htmlFor="age">Ano</label>
                        <input type="text" className="form-control" id="age" placeholder="Ano" onChange={event => this.setState({ age: event.target.value })} required />
                      </div>
                    </div>
                    <div className='row'>
                      <div className="form-group col-md-6">
                        <label htmlFor="model">Modelo</label>
                        <input type="text" className="form-control" id="model" placeholder="Modelo" onChange={event => this.setState({ model: event.target.value })} required />
                      </div>
                      <div className="form-group col-md-6">
                        <label htmlFor="board">Placa</label>
                        <input type="text" className="form-control" id="board" placeholder="Placa" onChange={event => this.setState({ board: event.target.value })} required />
                      </div>
                    </div>
                    <div className='row'>
                      <div className="form-group col-md-12">
                        <label htmlFor="exampleFormControlFile1">Imagens do veículo</label>
                        <input type="file" className="form-control-file" id="exampleFormControlFile1" multiple onChange={event => this.setState({ images: event.target })} />
                      </div>
                    </div>
                    <a onClick={this.images}>images</a>
                    {this.state.imagem && <div className='row'>
                      <img src={this.state.imagem} />
                    </div>}
                    <br />
                    <div className="form-group">
                      <button className='btn btn-primary' type='submit'>Adicionar</button>
                    </div>
                  </form>
                </div>
              </div>
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

export default connect(mapStateToProps, null)(Client);
