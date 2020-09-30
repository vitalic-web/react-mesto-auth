import React from 'react';

/**
 * Компонент открытия картинки в полную величину
 * @param card - параметры текущей карточки {name: '...', link: '...', visibility: true/false}
 * @param onClose - закрытие через крестик
 * @returns {JSX.Element} - возврат картинки в полную величину
 * @constructor
 */

function ImagePopup({card, onClose}) {

  return (
    <div className={`popup popup_open_photo ${card.visibility ? 'popup_active' : ''}`}>
      <div className="popup-photo">
        <img className="popup-photo__image"
             src={card.link} alt=""/>
        <h2 className="popup-photo__text">{card.name}</h2>
        <button className="popup__close-icon" type="button" onClick={onClose}/>
      </div>
    </div>
  )
}

export default ImagePopup;