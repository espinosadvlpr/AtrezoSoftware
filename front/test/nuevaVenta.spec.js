const nuevaVenta = require("../js/nuevaVenta.js");
const jsdom = require("jsdom");
const myProd = new Object();
myProd.imagenProducto = '';
myProd.nombreProducto = 'Aceite cadenol';
myProd.cantidadDisponible = 2;
myProd.precioDeVenta = 5000;
myProd.precioDeCompra = 4500;
myProd.codigoProducto = 123;
nuevaVenta.originalList.push(myProd);

describe('Petitions', () => {

    /**
     * Se realiza la peticion de la lista de productos al servidor
     * por lo que la lista debe ser mayor a 0
     */
    it('should be greater than zero', () => {
        let listProdcuts = 0;
        let promise = nuevaVenta.allProducts();
        promise.then((val) => {
            console.log('asynchronously executed: ' + val);
            listProdcuts = nuevaVenta.originalList.length;
            expect(listProdcuts).toBeGreaterThan(0);
        }).catch((err) => {
            console.log('asynchronously executed: ' + err);
        }).finally(() => {
            console.log('promise done executing');
        });
    });

});


describe('Elementos', () => {

    /**
     * Elemento creado como constante 
     */
    it('Should be 1', () =>{
        expect(nuevaVenta.originalList.length).toEqual(1);
    });
    
    /**
     * Tipo de transaccion venta
     */
     it('Should be V', () =>{
        expect(nuevaVenta.tipoTransaccionActual).toEqual('V');
    });

    /**
     * Se crea un elemnto con nombre de clase target
     * Entonces la cantidad de elementos de esa clase debe ser 1
     */
    it('should be 1', () => {
        document.body.innerHTML = '<div id="contenedor"></div>';
        nuevaVenta.crearEtiqueta(myProd);
        var divs = document.getElementsByClassName("target").length;
        expect(divs).toEqual(1);
    });

});
