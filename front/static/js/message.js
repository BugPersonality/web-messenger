const host = window.location.origin + '/'

let owner = ''
console.log(location)
let chatSocket;

window.onload = () => {
    if (document.querySelector('main').id !== "") {
        getDialogs(document.querySelector('main').id)
        open_dialog(document.querySelector('main').id)
    } else {
        getDialogs()
    }
}

function getDialogs(id = null) {
    fetch(host + `api/dialog/`, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
    }).then(response => {
        return response.json()
    })
        .then(responseJson => {
            if (typeof responseJson['error'] === "undefined") {
                document.querySelector(".preloader").classList.remove('preloader')
                responseJson.forEach(el => {
                    let template = document.querySelector("#dialog");
                    let tmp = template.content.cloneNode(true);
                    if (id !== null && (el.id === id || el.id.toString() === id)) {
                        tmp.querySelector(`.dialog`).classList.add('active_dialog')
                    }
                    tmp.querySelector(".dialog").onclick = () => {
                        open_dialog(el.id)
                    };
                    tmp.querySelector(".dialog").id = 'dialog' + el.id
                    if (el.header === "") {
                        el.header = el.user
                    }
                    tmp.querySelector(".header-msg").innerHTML = el.header;
                    tmp.querySelector("img").src = host + 'media/' + el.photo;
                    if (el.last_msg !== '') {
                        tmp.querySelector(".last-msg").innerHTML = el.last_msg;
                    }
                    document.querySelector(".dialogs").appendChild(tmp);
                })
                document.querySelector(".messages_inner").scrollTop = document.querySelector(".messages_inner").scrollHeight
            } else {
                alert_msg("Ошибка", responseJson["error"])
            }
        })
        .catch(error => {
            location = host + 'login/'
        });
}

function findUser(patch) {
    fetch(host + `api/find/?text=${patch.value}`, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
    }).then(response => {
        return response.json()
    })
        .then(responseJson => {
            document.querySelectorAll('.search .user').forEach(el => {
                el.remove();
            })
            if (typeof responseJson['error'] === "undefined") {
                responseJson = responseJson.users
                responseJson.forEach(el => {
                    let template = document.querySelector("#search");
                    let tmp = template.content.cloneNode(true);
                    tmp.querySelector("p").innerHTML = el.name_surname;
                    tmp.querySelector("p").onclick = () => {
                        location = host + el.id;
                    }
                    tmp.querySelector("p").id = 'user' + el.id
                    tmp.querySelector("img").src = host + el.photo;
                    document.querySelector(".search").appendChild(tmp);
                })
            } else {
                alert_msg("Ошибка", responseJson["error"])
            }
        })
        .catch(error => {
            alert_msg("Ошибка", "" + "Обновите страницу")
        });
}

function open_dialog(id) {
    try {
        chatSocket.close()
    } catch (e) {
    }
    fetch(host + `api/dialog/${id}/`, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
    }).then(response => {
        return response.json()
    })
        .then(responseJson => {
            if (typeof responseJson['error'] === "undefined") {
                document.querySelectorAll('.dialog').forEach(el => {
                    el.classList.remove('active_dialog')
                })
                document.querySelector('.messages_inner').style.borderBottom = '1px double #216309'
                history.pushState(null, null, `/dialogs/${id}/`);
                chatSocket = new WebSocket(
                    'wss://'
                    + window.location.host
                    + '/ws/'
                    + id
                    + '/'
                );
                chatSocket.onmessage = function (e) {
                    console.log('onmessage')
                    const data = JSON.parse(e.data)
                    if (data.message) {
                        let template = document.querySelector("#message");
                        let tmp = template.content.cloneNode(true);
                        tmp.querySelector('.message-text p').innerHTML = data.message;
                        tmp.querySelector('.comment-avatar').src = host + 'media/' + data.photo;
                        if (owner === data.sender) {
                            tmp.querySelector('.message').style.alignSelf = 'flex-end';
                            tmp.querySelector('.message').style.flexDirection = 'row-reverse';
                            tmp.querySelector('.message-text').style.cursor = 'pointer';
                            tmp.querySelector('.message-text').onclick = () => onchange_msg(data.id);
                            tmp.querySelector('.delete-msg').style.display = 'unset';
                        }
                        tmp.querySelector('.message').id = 'message' + data.id
                        console.log(tmp.querySelector('.message'))
                        console.log(document.querySelector('.data').nextSibling)
                        try {
                            document.querySelector(".messages_inner").insertBefore(tmp, document.querySelector('.message:last-child').nextSibling);
                        } catch (TypeError) {
                            document.querySelector(".messages_inner").appendChild(tmp);
                        }
                        document.querySelector(".messages_inner").scrollTop = document.querySelector(".messages_inner").scrollHeight
                    }
                    updateDialogs(id)
                }

                chatSocket.onclose = function (e) {
                    console.log('onclose')
                    chatSocket = new WebSocket(
                        'wss://'
                        + window.location.host
                        + '/ws/'
                        + id
                        + '/'
                    );
                }
                document.querySelector('.messages').id = id;
                document.querySelector('.messages .data').style.display = 'none';
                document.querySelector('.msg-enter').style.display = 'unset';
                document.querySelectorAll('.message').forEach(el => {
                    el.remove()
                })
                owner = responseJson.owner
                responseJson.messages.forEach(el => {
                    let template = document.querySelector("#message");
                    let tmp = template.content.cloneNode(true);
                    tmp.querySelector('.message-text p').innerHTML = el.text;
                    tmp.querySelector('.comment-avatar').src = host + 'media/' + el.photo;
                    if (responseJson.owner === el.sender) {
                        tmp.querySelector('.message').style.alignSelf = 'flex-end';
                        tmp.querySelector('.message').style.flexDirection = 'row-reverse';
                        tmp.querySelector('.message-text').style.cursor = 'pointer';
                        tmp.querySelector('.message-text').onclick = () => onchange_msg(el.id);
                        tmp.querySelector('.delete-msg').style.display = 'unset';
                    }
                    tmp.querySelector('.message').id = 'message' + el.id
                    document.querySelector(".messages_inner").insertBefore(tmp, document.querySelector('.data').nextSibling);
                })
                document.querySelector(".messages_inner").scrollTop = document.querySelector(".messages_inner").scrollHeight
                try {
                    document.querySelector(`#dialog${id}`).classList.add('active_dialog');
                } catch (e) {
                }
            } else {
                alert_msg("Ошибка", responseJson["error"])
            }
        })
}

function send_msg() {
    const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
    let value = document.querySelector('.msg-print').value;
    let id = document.querySelector('.messages').id
    console.log(id)
    fetch(host + `api/message/${id}/`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken,
        },
        body: JSON.stringify({
            text: value
        })
    }).then(response => {
        return response.json()
    })
        .then(responseJson => {
            if (typeof responseJson['error'] === "undefined") {
                chatSocket.send(JSON.stringify({
                    'message': value,
                    'photo': responseJson.photo,
                    'sender': responseJson.sender,
                    'id': responseJson.id
                }))
                document.querySelector('.msg-print').value = '';
            } else {
                alert_msg("Ошибка", responseJson["error"])
            }
        })
}

function logout() {
    const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
    fetch(host + 'api/logout/', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken,
        },
    }).then(response => response)
        .then(responseJson => {
            if (typeof responseJson['error'] === "undefined") {
                location = host + "login/";
            } else {
            }
        })
        .catch(error => {
            alert_msg("Ошибка", "Ошибка" + ", обновите страницу")
        });
}

function create_dialog(el) {
    const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
    let id = el.parentNode.querySelector("p").id.split('user')[1];
    fetch(host + 'api/dialog/', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken,
        },
        body: JSON.stringify({
            header: "",
            users: [id]
        })
    }).then(response => response.json())
        .then(responseJson => {
            if (typeof responseJson['error'] === "undefined") {
                location = location.origin + '/dialogs/' + responseJson.id + '/'
            } else {
            }
        })
        .catch(error => {
            alert_msg("Ошибка", "Ошибка" + ", обновите страницу")
        });
}


function updateDialogs(id = null) {
    fetch(host + `api/dialog/`, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
    }).then(response => {
        return response.json()
    })
        .then(responseJson => {
            if (typeof responseJson['error'] === "undefined") {
                document.querySelectorAll('.dialogs .dialog').forEach(el => {
                    el.remove()
                })
                responseJson.forEach(el => {
                    let template = document.querySelector("#dialog");
                    let tmp = template.content.cloneNode(true);
                    if (id !== null && (el.id === id || el.id.toString() === id)) {
                        tmp.querySelector(`.dialog`).classList.add('active_dialog')
                    }
                    tmp.querySelector(".dialog").onclick = () => {
                        open_dialog(el.id)
                    };
                    tmp.querySelector(".dialog").id = 'dialog' + el.id
                    if (el.header === "") {
                        el.header = el.user
                    }
                    tmp.querySelector(".header-msg").innerHTML = el.header;
                    tmp.querySelector("img").src = host + 'media/' + el.photo;
                    if (el.last_msg !== '') {
                        tmp.querySelector(".last-msg").innerHTML = el.last_msg;
                    }
                    document.querySelector(".dialogs").appendChild(tmp);
                })
            } else {
                alert_msg("Ошибка", responseJson["error"])
            }
        })
        .catch(error => {
            alert_msg("Ошибка", "" + "Обновите страницу")
        });
}


function delete_msg(el) {
    const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
    let id = el.parentNode.id.split('message')[1]
    fetch(host + `api/message/${id}/`, {
        method: 'DELETE',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken,
        },
    }).then(response => {
        return response
    })
        .then(responseJson => {
            if (typeof responseJson['error'] === "undefined") {
                document.querySelector(`#message${id}`).remove()
            } else {
                alert_msg("Ошибка", responseJson["error"])
            }
        })
        .catch(error => {
            alert_msg("Ошибка", "" + "Обновите страницу")
        });
}


function change_msg(id) {
    const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
    let text = document.querySelector(`.msg-print`).value
    console.log(text)
    fetch(host + `api/message/${id}/`, {
        method: 'PUT',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken,
        },
        body: JSON.stringify({
            text: text
        })
    }).then(response => {
        return response
    })
        .then(responseJson => {
            if (typeof responseJson['error'] === "undefined") {
                document.querySelector(`#message${id} .message-text p`).textContent = text
            } else {
                alert_msg("Ошибка", responseJson["error"])
            }
        })
        .catch(error => {
            alert_msg("Ошибка", "" + "Обновите страницу")
        });
    document.querySelector('.msg-enter button').onclick = () => send_msg();
    document.querySelector(`.msg-print`).value = '';
}


function onchange_msg(id) {
    let text = document.querySelector(`#message${id} .message-text p`).textContent;
    document.querySelector('.msg-print').value = text;
    document.querySelector('.msg-print').focus();
    document.querySelector('.msg-enter button').onclick = () => change_msg(id);
}