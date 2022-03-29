window.onload = function(){
    document.getElementById("email").focus();
}

function login(){ 
    let user_email = document.getElementById("email").value;
    let user_password = document.getElementById("password").value;
    const user_json = {email: user_email,password: user_password};

    sendLogin(user_json).then(data => {
        for (let value of data){
            sesion(value.nombres);
            window.location = 'home/index.html';
        }
    }).catch(error => {
        alert("El usuario o la contraseña son incorrectos, por favor intente nuevamente")
        cleanLogin()
        }
    );
}

function cleanLogin(){
    document.getElementById("email").value = "";
    document.getElementById("password").value = "";
}

async function sendLogin(user_json){
    const response = await fetch("http://3.84.226.84:3050/validate_login/",{
        method: 'POST',
        body: JSON.stringify(user_json),
        headers: {
            'Content-Type':'application/json'
        }
    });

    console.log(response.status);

    const data = await response.json();
    return data;
}

function sesion(user) {
    sessionStorage.clear()
    if (window.sessionStorage) {
        sessionStorage.setItem("user", user);
        var user = sessionStorage.getItem("user");
        //sessionStorage.removeItem("user");
    }
}
