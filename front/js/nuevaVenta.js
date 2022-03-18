var originalList = []
var selectedlList = []

 

function cargarTodo() {
    let promise = allProducts();
    promise.then((val) => {
        console.log('asynchronously executed: ' + val);
        crearBuscador();
        cargarCategorias();
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

function cargarCategorias() {
    console.log('Cargar categorias dossss');
    fetch('http://localhost:3050/categorias')
        .then(response => response.json())
        .then(data => {
            console.log(data);
            for (let value of data) {
                console.log(value.codigoCategoria + ' ' + value.nombreCategoria);
                var categoria = '<a class="item" style="color:#000000;" ' +
                    'onclick="cargarProductosPorCategoria(' + value.codigoCategoria + ')">' + value.nombreCategoria + ' </a>';
                $('#listaCategorias').append(categoria);
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

                showFirstCategoryProducts(data);
                return resolve(data);
            })
            .then(error => {
                return reject(error);
            })
    });
}

function showFirstCategoryProducts(data) {
    originalList = data;
    visibleProducts = Array(data.length);
    cargarProductosPorCategoria(originalList[0].idCategoria);
}

function mostrarTodosLosProductos() {
    mostradosActualmente = document.querySelectorAll(".target");
    originalList.forEach(cProd => {
        let isShowed = getTarget(cProd.nombreProducto , mostradosActualmente);
        if (isShowed == null) {
            crearEtiqueta(cProd);
        } else {
            isShowed.classList.remove("filtro");
        }
    });
}

function crearEtiqueta(value) {
    var editar = '<a class="target" id="linkEditarProducto" style="color:rgb(0, 0, 0);" >';
    var clase = '<div class="containerNV">';
    var image = '<div class="center"> <img src="../producto/productos/images/' + value.imagenProducto
        + '" width="260" height="150" class="imgProduct2"> </img> </div>';
    var nombreProducto = ' <div class="lefth"> <h2 style="color:rgb(0, 0, 0);">' + value.nombreProducto + '.</h2>';
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

function cargarProductosPorCategoria(idCategoria) {
    mostradosActualmente = document.querySelectorAll(".target");
    for (let i = 0; i < originalList.length; i++) {
        const product = originalList[i];
        let nameProduct = product.nombreProducto;
        let target = getTarget(nameProduct , mostradosActualmente);
        //Devuelvo un target si ese producto ya se esta mostrando
        if(idCategoria == product.idCategoria){
            //Si pertenece a la categoria que se quiere mostrar
            if(target == null){
                crearEtiqueta(product);
            }else {
                target.classList.remove("filtro");
            }
        }else if(target != null){
            target.classList.add("filtro");
        }
    }
    console.log("----------");
}


function getTarget(nameProd , listTarget){
    for (let i = 0; i < listTarget.length; i++) {
        let nameCurrPord = listTarget[i].textContent.split(".")[0];
        let recortado = nameCurrPord.slice(5);
        if(nameProd == recortado){
            return listTarget[i];
        }
    }
    return null;
}