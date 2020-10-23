import React, {useContext} from 'react';
import {CurrentUserContext} from "../contexts/CurrentUserContext";

/**
 * Компонент создания карточки
 * @param card - объект с данными карточки
 * @param onCardClick - параметр для передачи данных карточки в компонент ImagePopup
 * @param onCardLike - функция постановки лайка
 * @param onCardDelete - функция удаления карточки
 * @returns {JSX.Element} - возвращает разметку карточки
 * @constructor
 */

function Card({card, onCardClick, onCardLike, onCardDelete}) {
  const currentUser = useContext(CurrentUserContext);
  const isOwn = card.owner === currentUser._id; // проверка карточки: если моя, то возвращает true, если нет false
  const isLiked = card.likes.some(i => i === currentUser._id); // проверка лайка: если мой, то возвращает true, если нет false

  // функция для передачи параметров текущей карточки для открытия картинки в полный размер
  function handleClick() {
    onCardClick(card.name, card.link, true);
  }

  function handleLikeClick() {
    onCardLike(card);
  }

  function handleDeleteClick() {
    onCardDelete(card);
  }

  return (
    <div className="element">
      <img className="element__image"
           src={card.link}
           alt=""
           onClick={handleClick}
      />
      {/*element__delete_hidden добавляется если карточка не моя*/}
      <button onClick={handleDeleteClick} className={`element__delete ${!isOwn && 'element__delete_hidden'}`} type="button"/>
      <div className="element__title">
        <h2 className="element__title-text">{card.name}</h2>
        <div className="element__like-container">
          <button onClick={handleLikeClick} className={`element__title-like ${isLiked && 'element__title-like_active'}`} type="button"/>
          <div className="element__like-amount">{card.likes.length}</div>
        </div>
      </div>
    </div>
  );
}

export default Card;