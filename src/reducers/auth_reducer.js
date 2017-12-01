export default (state = {}, action) => {
  switch (action.type) {
    case 'LOGGED_IN':
      return { user: action.payload }
    case 'GET_CLIENTS':
      return { clients: action.payload }
    case 'IS_LOADING_TRUE':
      return { isLoading: true }
    case 'IS_LOADING_FALSE':
      return { isLoading: false }
    default:
      return state
  }
}
