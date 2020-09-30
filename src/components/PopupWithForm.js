import React from 'react';

/**
 * Компонент создания окна попап
 * @param title - название окна попап
 * @param name - уникальная часть имени класса определенного типа попапа
 * @param children - уникальная разметка для каждого класса
 * @param isOpen - параметр для открытия попапа, меняется при клике на true
 * @param onClose - закрытие попапа по клику на крестик
 * @param onSubmit - функция обработки сабмита
 * @returns {JSX.Element} - возвращает разметку попапа
 * @constructor
 */

function PopupWithForm({title, name, children, isOpen, onClose, onSubmit}) {

  return (
    <section className={`popup popup_${name} ${isOpen ? 'popup_active' : ''}`}>

      <form className="popup__container" onSubmit={onSubmit}>
        <h3 className="popup__title">{title}</h3>

        {children}

        <button className="popup__close-icon" type="button" onClick={onClose}/>
      </form>
    </section>
  );
}

export default PopupWithForm;