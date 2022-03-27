const host = window.location.origin + '/'

function getCookie(name) {
    let matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}

if (getCookie('sessionid') !== undefined) {
    location = host;
}

function login_form() {
    document.querySelector('.register_form').style.display = 'none';
    document.querySelector('.login_form').style.display = 'unset';
}

function register_form() {
    document.querySelector('.login_form').style.display = 'none';
    document.querySelector('.register_form').style.display = 'unset';
}

fetch(host + `api/user/`, {
    method: 'GET',
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
    },
}).then(response => {
    if (response.status === 200) {
        location = host
    }
})

function register() {
    let email = document.querySelector("#email").value;
    let username = document.querySelector("#username").value;
    let password = document.querySelector("#password").value;
    let password2 = document.querySelector("#password2").value;
    if (password === password2) {
        fetch(host + 'api/register/', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'email': email,
                'username': username,
                'password': password
            }),
        }).then(response => response.json())
            .then(responseJson => {
                if (typeof responseJson['id'] !== "undefined") {
                    setTimeout(function () {
                        location = host + 'login';
                    }, 2000)
                    document.querySelector('#ex1').textContent = 'Registered successful';
                } else {
                    let a = ''
                    Object.keys(responseJson).forEach(el => {
                        a += responseJson[el].toString().replace('This', el) + '<br>'
                        console.log(a, el)
                    })
                    document.querySelector('#ex1').innerHTML = a;
                }
                document.querySelector('main p a').click();
            })

    } else {
        alert('Пароли разные')
    }
}

function login() {
    let email = document.querySelector("#email_l").value;
    let password = document.querySelector("#password_l").value;
    fetch(host + 'api/login/', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({'email': email, 'password': password}),
    }).then(response => response)
        .then(responseJson => {
            if (responseJson.status !== 400) {
                location = host;
            } else {
                document.querySelector('#ex1').innerHTML = 'Неверный логин или пароль';
                document.querySelector('main p a').click();
            }
        })
}
