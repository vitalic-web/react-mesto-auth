import React, { useLayoutEffect, useState } from 'react';
import Header from './Header';
import { useHistory } from 'react-router-dom';

function Login({setLogin, signLink}) {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const BASE_URL = 'https://auth.nomoreparties.co';
  const history = useHistory();

  //setLogin('Регистрация');
  // signLink('/sign-up');

  // изменение состояния хедэра
  // handleHeader('', 'Регистрация', '/sign-up');





  // handleHeaderLink('/sign-up');

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

  // обработчик сабмита
  function handleSubmit(e) {
    e.preventDefault();

    if (!email || !password) {
      return;
    }

    return fetch(`${BASE_URL}/signin`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    })
      .then((response => response.json()))
      .then((data) => {
        // console.log(data.token);
        localStorage.setItem('jwt', data.token);
        return data;
      })
      .then(() => resetForm())
      .then(() => history.push('/'))
      // .then(() => {
      //   let jwt = localStorage.getItem('jwt');

      //   if (jwt) {
      //     return fetch(`${BASE_URL}/users/me`, {
      //       method: 'GET',
      //       headers: {
      //         'Accept': 'application/json',
      //         'Content-Type': 'application/json',
      //         'Authorization': `Bearer ${jwt}`,
      //       }
      //     })
      //       .then(res => res.json())
      //       .then(data => data.data)
      //       .then(res => {
      //         if (res) {
      //           setIsLogin(true);
      //           setEmail(res.email);
      //         }
      //       })
      //       .catch((err) => console.log(err));
      //   }
      // })
      // .then(() => history.push('/'))

      // .then(() => {
      //   handleHeader('Выйти', '/sign-in');

      //   setUserData({
      //     email: email
      //   });
      // })
      .catch((err) => console.log(err));
  };

  // console.log(`This is localStorage: ${localStorage.jwt}`);

  return (
    <>
      {/* <Header auth="Регистрация" /> */}

      <form onSubmit={handleSubmit} className="user-enter">
        <h1 className="user-enter__title">Вход</h1>
        <input className="user-enter__input" name="email" type="email" id="login-email" placeholder="Email" required
          value={email} onChange={handleEmailInput} />
        <input className="user-enter__input" name="password" type="password" id="login-password" placeholder="Пароль" required
          value={password} onChange={handlePasswordInput} />
        <button className="user-enter__button" type="submit" >Войти</button>
        <p className="user-enter__redirect">Ещё не зарегистрированы? <a href="/sign-up">Регистрация</a></p>
      </form>
    </>
  )
}

export default Login;