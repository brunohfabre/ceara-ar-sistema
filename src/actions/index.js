import { firebaseApp, db } from '../firebase';

export const logUser = (user) => {
  return {
    type: 'LOGGED_IN',
    payload: user
  }
}

export const getClients = () => {
  return (dispatch) => {
    db.collection('clients').get().then(clients => {
      let data = [];
      clients.forEach(client => {
        data.push(client);
      });
    });
  }
}

export const signIn = (email, password, e) => {
  e.preventDefault()
  return (dispatch) => {
    isLoadingTrue(dispatch)

    firebaseApp.auth().signInWithEmailAndPassword(email, password).then(res => {
      isLoadingFalse(dispatch)
    }).catch(err => {
      console.log(err)
    })
  }
}

export const isLoadingTrue = (dispatch) => {
  dispatch({
    type: 'IS_LOADING_TRUE',
  })
}

export const isLoadingFalse = (dispatch) => {
  dispatch({
    type: 'IS_LOADING_FALSE',
  })
}
