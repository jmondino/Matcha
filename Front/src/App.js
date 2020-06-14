import React, { Component } from 'react';
import { Route, BrowserRouter, Switch } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Profile from './components/profile/Profile';
import Dashboard from './components/dashboard/Dashboard';
import SignUp from './components/auth/SignUp';
import SignIn from './components/auth/SignIn';
import ProfileList from './components/profile/ProfileList';
import ProfileEdit from './components/profile/ProfileEdit'; 
import ProtectedRoute, { NotAuthRoute } from './components/auth/ProtectedRoute';
import MatchList from './components/profile/MatchList';
import ForgotPassword from './components/auth/ForgotPassword';
import Historic from './components/hist/Historic';
import Notifications from './components/dashboard/Notifications';
import Chat from './components/social/Chat';

/*
<ProtectedRoute path="/profiles/:user_id" component={Profile} />
<ProtectedRoute path="/profiles-list" component={ProfileList} />
<ProtectedRoute path="/match" component={ProfileList} />
*/

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div className="App">
          <Navbar />
          <Switch>
            <NotAuthRoute exact path="/" component={Dashboard} />
            <Route exact path="/forgot-password" component={ForgotPassword} />
            <ProtectedRoute path="/profiles/:user_id" component={Profile} />
            <ProtectedRoute path="/profiles-list" component={ProfileList} />
            <ProtectedRoute path="/profile-edit" component={ProfileEdit} />
            <ProtectedRoute path="/lucky" component={MatchList} />
            <ProtectedRoute exact path="/profile-admirer" component={Historic} />
            <ProtectedRoute exact path="/Center" component={Notifications} />
            <ProtectedRoute exact path="/SocialRoom" component={Chat} />
            {/* <Route path="/profiles/:user_id" component={Profile} />
            <Route path="/profiles-list" component={ProfileList} />
            <Route path="/profile-edit" component={ProfileEdit} />
            <Route path="/match" component={ProfileList} /> */}
            <NotAuthRoute path="/signin" component={SignIn} />
            <NotAuthRoute path="/signup" component={SignUp} />
            <NotAuthRoute path="/act/:token" component={Dashboard} />
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;