function cargarTodosLosUsuarios() {
    peticionTodosLosUsuarios()
        //.then(cargarCategorias2())
        .then(crearBuscador);
}

function peticionTodosLosUsuarios() {
    return new Promise((resolve, reject) => {
        fetch('http://localhost:3050/users')
            .then(response => response.json())
            .then(data => {
                console.log('Usuarios traidos del servidor');
                mostrarTodosLosUsuarios(data);
                return resolve(data);
            })
            .then(error => {
                return reject(error);
            })
    });
}

function crearBuscador() {
    document.addEventListener("keyup", e => {
        if (e.target.matches("#searchUser")) {
            if (e.key === "Escape") e.target.value = ""
            document.querySelectorAll(".lista-usuarios").forEach(producto => {
                producto.textContent.toLowerCase().includes(e.target.value.toLowerCase())
                    ? producto.classList.remove("filtro")
                    : producto.classList.add("filtro")
            })
        }
    })
}

function mostrarTodosLosUsuarios(data) {
    for (let value of data) {
        var TextJSON = JSON.stringify(value) + '';
        var editar = '<a id="linkEditarUsuario" href="./editar_usuario.html" onClick=\'cambiarIdUsuario('
            + TextJSON + ');\' style="color:rgb(0, 0, 0);" >';
        var clase = '<div class="lista-usuarios">';
        var nombreUsuario = '<h3 style="color:rgb(0, 0, 0);">' + value.nombres + ' ' + value.Apellidos + '</h3>';
        var tipoUsuario = '<p style="color:rgb(120, 120, 120);">' + obtenerTipoPersona(value.tipoPersona) + '</p>';
        var cerrarDiv = editar + clase + nombreUsuario + tipoUsuario + '</div> </a>';
        $('#contenedor').append(cerrarDiv);
    }
}

function obtenerTipoPersona(tipoPersona) {
    if (tipoPersona == 'A') {
        return 'Administrador';
    } else if (tipoPersona == 'C') {
        return 'Cliente';
    } else if (tipoPersona == 'E') {
        return 'Empleado';
    } else {
        return 'Sin tipo de ususario!!';
    }
}

function chageToAddUser() {
    window.location = "./agregarUsuario.html";
}

function matchPassword() {
    var pw1 = document.getElementById("password").value;
    var pw2 = document.getElementById("repeat-password").value;
    if (pw2.length < 6) {
        alert("Ingrese una contraseña con al menos 7 caracteres!!");
        event.preventDefault();
    } else if(pw1 != pw2 ){
        alert("Las contraseñas no conciden!!");
        event.preventDefault();
    }else {
        return true;
    }
}

function cambiarIdUsuario(usuarioActual){
    console.log('Se guaradron atributos: ' + JSON.stringify(usuarioActual));
    localStorage.setItem("usuarioActual", JSON.stringify(usuarioActual));
}

function cargarUsuarioSeleccionado() {
    var retrievedObject = localStorage.getItem('usuarioActual');
    var objetoUsuario = JSON.parse(retrievedObject)
    console.log('Objeto Persona guardado: ', objetoUsuario);
    document.getElementById("nombres").value=objetoUsuario.nombres;
    document.getElementById("Apellidos").value=objetoUsuario.Apellidos;
    document.getElementById("Tipo_usuario").value=objetoUsuario.tipoPersona;
    document.getElementById("telefono").value=objetoUsuario.telefono;
    document.getElementById("Email").value=objetoUsuario.email;
    document.getElementById("direccion").value=objetoUsuario.direccion;
    document.getElementById("password").value=objetoUsuario.password;
    document.getElementById("repeat-password").value=objetoUsuario.password;
    document.getElementById("userID").value=objetoUsuario.idPersona;
}

/**
 * Se utiliza el atributo LocalStorage para eliminar un producto
 */
 function eliminarProducto(){
    if (window.confirm("Realmente desea eliminar este usuario?")) {
        var retrievedObject = localStorage.getItem('usuarioActual');
        var objetoUsuario = JSON.parse(retrievedObject)
        fetch('http://localhost:3050/delete_user/' + objetoUsuario.idPersona, {
            method: 'DELETE',
        })
        .then(res => res.text()) // or res.json()
        .then(res => window.location = "./lista_ususarios.html")
    }
}