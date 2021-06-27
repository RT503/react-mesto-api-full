import React, {useContext} from 'react';
import {CurrentUserContext} from "../contexts/CurrentUserContext";


function Card(props) {

    const currentUser = useContext(CurrentUserContext);

    const isOwn = props.owner._id === currentUser._id;

    const isLiked = props.likes.some(i => i._id === currentUser._id);


    function handleCardClick() {
        props.onCardClick(props);
    }

    function handleLikeClick() {
        props.onCardLike(props);
    }

    function handleDeleteClick() {
        props.onCardDelete(props);
    }

    const cardDeleteButtonClassName = (
        `card__remove-button ${isOwn ? '' : 'card__remove-button_hidden'}`
    );


    const cardLikeButtonClassName = (
        `card__like-button ${isLiked ? 'card__like-button_active' : ''}`
    );


    return (
        <li className="card">
            <img className="card__image" src={props.link} alt={props.name} onClick={handleCardClick}/>
            <button type="button" className={cardDeleteButtonClassName} onClick={handleDeleteClick}/>
            <div className="card__bottom-section">
                <h2 className="card__title">{props.name}</h2>
                <button type="button" className={cardLikeButtonClassName} onClick={handleLikeClick}>
                    <p className="card__counter">{props.likes.length}</p>
                </button>
            </div>
        </li>
    )
}

export default Card;