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

import Api from '../utils/api';

import { CurrentUserContext } from "../contexts/CurrentUserContext";

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

  function handleCardLike(card) {
    const isLiked = card.likes.some(i => i === currentUser._id);

    api.changeLikeCardStatus(card._id, isLiked)
      .then((newCard) => {
        const newCards = cards.map(c => c._id === card._id ? newCard.data : c);

        setCards(newCards);
      })
      .catch(err => console.error(err))
  }

  function handleCardDelete(card) {
    api.deleteCard(card)
      .then(() => {
        const newCards = cards.filter(item => item._id !== card._id);
        setCards(newCards);
      })
      .catch(err => console.error(err))
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
        setCurrentUser(res.data);
        closeAllPopups();
      })
      .catch(err => console.error(err))
  }

  // обновление аватара через попап редактирования аватара
  function handleUpdateAvatar(avatarLink) {
    api.editAvatar(avatarLink)
      .then(res => {
        setCurrentUser(res.data);
        closeAllPopups();
      })
  }

  // добавление карточки
  function handleAddPlaceSubmit(place, link) {
    api.addCard(place, link)
      .then(res => {
        setCards([res.data, ...cards]);
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

  const jwt = localStorage.getItem('jwt');

  const api = new Api({
    url: 'https://api.vtl.students.nomoreparties.co',
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${jwt}`
    }
  });

  // проверка токена
  const tokenCheck = (jwt) => {

    if (jwt) {
      Promise.all([api.getUserInfo(), api.getInitialCards()])
        .then(([profileInfo, cardsInfo]) => {
          setIsLogin(true);
          setUserData({
            email: profileInfo.email,
            auth: 'Выйти'
          });
          setCurrentUser(profileInfo);
          setCards(cardsInfo.data);
          history.push('/')
        })
        .catch((err) => console.log(err));
    }
  }

  useEffect(() => {
    tokenCheck(jwt);
  }, [isLogin]);

  // выход из учетной записи
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
