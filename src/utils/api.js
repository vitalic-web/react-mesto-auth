export default class Api {
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
      return fetch(`${this._url}/cards/${cardID}/likes`, {
        method: 'DELETE',
        headers: this._headers
      })
        .then(this._handleResponse)
    } else {
      return fetch(`${this._url}/cards/${cardID}/likes`, {
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

  // метод авторизации пользователя
  login(email, password) {
    return fetch(`${this._url}/signin`, {
      method: this._method,
      headers: this._headers,
      body: JSON.stringify({ email, password })
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else if (response.status === 400) {
          return Promise.reject(`Ошибка: ${response.status} - не передано одно из полей`);
        } else if (response.status === 401) {
          return Promise.reject(`Ошибка: ${response.status} - неправильные почта или пароль`);
        }
      })
      .then((data) => {
        localStorage.setItem('jwt', data.token);
        return data;
      })
  }

  // метод регистрации пользователя
  register(email, password, error) {
    return fetch(`${this._url}/signup`, {
      method: this._method,
      headers: this._headers,
      body: JSON.stringify({ email, password })
    })
      .then((response) => {
        if (response.status === 201) {
          return response.json();
        } else if (response.status === 400) {
          error(true);
          return Promise.reject(`Ошибка: ${response.status} - некорректно заполнено одно из полей`);
        }
      })
  }

  // метод запроса регистрационных данных пользователя
  getUserInfo() {
    return fetch(`${this._url}/users/me`, {
      method: 'GET',
      headers: this._headers
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        }
        else if (response.status === 401) {
          return Promise.reject(`Ошибка: ${response.status} - переданный токен некорректен`);
        }
      })
      .then(data => data.data)
  }
}

// экземпляр апи для работы с регистрацией/авторизацией пользователя
export const apiAuth = new Api({
  url: 'https://api.vtl.students.nomoreparties.co',
  method: 'POST',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  }
})
