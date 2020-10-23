import React from 'react';
import { Link, Route, Switch } from 'react-router-dom';
import headerLogo from '../images/header__logo.svg';

function Header({ isLogin, userData, signOut }) {
  const userEmail = isLogin ? userData.email : '';

  return (
    <header className="header">
      <img className="header__logo" src={headerLogo} alt="лого" />
      <div className="header__auth"><p className="header__mail">{userEmail}</p>
        <Switch>
          <Route path="/sign-in">
            <Link to="/sign-up" className="header__link">Регистрация</Link>
          </Route>
          <Route path="/sign-up">
            <Link to="/sign-in" className="header__link">Вход</Link>
          </Route>
          <Route path="/">
            <Link to="/sign-in" className="header__link" onClick={signOut}>{userData.auth}</Link>
          </Route>
        </Switch>
      </div>
    </header>
  )
}

export default Header;