import React, { useContext, useEffect, useState } from 'react';
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import PopupWithForm from "./PopupWithForm";

/**
 * Компонент попапа редактирования данных профиля
 * @param isOpen - стейт на открытие попапа
 * @param onClose - функция закрытия попапа
 * @param onUpdateUser - функция обработки сабмита
 * @returns {JSX.Element}
 * @constructor
 */

function EditProfilePopup({ isOpen, onClose, onUpdateUser }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const currentUser = useContext(CurrentUserContext);

  function nameChange(e) {
    setName(e.target.value);
  }

  function descriptionChange(e) {
    setDescription(e.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();

    onUpdateUser(name, description);
  }

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name);
      setDescription(currentUser.about);
    }
  }, [currentUser])

  return (
    <PopupWithForm title="Редактировать профиль"
      name="edit_profile"
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      buttonText="Сохранить"
    >
      <input name="name" className="popup__input popup__input_filed_name" type="text" required
        pattern="[А-ЯЁа-яёA-Za-z -]{1,}" minLength="2" maxLength="40" id="name-input" placeholder={"Имя"}
        value={name || ''} onChange={nameChange} />
      <span className="popup__input-error-message" id="name-input-error" />

      <input name="about" className="popup__input popup__input_filed_prof" type="text" required
        minLength="2" maxLength="200" id="prof-input" placeholder={"Занятие"}
        value={description || ''} onChange={descriptionChange} />
      <span className="popup__input-error-message" id="prof-input-error" />
    </PopupWithForm>
  );
}

export default EditProfilePopup;