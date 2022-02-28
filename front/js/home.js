window.onload = validateUser();

function validateUser(){
    if(window.sessionStorage){
        var user = sessionStorage.getItem("user")
        if(user == null){
            window.location = '../index.html'
        }else{
            getUser()
        }
    }
}

function getUser() {
    var h1 = document.getElementById("User")
    if (window.sessionStorage) {
        var user = sessionStorage.getItem("user");
        var bienvenida = "Hola " + user
        h1.textContent = bienvenida
            //sessionStorage.removeItem("user");
    }
}
