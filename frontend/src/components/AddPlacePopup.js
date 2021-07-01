import React from 'react';
import PopupWithForm from "./PopupWithForm";

function AddPlacePopup(props) {

    const [name, setName] = React.useState('');
    const [link, setLink] = React.useState('');

    function handleChangeName(evt) {
        setName(evt.target.value);
    }

    function handleChangeLink(evt) {
        setLink(evt.target.value);
    }

    function handleSubmit(evt) {
        evt.preventDefault();

        props.onAddPlace({name, link});

        setTimeout(() => {
            setName('');
            setLink('');
        }, 700)
    }


    return (
        <PopupWithForm
            name="add-new-card"
            title="Новое место"
            submitText="Сохранить"
            isOpen={props.isOpen}
            onClose={props.onClose}
            onSubmit={handleSubmit}
        >
            <input type="text"
                   id="placeName"
                   value={name}
                   onChange={handleChangeName}
                   className="popup__input popup__input_type_name"
                   name="name"
                   placeholder="Название"
                   required
                   minLength="2"
                   maxLength="30"/>
            <span className="popup__input-error placeName-error"/>
            <input type="url"
                   id="placeLink"
                   value={link}
                   onChange={handleChangeLink}
                   className="popup__input popup__input_type_picture-link"
                   name="link"
                   placeholder="Ссылка на картинку"
                   required
                   pattern="https://.*"/>
            <span className="popup__input-error placeLink-error"/>
        </PopupWithForm>
    )
}

export default AddPlacePopup;