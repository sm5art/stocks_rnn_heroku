import { browserHistory as history } from 'react-router';
import { SESSION_LOAD, SESSION_LOGIN, SESSION_LOGOUT } from '../actions';
import { deleteSession, postSession } from '../api/session';
import { updateHeaders } from '../api/utils';

const localStorage = window.localStorage;

export function initialize() {
  return (dispatch) => {
    return fetch('/session', {credentials: 'include'})
      .then(response => response.json())
      .then(json => {
        console.log(json)
        if(json["user"] != undefined){
          console.log('dispatched')
          dispatch({type:SESSION_LOAD, payload:{email: json.user._id, name: json.user.google.name, token: json.user.google.token}})
          history.push(window.location.pathname == '/login' ? '/dashboard': window.location.pathname)
        }
        else {
          dispatch({type: SESSION_LOAD, payload:{}})
        }
      })
  };
}

export function logout(session) {
  return (dispatch) => {
    dispatch({ type: SESSION_LOGOUT });

    window.location.href = '/logout'; // reload fully
  }
}
