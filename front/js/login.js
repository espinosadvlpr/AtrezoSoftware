function sendLogin() {
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    fetch('http://localhost:3050/admin')
        .then(response => response.json())
        .then(data => {
            console.log(data);
            for (let value of data) {
                if (email === value.email && password === value.password && value.tipoPersona === 'A') {
                    sesion(value.nombres)
                    window.location = "home/index.html";
                }
            }
        })
}

function sesion(user) {
    sessionStorage.clear()
    if (window.sessionStorage) {
        sessionStorage.setItem("user", user);
        var user = sessionStorage.getItem("user");
        //sessionStorage.removeItem("user");
    }
}