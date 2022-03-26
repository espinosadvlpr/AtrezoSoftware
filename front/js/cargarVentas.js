/**
 * Se establece fecha maxima la fecha actual
 * @returns 
 */
function setCurrentDate() {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    today = yyyy + '-' + mm + '-' + dd;
    document.getElementById("fecha_venta").max = "" + today;
    return today;
}

function cargaPrincipal() {
    setCurrentDate();
    let fecha = document.getElementById("fecha_venta").value;
    console.log("Fecha actual!!!! " + fecha);
    if (Object.keys(fecha).length != 0) {
        console.log("HAY UNA FECHA");
        peticionTodasLasVentas(fecha);
        ventasYGastos();
    }
}


function ventasYGastos() {
    let ventas = 0;
    let compras = 0;
    peticionUtilidades('V', document.getElementById("fecha_venta").value).then(response => {
        console.log("Ventas del dia: " + ventas);
    }).catch(e => {
        ventas = e;
        console.log(e);
        document.getElementById("ventas_totales").innerHTML = "$ " + e;
    });
    peticionUtilidades('C', document.getElementById("fecha_venta").value).then(response => {
        console.log("Compras del dia: " + compras);
    }).catch(e => {
        console.log(e);
        compras = e;
        document.getElementById("gastos_totales").innerHTML = "$ " + e;
        document.getElementById("utilidad").innerHTML = "$ " + (ventas - compras);
    });
    console.log('Ventas: ' + ventas + ' Compras: ' + compras);
    //let utilidad = ventas - compras;
}

function peticionUtilidades(type, fecha) {
    return new Promise((resolve, reject) => {
        fetch(`http://localhost:3050/utilidades/${fecha}/${type}`)
            .then(response => response.json())
            .then(data => {
                if (data[0].Total == undefined) {
                    return 0;
                } else {
                    return data[0].Total;
                }
            })
            .then(error => {
                return reject(error);
            })
    });
}

function peticionTodasLasVentas(fecha) {
    return new Promise((resolve, reject) => {
        fetch('http://localhost:3050/ventas/' + fecha)
            .then(response => response.json())
            .then(data => {
                agruparVentas(data);
                return resolve(data);
            })
            .then(error => {
                return reject(error);
            })
    });
}

function agruparVentas(data) {
    var currentValue = data[0].idFactura;
    let listaProductos = '';
    let currentTransaction = data[0].tipoTransaccion;
    let subTotalVenta = 0;
    let i = 0;
    var currentFacture=[];
    for (let value of data) {
        i++;
        if (value.idFactura == currentValue) {
            value.precioProducto
            listaProductos += value.nombreProducto + ', ';
            subTotalVenta += value.SubTotal;
        } else if (value.idFactura != currentValue) {
            console.log(subTotalVenta + ' -- ** --');
            crearEtiquetaTransaction(subTotalVenta, currentTransaction, listaProductos, currentFacture);
            listaProductos = value.nombreProducto + ', ';
            subTotalVenta = 0;
            subTotalVenta += value.SubTotal;
            currentFacture = new Array();
        }
        currentFacture.push(value);
        if (i == data.length) {
            crearEtiquetaTransaction(subTotalVenta, value.tipoTransaccion, listaProductos, currentFacture);
        }
        currentValue = value.idFactura;
        currentTransaction = value.tipoTransaccion;
    }
}

function createObjetctToShowInFacture(currentProd) {
    var myProdInFacture = new Object();
    myProdInFacture.nombreProducto = currentProd.nombreProducto;
    myProdInFacture.cantidad = currentProd.cantidad;
    myProdInFacture.precioProducto = currentProd.precioProducto;
    myProdInFacture.SubTotal = currentProd.SubTotal;
    console.log("Objeto: " + myProdInFacture);
    return myProdInFacture;
}

function crearEtiquetaTransaction(total, tipoTransaccion, listaProductos, currentFacture) {
    var editar = `<a style="text-decoration:none" id="linkEditarProducto" onclick='abrirVentana2(${JSON.stringify(currentFacture)})' style="color:rgb(0, 0, 0);" >`;
    var clase = '<div class="lista-ventas">';
    var productos = '<h3 style="color:rgb(0, 0, 0);">' + listaProductos + '</h3>';
    var precio = '';
    if (tipoTransaccion == 'V') {
        precio = '<h3 style="color:rgb(76, 175, 80);">  $ ' + total + ' COP</h3>';
    } else {
        precio = '<h3 style="color:rgb(175, 76, 76);">  $ ' + total + ' COP</h3>';
    }
    var cerrarDiv = editar + clase + productos + precio + '</div> </a>';
    $('#ListaDeVentas').append(cerrarDiv);
    console.log("Se creo la etiqueta!!");
}

/**
 * Llena la tabla de factura para una venta en particular
 * @param {*} listToShow lista de lo que se va a mostrar
 */
function llenarTabla2(listToShow) {
    $(".iProd").remove();
    let totalFactura = 0;
    for (const CProd of listToShow) {
        var tr = `<tr class="iProd">
          <td>`+ CProd.nombreProducto + `</td>
          <td>`+ CProd.cantidad + `</td>
          <td>`+ CProd.precioProducto + `</td>
          <td>`+ CProd.SubTotal + `</td>
        </tr>`;
        $("#cuerpo").append(tr);
        totalFactura += CProd.SubTotal;
    }
    insertPerson(listToShow[0].tipoTransaccion , listToShow[0].Person);
    document.getElementById("totalFactura").innerHTML = "Total: " + totalFactura;
}

/**
 * Se muestra un cliente, un proveedor o NO SELECCIONADO
 * @param {*} tipoTransaccion Venta o compra
 */
function insertPerson(tipoTransaccion , Persona){
    document.getElementById("personaFactura").innerHTML = "";
    console.log("Persona: " + Persona);
    if(Persona != null){
        if(tipoTransaccion == 'V'){
            document.getElementById("personaFactura").innerHTML = "Cliente: " + Persona;
        }else {
            document.getElementById("personaFactura").innerHTML = "Proveedor: " + Persona;
        }
    }
}

/**
 * 
 * @param {*} listToShow 
 */
function abrirVentana2(listToShow) {
    document.getElementById("ventana").style.display = "block";
    document.getElementById("main").classList.add("desenfoque");
    llenarTabla2(listToShow);

}

function recargarPagina() {
    console.log("Click en el boton recargar!!!");
    //$("#main-content").load('listaVentas.html');
    window.location.reload();
}

