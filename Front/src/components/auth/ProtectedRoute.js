import React, { Component } from "react";
import { Route, Redirect } from 'react-router-dom';
import { connect } from "react-redux";


export class NotLogRoute extends Component {
  render() {
    const { component: Component, ...props } = this.props

    return (
      <Route 
        {...props} 
        render={props => (
          !(this.props.auth.id !== -1 && this.props.auth.key !== null) ?
            <Component {...props} /> :
            <Redirect to='/lucky' />
        )}
      />
    )
  }
}

class ProtectedRoute extends Component {
    render() {
      const { component: Component, ...props } = this.props
  
      return (
        <Route 
          {...props} 
          render={props => (
            this.props.auth.id !== -1 && this.props.auth.key !== null ?
              <Component {...props} /> :
              <Redirect to='/signin' />
          )}
        />
      )
    }
}

const mapStateToProps = (state) => {
    return {
        ...state
    }
}

export default connect(mapStateToProps)(ProtectedRoute);
export const NotAuthRoute = connect(mapStateToProps)(NotLogRoute);