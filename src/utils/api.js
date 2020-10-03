/**
 * Класс для запросов к api, в нем создается один экземляр и экспортируется для дальнейшей работы
 */

export class Api {
  constructor(options) {
    this._url = options.url;
    this._method = options.method;
    this._headers = options.headers;
  };

  _handleResponse(res) {
    if (res.ok) {
      return res.json();
    } else {
      return Promise.reject(`Ошибка: ${res.status}`);
    }
  };

  getProfileInfo() {
    return fetch(`${this._url}/users/me`, {
      method: this._method,
      headers: this._headers
    })
      .then(this._handleResponse)
  };

  getInitialCards() {
    return fetch(`${this._url}/cards`, {
      method: this._method,
      headers: this._headers
    })
      .then(this._handleResponse)
  };

  setProfileInfo(name, about) {
    return fetch(`${this._url}/users/me`, {
      method: 'PATCH',
      headers: this._headers,
      body: JSON.stringify({
        name: name,
        about: about
      })
    })
      .then(this._handleResponse)
  };

  addCard(place, link) {
    return fetch(`${this._url}/cards`, {
      method: 'POST',
      headers: this._headers,
      body: JSON.stringify({
        name: place,
        link: link
      })
    })
      .then(this._handleResponse)
  };

  deleteCard(card) {
    return fetch(`${this._url}/cards/${card._id}`, {
      method: 'DELETE',
      headers: this._headers
    })
      .then(this._handleResponse)
  };

  changeLikeCardStatus(cardID, isLiked) {
    if (isLiked) {
      return fetch(`${this._url}/cards/likes/${cardID}`, {
        method: 'DELETE',
        headers: this._headers
      })
        .then(this._handleResponse)
    } else {
      return fetch(`${this._url}/cards/likes/${cardID}`, {
        method: 'PUT',
        headers: this._headers
      })
        .then(this._handleResponse)
    }
  }

  editAvatar(inputValue) {
    return fetch(`${this._url}/users/me/avatar`, {
      method: 'PATCH',
      headers: this._headers,
      body: JSON.stringify({
        avatar: inputValue
      })
    })
      .then(this._handleResponse)
  };
}

export const api = new Api({
  url: 'https://mesto.nomoreparties.co/v1/cohort-13',
  method: 'GET',
  headers: {
    authorization: '91300657-0053-4635-a6b2-461fc085116c',
    'Content-Type': 'application/json'
  }
});

