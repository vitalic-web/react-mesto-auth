import React, { useState } from 'react';
import Header from './Header';
import { useHistory } from 'react-router-dom';

function Register({setLogin, setLink}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const BASE_URL = 'https://auth.nomoreparties.co';
  const history = useHistory();

  //setLogin('Войти');
  //setLink('/sign-in');
  // signLink('/sign-in');

  // setTest({
  //   email: '',
  //   auth: 'heh',
  //   link: ''
  // })

  // изменение состояния хедэра
  //handleHeader('', 'Войти', '/sign-in');

  //handleHeaderEmail('');

  // handleHeaderLink('/sign-in');

  // запись введенных данных в поле email
  function handleEmailInput(e) {
    setEmail(e.target.value);
  }

  // запись введенных данных в поле password
  function handlePasswordInput(e) {
    setPassword(e.target.value);
  }

  // обработчик сабмита
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
        // console.log(response);
        try {
          if (response.status === 201) {
            return response.json();
          }
        } catch (e) {
          return (e)
        }
      })
      .then((res) => {
        // console.log(res);
        return res;
      })
      .then((res) => {
        if (res) {
          setMessage('Вы успешно зарегистрировались!');
          history.push("/sign-in");
        } else {
          setMessage('Что-то пошло не так! Попробуйте ещё раз.');
        }

      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      {/* <Header auth="Войти" /> */}

      <form onSubmit={handleSubmit} className="user-enter">
        <h1 className="user-enter__title">Регистрация</h1>
        <input className="user-enter__input" name="email" type="email" id="reg-email" placeholder="Email" required
          value={email} onChange={handleEmailInput} />
        <input className="user-enter__input" name="password" type="password" id="reg-password" placeholder="Пароль" required
          value={password} onChange={handlePasswordInput} />
        <button className="user-enter__button" type="submit" >Зарегистрироваться</button>
        <p className="user-enter__redirect">Уже зарегистрированы? <a href="/sign-in">Войти</a></p>
      </form>
    </>
  )
}

export default Register;