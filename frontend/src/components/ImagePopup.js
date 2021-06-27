import React from 'react';


function ImagePopup({card, onClose}) {
    return (
        <div className={`popup popup_type_view-image ${card ? 'popup_opened' : ""}`}>
            <figure className="popup__figure">
                <button type="button" className="popup__close popup__close_view-image" onClick={onClose}/>
                <img className="popup__image"
                     src={card ? card.link : ''}
                     alt={card ? card.name : ''}
                />
                <figcaption className="popup__imagecaption">{card ? card.name : ''}</figcaption>
            </figure>
        </div>
    )
}

export default ImagePopup;