function cargarTodosLosProductos() {
    peticionTodosLosProductos()
        .then(cargarCategorias2())
        .then(crearBuscador());
}

function peticionTodosLosProductos() {
    return new Promise((resolve, reject) => {
        fetch('http://localhost:3050/product')
            .then(response => response.json())
            .then(data => {
                console.log('Productos traidos del servidor');
                mostrarTodosLosProductos(data);
                return resolve(data);
            })
            .then(error => {
                return reject(error);
            })
    });
}

function crearBuscador() {
    document.addEventListener("keyup", e => {
        if (e.target.matches("#gsearch")) {
            if (e.key === "Escape") e.target.value = ""
            document.querySelectorAll(".lista-productos").forEach(producto => {
                producto.textContent.toLowerCase().includes(e.target.value.toLowerCase()) ?
                    producto.classList.remove("filtro") :
                    producto.classList.add("filtro")
            })
        }
    })
}

/**
 * Se carga un producto en particular
 * Se cargan las categorias
 */
function cargarProductoYCategorias() {
    let cargarCategoriasServidor = cargarCategorias();
    cargarCategoriasServidor.then((successMessage) => {
            console.log('Se cargaron las categorias con exito: ' + successMessage);
            getCodigoProducto();
        })
        /*
        cargarCategorias()
            .then(getCodigoProducto());*/

}

/**
 * Funciones que se muestran al crear o editar un producto
 */
function cargarCategorias() {
    return new Promise((resolve, reject) => {
        fetch('http://localhost:3050/categorias')
            .then(response => response.json())
            .then(data => {
                console.log(data);
                for (let value of data) {
                    console.log(value.codigoCategoria + ' ' + value.nombreCategoria);
                    var categoria = '<option value="' + value.codigoCategoria + '"> ' + value.nombreCategoria + ' </option>';
                    $('#Categoria1').append(categoria);
                }
                return resolve(data);
            })
            .then(error => {
                return reject(error);
            })
    });
}

/**
 * Funciones que se cargan en la lista de productos
 */

function cargarCategorias2() {
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
 * Se debe mantener el producto actual del producto
 * con ello al cambiar de pagina ya tenemos 
 * el id para los parametros necesarios
 * @param {*} nuevoId 
 */
function cambiarIdProducto(productoActual) {
    console.log('Se guaradron atributos: ' + JSON.stringify(productoActual));
    localStorage.setItem("ProductoActual", JSON.stringify(productoActual));
}

function getCodigoProducto() {
    var retrievedObject = localStorage.getItem('ProductoActual');
    var objetoProducto = JSON.parse(retrievedObject);
    console.log('retrievedObject: ', objetoProducto);
    document.getElementById("codigoProducto").value = objetoProducto.codigoProducto;
    document.getElementById("cantidadDisponible").value = objetoProducto.cantidadDisponible;
    document.getElementById("nombreProducto").value = objetoProducto.nombreProducto;
    document.getElementById("precioDeCompra").value = objetoProducto.precioDeCompra;
    document.getElementById("precioDeVenta").value = objetoProducto.precioDeVenta;
    document.getElementById("descripcionProducto").value = objetoProducto.descripcionProducto;
    document.getElementById("Categoria1").value = objetoProducto.idCategoria;
    document.getElementById('camara').src = "./productos/images/" + objetoProducto.imagenProducto;
}

function chageToAddProduct() {
    window.location = "../crearProducto.html";
}

/**
 * Se utiliza el atributo LocalStorage para eliminar un producto
 */
function eliminarProducto() {
    if (window.confirm("Realmente desea eliminar este producto?")) {
        var retrievedObject = localStorage.getItem('ProductoActual');
        var objetoProducto = JSON.parse(retrievedObject)
        fetch('http://localhost:3050/delete_product/' + objetoProducto.codigoProducto, {
                method: 'DELETE',
            })
            .then(res => res.text()) // or res.json()
            .then(res => window.location = "./productos/productos.html")
    }
}

/**
 * Se eliminan los productos bien sea para mostrar unos nuevos por categoria
 * o para mostrar unos que se hayan buscado
 */
function eliminarTodosLosProductos() {
    var prod = document.getElementById("contenedor");
    while (prod.firstChild) {
        prod.removeChild(prod.firstChild);
    }
}

function mostrarTodosLosProductos(data) {
    for (let value of data) {
        var TextJSON = JSON.stringify(value) + '';
        var editar = '<a id="linkEditarProducto" href="../editarProducto.html" onClick=\'cambiarIdProducto(' +
            TextJSON + ');\' style="color:rgb(0, 0, 0);" >';
        var clase = '<div class="lista-productos">';
        var image = '<img src="./images/' + value.imagenProducto + '" width="260" height="150"> </img>';
        var nombreProducto = '<h1 style="color:rgb(0, 0, 0);">' + value.nombreProducto + '</h1>';
        var cantidadDisponible = '<p style="color:rgb(120, 120, 120);">' + value.cantidadDisponible + ' disponibles</p>';
        var precio = '<h3 style="color:rgb(60, 60, 60);">  $ ' + value.precioDeVenta + ' COP</h3>';
        var cerrarDiv = editar + clase + image + nombreProducto + cantidadDisponible + precio + '</div> </a>';
        $('#contenedor').append(cerrarDiv);
    }
}

function cargarProductosPorCategoria(idCategoria) {
    eliminarTodosLosProductos();
    fetch('http://localhost:3050/product/' + idCategoria)
        .then(response => response.json())
        .then(data => {
            console.log('Productos cargados solo por categoria');
            mostrarTodosLosProductos(data);
        })
}