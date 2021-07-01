class Api {
    constructor({url, headers}){
        this._url = url;
        this._headers = headers;
    }

    getUserInfo() {
        return fetch(`${this._url}/users/me`, {
            headers: this._headers,
            credentials: 'include',
        })
            .then(result => {
                this._getResponseData({ result })
            });
    }

    setUserInfo({name, about}){
        return fetch(`${this._url}/users/me`, {
            method: 'PATCH',
            headers: this._headers,
            credentials: 'include',
            body : JSON.stringify({name, about})
        })
            .then(result => this._getResponseData({result}));
    }

    setUserAvatar({avatar}) {
        return fetch(`${this._url}/users/me/avatar`, {
            method: 'PATCH',
            headers: this._headers,
            credentials: 'include',
            body : JSON.stringify({avatar})
        })
            .then(result => this._getResponseData({result}));
    }

    getCards() {
        return fetch(`${this._url}/cards`, {
            headers: this._headers,
            credentials: 'include',
        })
            .then(result => this._getResponseData({result}));
    }

    patchUserInfo({ name, about }) {
        return fetch(`${this._url}/users/me`, {
            method: 'PATCH',
            headers: this._headers,
            credentials: 'include',
            body: JSON.stringify({ name, about })
        })
            .then(result => this._getResponseData({result}));
    }

    postCard( {name, link} ) {
        return fetch(`${this._url}/cards`, {
            method: 'POST',
            headers: this._headers,
            credentials: 'include',
            body: JSON.stringify({ name, link })
        })
            .then(result => this._getResponseData({result}));
    }

    deleteCard({cardId}) {
        return fetch(`${this._url}/cards/${cardId}`, {
            method: 'DELETE',
            credentials: 'include',
            headers: this._headers
        })
            .then(result => this._getResponseData({ result }));
    }


    changeLikeCardStatus({cardId, isLiked}){

        return fetch(`${this._url}/cards/${cardId}/likes`, {
            method: isLiked ? 'PUT' : 'DELETE',
            headers: this._headers,
            credentials: 'include',
        })
            .then(result => this._getResponseData({result}));
    }

    _getResponseData({result}){
        return result.ok ? result.json() : '';
    }

    updateAvatar({ avatar }) {
        return fetch(`${this._url}/users/me/avatar`, {
            method: 'PATCH',
            headers: this._headers,
            credentials: 'include',
            body: JSON.stringify({ avatar })
        })
            .then(result => this._getResponseData({result}));
    }
}

const api = new Api({
    url: 'https://api.rt503.nomoredomains.monster',
    headers: {
        'Content-Type': 'application/json'
    },
});

export default api;