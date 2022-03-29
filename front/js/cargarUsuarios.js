function cargarTodosLosUsuarios() {
    peticionTodosLosUsuarios()
        //.then(cargarCategorias2())
        .then(crearBuscador);
}

/**
 * Peticion de una lista de todos los ususarios
 * @returns lista de todos los ususarios
 */
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

/**
 * Se crea un buscador con la informacion de las tarjetas
 */
function crearBuscador() {
    document.addEventListener("keyup", e => {
        if (e.target.matches("#searchUser")) {
            if (e.key === "Escape") e.target.value = ""
            document.querySelectorAll(".lista-usuarios").forEach(producto => {
                producto.textContent.toLowerCase().includes(e.target.value.toLowerCase()) ?
                    producto.classList.remove("filtro") :
                    producto.classList.add("filtro")
            })
        }
    })
}

/**
 * Se crea una tarjeta para cada uno de los usuarios de la lista
 * @param {*} data lista de uauarios
 */
function mostrarTodosLosUsuarios(data) {
    var cabecera = '<div class = "lista-usuarios"><table class="default"><tr><th>Usuario</th><th>Tipo usuario</th><th>Accion</th></tr>'
    for (let value of data) {
        var TextJSON = JSON.stringify(value) + '';
        var nombreUsuario = '<td><p style="color:rgb(0, 0, 0);">' + value.nombres + ' ' + value.Apellidos + '</p></td>';
        var tipoUsuario = '<td><p style="color:rgb(120, 120, 120);">' + obtenerTipoPersona(value.tipoPersona) + '</p></td>';
        var editar = '<td><p><a id="linkEditarUsuario" href="./editar_usuario.html" onClick=\'cambiarIdUsuario(' +
            TextJSON + ');\' style="color:rgb(0, 0, 0);" > Editar</a></p></td>';
        var tabla = '<tr>' + nombreUsuario + tipoUsuario + editar + '</tr>'
        cabecera += tabla
    }
    cabecera += '</table></div>'
    console.log(cabecera)
    $('#contenedor').append(cabecera);
}

/**
 * Devuelve un tipo de ususario para cada tipo
 * @param {*} tipoPersona 
 * @returns Administradro cliente, etc
 */
function obtenerTipoPersona(tipoPersona) {
    if (tipoPersona == 'A') {
        return 'Administrador';
    } else if (tipoPersona == 'C') {
        return 'Cliente';
    } else if (tipoPersona == 'E') {
        return 'Empleado';
    } else if (tipoPersona == 'P'){
        return 'Proveedor';
    }else {
        return 'Sin tipo de ususario!!';
    }
}

/**
 * Cambio de html
 */
function chageToAddUser() {
    window.location = "./agregarUsuario.html";
}

/**
 * Valida que los campos 1 y 2 de contraseñas coinicida
 * @returns true si las contrasenas coinciden
 */
function matchPassword() {
    let verifyPasswords = verifyPasswords();
    if(verifyPasswords != true){
        alert("Las contraseñas no conciden!!");
        event.preventDefault();
    }else {
        alert("Usuario registrado.");
        history.back();
    }
    return verifyPasswords;
}

/**
 * Verifica que las dos contrasenas coinciden
 * @returns true si los campos coinciden
 */
function verifyPasswords() {
    var pw1 = document.getElementById("password").value;
    var pw2 = document.getElementById("repeat-password").value;
    if(pw1 == pw2 && pw1.length > 6 ){
        return true;
    }
    return false;
}

/**
 * Se selecciona un usuario para mostralo
 * @param {*} usuarioActual 
 */
function cambiarIdUsuario(usuarioActual) {
    console.log('Se guaradron atributos: ' + JSON.stringify(usuarioActual));
    localStorage.setItem("usuarioActual", JSON.stringify(usuarioActual));
}

/**
 * Carga los atributos del ususario seleccionado
 */
function cargarUsuarioSeleccionado() {
    var retrievedObject = localStorage.getItem('usuarioActual');
    var objetoUsuario = JSON.parse(retrievedObject)
    console.log('Objeto Persona guardado: ', objetoUsuario);
    document.getElementById("nombres").value = objetoUsuario.nombres;
    document.getElementById("Apellidos").value = objetoUsuario.Apellidos;
    document.getElementById("Tipo_usuario").value = objetoUsuario.tipoPersona;
    document.getElementById("telefono").value = objetoUsuario.telefono;
    document.getElementById("Email").value = objetoUsuario.email;
    document.getElementById("direccion").value = objetoUsuario.direccion;
    document.getElementById("password").value = objetoUsuario.password;
    document.getElementById("repeat-password").value = objetoUsuario.password;
    document.getElementById("userID").value = objetoUsuario.idPersona;
}

/**
 * Se utiliza el atributo LocalStorage para eliminar un producto
 */
function eliminarProducto() {
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

module.exports = {
    "verifyPasswords" : verifyPasswords
}