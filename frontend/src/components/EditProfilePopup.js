import React from 'react';
import PopupWithForm from "./PopupWithForm";
import {CurrentUserContext} from "../contexts/CurrentUserContext";

function EditProfilePopup(props) {
    const [name, setName] = React.useState('');
    const [description, setDescription] = React.useState('');

    const currentUser = React.useContext(CurrentUserContext);

    React.useEffect(() => {
        setName(currentUser.name || '');
        setDescription(currentUser.about || '');
    }, [currentUser])

    function handleChangeName(evt) {
        setName(evt.target.value);
    }


    function handleChangeAbout(evt) {
        setDescription(evt.target.value);
    }

    function handleSubmit(evt) {
        evt.preventDefault();
        props.onUpdateUser({
            name,
            about: description,
        })
    }

    return (
        <PopupWithForm
            name="edit-profile"
            title="Редактировать профиль"
            submitText="Сохранить"
            isOpen={props.isOpen}
            onClose={props.onClose}
            onSubmit={handleSubmit}
        >
            <input type="text"
                   id="profileName"
                   className="popup__input popup__input_type_name"
                   name="name"
                   placeholder="Имя"
                   required
                   minLength="2"
                   maxLength="40"
                   value={name}
                   onChange={handleChangeName}/>
            <span className="popup__input-error profileName-error"></span>
            <input type="text" id="profileStatus" className="popup__input popup__input_type_status" name="status"
                   placeholder="Обо мне" required minLength="2" maxLength="200" value={description}
                   onChange={handleChangeAbout}/>
            <span className="popup__input-error profileStatus-error"></span>

        </PopupWithForm>
    )


}

export default EditProfilePopup;