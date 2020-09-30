import React from 'react';
import headerLogo from '../images/header__logo.svg';

function Header() {
  return (
    <header className="header">
      <img className="header__logo" src={headerLogo} alt="лого"/>
    </header>
  )
}

export default Header;