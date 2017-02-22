import { browserHistory as history } from 'react-router';
import { SESSION_LOAD, SESSION_LOGIN, SESSION_LOGOUT } from '../actions';

const localStorage = window.localStorage;

export function initialize() {
  return (dispatch) => {
    const { email, name, token } = localStorage;
    if(token){
      dispatch({type:SESSION_LOAD, payload:{email, name, token}})
    }
    else{
      fetch('/session', {credentials: 'include'})
        .then(response => response.json())
        .then(json => {
          if(json["user"] != undefined){
            localStorage.email = json.user._id
            localStorage.name = json.user.google.name
            localStorage.token = json.user.google.token
            dispatch({type:SESSION_LOAD, payload:{email: json.user._id, name: json.user.google.name, token: json.user.google.token}})
            history.push('/dashboard')
          }
          else {
            dispatch({type: SESSION_LOAD, payload:{}})
          }
        })
    }

  };
}

export function logout(session) {
  return (dispatch) => {
    dispatch({ type: SESSION_LOGOUT });

    window.location.href = '/logout'; // reload fully
  }
}
