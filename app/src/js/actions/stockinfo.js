import {
 UPDATE_INFO, UNLOAD_INFO, DASH_ERROR
} from '../actions';

export function initializeInfo() {
  return dispatch => {
    fetch('/list_info', {
        credentials:'include',
        headers: {
          'Content-Type': 'application/json'
        }
    })
      .then(response=>{return response.json()})
      .then(json => {
        dispatch(updateInfo(json.stock_info))
      })
    }
}

export function getInfo(symbol) {
  return dispatch => {
    fetch('/get_info', {
        method: "POST",
        credentials:'include',
        body: JSON.stringify({symbol}),
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
          dispatch(updateInfo(json.stock))
        }
      })
    }
}

export function updateInfo(predictions) {
  let payload = {data:{}}
  for(let prediction of predictions){
    payload.data[prediction.symbol] = prediction;
  }
  return { type: UPDATE_INFO,  payload};
}

export function unloadInfo(){
  return { type: UNLOAD_INFO };
}

export function error(){
  return { type: DASH_ERROR };
}
