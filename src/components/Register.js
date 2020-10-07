import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import InfoTooltip from './InfoTooltip';

function Register({ setIsLogin, setIsSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isError, setIsError] = useState(false);
  const BASE_URL = 'https://auth.nomoreparties.co';
  const history = useHistory();

  // запись введенных данных в поле email
  function handleEmailInput(e) {
    setEmail(e.target.value);
  }

  // запись введенных данных в поле password
  function handlePasswordInput(e) {
    setPassword(e.target.value);
  }

  function resetForm() {
    setEmail('');
    setPassword('');
  }

  function close() {
    setIsError(false);
  }

  // закрытие попапов через escape и overlay
  useEffect(() => {
    function handleOverlayClose(evt) {
      if (evt.target.classList.contains('popup_active')) {
        close();
      }
    }

    function handleEscClose(evt) {
      if (evt.key === "Escape") {
        close();
      }
    }

    document.addEventListener('click', handleOverlayClose);
    document.addEventListener('keydown', handleEscClose);

    return () => {
      document.removeEventListener('click', handleOverlayClose);
      document.removeEventListener('keydown', handleEscClose);
    }
  })

  function handleSubmit(e) {
    e.preventDefault();

    return fetch(`${BASE_URL}/signup`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    })
      .then((response) => {
        if (response.status === 201) {
          return response.json();
        } else {
          setIsError(true);
          return Promise.reject(`Ошибка: ${response.status}`);
        }
      })
      .then(() => {
        setTimeout(() => {
          return fetch(`${BASE_URL}/signin`, {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password })
          })
            .then((response => response.json()))
            .then((data) => {
              localStorage.setItem('jwt', data.token);
              return data;
            })
            .then(() => resetForm())
            .then(() => setIsLogin(true))
            .then(() => history.push('/'))
            .then(() => setIsSuccess(true))
        }, 500);
      })
      .catch((err) => console.log(err));
  };

  return (
    <form onSubmit={handleSubmit} className="user-enter">
      <InfoTooltip isOpen={isError} close={close} />
      <h1 className="user-enter__title">Регистрация</h1>
      <input className="user-enter__input" name="email" type="email" id="reg-email" placeholder="Email" required
        value={email} onChange={handleEmailInput} />
      <input className="user-enter__input" name="password" type="password" id="reg-password" placeholder="Пароль" required
        value={password} onChange={handlePasswordInput} />
      <button className="user-enter__button" type="submit" >Зарегистрироваться</button>
      <p className="user-enter__redirect">Уже зарегистрированы? <a href="/sign-in">Войти</a></p>
    </form>
  )
}

export default Register;