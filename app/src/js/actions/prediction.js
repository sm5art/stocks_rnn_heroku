import {
 UPDATE_PREDICTIONS, UNLOAD_PREDICTIONS
} from '../actions';

export function initializePrediction() {
  return dispatch => {
    fetch('/list_predictions', {
        credentials:'include',
        headers: {
          'Content-Type': 'application/json'
        }
    })
      .then(response=>{return response.json()})
      .then(json => {
        dispatch(updatePredictions(json.predictions))
      })
    }
}

export function getPrediction(symbol) {
  return dispatch => {
    fetch('/get_prediction', {
        method: "POST",
        credentials:'include',
        body: JSON.stringify({symbol}),
        headers: {
          'Content-Type': 'application/json'
        }
    })
      .then(response=>{return response.json()})
      .then(json => {
        console.log(json)
        dispatch(updatePredictions(json.prediction))
      })
    }
}

export function updatePredictions(predictions) {
  let payload = {data:{}}
  for(const prediction of predictions){
    payload.data[prediction.symbol] = prediction;
  }
  return { type: UPDATE_PREDICTIONS,  payload};
}

export function unloadPredictions(){
  return { type: UNLOAD_PREDICTIONS };
}
