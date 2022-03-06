const host = "https://messenger-by-best-html-dev.herokuapp.com/"

show()

function show() {
    fetch(host + `api/user/`, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
    }).then(response => {
        return response.json()
    })
        .then(responseJson => {
            if (typeof responseJson['error'] === "undefined") {
                console.log(document.querySelector('.data-input input:nth-child(1)'))
                document.querySelector('.data-input input:nth-child(1)').value = responseJson.user.name
                document.querySelector('.data-input input:nth-child(2)').value = responseJson.user.surname
                document.querySelector('.data-input input:nth-child(3)').value = responseJson.user.age
                let photo = responseJson.user.photo
                if (photo !== null) {
                    document.querySelector('.photo img').src = photo
                }
                responseJson.articles.forEach(el => {
                    let template = document.querySelector("#article");
                    let tmp = template.content.cloneNode(true);
                    tmp.querySelector(".article").id = "article" + el.id;
                    tmp.querySelector(".header").innerHTML = el.header;
                    tmp.querySelector(".text").innerHTML = el.text;
                    el.comments.forEach(comment => {
                        let template_comment = document.querySelector("#comments");
                        let tmp_comment = template_comment.content.cloneNode(true);
                        tmp_comment.querySelector(".comment-name").innerHTML = comment.name;
                        tmp_comment.querySelector(".comment img").src = comment.photo
                        tmp_comment.querySelector(".comment-text").innerHTML = comment.text;
                        tmp.querySelector(".comments").appendChild(tmp_comment);
                    })
                    document.querySelector(".articles").appendChild(tmp)
                })
                document.querySelector('.page').classList.remove('preloader')
            } else {
                alert_msg("Ошибка", responseJson["error"])
            }
        })
        .catch(error => {
            location = host + 'login/'
        });
}

function patchUser(patch) {
    const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
    fetch(host + `api/user/`, {
        method: 'PUT',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken,
        },
        body: JSON.stringify(JSON.parse(`{"${patch.classList[0]}": "${patch.value}"}`)),
    }).then(response => {
        return response
    })
        .then(responseJson => {
            if (typeof responseJson['error'] === "undefined") {
                console.log(responseJson)
            } else {
                alert_msg("Ошибка", responseJson["error"])
            }
        })
        .catch(error => {
            alert_msg("Ошибка", "" + "Обновите страницу")
        });
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

window.onload = () => {
    document.getElementById("upload").onchange = upload_change;
    const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;

    async function upload_change() {
        let formData = new FormData();
        formData.append('file', document.getElementById("upload").files[0]);
        send_file(csrftoken, formData);
    }
}

function upload_file() {
    document.querySelector('.input-file-area').style.opacity = '1';
    document.querySelector('.popup-fade').style.opacity = '0.9';
    document.querySelector('.popup-fade').style.zIndex = '9999';
    document.querySelector('.esc').style.display = 'unset';
    document.querySelectorAll('.article').forEach(el => el.style.zIndex = '1');
    document.querySelector('header').style.zIndex = '100';
}

function close_input() {
    document.querySelector('.input-file-area').style.opacity = '0';
    document.querySelector('.popup-fade').style.opacity = '0';
    document.querySelector('.popup-fade').style.zIndex = '-2';
    document.querySelector('.esc').style.display = 'none';
    document.querySelectorAll('.article').forEach(el => el.style.zIndex = '10003');
    document.querySelector('header').style.zIndex = '10004';
}

function send_file(csrftoken, formData) {
    fetch(host + `api/user/`, {
        method: 'PUT',
        headers: {
            'X-CSRFToken': csrftoken,
        },
        body: formData,
    }).then(response => {
        return response
    })
        .then(responseJson => {
            if (typeof responseJson['error'] === "undefined") {
                document.querySelector('.popup-fade').style.opacity = '0';
                document.querySelector('.popup-fade').style.zIndex = '-2';
                document.querySelector('.input-file-area').style.opacity = '0';
                document.querySelector('.esc').style.display = 'none';
                document.querySelectorAll('.article').forEach(el => el.style.zIndex = '10003');
                document.querySelector('header').style.zIndex = '10004';
                show()
            } else {
                alert_msg("Ошибка", responseJson["error"])
            }
        })
        .catch(error => {
            alert_msg("Ошибка", "" + "Обновите страницу")
        });
}

function dropHandler(ev) {
    ev.preventDefault();
    if (ev.dataTransfer.items) {
        if (ev.dataTransfer.items[0].kind === 'file') {
            var file = ev.dataTransfer.items[0].getAsFile();
            const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
            let formData = new FormData();
            formData.append('file', file);
            send_file(csrftoken, formData)
        }
    } else {
        const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
        let formData = new FormData();
        formData.append('file', ev.dataTransfer.files[0]);
        send_file(csrftoken, formData)
    }
}

function dragOverHandler(ev) {
    ev.preventDefault();
}

function create_article() {
    const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
    let header = document.querySelector('.header-input').value;
    let text = document.querySelector('.textarea-input').value;
    if (header.trim() !== "" && text.trim() !== "") {
        fetch(host + 'api/article/', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken,
            },
            body: JSON.stringify({
                header: header,
                text: text
            })
        }).then(response => response.json())
            .then(responseJson => {
                if (typeof responseJson['error'] === "undefined") {
                    let template = document.querySelector("#article");
                    let tmp = template.content.cloneNode(true);
                    tmp.querySelector(".article").id = "article" + responseJson.id;
                    tmp.querySelector(".header").innerHTML = header;
                    tmp.querySelector(".text").innerHTML = text;
                    document.querySelector(".articles").appendChild(tmp);
                    document.querySelector('.header-input').value = "";
                    document.querySelector('.textarea-input').value = "";
                } else {
                }
            })
            .catch(error => {
                alert_msg("Ошибка", "Ошибка" + ", обновите страницу")
            });
    }
}

function delete_article(el) {
    const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
    fetch(host + `api/article/${el.parentNode.id.split('article')[1]}/`, {
        method: 'DELETE',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken,
        },

    }).then(response => response)
        .then(responseJson => {
            if (typeof responseJson['error'] === "undefined") {
                document.querySelector(".articles").removeChild(el.parentNode);
            } else {
            }
        })
        .catch(error => {
            alert_msg("Ошибка", "Ошибка" + ", обновите страницу")
        });
}