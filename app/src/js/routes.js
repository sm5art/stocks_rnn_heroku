import Login from './screens/Login';
import Main from './components/Main';
import Dashboard from './screens/Dashboard';
import Tasks from './screens/Tasks';
import Task from './screens/Task';
import NotFound from './screens/NotFound';

import React from 'react';

import { Route, IndexRoute } from 'react-router'

export default function getRoutes(store) {
  function isAuth(nextState, replaceState,cb){
    if(!store.getState().session.hasOwnProperty('token'))
    replaceState("/login");
    cb()
  }

  return(
    <Route path="/" component={Main}>
      <IndexRoute component={Dashboard} onEnter={isAuth}/>
      <Route path="login" component={Login}/>
      <Route path="dashboard" component={Dashboard} onEnter={isAuth}/>
      <Route path="tasks/:id" component={Task} onEnter={isAuth}/>
      <Route path='tasks' component={Tasks} onEnter={isAuth}/>
      <Route path='*' component={NotFound}/>
    </Route>
    )
}
