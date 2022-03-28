const nuevaVenta = require("../js/nuevaVenta.js");
const jsdom = require("jsdom");
var myProd = new Object();

describe('Petitions', () => {

    it('originalList should be greater than zero', () => {
        let listProdcuts = 0;
        let promise = nuevaVenta.allProducts();
        promise.then((val) => {
            console.log('asynchronously executed: ');
            listProdcuts = nuevaVenta.originalList.length;
            expect(listProdcuts).toEqual(0);
        }).catch((err) => {
            console.log('asynchronously executed: ' + err);
        }).finally(() => {
            console.log('promise done executing');
        });
    });

});


describe('Elementos', () => {

    it('selectedList Should be 0', () => {
        myProd.cantidadAComprar = 0;
        nuevaVenta.selectedlList.push(myProd);
        nuevaVenta.clearList();
        expect(nuevaVenta.selectedlList.length).toEqual(0);
    });

    it('totalSale Should be 3000', () => {
        myProd.cantidadAComprar = 3;
        myProd.precioProd = 1500;
        nuevaVenta.selectedlList.push(myProd);
        let totalSale = nuevaVenta.getTotalProductsSelect();
        expect(totalSale).toEqual(4500);
    });

    it('elements by class should be 1', () => {
        document.body.innerHTML = '<div id="contenedor"></div>';
        nuevaVenta.crearEtiqueta(myProd);
        var divs = document.getElementsByClassName("target").length;
        expect(divs).toEqual(1);
    });

});
