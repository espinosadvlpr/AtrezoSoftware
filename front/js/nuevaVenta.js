var originalList = []
var selectedlList = []

function cargarTodo() {
    let promise = allProducts();
    promise.then((val) => {
        console.log('asynchronously executed: ' + val);
        crearBuscador();
    }).catch((err) => {
        console.log('asynchronously executed: ' + err);
    }).finally(() => {
        console.log('promise done executing');
    });
}

function crearBuscador() {
    console.log("Cargadando Buscador..")
    document.addEventListener("keyup", e => {
        if (e.target.matches("#gsearch")) {
            if (e.key === "Escape") e.target.value = ""
            document.querySelectorAll(".target").forEach(producto => {
                producto.textContent.toLowerCase().includes(e.target.value.toLowerCase()) ?
                    producto.classList.remove("filtro") :
                    producto.classList.add("filtro")
            })
        }
    })
}

function cambiarANuevaVenta() {
    window.location = "./nuevaVenta.html";
}

function allProducts() {
    return new Promise((resolve, reject) => {
        fetch('http://localhost:3050/product')
            .then(response => response.json())
            .then(data => {
                console.log('Productos traidos del servidor');
                showAllProducts(data);
                return resolve(data);
            })
            .then(error => {
                return reject(error);
            })
    });
}

function showAllProducts(data) {
    originalList = data;
    for (let value of data) {
        var editar = '<a class="target" id="linkEditarProducto" style="color:rgb(0, 0, 0);" >';
        var clase = '<div class="containerNV">';
        var image = '<div class="center"> <img src="../producto/productos/images/' + value.imagenProducto
            + '" width="260" height="150" class="imgProduct2"> </img> </div>';
        var nombreProducto = ' <div class="lefth"> <h2 style="color:rgb(0, 0, 0);">' + value.nombreProducto + '</h2>';
        var cantidadDisponible = '<p style="color:rgb(120, 120, 120);">' + value.cantidadDisponible + ' disponibles</p>';
        var precio = '<h4 style="color:rgb(60, 60, 60);">  $ '
            + value.precioDeVenta + ' COP</h4> </div>';
        var cantidadAgregar = '<div class="rigthInput">' +
            '<input type="number" onchange="cambiarValorVenta(' + value.codigoProducto + ')"'
            + 'class="quantityProduct" id="' + value.codigoProducto + '"'
            + 'name="quantity" min="0" max="'
            + value.cantidadDisponible + '"></input> </div>';
        var cerrarDiv = editar + clase + image + nombreProducto + cantidadDisponible + precio + cantidadAgregar + '</div> </a>';
        $('#contenedor').append(cerrarDiv);
    }
}

function cambiarValorVenta(codeIdCurrentProd) {
    for (let cProduct of originalList) {
        let idCProd = cProduct.codigoProducto;
        if (idCProd == codeIdCurrentProd) {
            if (yaExiste(idCProd) == false) {
                console.log('Ya existe');
                var myProd = new Object();
                myProd.codigoProducto = idCProd;
                myProd.precioDeVenta = cProduct.precioDeVenta;
                myProd.cantidadAComprar = document.getElementById(idCProd).value;
                myProd.nombreProducto = cProduct.nombreProducto;
                selectedlList.push(myProd);
            }
        }
    }
    updateTotalValue();
}

function abrirVentana() {
    clearList();
    if (selectedlList.length > 0) {
        document.getElementById("ventana").style.display = "block";
        document.getElementById("main").classList.add("desenfoque");
        llenarTabla();
    }
}

function cerrarVentana() {
    document.getElementById("ventana").style.display = "none";
    document.getElementById("main").classList.remove("desenfoque");
}

function yaExiste(idProd) {
    for (let cProd of selectedlList) {
        if (cProd.codigoProducto == idProd) {
            cProd.cantidadAComprar = document.getElementById(idProd).value;
            return true;
        }
    }
    updateTotalValue();
    return false;
}

function updateTotalValue() {
    let total = 0;
    for (let cProd of selectedlList) {
        total += cProd.precioDeVenta * cProd.cantidadAComprar;
    }
    console.log('Total: ' + total);
    document.getElementById('botonNuevaVenta').firstChild.data = 'Nueva venta $ ' + total;
    document.getElementById('botonConfirmarVenta').firstChild.data = 'Confirmar venta $ ' + total;
}

function llenarTabla() {
    $(".iProd").remove();
    for (const CProd of selectedlList) {
        if (CProd.cantidadAComprar > 0) {
            var tr = `<tr class="iProd">
          <td>`+ CProd.nombreProducto + `</td>
          <td>`+ CProd.cantidadAComprar + `</td>
          <td>`+ CProd.precioDeVenta + `</td>
          <td>`+ (CProd.cantidadAComprar * CProd.precioDeVenta) + `</td>
        </tr>`;
            $("#cuerpo").append(tr);
        }
    }
}

function sendSelectProducts() {
    if (selectedlList.length > 0) {
        var url = 'http://localhost:3050/add_sale';
        fetch(url, {
            method: 'POST', 
            body: JSON.stringify(selectedlList),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => res.json())
        .then(data => {
                alert("Venta realizada correctamente.");
                window.location = "./listaVentas.html";
            })
            .then(error => {
                alert("No se pudo generar la venta!!!");
                console.log(error);
                return reject(error);
            });
        }
}
/**
 * Limpia de la lista de los elemntos que fueron seleccionados pero
 * que la cantidad a comprar es 0
 */
function clearList() {
    for (let i = 0; i < selectedlList.length; i++) {
        const cProd = selectedlList[i];
        if (cProd.cantidadAComprar <= 0) {
            selectedlList.splice(i, 1);
        }
    }
}