import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import Split from 'grommet/components/Split';
import Sidebar from 'grommet/components/Sidebar';
import Button from 'grommet/components/Button';
import Article from 'grommet/components/Article';
import Section from 'grommet/components/Section';
import Heading from 'grommet/components/Heading';
import Paragraph from 'grommet/components/Paragraph';
import Footer from 'grommet/components/Footer';
import Logo from 'grommet/components/icons/Grommet';

import Google from 'grommet/components/icons/base/PlatformGoogle'
import { login } from '../actions/session';
import { navEnable } from '../actions/nav';
import { pageLoaded } from './utils';

class Login extends Component {

  constructor() {
    super();
  }

  componentDidMount() {
    pageLoaded('Login');
    this.props.dispatch(navEnable(false));
  }

  componentWillUnmount() {
    this.props.dispatch(navEnable(true));
  }

  render() {
    const { session: { error } } = this.props;

    return (
      <Split flex='left' separator={true}>

        <Article>
          <Section full={true} colorIndex='brand' texture='url(img/splash.png)'
            pad='large' justify='center' align='center'>
            <Heading tag='h1'><strong>Stocks.js</strong></Heading>
            <Paragraph align='center' size='large'>
              Bringing machine learning to the cloud
            </Paragraph>
          </Section>
        </Article>

        <Sidebar justify='between' align='center' pad='none' size='large'>
          <span />
          <Section>
            <Button href="/auth/google" icon={<Google/>}>Sign in</Button>
          </Section>
          <Footer direction='row' size='small'
            pad={{ horizontal: 'medium', vertical: 'small' }}>
            <span className='secondary'>&copy; 2017 Samba Bamba Labs</span>
          </Footer>
        </Sidebar>

      </Split>
    );
  }
}

Login.propTypes = {
  dispatch: PropTypes.func.isRequired,
  session: PropTypes.shape({
    error: PropTypes.string
  })
};

const select = state => ({
  session: state.session
});

export default connect(select)(Login);
