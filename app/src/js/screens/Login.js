import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { browserHistory as history } from 'react-router'

import Split from 'grommet/components/Split';
import Sidebar from 'grommet/components/Sidebar';
import Button from 'grommet/components/Button';
import Article from 'grommet/components/Article';
import Section from 'grommet/components/Section';
import Heading from 'grommet/components/Heading';
import Paragraph from 'grommet/components/Paragraph';
import Card from 'grommet/components/Card'
import Footer from 'grommet/components/Footer';
import Logo from 'grommet/components/icons/Grommet';
import Hero from 'grommet/components/Hero';
import Box from 'grommet/components/Box';
import Image from 'grommet/components/Image'

import Google from 'grommet/components/icons/base/PlatformGoogle'
import { login } from '../actions/session';
import { navEnable } from '../actions/nav';
import { pageLoaded } from './utils';

class Login extends Component {

  constructor() {
    super();
  }

  componentWillMount(){
    const { session } = this.props;
    if(session.token){
      history.push('/dashboard')
    }
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
          <Section full={true} colorIndex='accent-2'>
            <Hero background={<Image src='/img/marquee.jpg' fit="cover"/>}>
              <Box align="end"><Card textSize="xlarge" label="Bringing machine learning in the cloud to stock prediction" heading={<strong>hedgedump.js</strong>}/></Box>
            </Hero>
          </Section>
        </Article>

        <Sidebar justify='between' align='center' pad='none' size='large'>
          <span />
          <Section>
            <Button href="/auth/google" icon={<Google/>}>Sign in</Button>
          </Section>
          <Footer direction='row' size='small'
            pad={{ horizontal: 'medium', vertical: 'small' }}>
            <span className='secondary'>&copy; 2017 Memr.io Labs</span>
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
