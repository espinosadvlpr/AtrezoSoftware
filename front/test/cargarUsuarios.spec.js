const cargarProductos = require("../js/cargarUsuarios.js");

describe('Usuarios', () => {

    it('Must be false because there are no passwords', () => {
        document.body.innerHTML = '<input id="password" type="password">' 
        + '<input id="repeat-password" type="password">';
        let passwordCorrect = cargarProductos.verifyPasswords();
        expect(passwordCorrect).toBeFalsy();
    });

    it('Must be false because it Must contain at least 6 characters', () => {
        document.body.innerHTML = '<input id="password" type="password">' 
        + '<input id="repeat-password" type="password">';
        document.getElementById("password").value = "Omar";
        document.getElementById("repeat-password").value = "Omar";
        let passwordCorrect = cargarProductos.verifyPasswords();
        expect(passwordCorrect).toBeFalsy();
    });

    it('Must be true because the passwords match the format', () => {
        document.body.innerHTML = '<input id="password" type="password">' 
        + '<input id="repeat-password" type="password">';
        document.getElementById("password").value = "OmarCianito";
        document.getElementById("repeat-password").value = "OmarCianito";
        let passwordCorrect = cargarProductos.verifyPasswords();
        expect(passwordCorrect).toBeTruthy();
    });

});