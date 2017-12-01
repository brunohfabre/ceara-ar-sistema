import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { firebaseApp } from '../firebase';

import Header from './Header';

class Releases extends Component {
  constructor(props) {
    super(props);

    this.state = {
      month: new Date().getMonth(),
      year: new Date().getFullYear(),
      months: [
        'janeiro',
        'fevereiro',
        'março',
        'abril',
        'maio',
        'junho',
        'julho',
        'agosto',
        'setembro',
        'outubro',
        'novembro',
        'dezembro',
      ],
      teste: false,
      isLoading: true,
      releases: null
    }
  }

  componentDidMount() {
    this.setState({ isLoading: true });
    this.getReleases();
  }

  getReleases() {
    firebaseApp.database().ref(`${this.state.month}-${this.state.year}`).on('value', snap => {
      let releases = [];
      snap.forEach(release => {
        releases.push(release.val())
      })
      this.setState({
        releases: releases,
        isLoading: false
      });
    })
  }

  removeMonth() {
    this.setState({ isLoading: true })
    if(this.state.month === 0) {
      this.setState({
        year: this.state.year - 1,
        month: 11
      }, () => {
        this.getReleases()
      })
    } else {
      this.setState({ month: this.state.month - 1 }, () => {
        this.getReleases()
      });
    }
  }

  addMonth() {
    this.setState({ isLoading: true })
    if(this.state.month === 11) {
      this.setState({
        year: this.state.year + 1,
        month: 0
      }, () => {
        this.getReleases()
      })
    } else {
      this.setState({ month: this.state.month + 1 }, () => {
        this.getReleases()
      });
    }
  }

  removeRelease(key, image) {
    this.setState({ isLoading: true });

    if(image) {
      firebaseApp.storage().ref(`${this.state.month}-${this.state.year}/${key}/${image.imageName}/`).delete().then(deleteRes => {
        firebaseApp.database().ref(`${this.state.month}-${this.state.year}/${key}/`).remove().then(res => {
          this.setState({ isLoading: false });
        }).catch(err => {
          console.error(err)
        });
      }).catch(err => {
        console.error(err)
      });
    } else {
      firebaseApp.database().ref(`${this.state.month}-${this.state.year}/${key}`).remove().then(res => {
        this.setState({ isLoading: false });
      }).catch(err => {
        console.error(err)
      });
    }
  }
  getClient(key) {
    let client = '';
    firebaseApp.database().ref(`clients/${key}`).once('value').then(snap => {
      client = snap.val();
      return client.name;
    });
  }

  render() {
    return(
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
        <Link to={`/lancamento/${this.state.month}/${this.state.year}`} className='btn btn-primary btn-add-release'>adicionar</Link>
        <div className='container'>
          <div className='row'>
            <div className='col-md-12'>
              <div className='card'>
                <div className='card-body'>
                  <div className='row'>
                    <div className='col align-self-center'>
                      <nav aria-label="Page navigation example" style={{padding: '16px 0'}}>
                        <ul className="pagination">
                          <li className="page-item">
                            <a className="page-link" aria-label="Previous" onClick={() => this.removeMonth()} style={{cursor: 'pointer'}}>
                              <span aria-hidden="true">&laquo;</span>
                              <span className="sr-only">Previous</span>
                            </a>
                          </li>
                          <li className="page-item"><a className="page-link">{this.state.months[this.state.month]} de {this.state.year}</a></li>
                          <li className="page-item">
                            <a className="page-link" aria-label="Next" onClick={() => this.addMonth()} style={{cursor: 'pointer'}}>
                              <span aria-hidden="true">&raquo;</span>
                              <span className="sr-only">Next</span>
                            </a>
                          </li>
                        </ul>
                      </nav>
                    </div>
                  </div>
                  {this.state.releases && <table className="table table-striped table-responsive-sm">
                    <thead>
                      <tr>
                        <th scope="col">Cliente</th>
                        <th scope="col">Tipo Lançamento</th>
                        <th scope="col">Tipo Pagamento</th>
                        <th scope="col">Valor</th>
                        <th scope="col">Imagem</th>
                        <th scope="col">Ação</th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.releases.map(release => (
                        <tr key={release.name}>
                          <td>{release.client ? (<Link to={`cliente/${release.client.key}`}>{release.client.name}</Link>) : 'nenhum cliente para este lançamento'}</td>
                          <td>{release.type}</td>
                          <td>{release.paymentType}</td>
                          <td>{release.value}</td>
                          <td>{release.image ? <a href={release.image.imageUrl} alt={release.image.imageName} target='blank'><img src={release.image.imageUrl} style={{height: '100px'}} /></a> : 'nenhuma imagem'}</td>
                          <td><button className='btn btn-danger' onClick={() => this.removeRelease(release.key, release.image)}>remover</button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>}
                  {!this.state.releases === [] && <div>
                    Nenhum lançamento cadastrado
                  </div>}
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
    user: state.auth.user,
  }
}

export default connect(mapStateToProps, null)(Releases);
