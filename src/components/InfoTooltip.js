import React, { useState, useEffect } from 'react';
import { Route, Switch } from 'react-router-dom';

function InfoTooltip({ isOpen, close }) {

  return (
    <section className={`popup ${isOpen ? 'popup_active' : ''}`}>
      <div className="popup__container">
        <Switch>
          <Route path="/sign-up">
            <img className="popup-tooltip__success-img" src={require('../images/error_reg.svg')} alt="error" />
            <p className="popup-tooltip">Что-то пошло не так! Попробуйте ещё раз.</p>
          </Route>
          <Route path="/">
            <img className="popup-tooltip__success-img" src={require('../images/success.svg')} alt="success" />
            <p className="popup-tooltip">Вы успешно зарегистрировались!</p>
          </Route>
        </Switch>
        <button onClick={close} className="popup__close-icon" type="button" />
      </div>
    </section>
  );
}

export default InfoTooltip;