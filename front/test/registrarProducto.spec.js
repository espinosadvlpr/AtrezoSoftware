const cargarProductos = require("../js/cargarProductos.js");

describe('Productos', () => {

    it('The sale price must be greater than 20%', () => {
        document.body.innerHTML = '<input type="number" id="precioDeVenta">' 
        + '<input type="number" id="precioDeCompra">';
        var precioCompra = document.getElementById("precioDeCompra");
        var precioVenta = document.getElementById("precioDeVenta");
        precioCompra.value = 5000;
        cargarProductos.sumarPorcentaje();
        expect(parseFloat(precioVenta.value)).toEqual(6000);
    });

    it('The sale price must be greater than 5% of the purchase price', () => {
        document.body.innerHTML = '<input type="number" id="precioDeVenta">' 
        + '<input type="number" id="precioDeCompra">';
        var precioCompra = document.getElementById("precioDeCompra");
        var precioVenta = document.getElementById("precioDeVenta");
        precioCompra.value = 5000;
        cargarProductos.sumarPorcentaje();
        expect(parseFloat(precioVenta.min)).toEqual(5250);    
    });

});