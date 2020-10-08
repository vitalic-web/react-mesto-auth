import React, { useRef } from 'react';
import PopupWithForm from "./PopupWithForm";

/**
 * Компонент попапа добавления карточки
 * @param isOpen - стейт на открытие попапа
 * @param onClose - функция закрытия попапа
 * @param onAddPlaceSubmit - функция обработки сабмита
 * @returns {JSX.Element}
 * @constructor
 */

function AddPlacePopup({ isOpen, onClose, onAddPlaceSubmit }) {
  const nameRef = useRef('');
  const linkRef = useRef('');

  function handleSubmit(e) {
    e.preventDefault();

    onAddPlaceSubmit(nameRef.current.value, linkRef.current.value);

    // очистка инпутов после загрузки карточки
    nameRef.current.value = '';
    linkRef.current.value = '';
  }

  return (
    <PopupWithForm title="Новое место"
      name="add_photo"
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      buttonText="Создать"
    >
      <input name="place" className="popup__input popup__input_filed_name" type="text" placeholder="Название"
        required minLength="1" maxLength="30" id="place-input" ref={nameRef} />
      <span className="popup__input-error-message" id="place-input-error" />

      <input name="link" className="popup__input popup__input_filed_prof" type="url"
        placeholder="Ссылка на картинку" required id="link-input" ref={linkRef} />
      <span className="popup__input-error-message" id="link-input-error" />
    </PopupWithForm>
  )
}

export default AddPlacePopup;