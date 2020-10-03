import React from 'react';
import headerLogo from '../images/header__logo.svg';

function Header({ auth }) {
  return (
    <header className="header">
      <img className="header__logo" src={headerLogo} alt="лого" />
      <div className="header__auth">{auth}</div>
    </header>
  )
}

export default Header;