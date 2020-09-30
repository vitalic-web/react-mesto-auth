import React, {useContext} from 'react';
import Card from './Card';
import {CurrentUserContext} from "../contexts/CurrentUserContext";

/**
 * Компонент раздела main
 * @param cards - массив с карточками
 * @param onCardLike - функция лайка карточки
 * @param onCardDelete - функция удаления карточки
 * @param onEditProfile - попап редактирования профиля
 * @param onAddPlace - попап добавления места
 * @param onEditAvatar - попап редактирования аватара
 * @param onCardClick - передача параметра в компонент Card
 * @returns {JSX.Element} - возврат разметки содержимого раздела main
 * @constructor
 */

function Main({cards, onCardLike, onCardDelete, onEditProfile, onAddPlace, onEditAvatar, onCardClick}) {
  const currentUser = useContext(CurrentUserContext);

  return (
    <main className="content">
      <section className="profile">
        <div className="profile__info">
          <img className="profile__avatar"
               src={currentUser && currentUser.avatar}
               alt=""
          />
          <div className="profile__avatar-editor" onClick={onEditAvatar}></div>
          <div className="profile__author">
            <div className="profile__title">
              <h1 className="profile__title-name">{currentUser && currentUser.name}</h1>
              <button className="profile__title-button" type="button" onClick={onEditProfile}/>
            </div>
            <p className="profile__subtitle">{currentUser && currentUser.about}</p>
          </div>
        </div>
        <button className="profile__add-button" type="button" onClick={onAddPlace}/>
      </section>

      <section className="elements" aria-label="Элементы">
        {cards.map(item =>
          <Card key={item._id} card={item} onCardClick={onCardClick} onCardLike={onCardLike} onCardDelete={onCardDelete}/>
        )}
      </section>

    </main>
  );
}

export default Main;