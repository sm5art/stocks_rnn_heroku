import {
 UPDATE_PREDICTIONS, UNLOAD_PREDICTIONS
} from '../actions';
import { createReducer } from './utils';

const initialState = {
  data: {},
  loading: true
};

function assign(object, source) {
  Object.keys(source).forEach(function(key) {
    object[key] = source[key];
  });
}

const handlers = {
  [UPDATE_PREDICTIONS]: (state, action) => {
    const data = Object.assign({}, state.data, action.payload.data)
    return {loading: false, data}
  },
  [UNLOAD_PREDICTIONS]: ()=>{
    return initialState
  }
};

export default createReducer(initialState, handlers);
