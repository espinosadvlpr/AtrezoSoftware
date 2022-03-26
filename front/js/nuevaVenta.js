var originalList = []
var selectedlList = []
var idPersona = -1;
var tipoTransaccionActual = '';

/**
 * Se cargan todos los productos
 * suidamente se cargan las categorias
 * y se crea un buscador
 * @param {*} tipoTransaccion 
 */
function cargarTodo(tipoTransaccion) {
    this.tipoTransaccionActual = tipoTransaccion;
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

/**
 * Se agregan funciones al cuadro de busqueda,
 * de manera que lo que se ingrese en el mismo
 * corresponda con las targetas de productos mostradas
 */
function crearBuscador() {
    console.log("Cargadando Buscador..")
    document.addEventListener("keyup", e => {
        if (e.target.matches("#gsearch2")) {
            if (e.key === "Escape") e.target.value = ""
            document.querySelectorAll(".target").forEach(producto => {
                producto.textContent.toLowerCase().includes(e.target.value.toLowerCase()) ?
                    producto.classList.remove("filtro") :
                    producto.classList.add("filtro")
            })
        }
    })
}

/**
 * Se hace na peticion para cargar las categorias
 */
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
/**
 * Se cambia a otro html
 */
function cambiarANuevaVenta() {
    window.location = "./nuevaVenta.html";
}

/**
 * Se cambia a otro html
 */
function cambiarANuevaCompra() {
    window.location = "./nuevaCompra.html";
}

/**
 * Se realiza una promesa que contiene
 * una peticion de todos los productos
 * Aunque solo unos de ellos se iran mostrando
 * @returns 
 */
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

/**
 * Se muestran todos los productos de la primera categoria cargada
 * @param {*} data 
 */
function showFirstCategoryProducts(data) {
    originalList = data;
    visibleProducts = Array(data.length);
    cargarProductosPorCategoria(originalList[0].idCategoria);
}

/**
 * Se muestran todos los productos 
 * teniendo en cuenta que algunos ya son visibles
 */
function mostrarTodosLosProductos() {
    mostradosActualmente = document.querySelectorAll(".target");
    originalList.forEach(cProd => {
        let isShowed = getTarget(cProd.nombreProducto, mostradosActualmente);
        if (isShowed == null) {
            crearEtiqueta(cProd);
        } else {
            isShowed.classList.remove("filtro");
        }
    });
}

/**
 * Crear una terjeta de un producto
 * con su información aprticular
 * @param {*} value 
 */
function crearEtiqueta(value) {
    var editar = '<a class="target" id="linkEditarProducto" style="color:rgb(0, 0, 0);" >';
    var clase = '<div class="containerNV">';
    var image = '<div class="center"> <img src="../producto/productos/images/' + value.imagenProducto
        + '" width="260" height="150" class="imgProduct2"> </img> </div>';
    var nombreProducto = ' <div class="lefth"> <h2 style="color:rgb(0, 0, 0);">' + value.nombreProducto + '.</h2>';
    var cantidadDisponible = '<p style="color:rgb(120, 120, 120);">' + value.cantidadDisponible + ' disponibles</p>';
    let precioActual = 0;
    let maxToSelected = 0;
    if(tipoTransaccionActual == 'V'){
        precioActual = value.precioDeVenta;
        maxToSelected = value.cantidadDisponible;
    }else if(tipoTransaccionActual == 'C'){
        precioActual = value.precioDeCompra;
        maxToSelected = 100;
    }
    var precio = '<h4 style="color:rgb(60, 60, 60);">  $ '
        + precioActual + ' COP</h4> </div>';
    var cantidadAgregar = '<div class="rigthInput">' +
        '<input type="number" onchange="cambiarValorVenta(' + value.codigoProducto + ')"'
        + 'class="quantityProduct" id="' + value.codigoProducto + '"'
        + 'name="quantity" min="0" max="'
        + maxToSelected + '"></input> </div>';
    var cerrarDiv = editar + clase + image + nombreProducto + cantidadDisponible + precio + cantidadAgregar + '</div> </a>';
    $('#contenedor').append(cerrarDiv);
}

/**
 * Agrega a la lita la información necesaria para agregar una venta o compra 
 * @param {*} codeIdCurrentProd 
 */
function cambiarValorVenta(codeIdCurrentProd) {
    for (let cProduct of originalList) {
        let idCProd = cProduct.codigoProducto;
        if (idCProd == codeIdCurrentProd) {
            if (yaExiste(idCProd) == false) {
                console.log('Ya existe');
                var myProd = new Object();
                myProd.codigoProducto = idCProd;
                precioActual = 0;
                if(tipoTransaccionActual == 'V'){
                    precioActual = cProduct.precioDeVenta;
                }else if(tipoTransaccionActual == 'C'){
                    precioActual = cProduct.precioDeCompra;
                }
                myProd.precioProd = cProduct.precioDeVenta;
                myProd.cantidadAComprar = document.getElementById(idCProd).value;
                myProd.nombreProducto = cProduct.nombreProducto;
                selectedlList.push(myProd);
            }
        }
    }
    updateTotalValue();
}

/**
 * Limpia la lista
 * Suporpone la factura de compra o venta
 * dejando el fondo desenfocado
 */
function abrirVentana() {
    clearList();
    if (selectedlList.length > 0) {
        document.getElementById("ventana").style.display = "block";
        document.getElementById("main").classList.add("desenfoque");
        llenarTabla();
    }
}

/**
 * Cierra la ventana y quita el desenfoque
 */
function cerrarVentana() {
    document.getElementById("ventana").style.display = "none";
    document.getElementById("main").classList.remove("desenfoque");
}

/**
 * Un producto debe agregarse a la lista una unica vez
 * @param {*} idProd Producto en particular
 * @returns true si existe dentro de la lista, false de lo contrario
 */
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

/**
 * Se pone el valor total de la venta ó en los botones correpondientes
 */
function updateTotalValue() {
    let total = getTotalProductsSelect();
    console.log('Total: ' + total);
    if(tipoTransaccionActual == 'V'){
        document.getElementById('botonNuevaVenta').firstChild.data = 'Nueva venta $ ' + total;
        document.getElementById('botonConfirmarVenta').firstChild.data = 'Confirmar venta $ ' + total;
    }else if(tipoTransaccionActual == 'C'){
        document.getElementById('botonNuevaCompra').firstChild.data = 'Nueva compra $ ' + total;
        document.getElementById('botonConfirmarCompra').firstChild.data = 'Confirmar compra $ ' + total;
    }
}

/**
 * Llena la tabla de facturas con los productos seleccionados
 */
function llenarTabla() {
    $(".iProd").remove();//Remueve elementos de la tabla
    for (const CProd of selectedlList) {
        if (CProd.cantidadAComprar > 0) {
            var tr = `<tr class="iProd">
          <td>`+ CProd.nombreProducto + `</td>
          <td>`+ CProd.cantidadAComprar + `</td>
          <td>`+ CProd.precioProd + `</td>
          <td>`+ (CProd.cantidadAComprar * CProd.precioProd) + `</td>
        </tr>`;
            $("#cuerpo").append(tr);
        }
    }
}

/**
 * Se realiza una peticion con la lista de productos que el cliente haya seleccionado
 * @param {*} tipoTransaccion 
 */
function sendSelectProducts(tipoTransaccion) {
    if (selectedlList.length > 0 && getTotalProductsSelect() > 0) {
        var url = `http://localhost:3050/add_transaction/${idPersona}/${tipoTransaccion}`;
        fetch(url, {
            method: 'POST',
            body: JSON.stringify(selectedlList),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => res.json())
            .then(data => {
                if(tipoTransaccionActual == 'V'){
                    alert("Venta realizada correctamente.");
                }else if(tipoTransaccionActual == 'C'){
                    alert("Compra realizada correctamente.");
                }
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
 * 
 * @returns Obtiene el total de todos los productos seleccionados
 */
function getTotalProductsSelect() {
    let total = 0;
    for (let cProd of selectedlList) {
        //TO DO
        total += cProd.precioProd * cProd.cantidadAComprar;
    }
    return total;
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

/**
 * Se muestran, ocultan o crean tarjetas para una lista por categoria
 * @param {*} idCategoria de la categoria que se ve a mostrar
 */
function cargarProductosPorCategoria(idCategoria) {
    mostradosActualmente = document.querySelectorAll(".target");
    for (let i = 0; i < originalList.length; i++) {
        const product = originalList[i];
        let nameProduct = product.nombreProducto;
        let target = getTarget(nameProduct, mostradosActualmente);
        //Devuelvo un target si ese producto ya se esta mostrando
        if (idCategoria == product.idCategoria) {
            //Si pertenece a la categoria que se quiere mostrar
            if (target == null) {
                crearEtiqueta(product);
            } else {
                target.classList.remove("filtro");
            }
        } else if (target != null) {
            target.classList.add("filtro");
        }
    }
    console.log("----------");
}

/**
 * Devuleve un target si el producto ya esta mostrado
 * @param {*} nameProd a buscar
 * @param {*} listTarget en una lista actual
 * @returns un target nameProd esta en la lista, null de lo contrario
 */
function getTarget(nameProd, listTarget) {
    for (let i = 0; i < listTarget.length; i++) {
        let nameCurrPord = listTarget[i].textContent.split(".")[0];
        let recortado = nameCurrPord.slice(5);
        if (nameProd == recortado) {
            return listTarget[i];
        }
    }
    return null;
}

/**
 * Funciones que se muestran al crear o editar un producto
 */
function cargarPersona(tipoPersona , elementToChange) {
    console.log('Cargando personas!!');
    return new Promise((resolve, reject) => {
        fetch('http://localhost:3050/users/' + tipoPersona)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                for (let value of data) {
                    console.log(value.nombres + ' ' + value.Apellidos);
                    var persona = '<option value="' + value.idPersona + '"> ' + value.nombres + ' ' + value.Apellidos + ' </option>';
                    $(`#${elementToChange}`).append(persona);
                }
                return resolve(data);
            })
            .then(error => {
                return reject(error);
            })
    });
}

/**
 * Se muestra en la factura un cliente ó un proveedor
 * @param {*} idElement 
 * @param {*} idSelect 
 */
function showPersonSelected(idElement , idSelect) {
    console.log("ON change!!" + idElement + "  " + idSelect);
    let toChange = document.getElementById(idElement);
    var select = document.getElementById(idSelect);
	var option = select.options[select.selectedIndex];
    if(option.value != -1){
        idPersona = option.value;
        if(tipoTransaccionActual == 'V'){
            toChange.textContent = 'Cliente: ' + option.text;
        }else if(tipoTransaccionActual == 'C'){
            toChange.textContent = 'Proveedor: ' + option.text;
        }
    }else {
        if(tipoTransaccionActual == 'V'){
            toChange.textContent = 'No se selecciono cliente.';
        }else if(tipoTransaccionActual == 'C'){
            toChange.textContent = 'No se selecciono proveedor.';
        }
    }
}