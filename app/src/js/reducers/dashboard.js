import {
 DASH_ERROR, UPDATE_STOCKS, UNLOAD_STOCKS
} from '../actions';
import { createReducer } from './utils';

const initialState = {
  stocks: [],
  loading: true,
  error: false
};

const handlers = {
  [UPDATE_STOCKS]: (state, action) => {
    return {stocks: state.stocks.concat(action.stocks), loading: false, error: false}
  },
  [DASH_ERROR]: () =>{
    return { error: true }
  },
  [UNLOAD_STOCKS]: ()=>{
    return initialState
  }
};

export default createReducer(initialState, handlers);
