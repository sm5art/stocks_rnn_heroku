import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';


import Label from 'grommet/components/Label'
import Box from 'grommet/components/Box';
import ListItem from 'grommet/components/ListItem';
import Button from 'grommet/components/Button';
import Spinning from 'grommet/components/icons/Spinning';
import Value from 'grommet/components/Value';
import Title from 'grommet/components/Title'



class StockInfo extends Component {

  constructor() {
    super();
  }

  render() {
    const { index, stock, info, prediction } = this.props;
    let infoComp = (<Spinning></Spinning>);
    let predictionComp = (<Spinning></Spinning>)
    if(info.data[stock.symbol]){
      if(!info.loading) {
        infoComp = (
          <Label>{info.data[stock.symbol].industry}</Label>
        )
      }
    }
    if(prediction.data[stock.symbol]){
      if(!prediction.loading && prediction.data[stock.symbol].pred_date) {
        const pred = parseFloat(prediction.data[stock.symbol].prediction);
        const previous_points = prediction.data[stock.symbol].previous_predictions;
        const last_point = parseFloat(previous_points[previous_points.length-1])
        const net_change = (pred-last_point)/last_point*100
        const color = net_change > 0 ? "ok" : "critical";
        predictionComp = (
          <Value colorIndex={color} label="prediction" units="%" value={net_change.toFixed(2)}/>
        )
      }
    }
    return (
        <ListItem key={index} justify='between'>
            <Title>{stock.symbol}</Title>
            <Box>{infoComp}</Box>
            {predictionComp}
        </ListItem>
    );
  }

}

StockInfo.propTypes = {
  dispatch: PropTypes.func.isRequired,
  info: PropTypes.object.isRequired,
  prediction: PropTypes.object.isRequired
};

const select = state => ({
  info: state.info,
  prediction: state.prediction
});

export default connect(select)(StockInfo);
