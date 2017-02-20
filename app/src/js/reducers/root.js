import { combineReducers } from 'redux';

import dashboard from './dashboard';
import nav from './nav';
import session from './session';
import tasks from './tasks';
import prediction from './prediction'
import info from './stockinfo'

export default combineReducers({
  dashboard,
  nav,
  session,
  tasks,
  prediction,
  info
});
