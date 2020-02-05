import Comments from './Comments';

import React, {Component} from 'react'

import {withNavigation} from 'react-navigation';

class ProductComments extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return <Comments type={'product'} navigation={this.props.navigation}/>
    }
}


export default withNavigation(ProductComments)