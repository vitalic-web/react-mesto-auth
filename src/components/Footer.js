import React from 'react';
import { Route, Switch } from 'react-router-dom';

function Footer() {
  return (
    <Switch>
      <Route path="/sign-in"></Route>
      <Route path="/sign-up"></Route>
      <Route path="/">
        <footer className="footer">&copy; 2020 Mesto Russia</footer>
      </Route>
    </Switch>
  )
}

export default Footer;