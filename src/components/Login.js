import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { apiAuth } from '../utils/api';

function Login({ setIsLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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

  // обработчик сабмита
  function handleSubmit(evt) {
    evt.preventDefault();

    if (!email || !password) {
      return;
    }

    apiAuth.login(email, password)
      .then(() => resetForm())
      .then(() => setIsLogin(true))
      .then(() => history.push('/'))
      .catch((err) => console.log(err));
  };

  return (
    <form onSubmit={handleSubmit} className="user-enter">
      <h1 className="user-enter__title">Вход</h1>
      <input className="user-enter__input" name="email" type="email" id="login-email" placeholder="Email" required
        value={email} onChange={handleEmailInput} />
      <input className="user-enter__input" name="password" type="password" id="login-password" placeholder="Пароль" required
        value={password} onChange={handlePasswordInput} />
      <button className="user-enter__button" type="submit">Войти</button>
      <p className="user-enter__redirect">Ещё не зарегистрированы? <a href="/sign-up">Регистрация</a></p>
    </form>
  )
}

export default Login;