class Api {
  constructor({ baseUrl }) {
    this._baseUrl = baseUrl;
    this.userId = null;
  }

  _request(endpoint, options) {
    return fetch(`${this._baseUrl}/${endpoint}`, options).then((res) =>
      this._getResponseData(res)
    );
  }

  _getResponseData(res) {
    if (!res.ok) {
      return Promise.reject(`Ошибка: ${res.status}`);
    }
    return res.json();
  }

  _getHeaders() {
    const token = localStorage.getItem('token');
    return {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  }


  getUserInfo() {
    return this._request("users/me", { headers: this._getHeaders() }).then(
      (data) => {
        this.userId = data._id;
        return data;
      }
    );
  }

  getCards() {
    return this._request("cards", { headers: this._getHeaders() });
  }

  setUserInfo(data) {
    return this._request("users/me", {
      method: "PATCH",
      headers: this._getHeaders(),
      body: JSON.stringify({
        name: data.name,
        about: data.about,
      }),
    });
  }

  setUserAvatar(data) {
    return this._request("users/me/avatar", {
      method: "PATCH",
      headers: this._getHeaders(),
      body: JSON.stringify({
        avatar: data.avatar,
      }),
    });
  }

  addCard(data) {
    return this._request("cards", {
      method: "POST",
      headers: this._getHeaders(),
      body: JSON.stringify({
        name: data.name,
        link: data.link,
      }),
    });
  }

  deleteCard(cardId) {
    return this._request(`cards/${cardId}`, {
      method: "DELETE",
      headers: this._getHeaders(),
    });
  }

  changeLikeCardStatus(cardId, isLike) {
    return this._request(`cards/${cardId}/likes`, {
      method: `${isLike ? "PUT" : "DELETE"}`,
      headers: this._getHeaders(),
    });
  }
}

const api = new Api({
  baseUrl: "https://api.voloh.nomoredomainsicu.ru"
});

export { api };
