import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import Anchor from 'grommet/components/Anchor';
import Article from 'grommet/components/Article';
import Box from 'grommet/components/Box';
import Header from 'grommet/components/Header';
import Heading from 'grommet/components/Heading';
import Label from 'grommet/components/Label';
import Meter from 'grommet/components/Meter';
import Notification from 'grommet/components/Notification';
import Value from 'grommet/components/Value';
import Spinning from 'grommet/components/icons/Spinning';
import LinkPrevious from 'grommet/components/icons/base/LinkPrevious';

import { getPrediction, unloadPredictions} from '../actions/prediction';
import { getInfo, unloadInfo} from '../actions/stockinfo';
import { Line } from 'react-chartjs-2';
import { pageLoaded } from './utils';

class Stock extends Component {

  componentDidMount() {
    const { params: {symbol}, dispatch, prediction } = this.props;
    dispatch(getPrediction(symbol));
    dispatch(getInfo(symbol));
    pageLoaded(symbol);
  }


  componentWillUnmount(){
    const { dispatch } = this.props;
    dispatch(unloadPredictions());
    dispatch(unloadInfo());
  }

  render() {
    const { dispatch, prediction, error, info, params: {symbol} } = this.props;

    let infoNode;
    let errorNode;
    let chartNode;
    if(error){
      errorNode = (
        <Notification status='critical' size='medium'
          message='Stock invalid, only NASDAQ stocks are supported at this time' />
      )
    }

    if(info.data[symbol]){
      if(!info.loading) {

      }
      else{
        infoNode = <Spinning/>;
      }
    }
    if(prediction.data[symbol]){
      if(!prediction.loading && prediction.data[symbol].pred_date) {
        let dates = []
        let real_points = []
        for(const e of prediction.data[symbol].previous_points){
          dates.push(e.date.substring(0,10))
          real_points.push(e.value)
        }
        let previous_predictions = prediction.data[symbol].previous_predictions
        dates.push(`${prediction.data[symbol].pred_date.substring(0,10)} next close`)
        previous_predictions.push(parseFloat(prediction.data[symbol].prediction))
        var data = {
          labels: dates,
          datasets: [{
            label: 'predictions',
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ][0],
            borderColor: [
                'rgba(255,99,132,1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ][0],
            data: previous_predictions},
            {
              label: 'real',
              backgroundColor: [
                  'rgba(255, 99, 132, 0.2)',
                  'rgba(54, 162, 235, 0.2)',
                  'rgba(255, 206, 86, 0.2)',
                  'rgba(75, 192, 192, 0.2)',
                  'rgba(153, 102, 255, 0.2)',
                  'rgba(255, 159, 64, 0.2)'
              ][1],
              borderColor: [
                  'rgba(255,99,132,1)',
                  'rgba(54, 162, 235, 1)',
                  'rgba(255, 206, 86, 1)',
                  'rgba(75, 192, 192, 1)',
                  'rgba(153, 102, 255, 1)',
                  'rgba(255, 159, 64, 1)'
              ][1],
              data: real_points}
          ]
        }
        chartNode = <Line data={data}/>
      }
      else {
        infoNode = <Spinning/>;
      }
      if(!prediction.data[symbol].pred_date){
        infoNode = (<Notification status='warning' size='large' state={error.message}
          message='Prediction data for this node does not exist quite yet. Let the batch run for ~10 minutes before you can see the predictions.' />)
      }
    }



    return (
      <Article primary={true} full={true}>
        <Header direction='row' size='large' colorIndex='light-2'
          align='center' responsive={false}
          pad={{ horizontal: 'small' }}>
          <Anchor path='/dashboard'>
            <LinkPrevious a11yTitle='Back to Tasks' />
          </Anchor>
          <Heading margin='none' strong={true}>
            {symbol}
          </Heading>
        </Header>
        {errorNode}
        {infoNode}
        {chartNode}
        <canvas id="myChart" width="400" height="400"></canvas>
      </Article>
    );
  }
}

Stock.propTypes = {
  dispatch: PropTypes.func.isRequired,
  error: PropTypes.bool.isRequired,
  params: PropTypes.object.isRequired,
  prediction: PropTypes.object.isRequired,
  info: PropTypes.object.isRequired
};

const select = state => ({ error: state.dashboard.error, prediction: state.prediction, info: state.info });

export default connect(select)(Stock);
