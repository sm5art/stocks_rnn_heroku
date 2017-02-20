import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import Anchor from 'grommet/components/Anchor';
import Article from 'grommet/components/Article';
import Box from 'grommet/components/Box';
import Section from 'grommet/components/Section';
import Header from 'grommet/components/Header';
import Heading from 'grommet/components/Heading';
import Label from 'grommet/components/Label';
import List from 'grommet/components/List';
import ListItem from 'grommet/components/ListItem';
import Title from 'grommet/components/Title'
import Search from 'grommet/components/Search'
import Notification from 'grommet/components/Notification';
import Paragraph from 'grommet/components/Paragraph';
import Value from 'grommet/components/Value';
import Meter from 'grommet/components/Meter';
import Spinning from 'grommet/components/icons/Spinning';
import { getMessage } from 'grommet/utils/Intl';
import Button from 'grommet/components/Button';
import AddMenu from '../components/AddMenu';
import StockInfo from '../components/StockInfo'

import NavControl from '../components/NavControl';

import { initializeStocks, unloadStocks } from '../actions/dashboard';
import { initializePrediction, unloadPredictions} from '../actions/prediction';
import { initializeInfo, unloadInfo} from '../actions/stockinfo';
import { pageLoaded } from './utils';
import { browserHistory as history } from 'react-router';

class Dashboard extends Component {
  constructor(){
    super()
    this.onSelect.bind(this)
  }

  onSelect(mapStockToIndex){
    return function(_id) {
        history.push(`/stock/${mapStockToIndex[_id].symbol}`)
    }
  }

  componentDidMount() {
    pageLoaded('Dashboard');
    const { dispatch } = this.props;
    dispatch(initializeStocks())
    dispatch(initializeInfo())
    dispatch(initializePrediction())
  }

  componentWillUnmount() {
    const {dispatch} = this.props;
    dispatch(unloadInfo())
    dispatch(unloadPredictions())
    dispatch(unloadStocks())
  }

  render() {
    const { error, loading, stocks } = this.props;
    const { intl } = this.context;

    let errorNode;
    let listNode;
    let loadNode;
    if (error) {
      errorNode = (
        <Notification status='critical' size='medium'
          message='Stock invalid, only NASDAQ stocks are supported at this time' />
      );
    } else if (loading) {
      loadNode = (
        <Box direction='row' responsive={false}
          pad={{ between: 'small', horizontal: 'medium', vertical: 'medium' }}>
          <Spinning /><span>Loading...</span>
        </Box>
      );
    }
      let mapStockToIndex = {}
      const stocksNode = (stocks || []).map((stock, index) => {
          mapStockToIndex[index] = stock
          return (<StockInfo stock={stock} index={index}></StockInfo>);
      });

        listNode = (
          <List selectable={true} onSelect={this.onSelect(mapStockToIndex)}>
            {stocksNode}
          </List>
        );



    return (
      <Article primary={true}>
        <Header direction='row' justify='between' size='large'
          pad={{ horizontal: 'medium', between: 'small' }}>
          <NavControl name="Dashboard"/>
          <Box flex="grow"/>
          <AddMenu/>
        </Header>
        {errorNode}
        <Section colorIndex="grey-4-a" pad='medium'>
          <Header>
              <Title>Watchlist</Title>
              <Box flex="grow"></Box>
              <Search inline={true}
                size='medium'
                placeHolder='Search'
                dropAlign={{"right": "right"}} />

          </Header>
        </Section>
        {loadNode}
        {listNode}
      </Article>
    );
  }
}

Dashboard.propTypes = {
  dispatch: PropTypes.func.isRequired,
  error: PropTypes.bool.isRequired,
  stocks: PropTypes.arrayOf(PropTypes.object)
};

Dashboard.contextTypes = {
  intl: PropTypes.object
};

const select = state => ({ ...state.dashboard });

export default connect(select)(Dashboard);
