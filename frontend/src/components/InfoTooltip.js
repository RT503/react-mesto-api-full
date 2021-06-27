import React, {useRef} from 'react';

function InfoTooltip(props) {

    const popup = useRef();


    return (
        <div ref={popup} className={`popup popup__${props.name} ${props.isOpen && 'popup_opened'}`}>
            <div className="popup__content popup__info">
                <button className="button popup__close " type="button" onClick={props.onClose}></button>
                <img src={props.image} className="popup__info_image" alt="Изображение результата запроса"/>
                <p className="popup__info_message"> {props.message}</p>
            </div>
        </div>
    )
}

export default InfoTooltip;