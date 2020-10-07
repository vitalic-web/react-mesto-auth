import React, { useState, useEffect } from 'react';
import { Route, Switch, useHistory } from 'react-router-dom';

import Main from './Main';
import Footer from './Footer';
import Header from './Header';
import PopupWithForm from './PopupWithForm';
import ImagePopup from './ImagePopup';
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";
import Login from './Login';
import Register from './Register';
import ProtectedRoute from './ProtectedRoute';
import InfoTooltip from './InfoTooltip';

import { api } from '../utils/api.js';
import { CurrentUserContext } from "../contexts/CurrentUserContext";

/**
 * Основной компонент, установлены слушатели на закрытие крестиком/escape/overlay
 * @returns {JSX.Element} - возврат разметки всей старницы
 * @constructor
 */

function App() {
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState({ name: '', link: '', visibility: false });
  const [currentUser, setCurrentUser] = useState();
  const [cards, setCards] = useState([]);

  const [isLogin, setIsLogin] = useState(false);
  const [userData, setUserData] = useState({
    email: '',
    auth: 'auth'
  });
  const [isSuccess, setIsSuccess] = useState(false);

  const history = useHistory();
  const BASE_URL = 'https://auth.nomoreparties.co';

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
    setSelectedCard({ name, link, visibility });
  }

  function closeSuccessPopup() {
    setIsSuccess(false);
  }

  // закрытие всех попапов
  function closeAllPopups() {
    setIsEditAvatarPopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    closeSuccessPopup();
    setSelectedCard((selectedCard) => {
      return { ...selectedCard, visibility: false }; // возврат значения адреса/имени картинки для плавного закрытия
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

  // проверка токена
  const tokenCheck = () => {
    let jwt = localStorage.getItem('jwt');

    if (jwt) {
      return fetch(`${BASE_URL}/users/me`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwt}`,
        }
      })
        .then(res => res.json())
        .then(data => data.data)
        .then(res => { // {_id: "5f7afa5a86203500127de5b1", email: "sss@sss.ru"}
          if (res) {
            setIsLogin(true);
            setUserData({
              email: res.email,
              auth: 'Выйти'
            });
            history.push('/')
          }
        })
        .catch((err) => console.log(err));
    }
  }

  useEffect(() => {
    tokenCheck();
  }, [isLogin]);

  function signOut() {
    localStorage.removeItem('jwt');
    setIsLogin(false);
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page">
        <Header isLogin={isLogin} userData={userData} signOut={signOut} />

        <InfoTooltip isOpen={isSuccess} close={closeSuccessPopup} />

        <Switch>
          <Route path="/sign-up">
            <Register setIsLogin={setIsLogin} setIsSuccess={setIsSuccess} />
          </Route>

          <Route path="/sign-in">
            <Login setIsLogin={setIsLogin} />
          </Route>

          <ProtectedRoute exact path="/" isLogin={isLogin}
            component={Main}
            cards={cards}
            onCardLike={handleCardLike}
            onCardDelete={handleCardDelete}
            onEditProfile={handleEditProfileClick}
            onAddPlace={handleAddPlaceClick}
            onEditAvatar={handleEditAvatarClick}
            onCardClick={handleCardClick} />

        </Switch>

        <EditProfilePopup isOpen={isEditProfilePopupOpen}
          onClose={closeAllPopups}
          onUpdateUser={handleUpdateUser}
        />

        <EditAvatarPopup isOpen={isEditAvatarPopupOpen}
          onClose={closeAllPopups}
          onUpdateAvatar={handleUpdateAvatar}
        />

        <AddPlacePopup isOpen={isAddPlacePopupOpen}
          onClose={closeAllPopups}
          onAddPlaceSubmit={handleAddPlaceSubmit}
        />

        <PopupWithForm title="Вы уверены?" name="is_delete">
          <button className="popup__save-button popup__save-button_delete" type="submit">Да</button>
        </PopupWithForm>

        <ImagePopup card={selectedCard} onClose={closeAllPopups} />

        <Footer />

      </div>
    </CurrentUserContext.Provider>

  );
}

export default App;
