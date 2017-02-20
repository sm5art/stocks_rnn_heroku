import {
 UPDATE_INFO, UNLOAD_INFO
} from '../actions';
import { createReducer } from './utils';

const initialState = {
  data: {},
  loading: true
};

const handlers = {
  [UPDATE_INFO]: (state, action) => {
    const data = Object.assign({}, state.data, action.payload.data)
    return {loading: false, data}
  },
  [UNLOAD_INFO]: ()=>{
    return initialState
  }
};

export default createReducer(initialState, handlers);
