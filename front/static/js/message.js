const host = window.location.origin + '/'
 
let owner = ''
let chatSocket;
let dialogSocket;
 
window.onload = () => {
    if (document.querySelector('main').id !== "") {
        getDialogs(document.querySelector('main').id)
        open_dialog(document.querySelector('main').id)
    } else {
        getDialogs()
    }
}
 
function getDialogs(id = null) {
    dialogSocket = new WebSocket(
        'ws://'
        + window.location.host
        + '/ws/'
    );
    console.log(22)
    dialogSocket.onmessage = function (e) {
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
                while (document.querySelector(".dialogs").childNodes.length !== 0) {
                    document.querySelector(".dialogs").childNodes.forEach(el => {
                        document.querySelector(".dialogs").removeChild(el);
                    })
                }
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
                        tmp.querySelector(".last-msg-time").textContent = el.last_msg_time.split('T')[1].split(':').slice(0,2).join(':');
                    }
                    document.querySelector(".dialogs").appendChild(tmp);
                })
                document.querySelector(".messages_inner").scrollTop = document.querySelector(".messages_inner").scrollHeight
            }
        })
 
    }
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
                        tmp.querySelector(".last-msg-time").textContent = el.last_msg_time.split('T')[1].split(':').slice(0,2).join(':');
                    }
                    document.querySelector(".dialogs").appendChild(tmp);
                })
                document.querySelector(".messages_inner").scrollTop = document.querySelector(".messages_inner").scrollHeight
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
                    tmp.querySelector("img").onclick = () => {
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
                    'ws://'
                    + window.location.host
                    + '/ws/'
                    + id
                    + '/'
                );
                console.log(window.location.host)
                chatSocket.onmessage = function (e) {
                    const data = JSON.parse(e.data)
                    console.log(data)
                    if (data.type === 'chat_message') {
                        let template = document.querySelector("#message");
                        let tmp = template.content.cloneNode(true);
                        tmp.querySelector('.message-text p').innerHTML = data.message;
                        tmp.querySelector('.comment-avatar').src = host + 'media/' + data.photo;
                        tmp.querySelector('.msg-time').textContent = data.creation_date.split('T')[1].split(':').slice(0,2).join(':')
                        if (owner === data.sender) {
                            tmp.querySelector('.message').style.alignSelf = 'flex-end';
                            tmp.querySelector('.message').style.flexDirection = 'row-reverse';
                            tmp.querySelector('.message-text').style.cursor = 'pointer';
                            tmp.querySelector('.message-text').onclick = () => onchange_msg(data.id);
                            tmp.querySelector('.delete-msg').style.display = 'unset';
                            tmp.querySelector('.change').style.right = 'unset';
                            tmp.querySelector('.change').style.left = '0';
                        }
                        tmp.querySelector("img").onclick = () => {
                            location = host + data.sender;
                        }
                        tmp.querySelector('.message').id = 'message' + data.id
                        try {
                            document.querySelector(".messages_inner").insertBefore(tmp, document.querySelector('.message:last-child').nextSibling);
                        } catch (TypeError) {
                            document.querySelector(".messages_inner").appendChild(tmp);
                        }
                        document.querySelector(".messages_inner").scrollTop = document.querySelector(".messages_inner").scrollHeight
                    } else if (data.type === 'del_message') {
                        document.querySelector(`#message${data.id}`).remove()
                    } else if (data.type === 'change_message') {
                        document.querySelector(`#message${data.id} .message-text p`).textContent = data.message
                        document.querySelector(`#message${data.id} .change`).textContent = "изм"
                    }
                    updateDialogs(id)
                }
 
                chatSocket.onclose = function (e) {
                    console.log('onclose')
                    chatSocket = new WebSocket(
                        'ws://'
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
                    tmp.querySelector('.msg-time').textContent = el.creation_date.split('T')[1].split(':').slice(0,2).join(':')
                    if (responseJson.owner === el.sender) {
                        tmp.querySelector('.message').style.alignSelf = 'flex-end';
                        tmp.querySelector('.message').style.flexDirection = 'row-reverse';
                        tmp.querySelector('.message-text').style.cursor = 'pointer';
                        tmp.querySelector('.message-text').onclick = () => onchange_msg(el.id);
                        tmp.querySelector('.delete-msg').style.display = 'unset';
                        tmp.querySelector('.change').style.right = 'unset';
                        tmp.querySelector('.change').style.left = '0';
                    }
                    if (Date.parse(el.update_date) !== Date.parse(el.creation_date)) {
                        tmp.querySelector('.change').textContent = "изм"
                    }
                    tmp.querySelector("img").onclick = () => {
                        location = host + el.sender;
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
    if (value !== '') {
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
                        'action': 'chat_message',
                        'message': value,
                        'photo': responseJson.photo,
                        'sender': responseJson.sender,
                        'id': responseJson.id,
                        'creation_date': responseJson.creation_date
                    }))
                    dialogSocket.send(JSON.stringify({
                        'action': 'new_dialog'
                    }))
                    document.querySelector('.msg-print').value = '';
                } else {
                    alert_msg("Ошибка", responseJson["error"])
                }
            })
    }
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
                        tmp.querySelector(".last-msg-time").textContent = el.last_msg_time.split('T')[1].split(':').slice(0,2).join(':');
                    }
                    document.querySelector(".dialogs").appendChild(tmp);
                })
            } else {
                alert_msg("Ошибка", responseJson["error"])
            }
        })
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
                chatSocket.send(JSON.stringify({
                    'action': 'del_message',
                    'id': id
                }))
            }
        })
}
 
 
function change_msg(id) {
    const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
    let text = document.querySelector(`.msg-print`).value
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
                chatSocket.send(JSON.stringify({
                    'action': 'change_message',
                    'id': id,
                    'message': text
                }))
            }
        })
    document.querySelector('.msg-print').removeEventListener('keydown', change_msg_listener);
    document.querySelector('.msg-print').addEventListener('keydown', send_msg_listener);
    document.querySelector('.msg-enter button').onclick = () => send_msg();
    document.querySelector(`.msg-print`).value = '';
    document.querySelector('.msg-edit').classList.add('none');
}
 
let my_id = 0
let send_msg_listener = function (e) {
    if (e.keyCode === 13) {
        send_msg();
    }
}
 
 
let change_msg_listener = function (e) {
    if (e.keyCode === 13) {
        change_msg(my_id);
    }
}
 
window.addEventListener("load", function (event) {
    document.querySelector('.msg-print').addEventListener('keydown', send_msg_listener);
});
 
function onchange_msg(id) {
    document.querySelector('.msg-edit').classList.remove('none');
    let text = document.querySelector(`#message${id} .message-text p`).textContent;
    document.querySelector('.msg-print').value = text;
    document.querySelector('.msg-print').focus();
    document.querySelector('.msg-enter button').onclick = () => change_msg(id);
    my_id = id
    document.querySelector('.msg-print').removeEventListener('keydown', send_msg_listener);
    document.querySelector('.msg-print').addEventListener('keydown', change_msg_listener);
}