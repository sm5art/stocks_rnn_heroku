import {
 DASH_ERROR, UPDATE_STOCKS, UNLOAD_STOCKS
} from '../actions';

import { getPrediction } from './prediction'
import { getInfo } from './stockinfo'

export function addStock(symbol) {

  return dispatch => {
    dispatch(getPrediction(symbol))
    dispatch(getInfo(symbol))
    fetch('/add_stock', {
        method:'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({symbol}),
        credentials:'include'
    })
      .then(response=>{return response.json()})
      .then(json => {
        if(json.error){
          dispatch(error())
        }
        else{
          dispatch(updateStocks(json.stock))
        }
      })
  }
}

export function initializeStocks() {
  return dispatch => {
    fetch('/list_stocks', {
        credentials:'include',
        headers: {
          'Content-Type': 'application/json'
        }
    })
      .then(response=>{return response.json()})
      .then(json => {
        if(json.error){
          dispatch(error())
        }
        else{
          dispatch(updateStocks(json.stocks))
        }
      })
    }
}

export function error(){
  return { type: DASH_ERROR }
}

export function updateStocks(stocks) {
  return { type: UPDATE_STOCKS,  stocks};
}

export function unloadStocks(){
  return { type: UNLOAD_STOCKS };
}
