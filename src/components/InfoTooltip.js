import React from 'react';
import test from '../images/success.svg'

function InfoTooltip() {

  return (
    <section className="popup popup_active">
      <div className="popup__container">
        <img className="popup-tooltip__success-img" src={require('../images/success.svg')} alt="okay"/>
        <p className="popup-tooltip">Вы успешно зарегистрировались!</p>
        <button className="popup__close-icon" type="button" />
      </div>
    </section>
  );
}

export default InfoTooltip;