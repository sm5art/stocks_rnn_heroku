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

import NavControl from '../components/NavControl';

import { initialize, addStock, unload } from '../actions/dashboard'
import { pageLoaded } from './utils';

class Dashboard extends Component {

  componentDidMount() {
    pageLoaded('Dashboard');
    const { dispatch } = this.props;
    dispatch(initialize())
  }

  componentWillUnmount() {
    const {dispatch} = this.props;
    dispatch(unload())
  }

  render() {
    const { error, loading, stocks } = this.props;
    const { intl } = this.context;

    let errorNode;
    let listNode;
    if (error) {
      errorNode = (
        <Notification status='critical' size='medium'
          message='Stock invalid, only NASDAQ stocks are supported at this time' />
      );
    } else if (loading) {
      listNode = (
        <Box direction='row' responsive={false}
          pad={{ between: 'small', horizontal: 'medium', vertical: 'medium' }}>
          <Spinning /><span>Loading...</span>
        </Box>
      );
    }

    const stocksNode = (stocks || []).map((stock, index) => (
        <ListItem key={index} justify='between'>
          <Label><Anchor path={`/stocks/${stock._id}`} label={stock.symbol} /></Label>
          <Box direction='row' responsive={false}
            pad={{ between: 'small' }}>
            <Label>{stock.date}</Label>
          </Box>
        </ListItem>
      ));

      listNode = (
        <List>
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
        {listNode}
      </Article>
    );
  }
}

Dashboard.propTypes = {
  dispatch: PropTypes.func.isRequired,
  error: PropTypes.boolean,
  stocks: PropTypes.arrayOf(PropTypes.object)
};

Dashboard.contextTypes = {
  intl: PropTypes.object
};

const select = state => ({ ...state.dashboard });

export default connect(select)(Dashboard);
