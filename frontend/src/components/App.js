import React from 'react';
import {useEffect, useState} from 'react';
import {Switch, Route, Redirect, useHistory} from 'react-router-dom';

import Header from "./Header";
import Main from "./Main.js";
import Footer from "./Footer";
import PopupWithForm from "./PopupWithForm";
import ImagePopup from "./ImagePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";
import api from "../utils/api";
import {CurrentUserContext} from "../contexts/CurrentUserContext";
import EditProfilePopup from "./EditProfilePopup";

import Login from "./Login";
import Register from "./Register";
import ProtectedRoute from "./ProtectedRoute";
import InfoTooltip from "./InfoTooltip";
import infoTooltipDoneImage from '../images/reg-success.svg';
import infoTooltipErrorImage from '../images/reg-failed.svg';
import * as auth from "../utils/auth";

function App() {
    const history = useHistory();
    const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = React.useState(false);
    const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
    const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = React.useState(false);
    const [selectedCard, setSelectedCard] = React.useState(null);
    const [currentUser, setCurrentUser] = React.useState({});
    const [cards, setCards] = React.useState([]);
    const [isLoggedIn, setLoggedIn] = React.useState(false);
    const [isInfoPopupOpen, setInfoPopupOpen] = useState(false);

    const [isInfoTooltip, setInfoTooltip] = useState({message: '', image: ''});
    const [headerUserLoginEmail, setHeaderUserLoginEmail] = useState('');

    function handleLogin({email, password}) {

        auth.login({
            email, password
        })
            .then((res) => {

                if (res.token) {
                    localStorage.setItem('token', res.token);

                    setHeaderUserLoginEmail(email);

                    setLoggedIn(true);

                    setInfoTooltip({
                        message: 'Вы успешно авторизовались!',
                        image: infoTooltipDoneImage
                    });

                    setInfoPopupOpen(true);
                }
            })
            .catch(() => {
                setInfoTooltipError()
                setInfoPopupOpen(true);
            })
    }

    function handleRegister({email, password}) {
        auth.register({
            email, password
        })
            .then((res) => {

                history.push('/singin');

                setInfoTooltip({
                    message: 'Вы успешно зарегистрировались!',
                    image: infoTooltipDoneImage
                });
                setInfoPopupOpen(true);
            })
            .catch((err) => {
                setInfoTooltipError()
                setInfoPopupOpen(true);
            })
    }

    function handleSignOut() {
        localStorage.removeItem('token');
        setLoggedIn(false);
        setHeaderUserLoginEmail('');
    }


    function setInfoTooltipError() {
        setInfoTooltip({
            message: 'Что-то пошло не так! Попробуйте еще раз.',
            image: infoTooltipErrorImage
        })
    }


    function handleEditAvatarClick() {
        setIsEditAvatarPopupOpen(true);
    }

    function handleEditProfileClick() {
        setIsEditProfilePopupOpen(true);
    }

    function handleAddPlaceClick() {
        setIsAddPlacePopupOpen(true);
    }

    function handleCardClick(card) {
        setSelectedCard(card);
    }

    function handleCardDelete(card) {
        api.deleteCard(card)
            .then(() => {
                setCards((cards) => cards.filter((c) => c._id !== card._id));
                closeAllPopups()
            })
            .catch((err) => console.log(`Ошибка удаления карточки ${err}`));
    }

    function handleCardLike(card) {
        const isLiked = card.likes.some(i => i._id === currentUser._id);
        api.changeLikeCardStatus(card._id, !isLiked)
            .then((newCard) => {
                    setCards((cards) => cards.map((c) => c._id === card._id ? newCard : c))
                }
            )
            .catch((err) => console.log(`Ошибка ${err}`));
    }

    function closeAllPopups() {
        setIsEditProfilePopupOpen(false);
        setIsAddPlacePopupOpen(false);
        setIsEditAvatarPopupOpen(false);
        setSelectedCard(null);
        setInfoPopupOpen(false);
    }

    useEffect(() => {
        api.getUserInfo()
            .then((info) => {
                setCurrentUser(info);
            })
            .catch((err) => console.log(`Ошибка ${err}`))
    }, [])

    useEffect(() => {
        api.getCards()
            .then((data) => {
                setCards(data);
            })
            .catch((err) => {
                console.log(`Ошибка ${err}`);
            })
    }, [])

    function handleUpdateUser({name, about}) {
        api.patchUserInfo({name, about})
            .then((data) => {
                setCurrentUser(data);
                closeAllPopups();
            }).catch((err) => {
            console.log(err)
        })
    }

    function handleUpdateAvatar({avatar}) {
        api.updateAvatar({avatar})
            .then((data) => {
                setCurrentUser(data);
                closeAllPopups()
            }).catch((err) => console.log(err));
    }

    function handleAddPlaceSubmit({name, link}) {
        api.postCard({name, link})
            .then((card) => {
                setCards(cards => [card, ...cards]);
                closeAllPopups()
            }).catch((err) => {
            console.log(err)
        })
    }

    function checkTokenInStorage() {

        if (localStorage.getItem('token')) {
            const token = localStorage.getItem('token');

            auth.checkUserToken(token)
                .then((data) => {
                    setLoggedIn(true);
                    setHeaderUserLoginEmail(data.data.email);
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    }

    useEffect(() => {
        checkTokenInStorage();
    }, [])

    return (

        <CurrentUserContext.Provider value={currentUser}>
            <div className="body">
                <div className="root">

                    <Header
                        isLoggedIn={isLoggedIn}
                        userLogin={headerUserLoginEmail}
                        onSignOut={handleSignOut}
                    />
                    <main className="main">
                        <Switch>
                            <ProtectedRoute
                                exact
                                path="/"
                                isLoggedIn={isLoggedIn}
                                component={Main}
                                onEditProfile={handleEditProfileClick}
                                onAddPlace={handleAddPlaceClick}
                                onEditAvatar={handleEditAvatarClick}
                                onCardClick={handleCardClick}
                                cards={cards}
                                onCardDelete={handleCardDelete}
                                onCardLike={handleCardLike}

                            />
                            <Route path="/signin">
                                {isLoggedIn ? <Redirect to="/"/> : <Login onSubmit={handleLogin}/>}
                            </Route>
                            <Route path="/signup">
                                {isLoggedIn
                                    ? <Redirect to="/"/>
                                    : <Register
                                        onSubmit={handleRegister}
                                    />
                                }
                            </Route>
                            <Route path="*">
                                <Redirect to="/"/>
                            </Route>
                        </Switch>
                    </main>
                    <Footer/>
                </div>
                <EditProfilePopup
                    isOpen={isEditProfilePopupOpen}
                    onClose={closeAllPopups}
                    onUpdateUser={handleUpdateUser}
                >
                </EditProfilePopup>

                <AddPlacePopup
                    isOpen={isAddPlacePopupOpen}
                    onClose={closeAllPopups}
                    onAddPlace={handleAddPlaceSubmit}
                >
                </AddPlacePopup>

                <EditAvatarPopup
                    isOpen={isEditAvatarPopupOpen}
                    onClose={closeAllPopups}
                    onUpdateAvatar={handleUpdateAvatar}
                />


                <PopupWithForm
                    name="popup_confirm"
                    title="Вы уверены?"
                    submitText="Да"
                    onClose={closeAllPopups}

                />

                <ImagePopup
                    card={selectedCard}
                    onClose={closeAllPopups}
                />

                <InfoTooltip
                    name="info-tooltip"
                    isOpen={isInfoPopupOpen}
                    onClose={closeAllPopups}
                    message={isInfoTooltip.message}
                    image={isInfoTooltip.image}
                />
            </div>
        </CurrentUserContext.Provider>
    )
}

export default App;
