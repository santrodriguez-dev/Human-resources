import React from 'react';
import './App.scss';

import { Route, HashRouter } from "react-router-dom";

// components
import Profile from './pages/profile/Profile';

const App = () => {

  return (
    <HashRouter>
      {/* <Route exact path="/" component={Home} />
      <Route exact path="/offers" component={Offers} />
      <Route exact path="/notifications" component={Notifications} /> */}
      <Route exact path="/profile" component={Profile} />
    </HashRouter>
  )
}

export default App