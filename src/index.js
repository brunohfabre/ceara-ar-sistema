import React from 'react';
import ReactDOM from 'react-dom';
import { firebaseApp } from './firebase';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import ReduxThunk from 'redux-thunk';
import reducers from './reducers';
import { logUser, setInitialDate } from './actions';

import App, { history} from './components/App';

const createStoreWithMiddleware = applyMiddleware(ReduxThunk)(createStore)
const store = createStoreWithMiddleware(reducers)

firebaseApp.auth().onAuthStateChanged(user => {
  if(user) {
    store.dispatch(logUser(user))
    history.push('/resumo')
  } else {
    store.dispatch(logUser(null))
  }
});

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>, document.getElementById('root')
);
