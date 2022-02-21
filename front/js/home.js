window.onload = function getUser() {
    var h1 = document.getElementById("User")
    if (window.sessionStorage) {
        var user = sessionStorage.getItem("user");
        var bienvenida = "Hola " + user
        h1.textContent = bienvenida
            //sessionStorage.removeItem("user");
    }
}