import React, {useRef} from 'react';
import PopupWithForm from "./PopupWithForm";

/**
 * Компонент попапа редактирования аватара
 * @param isOpen - стейт на открытие попапа
 * @param onClose - функция закрытия попапа
 * @param onUpdateAvatar - функция обработки сабмита
 * @returns {JSX.Element}
 * @constructor
 */

function EditAvatarPopup({isOpen, onClose, onUpdateAvatar}) {
  const avatarRef = useRef('');

  function handleSubmit(e) {
    e.preventDefault();

    onUpdateAvatar(avatarRef.current.value);
  }

  return (
    <PopupWithForm title="Обновить аватар"
      name="edit_avatar"
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
    >
      <input name="avatar" className="popup__input popup__input_filed_avatar-link" type="url"
        placeholder="Ссылка на аватар" required id="avatar-input" ref={avatarRef}/>
      <span className="popup__input-error-message" id="avatar-input-error"/>
      <button className="popup__save-button" type="submit">Сохранить</button>
    </PopupWithForm>
  )
}

export default EditAvatarPopup;