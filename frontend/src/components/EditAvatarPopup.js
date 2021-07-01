import React from 'react';
import PopupWithForm from "./PopupWithForm";

function EditAvatarPopup(props) {
    const avatarRef = React.useRef();

    function handleSubmit(evt) {
        evt.preventDefault();

        props.onUpdateAvatar({
            avatar: avatarRef.current.value
        });

        setTimeout(() => {
            avatarRef.current.value = '';
        }, 700);
    }

    return (
        <PopupWithForm
            name="edit-avatar"
            title="Обновить аватар"
            submitText="Сохранить"
            isOpen={props.isOpen}
            onClose={props.onClose}
            onSubmit={handleSubmit}
        >
            <input
                ref={avatarRef}
                id="avatar"
                type="url"
                className="popup__input popup__input_type_avatar-link"
                name="avatar"
                placeholder="Ссылка на картинку"
                required
            />
            <span className="popup__input-error avatar-error"></span>
        </PopupWithForm>
    )


}

export default EditAvatarPopup;