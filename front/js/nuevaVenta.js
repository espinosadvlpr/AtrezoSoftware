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
    for (let value of data) {
        var TextJSON = JSON.stringify(value) + '';
        var editar = '<a id="linkEditarProducto" href="#" onClick=\'cambiarIdProducto(' +
            TextJSON + ');\' style="color:rgb(0, 0, 0);" >';
        var clase = '<div class="lista-productos">';
        var image = '<img src="../producto/productos/images/' + value.imagenProducto + '" width="260" height="150" class="imgProduct"> </img>';
        var nombreProducto = '<h1 style="color:rgb(0, 0, 0);">' + value.nombreProducto + '</h1>';
        var cantidadDisponible = '<p style="color:rgb(120, 120, 120);">' + value.cantidadDisponible + ' disponibles</p>';
        var precio = '<h3 style="color:rgb(60, 60, 60);">  $ ' + value.precioDeVenta + ' COP</h3>';
        var cantidadAgregar = '<input type="number" class="" id="quantity" name="quantity" min="0" max="' + value.cantidadDisponible +'"></input>';
        var cerrarDiv = editar + clase + image + nombreProducto + cantidadDisponible + precio + cantidadAgregar + '</div> </a>';
        $('#contenedor').append(cerrarDiv);
    }
}