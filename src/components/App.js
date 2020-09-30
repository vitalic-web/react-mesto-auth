import React, {useState, useEffect} from 'react';
import Header from './Header';
import Main from './Main';
import Footer from './Footer';
import PopupWithForm from './PopupWithForm';
import ImagePopup from './ImagePopup';
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";
import {api} from '../utils/api.js';
import {CurrentUserContext} from "../contexts/CurrentUserContext";

/**
 * Основной компонент, установлены слушатели на закрытие крестиком/escape/overlay
 * @returns {JSX.Element} - возврат разметки всей старницы
 * @constructor
 */

function App() {
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState({name: '', link: '', visibility: false});
  const [currentUser, setCurrentUser] = useState();
  const [cards, setCards] = useState([]);

  useEffect(() => {
    Promise.all([api.getProfileInfo(), api.getInitialCards()])
      .then(([profileInfo, cardsInfo]) => {
        setCurrentUser(profileInfo);
        setCards(cardsInfo);
    })
      .catch(err => console.error(err))
  }, [])

  function handleCardLike(card) {
    const isLiked = card.likes.some(i => i._id === currentUser._id);

    api.changeLikeCardStatus(card._id, isLiked)
      .then((newCard) => {
        const newCards = cards.map(c => c._id === card._id ? newCard : c);
        setCards(newCards);
      })
  }

  function handleCardDelete(card) {
    api.deleteCard(card)
      .then(() => {
        const newCards = cards.filter(item => item._id !== card._id);
        setCards(newCards);
      })
  }

  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(!isEditAvatarPopupOpen);
  }

  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(!isEditProfilePopupOpen);
  }

  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(!isAddPlacePopupOpen);
  }

  function handleCardClick(name, link, visibility) {
    setSelectedCard({name, link, visibility});
  }

  // закрытие всех попапов
  function closeAllPopups() {
    setIsEditAvatarPopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setSelectedCard((selectedCard) => {
      return {...selectedCard, visibility: false}; // возврат значения адреса/имени картинки для плавного закрытия
    });
  }

  // обновление данных имени и рода занятий через попап редактирования профиля
  function handleUpdateUser(name, description) {
    api.setProfileInfo(name, description)
      .then(res => {
        setCurrentUser(res);
        closeAllPopups();
      })
      .catch(err => console.error(err))
  }

  // обновление аватара через попап редактирования аватара
  function handleUpdateAvatar(avatarLink) {
    api.editAvatar(avatarLink)
      .then(res => {
        setCurrentUser(res);
        closeAllPopups();
      })
  }

  function handleAddPlaceSubmit(place, link) {
    api.addCard(place, link)
      .then(res => {
        setCards([res, ...cards]);
        closeAllPopups();
        place = ''
        link = '';
      })
  }

  // закрытие попапов через escape и overlay
  useEffect(() => {
    function handleOverlayClose(evt) {
      if (evt.target.classList.contains('popup_active')) {
        closeAllPopups();
      }
    }

    function handleEscClose(evt) {
      if (evt.key === "Escape") {
        closeAllPopups();
      }
    }

    document.addEventListener('click', handleOverlayClose);
    document.addEventListener('keydown', handleEscClose);

    return () => {
      document.removeEventListener('click', handleOverlayClose);
      document.removeEventListener('keydown', handleEscClose);
    }
  })

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page">

        <Header/>

        <Main cards={cards}
              onCardLike={handleCardLike}
              onCardDelete={handleCardDelete}
              onEditProfile={handleEditProfileClick}
              onAddPlace={handleAddPlaceClick}
              onEditAvatar={handleEditAvatarClick}
              onCardClick={handleCardClick}
        />

        <EditProfilePopup isOpen={isEditProfilePopupOpen} onClose={closeAllPopups} onUpdateUser={handleUpdateUser}/>

        <EditAvatarPopup isOpen={isEditAvatarPopupOpen} onClose={closeAllPopups} onUpdateAvatar={handleUpdateAvatar}/>

        <AddPlacePopup isOpen={isAddPlacePopupOpen} onClose={closeAllPopups} onAddPlaceSubmit={handleAddPlaceSubmit}/>

        <PopupWithForm title="Вы уверены?"
                       name="is_delete"
        >
          <button className="popup__save-button popup__save-button_delete" type="submit">Да</button>
        </PopupWithForm>

        <ImagePopup card={selectedCard} onClose={closeAllPopups}/>

        <Footer/>

      </div>
    </CurrentUserContext.Provider>

  );
}

export default App;
