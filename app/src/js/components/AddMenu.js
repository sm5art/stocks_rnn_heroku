import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import Menu from 'grommet/components/Menu';
import Header from 'grommet/components/Header';
import Title from 'grommet/components/Title'
import Box from 'grommet/components/Box';
import TextInput from 'grommet/components/TextInput'
import TableAdd from 'grommet/components/icons/base/TableAdd';
import Button from 'grommet/components/Button';
import FormField from 'grommet/components/FormField';
import Layer from 'grommet/components/Layer'

import { addStock as addS } from '../actions/dashboard';

class AddMenu extends Component {

  constructor() {
    super();
    this.state = { open: false };

    this._onClick = this._onClick.bind(this);
    this.addStock = this.addStock.bind(this);
  }

  _onClick(event) {
    this.setState({open: true})
  }

  addStock(){
    const { dispatch } = this.props;
    const symbol = document.getElementById("ssinput").value
    dispatch(addS(symbol))
    this.setState({open: false})
  }

  render() {
    const { dropAlign, colorIndex, dashboard } = this.props;
    let overlay = null
    if(this.state.open){
      overlay = (
      <Layer closer={true} flush={true} onClose={()=>{this.setState({open: false})}}>
        <Box align="center" justify="center" pad="medium">
          <TextInput id="ssinput"></TextInput>
          <Button onClick={this.addStock} type={"submit"} label="add stock" accent={true} primary={true}/>
        </Box>
      </Layer>
      )
    }

    return (
      <Box>
        {overlay}
        <Button onClick={this._onClick} icon={<TableAdd/>}/>
      </Box>
    );
  }

}

AddMenu.propTypes = {
  colorIndex: PropTypes.string,
  dispatch: PropTypes.func.isRequired,
  dropAlign: Menu.propTypes.dropAlign,
  dashboard: PropTypes.object.isRequired
};

const select = state => ({
  dashboard: state.dashboard
});

export default connect(select)(AddMenu);
