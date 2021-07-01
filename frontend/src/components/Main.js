import React from 'react';
import Card from './Card';
import {CurrentUserContext} from "../contexts/CurrentUserContext";

function Main(props) {

    const currentUser = React.useContext(CurrentUserContext);

    return <main className="content">
        <section className="profile">
            <div className="profile__info">
                <img className="profile__avatar" src={currentUser.avatar} alt="Аватар пользователя"/>
                <button onClick={props.onEditAvatar} className="profile__avatar-button"/>
                <div className="profile__text-block">
                    <div className="profile__row">
                        <h2 className="profile__name">{currentUser.name}</h2>
                        <button onClick={props.onEditProfile} type="button"
                                className="profile__edit-button"/>
                    </div>
                    <p className="profile__status">{currentUser.about}</p>
                </div>
            </div>
            <button type="button" onClick={props.onAddPlace} className="profile__add-button"/>
        </section>

        <section className="elements">
            <ul className="elements__list">
                {props.cards.map(card => <Card
                    key={card._id}
                    onCardClick={props.onCardClick}
                    onCardLike={props.onCardLike}
                    onCardDelete={props.onCardDelete}
                    {...card}/>)}

            </ul>
        </section>


    </main>


}

export default Main;