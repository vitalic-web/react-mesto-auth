import React, { useState, useLocation } from 'react';
import { Link, Route, Switch, useHistory } from 'react-router-dom';
import headerLogo from '../images/header__logo.svg';

function Header({ isLogin, userData, signOut }) {
  const userEmail = isLogin ? userData.email : '';
  const userLink = isLogin ? 'Выход' : '';

  return (
    <header className="header">
      <img className="header__logo" src={headerLogo} alt="лого" />
      <div className="header__auth"><p>{userEmail}</p>
        <Switch>
          <Route path="/sign-in">
            <Link to="/sign-up" className="header__link">Регистрация</Link>
          </Route>
          <Route path="/sign-up">
            <Link to="/sign-in" className="header__link">Вход</Link>
          </Route>
          <Route path="/">
            <Link to="/sign-in" className="header__link" onClick={signOut}>Выход</Link>
          </Route>
        </Switch>
      </div>
    </header>
  )
}

export default Header;